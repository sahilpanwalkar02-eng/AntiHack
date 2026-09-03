import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Globe,
  FileCheck,
  FileText,
  MessageSquare,
  BookOpen,
  PhoneCall,
  User,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Scam Detector', href: '/scam-detector', icon: Bot, badge: 'AI' },
  { name: 'URL Threat Scanner', href: '/url-scanner', icon: Globe },
  { name: 'File Payload Scanner', href: '/file-scanner', icon: FileCheck },
  { name: 'Fraud Complaints', href: '/complaints', icon: FileText },
  { name: 'AI Incident Chatbot', href: '/chatbot', icon: MessageSquare },
  { name: 'Awareness Center', href: '/awareness', icon: BookOpen },
  { name: 'Emergency Cyber SOS', href: '/emergency', icon: PhoneCall, badge: '24/7' },
  { name: 'User Security Profile', href: '/profile', icon: User },
  { name: 'Admin Command Center', href: '/admin', icon: ShieldAlert, adminOnly: true },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/40 p-4 hidden md:block min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
          Security Platform
        </p>

        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-cyber-glow'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                )
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>

              {item.badge ? (
                <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/30">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
              )}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
