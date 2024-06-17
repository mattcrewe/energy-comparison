import "./index.css";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { createContext, useEffect, useState } from "react";

import Login from "./pages/auth";
import Dashboard from "./pages/dashboard/dashboard";
import Error404Page from "./pages/404";

interface AuthContextType {
  auth: boolean;
  setAuth: (status: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  auth: false,
  setAuth: () => {},
});

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth")
      .then((response) => {
        if (response.status == 200) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
        setAuth(false);
      });
  }, []);

  const PrivateRoutes = () => {
    return auth ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Routes>
        <Route
          path="/"
          element={auth ? <Outlet /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
