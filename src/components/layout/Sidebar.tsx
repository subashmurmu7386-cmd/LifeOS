import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Target, BookOpen, Timer,
  Quote, SmilePlus, Image, Bookmark, Key, QrCode,
  ArrowLeftRight, Calendar, Activity, Droplets, BookMarked,
  GraduationCap, Dumbbell, Database, TrendingUp, Sun, Moon,
  ChevronLeft, Menu, X,
  Sparkles, Pencil, Eraser, Zap, ZoomIn, Type, Monitor, Layout, Smile, Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const DRAWER_WIDTH = 288; // w-72 = 18rem = 288px

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
  onMobileOpen?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose, onMobileOpen }: SidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useLocalStorage('lifeos-sidebar-collapsed', false);

  // ── Swipe-to-close state ──────────────────────────────────────────────────
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontal = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontal.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    if (!isHorizontal.current) {
      // Determine swipe axis after 8px movement
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        isHorizontal.current = Math.abs(dx) > Math.abs(dy);
        if (isHorizontal.current) setIsDragging(true);
      }
    }

    // Only track leftward drags to close
    if (isHorizontal.current && dx < 0) {
      setDragX(Math.max(dx, -DRAWER_WIDTH));
    }
  };

  const handleTouchEnd = () => {
    if (dragX < -60) {
      onMobileClose();
    }
    // Snap back or close — reset drag state
    setDragX(0);
    setIsDragging(false);
    isHorizontal.current = false;
  };

  // ── Edge swipe to open ────────────────────────────────────────────────────
  useEffect(() => {
    let edgeStartX = 0;
    let isEdge = false;

    const onTouchStart = (e: TouchEvent) => {
      // Activate only when sidebar is closed and touch starts within 20px of left edge
      if (!mobileOpen && e.touches[0].clientX <= 20) {
        edgeStartX = e.touches[0].clientX;
        isEdge = true;
      } else {
        isEdge = false;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isEdge && !mobileOpen) {
        const dx = e.changedTouches[0].clientX - edgeStartX;
        if (dx > 60 && onMobileOpen) {
          onMobileOpen();
        }
      }
      isEdge = false;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [mobileOpen, onMobileOpen]);

  // ── Lock body scroll when mobile sidebar is open ──────────────────────────
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNav = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  // Proportional backdrop opacity during drag
  const backdropOpacity = mobileOpen ? Math.max(0, 1 + dragX / DRAWER_WIDTH) : 0;
  const drawerTranslate = mobileOpen ? `translateX(${Math.min(0, dragX)}px)` : 'translateX(-100%)';

  // ── Desktop sidebar content ───────────────────────────────────────────────
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
          <button onClick={toggleTheme} className="btn-ghost p-2 rounded-xl" title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
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
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className={cn(
        'glass-sidebar hidden lg:flex flex-col flex-shrink-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Drawer (always mounted, CSS-transition driven) ─────────── */}
      <div
        className="fixed inset-0 z-50 lg:hidden"
        style={{ pointerEvents: mobileOpen ? 'auto' : 'none' }}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            opacity: backdropOpacity,
            transition: isDragging ? 'none' : 'opacity 300ms ease',
            willChange: 'opacity',
          }}
          onClick={onMobileClose}
        />

        {/* Drawer panel */}
        <aside
          className="absolute left-0 top-0 bottom-0 glass-sidebar flex flex-col"
          style={{
            width: DRAWER_WIDTH,
            transform: drawerTranslate,
            transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
            boxShadow: '6px 0 32px rgba(0,0,0,0.35), 12px 0 48px rgba(124,58,237,0.18)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drawer header */}
          <div
            className="flex items-center justify-between px-4 py-4 border-b flex-shrink-0"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
                <span className="text-white font-display font-bold text-sm">L</span>
              </div>
              <span className="font-display font-bold text-lg gradient-text">LifeOS</span>
            </div>
            <button
              onClick={onMobileClose}
              className="btn-ghost p-2 rounded-xl"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Swipe hint indicator */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-16 rounded-l-full opacity-30"
            style={{ background: 'var(--glass-border)', marginRight: -1 }}
          />

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1">
            {groups.map(group => {
              const items = navItems.filter(i => i.group === group);
              return (
                <div key={group} className="mb-2">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1 px-2"
                    style={{ color: 'var(--text-muted)' }}
                  >
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

          {/* Bottom bar */}
          <div
            className="px-3 pt-3 pb-4 border-t flex-shrink-0"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            <button
              onClick={toggleTheme}
              className="btn-ghost w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
