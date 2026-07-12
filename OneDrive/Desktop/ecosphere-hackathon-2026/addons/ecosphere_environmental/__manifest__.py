{
    'name': 'EcoSphere Environmental',
    'version': '18.0.1.0.0',
    'summary': 'Carbon transactions, emission factors, and environmental goals',
    'description': """
EcoSphere Environmental Module
================================
Tracks Scope 1, 2, and 3 greenhouse gas emissions across departments.

Features:
- Emission Factor Library (GHG Protocol, IPCC AR6, DEFRA)
- Carbon Transaction journal with Draft→Confirmed→Cancelled workflow
- Environmental Goals with progress tracking and deadline management
- Automated CO₂ equivalent calculation (Quantity × Emission Factor)
- GHG Scope classification and filtering
    """,
    'author': 'EcoSphere Team',
    'category': 'ESG / Sustainability',
    'license': 'LGPL-3',
    'version': '18.0.1.0.0',
    'depends': ['ecosphere_base'],
    'data': [
        'security/ir.model.access.csv',
        'data/sequences.xml',
        'data/emission_factors.xml',
        'views/emission_factor_views.xml',
        'views/carbon_transaction_views.xml',
        'views/environmental_goal_views.xml',
        'views/menus.xml',
    ],
    'demo': [
        'data/demo_transactions.xml',
        'data/demo_goals.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
