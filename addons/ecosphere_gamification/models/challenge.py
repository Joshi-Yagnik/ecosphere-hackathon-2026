# addons/ecosphere_gamification/models/challenge.py
from odoo import models, fields, api

class EsgChallenge(models.Model):
    _name = 'esg.challenge'
    _description = 'Sustainability Challenge'
    _inherit = 'esg.mixin'
    _reference_prefix = 'gam.chal'
    _order = 'end_date desc, id desc'

    name = fields.Char(string='Challenge Name', required=True)
    description = fields.Text(string='Description')
    
    start_date = fields.Date(string='Start Date', required=True)
    end_date = fields.Date(string='End Date', required=True)
    
    xp_reward = fields.Integer(string='XP Reward', default=100)
    badge_reward_id = fields.Many2one('esg.badge', string='Badge Reward')
    
    type = fields.Selection([
        ('individual', 'Individual'),
        ('department', 'Department Team')
    ], string='Challenge Type', default='individual', required=True)
    
    state = fields.Selection([
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed')
    ], string='Status', default='draft', tracking=True)
    
    participation_ids = fields.One2many(
        'esg.challenge.participation',
        'challenge_id',
        string='Participants'
    )

    def action_start(self):
        self.state = 'active'

    def action_complete(self):
        self.state = 'completed'
        # Logic to award XP and Badges would go here based on participation progress


class EsgChallengeParticipation(models.Model):
    _name = 'esg.challenge.participation'
    _description = 'Challenge Participation'

    challenge_id = fields.Many2one('esg.challenge', string='Challenge', required=True, ondelete='cascade')
    user_id = fields.Many2one('res.users', string='Participant', required=True)
    
    progress = fields.Integer(string='Progress (%)', default=0)
    
    state = fields.Selection([
        ('joined', 'Joined'),
        ('completed', 'Completed')
    ], string='Status', default='joined')

    @api.onchange('progress')
    def _onchange_progress(self):
        if self.progress >= 100:
            self.progress = 100
            self.state = 'completed'
