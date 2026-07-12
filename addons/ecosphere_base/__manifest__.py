# EcoSphere Odoo 18 – Base Addon
# ============================================================
# __manifest__.py for ecosphere_base
# ============================================================
{
    'name': 'EcoSphere Base',
    'version': '18.0.1.0.0',
    'summary': 'Core ESG Platform – shared models, department config, and settings',
    'description': """
EcoSphere Base Module
=====================
Provides the foundational models and configuration shared across all
EcoSphere ESG modules:

- Department model with ESG score tracking
- ESG configuration settings
- Shared abstract models (EsgMixin)
- Security groups (ESG Manager, Department Head, Employee)
    """,
    'author': 'EcoSphere Team',
    'website': 'https://github.com/Joshi-Yagnik/ecosphere-hackathon-2026',
    'category': 'ESG / Sustainability',
    'license': 'LGPL-3',
    'depends': ['base', 'mail', 'hr'],
    'data': [
        'security/groups.xml',
        'security/ir.model.access.csv',
        'views/department_views.xml',
        'views/esg_config_views.xml',
        'views/menus.xml',
        'data/demo_departments.xml',
    ],
    'demo': [
        'data/demo_departments.xml',
    ],
    'assets': {
        'web.assets_backend': [],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
}
