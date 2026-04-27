import {Routes, Route} from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from "./pages/Home"

function App() {

  return (
    <div className="flec flex-col min-h-screen">
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App
