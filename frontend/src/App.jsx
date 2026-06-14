import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ChatPage from "./pages/ChatPage"
import CrisisPage from "./pages/CrisisPage"
import BreathingPage from "./pages/BreathingPage"
import HistoryPage from "./pages/HistoryPage"
import SettingsPage from "./pages/SettingsPage"
import FaqPage from "./pages/FaqPage"
import BottomNavigation from "./components/BottomNavigation"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  const location = useLocation()
  const hideBottomNavPaths = ['/', '/login', '/signup', '/faq']
  const showBottomNav = !hideBottomNavPaths.includes(location.pathname)

  return (
    <div className="app-container">
      <Routes>
        {/* Public routes */}
        <Route path="/"        element={<LandingPage />} />
        <Route path="/login"   element={<Login />}       />
        <Route path="/signup"  element={<Signup />}      />
        <Route path="/faq"     element={<FaqPage />}     />

        {/* Always public — crisis resources should never require login */}
        <Route path="/crisis"    element={<CrisisPage />}    />
        <Route path="/breathing" element={<BreathingPage />} />

        {/* Protected routes — require login */}
        <Route path="/chat" element={
          <ProtectedRoute><ChatPage /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute><HistoryPage /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
        } />
      </Routes>

      {showBottomNav && <BottomNavigation />}
    </div>
  )
}

export default App