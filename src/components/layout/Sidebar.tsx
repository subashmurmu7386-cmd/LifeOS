import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Target, BookOpen, Timer,
  Quote, SmilePlus, Image, Bookmark, Key, QrCode,
  ArrowLeftRight, Calendar, Activity, Droplets, BookMarked,
  GraduationCap, Dumbbell, Database, TrendingUp, Sun, Moon,
  ChevronLeft, Menu, Download, X,
  Sparkles, Pencil, Eraser, Zap, ZoomIn, Type, Monitor, Layout, Smile, Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', group: 'Main' },
  { path: '/todos', icon: CheckSquare, label: 'To-Do', group: 'Productivity' },
  { path: '/habits', icon: TrendingUp, label: 'Habits', group: 'Productivity' },
  { path: '/goals', icon: Target, label: 'Goals', group: 'Productivity' },
  { path: '/notes', icon: BookOpen, label: 'Notes', group: 'Productivity' },
  { path: '/pomodoro', icon: Timer, label: 'Pomodoro', group: 'Productivity' },
  { path: '/study', icon: GraduationCap, label: 'Study', group: 'Productivity' },
  { path: '/workout', icon: Dumbbell, label: 'Workout', group: 'Health' },
  { path: '/water', icon: Droplets, label: 'Water', group: 'Health' },
  { path: '/bmi', icon: Activity, label: 'BMI', group: 'Health' },
  { path: '/mood', icon: SmilePlus, label: 'Mood', group: 'Health' },
  { path: '/reading', icon: BookMarked, label: 'Reading', group: 'Lifestyle' },
  { path: '/vision', icon: Image, label: 'Vision Board', group: 'Lifestyle' },
  { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks', group: 'Lifestyle' },
  { path: '/quotes', icon: Quote, label: 'Quotes', group: 'Lifestyle' },
  { path: '/password', icon: Key, label: 'Password Gen', group: 'Tools' },
  { path: '/qrcode', icon: QrCode, label: 'QR Code', group: 'Tools' },
  { path: '/converter', icon: ArrowLeftRight, label: 'Converter', group: 'Tools' },
  { path: '/age', icon: Calendar, label: 'Age Calc', group: 'Tools' },
  { path: '/export', icon: Database, label: 'Data', group: 'System' },
  { path: '/ai-image', icon: Sparkles, label: 'AI Image Gen', group: 'Creator' },
  { path: '/ai-editor', icon: Pencil, label: 'Image Editor', group: 'Creator' },
  { path: '/bg-remover', icon: Eraser, label: 'BG Remover', group: 'Creator' },
  { path: '/photo-enhancer', icon: Zap, label: 'Enhancer', group: 'Creator' },
  { path: '/upscaler', icon: ZoomIn, label: 'Upscaler', group: 'Creator' },
  { path: '/logo-gen', icon: Type, label: 'Logo Gen', group: 'Creator' },
  { path: '/thumbnail', icon: Monitor, label: 'Thumbnail', group: 'Creator' },
  { path: '/poster-maker', icon: Layout, label: 'Poster Maker', group: 'Creator' },
  { path: '/meme-gen', icon: Smile, label: 'Meme Gen', group: 'Creator' },
  { path: '/qr-designer', icon: Palette, label: 'QR Designer', group: 'Creator' },
];

const groups = ['Main', 'Productivity', 'Health', 'Lifestyle', 'Tools', 'System', 'Creator'];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useLocalStorage('lifeos-sidebar-collapsed', false);

  const handleNav = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  const SidebarContent = () => (
    <div className={cn('flex flex-col h-full py-4', collapsed ? 'w-16' : 'w-60')}>
      {/* Logo */}
      <div className={cn('flex items-center px-4 mb-6', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
              <span className="text-white font-display font-bold text-sm">L</span>
            </div>
            <span className="font-display font-bold text-lg gradient-text">LifeOS</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
            <span className="text-white font-display font-bold text-sm">L</span>
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="btn-ghost p-1.5 rounded-lg hidden lg:flex">
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-1">
        {groups.map(group => {
          const items = navItems.filter(i => i.group === group);
          return (
            <div key={group} className="mb-2">
              {!collapsed && (
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 px-2" style={{ color: 'var(--text-muted)' }}>
                  {group}
                </p>
              )}
              {items.map(({ path, icon: Icon, label }) => (
                <button
                  key={path}
                  onClick={() => handleNav(path)}
                  className={cn('nav-item w-full', pathname === path && 'active', collapsed && 'justify-center px-0')}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="px-3 pt-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <div className={cn('flex items-center', collapsed ? 'flex-col gap-2' : 'justify-between')}>
          <button
            onClick={toggleTheme}
            className="btn-ghost p-2 rounded-xl"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="btn-ghost p-2 rounded-xl lg:hidden"
            >
              <Download size={16} />
            </button>
          )}
          {collapsed && (
            <button onClick={() => setCollapsed(false)} className="btn-ghost p-2 rounded-xl">
              <Menu size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'glass-sidebar hidden lg:flex flex-col flex-shrink-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 glass-sidebar flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <span className="text-white font-display font-bold text-sm">L</span>
                </div>
                <span className="font-display font-bold text-lg gradient-text">LifeOS</span>
              </div>
              <button onClick={onMobileClose} className="btn-ghost p-1.5">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1">
              {groups.map(group => {
                const items = navItems.filter(i => i.group === group);
                return (
                  <div key={group} className="mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1 px-2" style={{ color: 'var(--text-muted)' }}>
                      {group}
                    </p>
                    {items.map(({ path, icon: Icon, label }) => (
                      <button
                        key={path}
                        onClick={() => handleNav(path)}
                        className={cn('nav-item w-full', pathname === path && 'active')}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
