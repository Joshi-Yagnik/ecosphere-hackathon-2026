# addons/ecosphere_base/models/esg_department.py
# ============================================================
# EcoSphere – Department Model
# Extends Odoo's hr.department with ESG-specific fields
# ============================================================
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class EsgDepartment(models.Model):
    """
    Extends hr.department with ESG tracking fields.

    Each department in EcoSphere has:
    - Carbon emission targets
    - Live ESG sub-scores (env/social/gov)
    - A designated ESG responsible person
    """
    _name = 'esg.department'
    _description = 'ESG Department'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'esg_score desc, name'

    # ── Core ────────────────────────────────────────────────────
    name = fields.Char(
        string='Department Name',
        required=True,
        tracking=True,
        index=True,
    )

    hr_department_id = fields.Many2one(
        'hr.department',
        string='HR Department',
        help='Link to the standard Odoo HR department, if applicable.',
        ondelete='set null',
    )

    manager_id = fields.Many2one(
        'res.users',
        string='ESG Manager',
        required=True,
        tracking=True,
        help='The person responsible for ESG performance in this department.',
    )

    employee_count = fields.Integer(
        string='Headcount',
        default=0,
        tracking=True,
    )

    # ── Carbon Targets ──────────────────────────────────────────
    carbon_target = fields.Float(
        string='Annual Carbon Target (tCO₂e)',
        digits=(10, 2),
        tracking=True,
        help='Target annual carbon emissions in tonnes of CO₂ equivalent.',
    )

    carbon_actual = fields.Float(
        string='Actual Carbon (tCO₂e)',
        digits=(10, 2),
        compute='_compute_carbon_actual',
        store=True,
        help='Actual carbon emissions calculated from confirmed transactions.',
    )

    carbon_progress = fields.Float(
        string='Carbon Progress (%)',
        compute='_compute_carbon_progress',
        store=True,
        digits=(5, 1),
    )

    # ── ESG Scores ──────────────────────────────────────────────
    env_score = fields.Float(
        string='Environmental Score',
        digits=(5, 1),
        default=0.0,
        tracking=True,
        help='Score 0-100 for environmental performance.',
    )

    social_score = fields.Float(
        string='Social Score',
        digits=(5, 1),
        default=0.0,
        tracking=True,
        help='Score 0-100 for social performance.',
    )

    gov_score = fields.Float(
        string='Governance Score',
        digits=(5, 1),
        default=0.0,
        tracking=True,
        help='Score 0-100 for governance performance.',
    )

    esg_score = fields.Float(
        string='Overall ESG Score',
        digits=(5, 1),
        compute='_compute_esg_score',
        store=True,
        help='Weighted average of E, S, and G scores based on global settings.',
    )

    esg_rank = fields.Integer(
        string='ESG Rank',
        compute='_compute_rank',
        store=False,
    )

    # ── Relational ──────────────────────────────────────────────
    carbon_transaction_ids = fields.One2many(
        'esg.carbon.transaction',
        'department_id',
        string='Carbon Transactions',
    )

    env_goal_ids = fields.One2many(
        'esg.environmental.goal',
        'department_id',
        string='Environmental Goals',
    )

    # ── Computed ────────────────────────────────────────────────
    @api.depends('carbon_transaction_ids', 'carbon_transaction_ids.co2_equivalent',
                 'carbon_transaction_ids.state')
    def _compute_carbon_actual(self):
        for dept in self:
            confirmed = dept.carbon_transaction_ids.filtered(
                lambda t: t.state == 'confirmed'
            )
            dept.carbon_actual = sum(confirmed.mapped('co2_equivalent'))

    @api.depends('carbon_actual', 'carbon_target')
    def _compute_carbon_progress(self):
        for dept in self:
            if dept.carbon_target > 0:
                dept.carbon_progress = min(
                    (dept.carbon_actual / dept.carbon_target) * 100, 100.0
                )
            else:
                dept.carbon_progress = 0.0

    @api.depends('env_score', 'social_score', 'gov_score')
    def _compute_esg_score(self):
        config = self.env['esg.config.settings'].sudo().get_active_config()
        env_w = config.env_weight / 100
        soc_w = config.social_weight / 100
        gov_w = config.gov_weight / 100
        for dept in self:
            dept.esg_score = (
                dept.env_score * env_w +
                dept.social_score * soc_w +
                dept.gov_score * gov_w
            )

    def _compute_rank(self):
        all_depts = self.search([], order='esg_score desc')
        rank_map = {d.id: i + 1 for i, d in enumerate(all_depts)}
        for dept in self:
            dept.esg_rank = rank_map.get(dept.id, 0)

    # ── Constraints ─────────────────────────────────────────────
    @api.constrains('env_score', 'social_score', 'gov_score')
    def _check_scores(self):
        for dept in self:
            for score in (dept.env_score, dept.social_score, dept.gov_score):
                if not 0 <= score <= 100:
                    raise ValidationError('ESG scores must be between 0 and 100.')

    # ── API ─────────────────────────────────────────────────────
    def get_dashboard_data(self):
        """Return serializable dict for the frontend dashboard API."""
        self.ensure_one()
        return {
            'id': self.id,
            'name': self.name,
            'manager': self.manager_id.name,
            'employee_count': self.employee_count,
            'carbon_target': self.carbon_target,
            'carbon_actual': self.carbon_actual,
            'carbon_progress': self.carbon_progress,
            'env_score': self.env_score,
            'social_score': self.social_score,
            'gov_score': self.gov_score,
            'esg_score': self.esg_score,
            'rank': self.esg_rank,
        }
