'use client';
import { Trophy, Zap, UserCheck, Award, Gift, Medal, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const subPages = [
  { title: 'Challenges', href: '/gamification/challenges', icon: Zap, desc: 'Browse and manage ESG challenges with XP rewards.', badge: '12 Active', color: 'text-orange-600', bg: 'bg-orange-50' },
  { title: 'My Participations', href: '/gamification/challenge-participation', icon: UserCheck, desc: 'View employee challenge enrollments and progress.', badge: '248 Joined', color: 'text-amber-600', bg: 'bg-amber-50' },
  { title: 'Badges', href: '/gamification/badges', icon: Award, desc: 'Design and manage achievement badges for employees.', badge: '32 Badges', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { title: 'Rewards', href: '/gamification/rewards', icon: Gift, desc: 'Manage redeemable rewards in the XP rewards shop.', badge: '18 Available', color: 'text-red-500', bg: 'bg-red-50' },
  { title: 'Leaderboard', href: '/gamification/leaderboard', icon: Medal, desc: 'Company-wide XP leaderboard with trend tracking.', badge: 'Top 100', color: 'text-green-600', bg: 'bg-green-50' },
];

export default function GamificationPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="eco-page-header">
        <div>
          <h1 className="eco-page-title flex items-center gap-2">
            <Trophy className="w-6 h-6 text-orange-500" /> Gamification
          </h1>
          <p className="eco-page-subtitle">Drive ESG engagement through challenges, badges, XP points and rewards.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {subPages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.href} href={page.href} className="eco-card-hover p-5 block group">
              <div className={`w-10 h-10 ${page.bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${page.color}`} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-orange-700 transition-colors">{page.title}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-3">{page.desc}</p>
              <div className="flex items-center justify-between">
                <span className="eco-badge-orange text-xs">{page.badge}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
      <div className="eco-card p-4 border-l-4 border-orange-500 bg-orange-50/50 text-sm text-orange-800">
        ⚡ Challenge cards, XP progress bars, badge grid, rewards shop and full leaderboard table arrive in <strong>Phase 6</strong>.
      </div>
    </div>
  );
}
