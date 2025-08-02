import bcrypt from 'bcrypt';
import { generateToken } from '../utils/helperfns.js';
import User from '../models/User.js';

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });

    if (existingUser)
      return res.status(400).json({ success: false, message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
    });

    const token = generateToken(newUser);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    const { password: _, ...userData } = user.toJSON();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email','role', 'createdAt', 'updatedAt'],
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    console.error('User profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



const deleteUser = async (req, res) => {
  try {
    const deletedCount = await User.destroy({ where: { id: req.user.id } });

    if (!deletedCount)
      return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
  });

  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const updatePassword = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email is required." });

  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user)
    return res.status(404).json({ message: "No user found with this email." });

  const resetCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 mins

  await User.update(
    { reset_code: resetCode, reset_code_expires: expiresAt },
    { where: { id: user.id } }
  );

  await sendResetEmail(user.email, resetCode); // Use nodemailer here

  res.json({ message: "Reset code sent to email." });
};

export {
  registerUser,
  loginUser,
  userProfile,
  deleteUser,
  logoutUser,
  updatePassword,
};
