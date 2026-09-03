import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, FileText, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';

interface AdminStats {
  total_users: number;
  total_complaints: number;
  active_users: number;
  resolved_complaints: number;
  pending_complaints: number;
  under_investigation: number;
}

interface UserRecord {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  cyber_safety_score: number;
  created_at: string;
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'complaints'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get<AdminStats>('/admin/stats'),
        api.get<UserRecord[]>('/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = stats ? [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'blue' },
    { label: 'Active Users', value: stats.active_users, icon: Users, color: 'teal' },
    { label: 'Total Complaints', value: stats.total_complaints, icon: FileText, color: 'red' },
    { label: 'Resolved', value: stats.resolved_complaints, icon: CheckCircle2, color: 'emerald' },
    { label: 'Pending Review', value: stats.pending_complaints, icon: Clock, color: 'amber' },
    { label: 'Under Investigation', value: stats.under_investigation, icon: BarChart3, color: 'purple' },
  ] : [];

  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="h-7 w-7 text-red-400" /> Admin Command Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">Platform-wide user management, complaint resolution, and threat analytics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className={`border ${colorMap[s.color]} text-center space-y-2 py-5`}>
            <div className={`mx-auto h-9 w-9 rounded-xl flex items-center justify-center border ${colorMap[s.color]}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-[10px] font-semibold uppercase text-slate-400">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-px">
        {(['overview', 'users', 'complaints'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl capitalize transition-all ${activeTab === tab
                ? 'bg-slate-900 border border-b-slate-900 border-slate-800 text-blue-400 -mb-px'
                : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'users' ? '👥 Users' : '📋 Complaints'}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  {['ID', 'Name', 'Email', 'Role', 'Safety Score', 'Active', 'Joined'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-4 py-3 text-slate-500">#{user.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{user.full_name}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${user.cyber_safety_score}%` }} />
                        </div>
                        <span className="text-slate-400">{user.cyber_safety_score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${user.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
                        {user.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-white">Platform Health Metrics</h2>
            {stats && (
              <div className="space-y-3">
                {[
                  { label: 'Complaint Resolution Rate', value: stats.total_complaints > 0 ? Math.round((stats.resolved_complaints / stats.total_complaints) * 100) : 0, color: 'bg-emerald-400' },
                  { label: 'User Activation Rate', value: stats.total_users > 0 ? Math.round((stats.active_users / stats.total_users) * 100) : 0, color: 'bg-blue-400' },
                  { label: 'Pending Investigation Load', value: stats.total_complaints > 0 ? Math.round((stats.under_investigation / stats.total_complaints) * 100) : 0, color: 'bg-amber-400' },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{metric.label}</span>
                      <span className="text-white font-semibold">{metric.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${metric.color} rounded-full transition-all`} style={{ width: `${metric.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="space-y-3">
            <h2 className="text-sm font-bold text-white">Quick Actions</h2>
            {[
              { label: 'Export User Report', icon: '📥' },
              { label: 'Send System Broadcast', icon: '📢' },
              { label: 'Audit Security Logs', icon: '🔍' },
              { label: 'Manage Scam Articles', icon: '📰' },
            ].map((action, i) => (
              <button key={i} className="w-full text-left text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-2">
                <span>{action.icon}</span> {action.label}
              </button>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};
