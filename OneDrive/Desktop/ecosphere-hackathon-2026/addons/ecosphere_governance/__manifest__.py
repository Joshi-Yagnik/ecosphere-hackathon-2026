{
    'name': 'EcoSphere Governance',
    'version': '18.0.1.0.0',
    'summary': 'Policies, Audits, and Compliance tracking',
    'description': """
EcoSphere Governance Module
=============================
Manage corporate governance, policies, and compliance.

Features:
- Policy document management and employee acknowledgements
- Audit schedules and tracking
- Compliance Issue tracking with resolution workflow
    """,
    'author': 'EcoSphere Team',
    'category': 'ESG / Sustainability',
    'license': 'LGPL-3',
    'depends': ['ecosphere_base'],
    'data': [
        'security/ir.model.access.csv',
        'data/sequences.xml',
        'views/policy_views.xml',
        'views/audit_views.xml',
        'views/compliance_issue_views.xml',
        'views/menus.xml',
    ],
    'demo': [
        'data/demo_policies.xml',
        'data/demo_audits.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
