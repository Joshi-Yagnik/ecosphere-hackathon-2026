# addons/ecosphere_social/models/employee_participation.py
from odoo import models, fields, api
from odoo.exceptions import UserError

class EsgEmployeeParticipation(models.Model):
    _name = 'esg.employee.participation'
    _description = 'Employee Participation'
    _order = 'create_date desc'

    activity_id = fields.Many2one('esg.csr.activity', string='CSR Activity', required=True, ondelete='cascade')
    employee_id = fields.Many2one('res.users', string='Employee', required=True, default=lambda self: self.env.user)
    
    hours = fields.Float(string='Hours Contributed', required=True, default=1.0)
    
    evidence_url = fields.Char(string='Evidence URL', help='Link to photos or documents proving participation')
    
    state = fields.Selection([
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected')
    ], string='Status', default='pending', tracking=True)

    def action_verify(self):
        # Only managers or the activity organizer can verify
        for record in self:
            record.state = 'verified'

    def action_reject(self):
        for record in self:
            record.state = 'rejected'
