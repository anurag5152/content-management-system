import { useState, useEffect } from "react";
import "../src/Login.css";
import logobase from './assets/logo_base.png';
import logotop from './assets/logo_top.png';
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
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

    navigate("/Dashboard");
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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Enter the shown text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              style={{ flex: 1 }}
            />

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff'
            }}>
              <div style={{ 
                display: 'flex', 
                userSelect: 'none',
                letterSpacing: '1px'
              }}>
                {captcha.split('').map((char, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      transform: `rotate(${(Math.random() - 0.5) * 20}deg) translateY(${(Math.random() - 0.5) * 4}px)`,
                      fontSize: '20px',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      color: '#000',
                      textDecoration: Math.random() > 0.5 ? 'line-through' : 'none',
                      fontStyle: Math.random() > 0.5 ? 'italic' : 'normal',
                      marginRight: '2px'
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
              
              <button 
                type="button" 
                onClick={generateCaptcha}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#666'
                }}
              >
                ↻
              </button>
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