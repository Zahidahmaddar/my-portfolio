import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD?.replace(/\s/g, '');
  const notif = process.env.NOTIFICATION_EMAIL;

  const diagnostics: Record<string, unknown> = {
    EMAIL_USER_SET: !!user,
    EMAIL_USER_VALUE: user ? `${user.substring(0, 4)}...` : 'NOT SET',
    EMAIL_PASSWORD_SET: !!pass,
    EMAIL_PASSWORD_LENGTH: pass?.length || 0,
    NOTIFICATION_EMAIL: notif ? `${notif.substring(0, 4)}...` : 'NOT SET',
  };

  if (!user || !pass) {
    return NextResponse.json({ success: false, diagnostics, error: 'Missing credentials' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    // Step 1: Verify SMTP connection
    await transporter.verify();
    diagnostics.smtp_verify = 'SUCCESS';

    // Step 2: Send a test email
    const info = await transporter.sendMail({
      from: `"Portfolio Test" <${user}>`,
      to: notif || user,
      subject: 'Portfolio Email Test',
      text: 'If you received this, your email setup is working correctly!',
      html: '<h2>Email Test</h2><p>If you received this, your email setup is working correctly!</p>',
    });

    diagnostics.message_id = info.messageId;
    diagnostics.accepted = info.accepted;
    diagnostics.rejected = info.rejected;

    return NextResponse.json({ success: true, diagnostics });
  } catch (error: unknown) {
    const err = error as Error & { code?: string; command?: string; responseCode?: number };
    diagnostics.error_message = err.message;
    diagnostics.error_code = err.code;
    diagnostics.error_command = err.command;
    diagnostics.response_code = err.responseCode;

    return NextResponse.json({ success: false, diagnostics });
  }
}
