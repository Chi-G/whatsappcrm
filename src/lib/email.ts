import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525", 10),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendSubscriptionSuccessEmail(toEmail: string, planName: string, amount: string) {
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Fora CRM</h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff; color: #334155;">
        <h2 style="margin-top: 0; color: #0f172a;">Payment Successful! 🎉</h2>
        <p>Hi there,</p>
        <p>Thank you for subscribing to <strong>${planName}</strong>. Your payment of <strong>${amount}</strong> was successfully processed.</p>
        <p>Your account is now fully active. You can log into your dashboard at any time to manage your settings, view chats, and explore all premium features.</p>
        
        <div style="margin-top: 32px; padding: 16px; background-color: #f8fafc; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #0f172a;">Subscription Details:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Plan:</strong> ${planName}</li>
            <li><strong>Amount:</strong> ${amount} / month</li>
            <li><strong>Status:</strong> Active</li>
          </ul>
        </div>
        
        <p style="margin-top: 32px;">If you have any questions, feel free to reply directly to this email.</p>
        <p>Best regards,<br>The Fora CRM Team</p>
      </div>
    </div>
  `;

  try {
    const info = await transport.sendMail({
      from: process.env.SMTP_FROM_EMAIL || '"Fora CRM Billing" <billing@foracrm.com>',
      to: toEmail,
      subject: "Welcome to Fora CRM! Payment Successful 🎉",
      html: htmlContent
    });
    console.log(`[Email] Success email sent to ${toEmail}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send success email:", error);
    return false;
  }
}
