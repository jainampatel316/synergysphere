import nodemailer from "nodemailer";
import env from "../config/env";

// Create transporter based on email provider
const createTransporter = () => {
  if (env.EMAIL_PROVIDER === "smtp") {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  
  throw new Error("Unsupported email provider");
};

const transporter = createTransporter();

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`📧 Email provider: ${env.EMAIL_PROVIDER}`);
    
    const mailOptions = {
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    };
    
    console.log(`📧 Mail options:`, { 
      from: mailOptions.from, 
      to: mailOptions.to, 
      subject: mailOptions.subject 
    });
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}:`, result.messageId);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    throw error;
  }
};

export const sendConfirmationEmail = async (email: string, name: string, token: string) => {
  const subject = "Confirm Your Email Address";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to SynergySphere!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering with SynergySphere. Please confirm your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${env.SOCKET_ORIGIN}/confirm-email?token=${token}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Confirm Email Address
        </a>
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${env.SOCKET_ORIGIN}/confirm-email?token=${token}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account with us, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">SynergySphere Team</p>
    </div>
  `;
  
  return sendEmail(email, subject, html);
};

export const sendPasswordResetEmail = async (email: string, name: string, token: string) => {
  const subject = "Reset Your Password";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password for your SynergySphere account. Click the button below to reset it:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${env.SOCKET_ORIGIN}/reset-password?token=${token}" 
           style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${env.SOCKET_ORIGIN}/reset-password?token=${token}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">SynergySphere Team</p>
    </div>
  `;
  
  return sendEmail(email, subject, html);
};

export const sendProjectInvitationEmail = async (email: string, name: string, projectName: string, inviterName: string) => {
  const subject = `You're invited to join "${projectName}"`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Project Invitation</h2>
      <p>Hi ${name},</p>
      <p>${inviterName} has invited you to collaborate on the project "<strong>${projectName}</strong>" in SynergySphere.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${env.SOCKET_ORIGIN}/invitations" 
           style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Invitation
        </a>
      </div>
      <p>If you don't have an account yet, you'll need to register first before accepting the invitation.</p>
      <p>This invitation will expire in 7 days.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">SynergySphere Team</p>
    </div>
  `;
  
  return sendEmail(email, subject, html);
};

export default {
  sendEmail,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendProjectInvitationEmail
};
