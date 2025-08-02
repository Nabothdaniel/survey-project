// utils/emailService.js
import nodemailer from "nodemailer";

// reusable transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// 1. Send password reset code
export const sendResetEmail = async (email, code) => {
  await transporter.sendMail({
    from: `"Survey Site"`,
    to: email,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${code}. It will expire in 15 minutes.`,
  });
};

// 2. Send signup verification code
export const sendSignupCode = async (email, code) => {
  await transporter.sendMail({
    from: `"Survey Site"`,
    to: email,
    subject: "Welcome to Survey Site - Verify Your Email",
    text: `Thank you for signing up!\n\nYour verification code is: ${code}\n\nPlease enter this code to complete your signup.`,
  });
};

// 3. Notify admin after a survey is added
export const notifyAdminNewSurvey = async (surveyTitle, createdBy) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  await transporter.sendMail({
    from: `"Survey Site"`,
    to: adminEmail,
    subject: "New Survey Created",
    text: `A new survey has been added.\n\nTitle: ${surveyTitle}\nCreated by: ${createdBy}`,
  });
};
