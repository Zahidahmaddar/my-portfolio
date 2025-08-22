import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
});

/**
 * Send an email notification
 * @param options Email options (to, subject, text, html)
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {

    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASSWORD);
    console.log(process.env.NOTIFICATION_EMAIL);
    
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not configured');
      return false;
    }

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      ...options,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send a contact form notification email
 * @param name Name of the person who submitted the form
 * @param email Email of the person who submitted the form
 * @param message Message content
 * @returns Promise that resolves when email is sent
 */
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
  const subject = `Thank you for contacting Zahid Farooq`;
  
  const text = `
    Dear ${name},
    
    Thank you for reaching out through my portfolio website. I have received your message and will get back to you shortly.
    
    This is an automated response, so please do not reply to this email.
    
    Best regards,
    Zahid Farooq
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a6cf7;">Thank You for Your Message</h2>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out through my portfolio website. I have received your message and will get back to you shortly.</p>
      <p>This is an automated response, so please do not reply to this email.</p>
      <div style="margin-top: 30px;">
        <p>Best regards,</p>
        <p><strong>Zahid Farooq</strong></p>
      </div>
      <hr style="border: 1px solid #eee; margin-top: 30px;">
      <p style="color: #666; font-size: 12px;">This is an automated message from my portfolio website.</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    text,
    html,
    replyTo: process.env.EMAIL_USER || 'muzamiladnan79@gmail.com'
  });
}

export async function sendContactNotification(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  const subject = `New Contact Form Submission from ${name}`;
  
  const text = `
    You have received a new contact form submission:
    
    Name: ${name}
    Email: ${email}
    
    Message:
    ${message}
    
    ---
    This is an automated notification from your portfolio website.
  `;
  
  const html = `
    <h2>New Contact Form Submission</h2>
    <p>You have received a new message from your portfolio website contact form.</p>
    
    <h3>Contact Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
    </ul>
    
    <h3>Message:</h3>
    <p style="white-space: pre-wrap;">${message}</p>
    
    <hr>
    <p><em>This is an automated notification from your portfolio website.</em></p>
  `;
  
  return sendEmail({
    to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER || 'muzamiladnan79@gmail.com',
    subject,
    text,
    html,
  });
}
