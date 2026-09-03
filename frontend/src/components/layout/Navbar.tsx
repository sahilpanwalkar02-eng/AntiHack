import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Moon, Sun, LogOut, User as UserIcon, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-500 border border-blue-500/30 group-hover:border-blue-400 transition-colors shadow-cyber-glow">
            <ShieldCheck className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight cyber-gradient-text">
              AntiHack
            </span>
            <span className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              Threat Shield
            </span>
          </div>
        </Link>

        {/* Right Action Menu */}
        <div className="flex items-center gap-4">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
              </button>

              <div className="h-6 w-px bg-slate-800" />

              <Link to="/profile" className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-800/60 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 text-xs font-bold text-white uppercase shadow-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{user?.full_name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
                </div>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Sign out"
              >
                <LogOut className="h-4 w-4 text-slate-400 hover:text-red-400" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
