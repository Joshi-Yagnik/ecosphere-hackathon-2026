# addons/ecosphere_gamification/models/badge.py
from odoo import models, fields

class EsgBadge(models.Model):
    _name = 'esg.badge'
    _description = 'Gamification Badge'

    name = fields.Char(string='Badge Name', required=True)
    icon = fields.Char(string='Icon (Emoji)', default='🏅')
    description = fields.Text(string='Description')
    
    xp_bonus = fields.Integer(string='XP Bonus', default=0, help='Extra XP awarded when this badge is earned.')

class EsgUserBadge(models.Model):
    _name = 'esg.user.badge'
    _description = 'User Earned Badge'
    _order = 'create_date desc'

    user_id = fields.Many2one('res.users', string='User', required=True)
    badge_id = fields.Many2one('esg.badge', string='Badge', required=True)
    earned_date = fields.Date(string='Date Earned', default=fields.Date.context_today)
