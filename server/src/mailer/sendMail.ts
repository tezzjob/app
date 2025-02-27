import nodemailer from 'nodemailer'
import logger from '../utils/logger';
import { EMAIL_PASS, EMAIL_USER } from '../utils/config';

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'tezzjob.services@gmail.com',
    pass: 'bzqc szro mvga ktvx',
  },
});

// Function to send email
export const sendEmail = async (to, subject, html) => {
    try {
    const info = await transporter.sendMail({
      from: `TezzJob" <${EMAIL_USER()}>`, // Sender address
      to, // Receiver email
      subject, // Email subject
      html, // Plain text body
    });

    console.log('Email sent:', info.response);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Email failed to send' };
  }
};
