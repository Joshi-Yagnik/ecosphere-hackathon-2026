# addons/ecosphere_base/models/esg_mixin.py
# ============================================================
# EcoSphere – Abstract Mixin for all ESG Models
# Provides reference generation, state tracking, and audit fields
# ============================================================
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class EsgMixin(models.AbstractModel):
    """
    Abstract mixin shared by all EcoSphere ESG document models.

    Provides:
    - Auto-generated reference (e.g. CT-2026-0001)
    - created_by / last_updated fields
    - Notes field
    - chatter (mail.thread + mail.activity.mixin)
    """
    _name = 'esg.mixin'
    _description = 'ESG Document Mixin'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    reference = fields.Char(
        string='Reference',
        readonly=True,
        copy=False,
        index=True,
        help='Unique auto-generated reference code for this record.',
    )

    notes = fields.Text(
        string='Notes',
        help='Additional information or remarks.',
    )

    active = fields.Boolean(
        string='Active',
        default=True,
        help='If unchecked, this record is archived.',
    )

    @api.model_create_multi
    def create(self, vals_list):
        """Auto-assign reference on creation if not provided."""
        for vals in vals_list:
            if not vals.get('reference') and hasattr(self, '_reference_prefix'):
                sequence_code = f'ecosphere.{self._reference_prefix}'
                vals['reference'] = self.env['ir.sequence'].next_by_code(sequence_code) or '/'
        return super().create(vals_list)
