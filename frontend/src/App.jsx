import { Routes, Route } from "react-router-dom";
import { useEffect} from "react";
import Lenis from "lenis";

import HomePage from "./pages/HomePage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import BuildPage from "./pages/BuildPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true, 
      smoothTouch: true,
    });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/build" element={<BuildPage />} />
    </Routes>
  )
}

