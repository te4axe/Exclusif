import express from 'express'
import { Register, Login } from '../Controller/AuthController.js'
import passport from 'passport'
const router = express.Router()



router.post("/register", Register)
router.post("/login", Login)  // Change this path
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({ success: true, user: req.user })
    } else {
        res.status(403).json({ success: false, message: "Not authenticated" })
    }
})
router.get("/login/failed", (req, res) => {
    res.status(401).json({message: "Login failed"})
})
router.get("/google/callback", passport.authenticate("google", {successRedirect: process.env.CLIENT_URL, failureRedirect: "/login/failed"}))

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}))
router.get("/logout", (req, res) => {
    req.logout((err) => {
        req.logOut()
        res.redirect(process.env.CLIENT_URL)
    })
})
export default router