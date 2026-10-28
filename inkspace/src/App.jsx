import { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ArticleDetails from "./pages/ArticleDetails";
import Categories from "./pages/Categories";
import Bookmarks from "./pages/Bookmarks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WriteArticle from "./pages/WriteArticle";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Every route nested inside this one requires a login
function RequireAuth() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          {/* Public pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private pages: login required */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/article/:id" element={<ArticleDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/write" element={<WriteArticle />} />
            <Route path="/write/:id" element={<WriteArticle />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}