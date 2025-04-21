import express from 'express';
import { verifyToken } from '../middlwares/AuthMiddlwares.js';
import { updateProfile } from '../Controller/UserController.js';
  // استيراد الـ controller

const router = express.Router();

// Route لتحديث الملف الشخصي
router.put("/updateProfile", verifyToken, updateProfile);
router.get('/profile', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude password field
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        name: user.name,
        email: user.email,
        shippingAddress: user.shippingAddress,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

export default router;
