import User from '../models/UserModel.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const Register = async (req, res) => {
    try {
      const { name,age,country, email, gender,password, role } = req.body;
  
      // Password hash
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Check if user exists (optional)
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Create new user with default role or the provided role
      const newUser = new User({
        name,
        email,
        age,
        gender,
        country,
        password: hashedPassword,
        role: role || "user", // Default to "user"
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong during registration" });z
    }
  };
  

  export const Login = async (req, res) => {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      const user = await User.findOne({ email });
      console.log("User found:", user ? "Yes" : "No");
      
      if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
      }
  
      const isMatch = await user.matchPassword(password);
      console.log("Password match:", isMatch ? "Yes" : "No");
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
  
      // Generate a JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };