import { useState, useEffect } from "react";
import "../src/Login.css";
import logobase from './assets/logo_base.png';
import logotop from './assets/logo_top.png';

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(text);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
      alert("Captcha wrong");
      generateCaptcha();
      return;
    }

    alert("login success (dummy)");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src={logobase} alt="logo" className="logo-img logo-base" />
          <img src={logotop} alt="logo" className="logo-img logotop" />
          <span className="logo-text">UTTAR PRADESH TIMES</span>
        </div>

        <h1 className="login-title">Welcome Back</h1>

        <form onSubmit={handleSubmit}>
          <label>User Name</label>
          <input
            type="email"
            placeholder="hannah.green@test.com"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Password123@"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Security Text</label>
          <div className="captcha-row">
            <input
              type="text"
              placeholder="Enter the shown text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
            />

            <div className="captcha-box">
              <span className="captcha-text">{captcha}</span>
              <button type="button" onClick={generateCaptcha} className="cap-refresh">↻</button>
            </div>
          </div>

          <div className="remember">
            <input className="box" type="checkbox" />
            <span className="rem">Remember me on this computer</span>
          </div>

          <button className="login-btn">Log in</button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-buttons">
          <button className="google">Continue with Google</button>
          <button className="whatsapp">Continue with WhatsApp</button>
          <button className="apple">Continue with Apple</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
