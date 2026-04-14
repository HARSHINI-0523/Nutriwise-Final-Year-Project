const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"NutriWise" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your NutriWise account",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });
};
