import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Flash from "./components/Flash.jsx";
import WakeBanner from "./components/WakeBanner.jsx";
import Home from "./pages/Home.jsx";
import ShowListing from "./pages/ShowListing.jsx";
import ListingForm from "./pages/ListingForm.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useApp } from "./context.jsx";

function RequireAuth({ children }) {
  const { user, authLoaded, setFlash } = useApp();
  const location = useLocation();
  useEffect(() => {
    if (authLoaded && !user) setFlash("error", "Please log in first");
  }, [authLoaded, user, setFlash]);
  if (!authLoaded) return <p className="text-center mt-5 text-muted">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <WakeBanner />
      <div className="container">
        <Flash />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listing/new" element={<RequireAuth><ListingForm /></RequireAuth>} />
          <Route path="/listing/:id" element={<ShowListing />} />
          <Route path="/listing/:id/edit" element={<RequireAuth><ListingForm edit /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
