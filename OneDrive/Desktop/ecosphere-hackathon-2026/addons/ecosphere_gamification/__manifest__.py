{
    'name': 'EcoSphere Gamification',
    'version': '18.0.1.0.0',
    'summary': 'Challenges, Badges, Leaderboards, and Rewards',
    'description': """
EcoSphere Gamification Module
===============================
Drive employee engagement in ESG through gamification.

Features:
- Sustainability Challenges (individual and team)
- Badge system and XP rewards
- Real-time Leaderboards
- Reward redemption
    """,
    'author': 'EcoSphere Team',
    'category': 'ESG / Sustainability',
    'license': 'LGPL-3',
    'depends': ['ecosphere_base', 'ecosphere_social'],
    'data': [
        'security/ir.model.access.csv',
        'data/sequences.xml',
        'data/badges.xml',
        'views/challenge_views.xml',
        'views/badge_views.xml',
        'views/menus.xml',
    ],
    'demo': [
        'data/demo_challenges.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
