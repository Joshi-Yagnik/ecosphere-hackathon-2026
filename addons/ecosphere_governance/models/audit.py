# addons/ecosphere_governance/models/audit.py
from odoo import models, fields, api
from odoo.exceptions import UserError
from datetime import date

class EsgAudit(models.Model):
    _name = 'esg.audit'
    _description = 'ESG Audit'
    _inherit = 'esg.mixin'
    _reference_prefix = 'gov.audit'
    _order = 'scheduled_date desc'

    name = fields.Char(string='Audit Title', required=True)
    
    type = fields.Selection([
        ('internal', 'Internal Audit'),
        ('external', 'External Audit'),
        ('certification', 'Certification Audit')
    ], string='Audit Type', required=True, default='internal')

    department_id = fields.Many2one('esg.department', string='Department Audited')
    auditor = fields.Char(string='Auditor / Firm', required=True)
    
    scheduled_date = fields.Date(string='Scheduled Date', required=True)
    completed_date = fields.Date(string='Completed Date')
    
    score = fields.Float(string='Audit Score (%)', help='Overall score of the audit.')
    
    state = fields.Selection([
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], string='Status', default='scheduled', tracking=True)

    issue_ids = fields.One2many(
        'esg.compliance.issue',
        'audit_id',
        string='Findings / Issues'
    )

    def action_start(self):
        for record in self:
            if record.state != 'scheduled':
                raise UserError("Only scheduled audits can be started.")
            record.state = 'in_progress'

    def action_complete(self):
        for record in self:
            if record.state != 'in_progress':
                raise UserError("Only in-progress audits can be completed.")
            record.state = 'completed'
            record.completed_date = fields.Date.context_today(record)

    def action_cancel(self):
        for record in self:
            record.state = 'cancelled'
