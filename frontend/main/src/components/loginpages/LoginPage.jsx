import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthButton from "../Buttons/AuthButton";
import { useState, useEffect } from "react";

import duplicateLogo from "../../assets/dulipcate Logo.svg";
import googleimg from "../../../src/assets/login-logos-img/google-color.svg";
import onedriveimg from "../../../src/assets/login-logos-img/OneDrive.svg";
import dropboximg from "../../../src/assets/login-logos-img/dropbox.svg"

const clientId = "your-client-id";

function LoginPage() {
  const [Gloadingstate, setGLoadingstate] = useState(false);
  const [Oloadingstate, setOLoadingstate] = useState(false);
  const [Dloadingstate, setDLoadingstate] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setGLoadingstate(true); // Start loading when user clicks login

      axios
        .post("http://127.0.0.1:8000/auth/google/callback/", {
          auth_code: response.code,
        })
        .then((res) => {
          console.log("Login Success:", res.data);
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("refresh_token", res.data.refresh_token);
          localStorage.setItem("user", res.data.user);
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("Login Error:", err)
          alert("Server Busy! try Again")
        })
        .finally(() => {
          setGLoadingstate(false); // Stop loading after response
        });
    },
    onError: () => {
      console.error("Google Login Failed");
      setGLoadingstate(false); // Stop loading if login fails
    },

    flow: "auth-code",
    // ✅ Add Google Drive scope here
    scope: "https://www.googleapis.com/auth/drive"
  });

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          padding: "50px",
          backgroundColor: "#fff",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          width: "350px",
          margin: "50px auto",
          textAlign: "center",
          minHeight: "500px",
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 24px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
            width: "fit-content",
            margin: "0px auto 30px",
          }}
        >
          <img
            src={duplicateLogo}
            alt="CloudScaner Logo"
            style={{ height: "40px" }}
          />
          <h1
            style={{
              margin: "0",
              fontSize: "24px",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            CloudScaner
          </h1>
        </div>
        <h2 style={{ color: "#333", fontWeight: "600" }}>Log in</h2>

        {/* Google Login Button */}
        <AuthButton
          onClick={() => {

            login();
          }}
          icon={googleimg}
          text={Gloadingstate ? "Logging in..." : "Login with Google"}
          disabled={Gloadingstate} // Disable button while logging in
          style={{
            transition: "transform 0.2s",
            cursor: Gloadingstate ? "not-allowed" : "pointer",
            opacity: Gloadingstate ? 0.7 : 1,
          }}
        />

        {/* OneDrive Login Button */}
        <AuthButton
          onClick={() => {
            login();
          }}
          icon={onedriveimg}
          text={Oloadingstate ? "Logging in..." : "Login with OneDrive"}
          disabled={Oloadingstate}
          style={{
            transition: "transform 0.2s",
            cursor: Oloadingstate ? "not-allowed" : "pointer",
            opacity: Oloadingstate ? 0.7 : 1,
          }}
        />

        {/* Dropbox Login Button */}
        <AuthButton
          onClick={() => {
            login();
          }}
          icon={dropboximg}
          text={Dloadingstate ? "Logging in..." : "Login with Dropbox"}
          disabled={Dloadingstate}
          style={{
            transition: "transform 0.2s",
            cursor: Dloadingstate ? "not-allowed" : "pointer",
            opacity: Dloadingstate ? 0.7 : 1,
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}


export default LoginPage;