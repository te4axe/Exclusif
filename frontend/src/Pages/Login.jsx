import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt_decode from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("❌ Veuillez remplir tous les champs !");
      return;
    }
    
    try {
      // Send request to backend API with email and password
      // Updated URL to match your backend route configuration
      const response = await axios.post(
        "http://localhost:5000/api/login",  // Changed from /api/login to /api/auth/login
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const { token } = response.data;
      if (!token) {
        toast.error("❌ Token not received!");
        return;
      }
      
      // Save token in local storage
      localStorage.setItem("token", token);
      
      // Decode the token to get user role
      const decodedToken = jwt_decode(token);
      
      // Check role and navigate accordingly
      if (decodedToken.role === "admin") {
        toast.success("✅ Connexion réussie ! Bienvenue administrateur.");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.success("✅ Connexion réussie !");
        setTimeout(() => navigate("/home"), 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = error.response?.data?.message || "❌ Erreur lors de la connexion !";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <div className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891419.png"
            alt="E-Commerce Logo"
            className="w-16 mx-auto mb-3"
          />
          <h2 className="text-3xl font-extrabold text-gray-700">Connexion</h2>
          <p className="text-gray-500">Accédez à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition transform hover:scale-105"
          >
            Se connecter
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="w-full border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500">ou</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 transition">
          <img
            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Connexion avec Google
        </button>

        <p className="text-center text-gray-600 mt-4">
          Nouveau client ?{" "}
          <Link to="/Register" className="text-blue-600 hover:underline font-semibold">
            Créez un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
