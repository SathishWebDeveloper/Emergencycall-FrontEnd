import { Route, Routes } from "react-router-dom";
import './App.css';
import { Ambulance } from "./pages/Ambulance/ambulance";
import { Doctors } from "./pages/Doctors/doctors";
import { Home } from "./pages/Home/home";
import { Notfound } from "./pages/NotFound/pagenotfound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/ambulance" element={<Ambulance />} />
      <Route path="*" element={<Notfound />} />
    </Routes>
  )
}

export default App;
