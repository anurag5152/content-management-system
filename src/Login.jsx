import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import "../src/Login.css";
import logobase from "./assets/logo_base.png";
import logotop from "./assets/logo_top.png";
import { useNavigate } from "react-router-dom";
import { fetchModulesByRole } from "./store/modulesSlice";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName.trim() || !password) {
      alert("Enter username and password");
      return;
    }

    if (!captchaInput.trim()) {
      alert("Enter the captcha text");
      return;
    }

    if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
      alert("Captcha wrong");
      generateCaptcha();
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/login`, {
        username: userName.trim(),
        password,
      }, {
        headers: { "Content-Type": "application/json" },
        timeout: 8000,
      });

      const user = res.data?.user;
      if (!user) {
        alert("Login response missing user data");
        setLoading(false);
        return;
      }

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("cms_user", JSON.stringify(user));

      // fetch modules via Redux thunk so store + storage are both updated
      try {
        await dispatch(fetchModulesByRole(user.role)).unwrap();
      } catch (err) {
        // ensure some value in storage so StorySidebar can read without error
        try {
          storage.setItem("cms_modules", JSON.stringify([]));
        } catch (e) {}
        console.error("Failed to fetch modules for role", err);
      }

      setPassword("");
      setCaptchaInput("");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      alert(msg);
      generateCaptcha();
    } finally {
      setLoading(false);
    }
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
            type="text"
            placeholder="admin"
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
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Enter the shown text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              style={{ flex: 1 }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  userSelect: "none",
                  letterSpacing: "1px",
                }}
              >
                {captcha.split("").map((char, index) => (
                  <span
                    key={index}
                    style={{
                      display: "inline-block",
                      transform: `rotate(${(Math.random() - 0.5) * 20}deg) translateY(${(Math.random() - 0.5) * 4}px)`,
                      fontSize: "20px",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      color: "#000",
                      textDecoration: Math.random() > 0.5 ? "line-through" : "none",
                      fontStyle: Math.random() > 0.5 ? "italic" : "normal",
                      marginRight: "2px",
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
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  color: "#666",
                }}
              >
                ↻
              </button>
            </div>
          </div>

          <div className="remember" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="box"
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember" className="rem">Remember me on this computer</label>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
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
