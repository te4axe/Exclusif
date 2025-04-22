import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; 

// Configuration de la stratégie Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,  // Ton Client ID de Google
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Ton Client Secret de Google
    callbackURL: "http://localhost:5000/auth/google/callback", 
    scope:["profile","email"], // L'URL de redirection après l'authentification
  },
  function(accessToken, refreshToken, profile, callback){
    callback(null, profile); // Ici, tu peux enregistrer l'utilisateur dans ta base de données si nécessaire

  }
));

passport.serializeUser((user, done) => {
  done(null, user); // Sérialisation de l'utilisateur
});
passport.deserializeUser((user, done) => {
  done(null, user); // Désérialisation de l'utilisateur
});