import { useState, Suspense, lazy } from 'react';
import SearchSpotlight from '@/components/features/SearchSpotlight';
import { useSpotlight } from '@/hooks/useSpotlight';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useTheme } from '@/hooks/useTheme';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Todos = lazy(() => import('@/pages/Todos'));
const Habits = lazy(() => import('@/pages/Habits'));
const Goals = lazy(() => import('@/pages/Goals'));
const Notes = lazy(() => import('@/pages/Notes'));
const Pomodoro = lazy(() => import('@/pages/Pomodoro'));
const Quotes = lazy(() => import('@/pages/Quotes'));
const Mood = lazy(() => import('@/pages/Mood'));
const VisionBoard = lazy(() => import('@/pages/VisionBoard'));
const Bookmarks = lazy(() => import('@/pages/Bookmarks'));
const PasswordGen = lazy(() => import('@/pages/PasswordGen'));
const QRCode = lazy(() => import('@/pages/QRCode'));
const Converter = lazy(() => import('@/pages/Converter'));
const AgeCalc = lazy(() => import('@/pages/AgeCalc'));
const BMI = lazy(() => import('@/pages/BMI'));
const Water = lazy(() => import('@/pages/Water'));
const Reading = lazy(() => import('@/pages/Reading'));
const Study = lazy(() => import('@/pages/Study'));
const Workout = lazy(() => import('@/pages/Workout'));
const DataExport = lazy(() => import('@/pages/DataExport'));
const AIImageGen = lazy(() => import('@/pages/AIImageGen'));
const AIImageEditor = lazy(() => import('@/pages/AIImageEditor'));
const BackgroundRemover = lazy(() => import('@/pages/BackgroundRemover'));
const PhotoEnhancer = lazy(() => import('@/pages/PhotoEnhancer'));
const ImageUpscaler = lazy(() => import('@/pages/ImageUpscaler'));
const FaceRestoration = lazy(() => import('@/pages/FaceRestoration'));
const ObjectRemover = lazy(() => import('@/pages/ObjectRemover'));
const ImageColorizer = lazy(() => import('@/pages/ImageColorizer'));
const AvatarGenerator = lazy(() => import('@/pages/AvatarGenerator'));
const LogoGenerator = lazy(() => import('@/pages/LogoGenerator'));
const PosterMaker = lazy(() => import('@/pages/PosterMaker'));
const ThumbnailCreator = lazy(() => import('@/pages/ThumbnailCreator'));
const MemeGenerator = lazy(() => import('@/pages/MemeGenerator'));
const QRDesigner = lazy(() => import('@/pages/QRDesigner'));
const ImageCompressor = lazy(() => import('@/pages/ImageCompressor'));

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/todos': 'To-Do Manager',
  '/habits': 'Habit Tracker',
  '/goals': 'Goal Planner',
  '/notes': 'Notes',
  '/pomodoro': 'Pomodoro Timer',
  '/quotes': 'Daily Quotes',
  '/mood': 'Mood Tracker',
  '/vision': 'Vision Board',
  '/bookmarks': 'Bookmarks',
  '/password': 'Password Generator',
  '/qrcode': 'QR Code Generator',
  '/converter': 'Unit Converter',
  '/age': 'Age Calculator',
  '/bmi': 'BMI Calculator',
  '/water': 'Water Tracker',
  '/reading': 'Reading Tracker',
  '/study': 'Study Planner',
  '/workout': 'Workout Planner',
  '/export': 'Data Export & Import',
  '/ai-image': 'AI Image Generator',
  '/ai-editor': 'AI Image Editor',
  '/bg-remover': 'Background Remover',
  '/photo-enhancer': 'Photo Enhancer',
  '/upscaler': 'Image Upscaler',
  '/face-restore': 'Face Restoration',
  '/obj-remover': 'Object Remover',
  '/colorizer': 'Image Colorizer',
  '/avatar-gen': 'Avatar Generator',
  '/logo-gen': 'Logo Generator',
  '/poster-maker': 'Poster Maker',
  '/thumbnail': 'Thumbnail Creator',
  '/meme-gen': 'Meme Generator',
  '/qr-designer': 'QR Code Designer',
  '/img-compress': 'Image Compressor',
};

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );
}

function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { open: spotlightOpen, setOpen: setSpotlightOpen } = useSpotlight();
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'LifeOS';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--app-bg)' }}>
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} title={title} onSearchOpen={() => setSpotlightOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/todos" element={<Todos />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/pomodoro" element={<Pomodoro />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/mood" element={<Mood />} />
                <Route path="/vision" element={<VisionBoard />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/password" element={<PasswordGen />} />
                <Route path="/qrcode" element={<QRCode />} />
                <Route path="/converter" element={<Converter />} />
                <Route path="/age" element={<AgeCalc />} />
                <Route path="/bmi" element={<BMI />} />
                <Route path="/water" element={<Water />} />
                <Route path="/reading" element={<Reading />} />
                <Route path="/study" element={<Study />} />
                <Route path="/workout" element={<Workout />} />
                <Route path="/export" element={<DataExport />} />
                <Route path="/ai-image" element={<AIImageGen />} />
                <Route path="/ai-editor" element={<AIImageEditor />} />
                <Route path="/bg-remover" element={<BackgroundRemover />} />
                <Route path="/photo-enhancer" element={<PhotoEnhancer />} />
                <Route path="/upscaler" element={<ImageUpscaler />} />
                <Route path="/face-restore" element={<FaceRestoration />} />
                <Route path="/obj-remover" element={<ObjectRemover />} />
                <Route path="/colorizer" element={<ImageColorizer />} />
                <Route path="/avatar-gen" element={<AvatarGenerator />} />
                <Route path="/logo-gen" element={<LogoGenerator />} />
                <Route path="/poster-maker" element={<PosterMaker />} />
                <Route path="/thumbnail" element={<ThumbnailCreator />} />
                <Route path="/meme-gen" element={<MemeGenerator />} />
                <Route path="/qr-designer" element={<QRDesigner />} />
                <Route path="/img-compress" element={<ImageCompressor />} />
                <Route path="*" element={
                  <div className="text-center py-20">
                    <p className="text-5xl mb-4">🔭</p>
                    <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>Page not found</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Navigate using the sidebar</p>
                  </div>
                } />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
      <SearchSpotlight open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
    </div>
  );
}

export default function App() {
  useTheme();
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
