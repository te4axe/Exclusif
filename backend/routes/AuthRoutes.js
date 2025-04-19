import express from 'express'
import { Register, Login } from '../Controller/AuthController.js'
const router = express.Router()

router.post("/register", Register)
router.post("/login", Login)  // Change this path

export default router