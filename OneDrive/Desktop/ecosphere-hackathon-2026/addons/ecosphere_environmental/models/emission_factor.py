# addons/ecosphere_environmental/models/emission_factor.py
# ============================================================
# EcoSphere – Emission Factor Model
# Defines conversion rates for different activity types
# ============================================================
from odoo import models, fields


class EsgEmissionFactor(models.Model):
    """
    Emission Factors for calculating CO₂ equivalents.
    Based on standards like GHG Protocol or EPA.
    """
    _name = 'esg.emission.factor'
    _description = 'Emission Factor'
    _order = 'category, name'

    name = fields.Char(string='Name', required=True, index=True)
    active = fields.Boolean(default=True)
    
    category = fields.Selection([
        ('electricity', 'Electricity'),
        ('fuel', 'Fuel'),
        ('travel', 'Business Travel'),
        ('waste', 'Waste'),
        ('materials', 'Materials'),
        ('other', 'Other'),
    ], string='Category', required=True)
    
    scope = fields.Selection([
        ('scope1', 'Scope 1 (Direct)'),
        ('scope2', 'Scope 2 (Indirect - Energy)'),
        ('scope3', 'Scope 3 (Value Chain)'),
    ], string='GHG Scope', required=True)
    
    unit = fields.Char(string='Unit', required=True, help="e.g., kWh, liters, km")
    factor = fields.Float(string='Factor (kg CO₂e / Unit)', digits=(10, 4), required=True)
    source = fields.Char(string='Source Database', help="e.g., DEFRA 2024, EPA")
    year = fields.Integer(string='Year')

    def name_get(self):
        result = []
        for record in self:
            result.append((record.id, f"{record.name} ({record.unit})"))
        return result
