import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./components/Dashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="*"
          element={
            <div style={{ padding: 24 }}>
              <h1>404</h1>
              <p>Page not found.</p>
              <Link to="/">Go home</Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
