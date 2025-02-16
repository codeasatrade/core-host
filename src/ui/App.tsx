import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Containers from "./components/Containers";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        console.log("App component rendered");
        <Route path="/" element={<Home />} />
        <Route path="/containers" element={<Containers />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
