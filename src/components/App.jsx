import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import "./styles/App.css";
import { getToken, setToken } from "../utils/token";
import AppContext from "../contexts/AppContext";
import api from "../utils/api";

function App() {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const jwt = getToken();
    if (!jwt) {
      return;
    }

    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        setIsLoggedIn(true);
        setUserData({ username, email });
        navigate("/ducks");
      })
      .catch(console.error);
  }, []);

  const handleRegister = (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find(
      (u) => u.email === data.email || u.username === data.username,
    );
    if (existingUser) {
      alert("This email or username is already registered");
      return;
    }
    const newUser = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setUserData({ username: newUser.username, email: newUser.email });
    setIsLoggedIn(true);
    setToken("data-jwt");
    navigate("/ducks");
  };

  const handleLogin = ({ identifier, password }) => {
    if (!identifier || !password) {
      alert("Please enter both identifier and password");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) =>
        (u.email === identifier || u.username === identifier) &&
        u.password === password,
    );

    if (user) {
      setToken("data-jwt");
      setUserData({ username: user.username, email: user.email });
      setIsLoggedIn(true);
      navigate("/ducks");
    } else {
      alert("Invalid credentials");
    }
  };
  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Routes>
        <Route
          path="/ducks"
          element={
            <ProtectedRoute>
              <Ducks setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile userData={userData} setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <div className="loginContainer">
              <Login handleLogin={handleLogin} />
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="registerContainer">
              <Register handleRegister={handleRegister} />
            </div>
          }
        />
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to="/ducks" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
