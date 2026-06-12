import { Routes, Route, useLocation } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ChatInterface from "./pages/ChatInterface"
import CrisisPage from "./pages/CrisisPage"
import BreathingPage from "./pages/BreathingPage"
import HistoryPage from "./pages/HistoryPage"
import SettingsPage from "./pages/SettingsPage"
import FaqPage from "./pages/FaqPage"
import BottomNavigation from "./components/BottomNavigation"

function App() {
  const location = useLocation();
  const hideBottomNavPaths = ['/', '/login', '/signup', '/faq'];
  const showBottomNav = !hideBottomNavPaths.includes(location.pathname);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/chat" element={<ChatInterface/>}/>
        <Route path="/crisis" element={<CrisisPage/>}/>
        <Route path="/breathing" element={<BreathingPage/>}/>
        <Route path="/history" element={<HistoryPage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/faq" element={<FaqPage/>}/>
      </Routes>
      
      {showBottomNav && <BottomNavigation />}
    </div>
  )
}

export default App

