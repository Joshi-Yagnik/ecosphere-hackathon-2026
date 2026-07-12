# addons/ecosphere_environmental/models/environmental_goal.py
# ============================================================
# EcoSphere – Environmental Goal Model
# Track sustainability targets and deadlines
# ============================================================
from odoo import models, fields, api
from datetime import date

class EsgEnvironmentalGoal(models.Model):
    """
    Tracks environmental goals (e.g., reduce paper usage by 50%).
    Includes progress tracking and deadline management.
    """
    _name = 'esg.environmental.goal'
    _description = 'Environmental Goal'
    _inherit = 'esg.mixin'
    _reference_prefix = 'env.goal'

    name = fields.Char(string='Goal Title', required=True)
    department_id = fields.Many2one('esg.department', string='Department', required=True)
    
    deadline = fields.Date(string='Deadline', required=True)
    progress = fields.Integer(string='Progress (%)', default=0)
    
    priority = fields.Selection([
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High')
    ], string='Priority', default='medium')
    
    state = fields.Selection([
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('achieved', 'Achieved'),
        ('abandoned', 'Abandoned')
    ], string='Status', default='not_started', tracking=True)

    is_overdue = fields.Boolean(compute='_compute_is_overdue', store=True)

    @api.depends('deadline', 'state')
    def _compute_is_overdue(self):
        today = date.today()
        for record in self:
            if record.state not in ['achieved', 'abandoned'] and record.deadline:
                record.is_overdue = record.deadline < today
            else:
                record.is_overdue = False

    @api.onchange('progress')
    def _onchange_progress(self):
        if self.progress >= 100:
            self.progress = 100
            self.state = 'achieved'
        elif self.progress > 0 and self.state == 'not_started':
            self.state = 'in_progress'
        elif self.progress < 0:
            self.progress = 0
