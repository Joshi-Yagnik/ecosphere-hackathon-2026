# addons/ecosphere_governance/models/policy.py
from odoo import models, fields, api
from odoo.exceptions import UserError
from datetime import date

class EsgPolicy(models.Model):
    _name = 'esg.policy'
    _description = 'Corporate ESG Policy'
    _inherit = 'esg.mixin'
    _reference_prefix = 'gov.pol'
    _order = 'publish_date desc, id desc'

    name = fields.Char(string='Policy Title', required=True)
    version = fields.Char(string='Version', default='1.0')
    
    category = fields.Selection([
        ('code_of_conduct', 'Code of Conduct'),
        ('data_privacy', 'Data Privacy'),
        ('anti_corruption', 'Anti-Corruption'),
        ('environmental', 'Environmental Standard'),
        ('social', 'Social Standard')
    ], string='Category', required=True)

    publish_date = fields.Date(string='Publish Date', default=fields.Date.context_today)
    document_url = fields.Char(string='Document URL', help='Link to the full policy document')
    
    require_acknowledgement = fields.Boolean(string='Requires Acknowledgement', default=True)
    
    state = fields.Selection([
        ('draft', 'Draft'),
        ('review', 'Under Review'),
        ('active', 'Active'),
        ('archived', 'Archived')
    ], string='Status', default='draft', tracking=True)

    acknowledgement_ids = fields.One2many(
        'esg.policy.acknowledgement',
        'policy_id',
        string='Acknowledgements'
    )
    
    compliance_rate = fields.Float(
        string='Compliance Rate (%)',
        compute='_compute_compliance_rate',
        store=True
    )

    @api.depends('acknowledgement_ids.state', 'require_acknowledgement')
    def _compute_compliance_rate(self):
        for record in self:
            if not record.require_acknowledgement or not record.acknowledgement_ids:
                record.compliance_rate = 100.0
                continue
            
            total = len(record.acknowledgement_ids)
            acknowledged = len(record.acknowledgement_ids.filtered(lambda a: a.state == 'acknowledged'))
            record.compliance_rate = (acknowledged / total) * 100.0 if total > 0 else 0.0

    def action_activate(self):
        for record in self:
            if record.state != 'review':
                raise UserError("Only policies under review can be activated.")
            record.state = 'active'
            # Typically, this would generate acknowledgement records for all active employees

    def action_review(self):
        for record in self:
            record.state = 'review'

    def action_archive(self):
        for record in self:
            record.state = 'archived'

class EsgPolicyAcknowledgement(models.Model):
    _name = 'esg.policy.acknowledgement'
    _description = 'Policy Acknowledgement'
    _order = 'create_date desc'

    policy_id = fields.Many2one('esg.policy', string='Policy', required=True, ondelete='cascade')
    employee_id = fields.Many2one('res.users', string='Employee', required=True)
    
    deadline = fields.Date(string='Deadline')
    
    state = fields.Selection([
        ('pending', 'Pending'),
        ('acknowledged', 'Acknowledged')
    ], string='Status', default='pending', tracking=True)

    is_overdue = fields.Boolean(compute='_compute_is_overdue', store=True)

    @api.depends('deadline', 'state')
    def _compute_is_overdue(self):
        today = date.today()
        for record in self:
            if record.state == 'pending' and record.deadline:
                record.is_overdue = record.deadline < today
            else:
                record.is_overdue = False

    def action_acknowledge(self):
        for record in self:
            # In a real scenario, ensure the current user is the employee_id
            record.state = 'acknowledged'
