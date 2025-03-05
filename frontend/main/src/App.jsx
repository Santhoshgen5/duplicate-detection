import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./components/loginpages/loginpage"; // Keep a single import
import PageNotFound from "./components/PageNotFound";
import Dashboard from "./components/Dashboard/Dashboard"


function App() {
  const clientId = "933890705867-blj09m00jt39h4gdud6k86v0ve4lbr2s.apps.googleusercontent.com";
  function Logout() {
    localStorage.clear();
    return <Navigate to="/" />;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="*"
          element={<PageNotFound />} 
        />
        
        <Route
          path="/"
          element={<GoogleOAuthProvider clientId={clientId}>
          <LoginPage />
          </GoogleOAuthProvider>}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route path="/logout" element={<Logout />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

