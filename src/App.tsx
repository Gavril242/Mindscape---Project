import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "./components/layout/Layout";
import StardustBackground from "./components/StardustBackground";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SoundProvider } from "./components/SoundContext";
import { MoodProvider } from "./context/MoodContext";
import TermsAndConditions from "./pages/TermsAndConditions";

// Pages
import Dashboard from "./pages/Dashboard";
import SafeSpace from "./pages/SafeSpace";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import Models from "./pages/Models";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import AudioDebug from "./pages/AudioDebug";
import Minigames from "./pages/Minigames";
import MindfulMatch from "./pages/MindfulMatch";
import MindfulLabyrinth from "./pages/MindfulLabyrinth";
import LoadingScreen from "./components/LoadingScreen";
import { TimerProvider } from "./context/TimerContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Redirect to main if already authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="safe-space" element={<SafeSpace />} />
      <Route path="chat" element={<Chat />} />
      <Route path="stats" element={<Stats />} />
      <Route path="profile" element={<Profile />} />
      <Route path="models" element={<Models />} />
      <Route path="audio-debug" element={<AudioDebug />} />
      <Route path="minigames" element={<Minigames />} />
      <Route path="mindful-match" element={<MindfulMatch />} />
      <Route path="mindful-labyrinth" element={<MindfulLabyrinth />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <MoodProvider>
            <SoundProvider>
               <TimerProvider>   
              <Toaster />
              <Sonner />
              <StardustBackground />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
               </TimerProvider>
            </SoundProvider>
          </MoodProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
