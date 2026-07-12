# addons/ecosphere_social/models/csr_activity.py
from odoo import models, fields, api
from odoo.exceptions import UserError

class EsgCsrActivity(models.Model):
    _name = 'esg.csr.activity'
    _description = 'CSR Activity'
    _inherit = 'esg.mixin'
    _reference_prefix = 'soc.csr'
    _order = 'date desc, id desc'

    name = fields.Char(string='Activity Title', required=True)
    date = fields.Date(string='Date', required=True, default=fields.Date.context_today)
    
    organizer_id = fields.Many2one('res.users', string='Organizer', default=lambda self: self.env.user)
    department_id = fields.Many2one('esg.department', string='Department')
    
    category = fields.Selection([
        ('community', 'Community Service'),
        ('environment', 'Environmental Cleanup'),
        ('education', 'Education & Mentorship'),
        ('health', 'Health & Wellness'),
        ('other', 'Other')
    ], string='Category', required=True, default='community')

    location = fields.Char(string='Location')
    
    description = fields.Text(string='Description')
    
    xp_reward = fields.Integer(string='XP Reward per Participant', default=50)

    state = fields.Selection([
        ('draft', 'Draft'),
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], string='Status', default='draft', tracking=True)

    participation_ids = fields.One2many(
        'esg.employee.participation',
        'activity_id',
        string='Participants'
    )
    
    total_hours = fields.Float(
        string='Total Volunteer Hours', 
        compute='_compute_total_hours', 
        store=True
    )

    @api.depends('participation_ids.hours')
    def _compute_total_hours(self):
        for record in self:
            record.total_hours = sum(record.participation_ids.mapped('hours'))

    def action_submit(self):
        for record in self:
            if record.state != 'draft':
                raise UserError("Only draft activities can be submitted.")
            record.state = 'pending'

    def action_approve(self):
        for record in self:
            if record.state != 'pending':
                raise UserError("Only pending activities can be approved.")
            record.state = 'approved'

    def action_complete(self):
        for record in self:
            if record.state != 'approved':
                raise UserError("Only approved activities can be marked completed.")
            # Automatically grant XP to participants (if Gamification is installed, we can trigger it here)
            record.state = 'completed'

    def action_cancel(self):
        for record in self:
            record.state = 'cancelled'
            
    def action_draft(self):
        for record in self:
            record.state = 'draft'
