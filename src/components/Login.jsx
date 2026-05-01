import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import "./styles/Login.css";

const Login = ({ setIsLoggedIn, handleLogin }) => {
  const [data, setData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(data);
  };

  return (
    <div className="login">
      <Logo title={"CryptoDucks"} />
      <p className="login__welcome">
        This app contains highly sensitive information. Please sign in or
        register to access CryptoDucks.
      </p>
      <form className="login__form" onSubmit={handleSubmit}>
        <label htmlFor="identifier">Login:</label>
        <input
          id="identifier"
          required
          name="identifier"
          type="text"
          value={data.identifier}
          onChange={handleChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          required
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange}
        />
        <div className="login__button-container">
          <button type="submit" className="login__link">
            Log in
          </button>
        </div>
      </form>

      <div className="login__signup">
        <p>Not a member yet?</p>
        <Link to="/register" className="signup__link">
          Sign up here
        </Link>
      </div>
    </div>
  );
};

export default Login;
