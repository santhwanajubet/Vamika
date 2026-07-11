const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

const sendPasswordResetEmail = async (email, resetUrl) => {
  await sendEmail({
    to: email,
    subject: 'Vamika — Reset Your Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="margin-bottom:16px;">Reset your password</h2>
        <p style="color:#555;margin-bottom:24px;">
          You requested a password reset. Click the button below to set a new password. This link expires in 15 minutes.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">
          Reset Password
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendPasswordResetEmail };
