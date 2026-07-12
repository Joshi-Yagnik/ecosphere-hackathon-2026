'use client';

// app/(dashboard)/settings/profile/page.tsx
// ============================================================
// User Profile Settings
// ============================================================
import { useState } from 'react';
import { User, Save, Key, Mail, Building, Globe } from 'lucide-react';
import { currentUser } from '@/lib/mock-data/settings';
import { getInitials } from '@/lib/utils';
import { mockGetSession } from '@/lib/mock-auth';

export default function ProfilePage() {
  const session = mockGetSession();
  const [profile, setProfile] = useState(session?.user || currentUser);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 600);
  };

  return (
    <div className="animate-fade-in max-w-4xl space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <User className="w-6 h-6 text-slate-600" /> My Profile
          </h1>
          <p className="eco-page-subtitle">Manage your personal information and account preferences.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="eco-btn-primary bg-emerald-600 hover:bg-emerald-700 text-sm px-4 py-2 gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Avatar Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="eco-card p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-700 shadow-inner mb-4">
              {getInitials(profile.name)}
            </div>
            <h3 className="font-bold text-slate-900 text-lg">{profile.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{profile.role}</p>
            <button onClick={() => alert('Uploading photo...')} className="eco-btn-secondary text-xs w-full justify-center">Upload Photo</button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="md:col-span-2 space-y-6">
          <div className="eco-card p-6">
            <h3 className="eco-section-title mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="eco-input pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="eco-input pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Job Role</label>
                <input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="eco-input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={profile.department} disabled className="eco-input pl-9 bg-slate-50 cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          <div className="eco-card p-6">
            <h3 className="eco-section-title mb-4">Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Language</label>
                <select value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })} className="eco-input cursor-pointer">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Timezone</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select value={profile.timezone} onChange={(e) => setProfile({ ...profile, timezone: e.target.value })} className="eco-input pl-9 cursor-pointer">
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Europe/Paris</option>
                    <option>Asia/Kolkata</option>
                    <option>Asia/Tokyo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="eco-card p-6 border-red-200">
            <h3 className="eco-section-title mb-2 text-red-600 flex items-center gap-2">
              <Key className="w-5 h-5" /> Security
            </h3>
            <p className="text-sm text-slate-500 mb-4">Manage your password and authentication methods.</p>
            <button onClick={() => alert('Account deletion requested.')} className="eco-btn-secondary text-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
              Change Password
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
