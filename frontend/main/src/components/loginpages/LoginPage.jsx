import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const clientId = "933890705867-blj09m00jt39h4gdud6k86v0ve4lbr2s.apps.googleusercontent.com";

function LoginPage() {
  const navigate = useNavigate()
  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log(response); // This should contain the auth code
      axios
        .post("http://127.0.0.1:8000/auth/google/callback/", {
          auth_code: response.code,  // Send the code to backend
        })
        .then((res) => {
          console.log("Login Success:", res.data);
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("refresh_token", res.data.refresh_token);
          localStorage.setItem("user", res.data.user);
          navigate("/dashboard");
        })
        .catch((err) => console.error("Login Error:", err));
    },
    onError: () => console.error("Google Login Failed"),
    flow: "auth-code",  // IMPORTANT: This fetches the AUTH CODE
  });

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <button onClick={() => login()}>Login with Google</button>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;


