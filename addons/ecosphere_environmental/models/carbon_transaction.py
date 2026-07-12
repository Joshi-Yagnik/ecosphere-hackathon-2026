# addons/ecosphere_environmental/models/carbon_transaction.py
# ============================================================
# EcoSphere – Carbon Transaction Model
# Records an activity and calculates emissions via emission factor
# ============================================================
from odoo import models, fields, api
from odoo.exceptions import UserError

class EsgCarbonTransaction(models.Model):
    """
    Records an activity (e.g. flight, electricity usage) and calculates 
    the resulting CO₂e emissions.
    """
    _name = 'esg.carbon.transaction'
    _description = 'Carbon Transaction'
    _inherit = 'esg.mixin'
    _reference_prefix = 'env.ct'
    _order = 'date desc, id desc'

    name = fields.Char(string='Description', required=True)
    date = fields.Date(string='Date', required=True, default=fields.Date.context_today)
    
    department_id = fields.Many2one('esg.department', string='Department', required=True)
    factor_id = fields.Many2one('esg.emission.factor', string='Emission Factor', required=True)
    
    quantity = fields.Float(string='Quantity', required=True, digits=(10, 2))
    unit = fields.Char(related='factor_id.unit', readonly=True)
    scope = fields.Selection(related='factor_id.scope', store=True, readonly=True)
    
    co2_equivalent = fields.Float(
        string='Emissions (tCO₂e)', 
        compute='_compute_emissions', 
        store=True,
        digits=(10, 4)
    )
    
    state = fields.Selection([
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled')
    ], string='Status', default='draft', tracking=True)

    @api.depends('quantity', 'factor_id')
    def _compute_emissions(self):
        for record in self:
            if record.factor_id and record.quantity:
                # factor is in kg CO2e. Convert to metric tonnes (tCO2e) -> / 1000
                record.co2_equivalent = (record.quantity * record.factor_id.factor) / 1000.0
            else:
                record.co2_equivalent = 0.0

    def action_confirm(self):
        for record in self:
            if record.state != 'draft':
                raise UserError("Only draft transactions can be confirmed.")
            record.state = 'confirmed'

    def action_cancel(self):
        for record in self:
            if record.state == 'confirmed':
                raise UserError("Confirmed transactions cannot be cancelled. Revert to draft first.")
            record.state = 'cancelled'
            
    def action_draft(self):
        for record in self:
            record.state = 'draft'
