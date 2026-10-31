import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

const FALLBACK_ADDRESS = 'darzahid537@gmail.com';

// Create transporter lazily so env vars are available
function getTransporter() {
  // Lets e2e runs exercise the full flow without sending real mail
  if (process.env.EMAIL_TRANSPORT === 'json') {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD?.replace(/\s/g, ''),
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Send an email notification
 * @param options Email options (to, subject, text, html)
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (process.env.EMAIL_TRANSPORT !== 'json' && (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD)) {
      console.error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD env vars.');
      return false;
    }

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Zahid Farooq" <${process.env.EMAIL_USER || FALLBACK_ADDRESS}>`,
      ...options,
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send an auto-reply email to the user who submitted the contact form
 * @param name Name of the person who submitted the form
 * @param email Email of the person who submitted the form
 * @returns Promise that resolves when email is sent
 */
export async function sendAutoReply(
  name: string,
  email: string
): Promise<boolean> {
  const subject = 'Thank you for contacting Zahid Farooq';

  const text = `Dear ${name},

Thank you for reaching out through my portfolio website. I have received your message and will get back to you shortly.

Best regards,
Zahid Farooq`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #10312c;">
      <p>Dear ${escapeHtml(name)},</p>
      <p>Thank you for reaching out through my portfolio website. I have received your message and will get back to you shortly.</p>
      <p>Best regards,<br><strong>Zahid Farooq</strong></p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    replyTo: process.env.EMAIL_USER || FALLBACK_ADDRESS,
  });
}

/**
 * Send a contact form notification email
 * @param name Name of the person who submitted the form
 * @param email Email of the person who submitted the form
 * @param message Message content
 * @param messageSubject Optional subject the person entered
 * @returns Promise that resolves when email is sent
 */
export async function sendContactNotification(
  name: string,
  email: string,
  message: string,
  messageSubject?: string
): Promise<boolean> {
  const subject = `New message from ${singleLine(name)}`;

  const text = `Name: ${name}
Email: ${email}
Subject: ${messageSubject || '(none)'}

${message}`;

  const html = `
    <h2>New message from your portfolio</h2>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(name)}</li>
      <li><strong>Email:</strong> ${escapeHtml(email)}</li>
      <li><strong>Subject:</strong> ${escapeHtml(messageSubject || '(none)')}</li>
    </ul>
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
  `;

  return sendEmail({
    to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER || FALLBACK_ADDRESS,
    subject,
    text,
    html,
    replyTo: email,
  });
}

/**
 * Email the admin's reply to the person who sent a contact message
 */
export async function sendReply(
  name: string,
  email: string,
  reply: string,
  originalMessage: string,
  messageSubject?: string
): Promise<boolean> {
  const subject = messageSubject ? `Re: ${singleLine(messageSubject)}` : 'Reply from Zahid Farooq';

  const text = `Hi ${name},

${reply}

Zahid Farooq

---
Your message:
${originalMessage}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #10312c;">
      <p>Hi ${escapeHtml(name)},</p>
      <p style="white-space: pre-wrap;">${escapeHtml(reply)}</p>
      <p><strong>Zahid Farooq</strong></p>
      <hr style="border: 0; border-top: 1px solid #d5dfe6; margin-top: 24px;">
      <p style="color: #48606b; font-size: 13px;">Your message:</p>
      <p style="color: #48606b; font-size: 13px; white-space: pre-wrap;">${escapeHtml(originalMessage)}</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    replyTo: process.env.EMAIL_USER || FALLBACK_ADDRESS,
  });
}
