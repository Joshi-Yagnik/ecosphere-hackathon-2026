{
    'name': 'EcoSphere Social',
    'version': '18.0.1.0.0',
    'summary': 'CSR Activities and Employee Participation tracking',
    'description': """
EcoSphere Social Module
=========================
Manages Corporate Social Responsibility (CSR) activities and employee participation.

Features:
- CSR Activities management with approval workflow
- Employee Participation Tracker (hours, XP, badges)
- Evidence upload integration
    """,
    'author': 'EcoSphere Team',
    'category': 'ESG / Sustainability',
    'license': 'LGPL-3',
    'depends': ['ecosphere_base'],
    'data': [
        'security/ir.model.access.csv',
        'data/sequences.xml',
        'views/csr_activity_views.xml',
        'views/employee_participation_views.xml',
        'views/menus.xml',
    ],
    'demo': [
        'data/demo_csr_activities.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
