import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import Register from "./component/register";
import Signin from "./component/sign-in";
import Navbar from "./component/navbar";
import Footer from "./component/footer";
function App() {
  return (
    <div className="min-vh-100 d-flex flex-column overflow-x-hidden">
      <header>
        <Navbar />
      </header>
      <main className="bg-success-subtle flex-grow-1">
        <Routes>
          <Route path="/events" element={<Home />} />
          <Route path="/events/about" element={<About />} />

          <Route path="/events/signup" element={<Register />} />
          <Route path="/events/signin" element={<Signin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
