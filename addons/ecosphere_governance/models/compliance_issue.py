# addons/ecosphere_governance/models/compliance_issue.py
from odoo import models, fields, api

class EsgComplianceIssue(models.Model):
    _name = 'esg.compliance.issue'
    _description = 'Compliance Issue'
    _inherit = 'esg.mixin'
    _reference_prefix = 'gov.issue'
    _order = 'create_date desc'

    name = fields.Char(string='Issue Title', required=True)
    audit_id = fields.Many2one('esg.audit', string='Source Audit')
    department_id = fields.Many2one('esg.department', string='Department')
    
    severity = fields.Selection([
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical')
    ], string='Severity', required=True, default='medium')
    
    state = fields.Selection([
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('escalated', 'Escalated'),
        ('resolved', 'Resolved')
    ], string='Status', default='open', tracking=True)
    
    assigned_to = fields.Many2one('res.users', string='Assigned To')
    
    description = fields.Text(string='Description')
    resolution = fields.Text(string='Resolution / Corrective Action')

    def action_start(self):
        self.state = 'in_progress'

    def action_escalate(self):
        self.state = 'escalated'

    def action_resolve(self):
        self.state = 'resolved'
