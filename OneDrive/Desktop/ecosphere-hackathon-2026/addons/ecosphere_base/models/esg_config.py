# addons/ecosphere_base/models/esg_config.py
# ============================================================
# EcoSphere – Global ESG Configuration Settings
# Extends Odoo's res.config.settings for ESG-specific options
# ============================================================
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class EsgConfigSettings(models.TransientModel):
    """
    ESG platform-wide configuration stored via res.config.settings.

    Controls:
    - ESG scoring weights (E/S/G must total 100%)
    - Feature toggles (mandatory CSR proof, auto badge award, etc.)
    - Alert thresholds
    - Notification preferences
    """
    _inherit = 'res.config.settings'

    # ── Scoring Weights ─────────────────────────────────────────
    env_weight = fields.Integer(
        string='Environmental Weight (%)',
        default=40,
        config_parameter='ecosphere.env_weight',
        help='Weight of Environmental score in overall ESG calculation.',
    )

    social_weight = fields.Integer(
        string='Social Weight (%)',
        default=30,
        config_parameter='ecosphere.social_weight',
        help='Weight of Social score in overall ESG calculation.',
    )

    gov_weight = fields.Integer(
        string='Governance Weight (%)',
        default=30,
        config_parameter='ecosphere.gov_weight',
        help='Weight of Governance score in overall ESG calculation.',
    )

    # ── Feature Toggles ─────────────────────────────────────────
    require_csr_proof = fields.Boolean(
        string='Mandatory CSR Activity Proof',
        default=False,
        config_parameter='ecosphere.require_csr_proof',
        help='If enabled, CSR activities require evidence upload before approval.',
    )

    auto_badge_award = fields.Boolean(
        string='Auto Badge Award on Challenge Completion',
        default=True,
        config_parameter='ecosphere.auto_badge_award',
        help='Automatically award the linked badge when a challenge is completed.',
    )

    enable_emission_tracking = fields.Boolean(
        string='Enable Emission Tracking',
        default=True,
        config_parameter='ecosphere.enable_emission_tracking',
        help='Enables the Carbon Transaction and Emission Factor modules.',
    )

    # ── Alert Settings ──────────────────────────────────────────
    overdue_alert_days = fields.Integer(
        string='Overdue Alert (days before deadline)',
        default=7,
        config_parameter='ecosphere.overdue_alert_days',
        help='Number of days before deadline to mark a record as "approaching due".',
    )

    # ── Notifications ───────────────────────────────────────────
    notify_by_email = fields.Boolean(
        string='Email Notifications',
        default=True,
        config_parameter='ecosphere.notify_by_email',
    )

    notify_in_app = fields.Boolean(
        string='In-App Notifications',
        default=True,
        config_parameter='ecosphere.notify_in_app',
    )

    # ── Constraint ──────────────────────────────────────────────
    @api.constrains('env_weight', 'social_weight', 'gov_weight')
    def _check_weights_sum(self):
        for record in self:
            total = record.env_weight + record.social_weight + record.gov_weight
            if total != 100:
                raise ValidationError(
                    f'ESG scoring weights must total 100%%. '
                    f'Current total: {total}%% (E={record.env_weight}, '
                    f'S={record.social_weight}, G={record.gov_weight}).'
                )

    @api.model
    def get_active_config(self):
        """
        Return current ESG configuration as a simple object.
        Used by computed fields on other models.
        """
        get = self.env['ir.config_parameter'].sudo().get_param
        return type('EsgConfig', (), {
            'env_weight': int(get('ecosphere.env_weight', 40)),
            'social_weight': int(get('ecosphere.social_weight', 30)),
            'gov_weight': int(get('ecosphere.gov_weight', 30)),
            'require_csr_proof': get('ecosphere.require_csr_proof', 'False') == 'True',
            'auto_badge_award': get('ecosphere.auto_badge_award', 'True') == 'True',
            'overdue_alert_days': int(get('ecosphere.overdue_alert_days', 7)),
        })()

    def get_values(self):
        res = super().get_values()
        get = self.env['ir.config_parameter'].sudo().get_param
        res.update({
            'env_weight': int(get('ecosphere.env_weight', 40)),
            'social_weight': int(get('ecosphere.social_weight', 30)),
            'gov_weight': int(get('ecosphere.gov_weight', 30)),
            'require_csr_proof': get('ecosphere.require_csr_proof', 'False') == 'True',
            'auto_badge_award': get('ecosphere.auto_badge_award', 'True') == 'True',
            'enable_emission_tracking': get('ecosphere.enable_emission_tracking', 'True') == 'True',
            'overdue_alert_days': int(get('ecosphere.overdue_alert_days', 7)),
            'notify_by_email': get('ecosphere.notify_by_email', 'True') == 'True',
            'notify_in_app': get('ecosphere.notify_in_app', 'True') == 'True',
        })
        return res

    def set_values(self):
        super().set_values()
        set_param = self.env['ir.config_parameter'].sudo().set_param
        set_param('ecosphere.env_weight', str(self.env_weight))
        set_param('ecosphere.social_weight', str(self.social_weight))
        set_param('ecosphere.gov_weight', str(self.gov_weight))
        set_param('ecosphere.require_csr_proof', str(self.require_csr_proof))
        set_param('ecosphere.auto_badge_award', str(self.auto_badge_award))
        set_param('ecosphere.enable_emission_tracking', str(self.enable_emission_tracking))
        set_param('ecosphere.overdue_alert_days', str(self.overdue_alert_days))
        set_param('ecosphere.notify_by_email', str(self.notify_by_email))
        set_param('ecosphere.notify_in_app', str(self.notify_in_app))
