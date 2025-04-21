// controllers/userController.js
import User from "../models/UserModel.js"; // استيراد نموذج المستخدم
// Get current user's profile (with data)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // req.user.id from JWT token
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update user's profile (address, phone, etc.)
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, address, currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming you have the user ID in req.user from the JWT token

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user fields
    user.name = firstName + ' ' + lastName;
    user.email = email;
    user.shippingAddress = address;

    if (currentPassword && newPassword) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
      user.password = newPassword;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};