const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ----- EMAIL -----
exports.sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
  }
};

// ----- SMS -----
exports.sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`✅ SMS sent to ${to}`);
  } catch (err) {
    console.error('❌ SMS send failed:', err.message);
  }
};

// ----- WHATSAPP -----
exports.sendWhatsApp = async (to, message) => {
  try {
    await client.messages.create({
      from: process.env.WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message,
    });
    console.log(`✅ WhatsApp message sent to ${to}`);
  } catch (err) {
    console.error('❌ WhatsApp send failed:', err.message);
  }
};