'use client';

// app/(dashboard)/settings/page.tsx
// ============================================================
// Global System Configuration
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Sliders, Bell, ShieldCheck, Activity } from 'lucide-react';
import { initialConfig } from '@/lib/mock-data/settings';
import type { EsgConfig } from '@/types';
import { cn } from '@/lib/utils';

export default function GlobalSettingsPage() {
  const [config, setConfig] = useState<EsgConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    // Validate weights equal 100
    const total = config.envWeight + config.socialWeight + config.govWeight;
    if (total !== 100) {
      setSaveMessage(`Error: ESG Weights must total 100%. Current: ${total}%`);
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setSaving(true);
    setSaveMessage('');
    setTimeout(() => {
      setSaving(false);
      setSaveMessage('Settings saved successfully.');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };

  const updateConfig = (key: keyof EsgConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const totalWeight = config.envWeight + config.socialWeight + config.govWeight;

  return (
    <div className="animate-fade-in max-w-4xl space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-600" /> Global Settings
          </h1>
          <p className="eco-page-subtitle">Configure organization-wide ESG scoring logic and system preferences.</p>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && (
            <span className={cn('text-sm font-semibold', saveMessage.includes('Error') ? 'text-red-500' : 'text-green-600')}>
              {saveMessage}
            </span>
          )}
          <button onClick={handleSave} disabled={saving} className="eco-btn-primary bg-emerald-600 hover:bg-emerald-700 text-sm px-4 py-2 gap-2">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scoring Engine */}
        <div className="eco-card p-6">
          <h3 className="eco-section-title mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" /> Scoring Engine Weights
          </h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Determine how much each pillar contributes to the overall Corporate ESG Score. <strong>Must total 100%.</strong>
          </p>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span className="text-emerald-700">Environmental (E)</span>
                <span>{config.envWeight}%</span>
              </div>
              <input type="range" min="0" max="100" value={config.envWeight} onChange={(e) => updateConfig('envWeight', Number(e.target.value))} className="w-full accent-emerald-600" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span className="text-blue-700">Social (S)</span>
                <span>{config.socialWeight}%</span>
              </div>
              <input type="range" min="0" max="100" value={config.socialWeight} onChange={(e) => updateConfig('socialWeight', Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span className="text-violet-700">Governance (G)</span>
                <span>{config.govWeight}%</span>
              </div>
              <input type="range" min="0" max="100" value={config.govWeight} onChange={(e) => updateConfig('govWeight', Number(e.target.value))} className="w-full accent-violet-600" />
            </div>
          </div>
          
          <div className={cn("mt-6 p-3 rounded-xl border text-center font-bold", totalWeight === 100 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200")}>
            Total Weight: {totalWeight}%
          </div>
        </div>

        <div className="space-y-6">
          {/* Features Toggle */}
          <div className="eco-card p-6">
            <h3 className="eco-section-title mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> System Features
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={config.emissionTrackingEnabled} onChange={(e) => updateConfig('emissionTrackingEnabled', e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                <div>
                  <span className="block text-sm font-semibold text-slate-900">Carbon Emission Tracking</span>
                  <span className="block text-[11px] text-slate-500">Enable Scope 1, 2, 3 carbon data entry and reporting.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={config.evidenceRequiredForCsr} onChange={(e) => updateConfig('evidenceRequiredForCsr', e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                <div>
                  <span className="block text-sm font-semibold text-slate-900">Mandatory Proof for CSR</span>
                  <span className="block text-[11px] text-slate-500">Require photo/doc uploads before approving CSR activities.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={config.badgeAutoAwardEnabled} onChange={(e) => updateConfig('badgeAutoAwardEnabled', e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                <div>
                  <span className="block text-sm font-semibold text-slate-900">Automated Badge Awards</span>
                  <span className="block text-[11px] text-slate-500">Automatically grant gamification badges when rules are met.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Notifications & Compliance */}
          <div className="eco-card p-6">
            <h3 className="eco-section-title mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" /> Notifications & Compliance
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Overdue Alert Threshold (Days)</label>
                <p className="text-[11px] text-slate-500 mb-2">How many days before a deadline should warning alerts trigger?</p>
                <input type="number" min="1" max="30" value={config.overdueAlertDays} onChange={(e) => updateConfig('overdueAlertDays', Number(e.target.value))} className="eco-input w-24" />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={config.notificationEmail} onChange={(e) => updateConfig('notificationEmail', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-orange-500" />
                  <span className="text-sm font-medium text-slate-700">Email Alerts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={config.notificationInApp} onChange={(e) => updateConfig('notificationInApp', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-orange-500" />
                  <span className="text-sm font-medium text-slate-700">In-App Alerts</span>
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
