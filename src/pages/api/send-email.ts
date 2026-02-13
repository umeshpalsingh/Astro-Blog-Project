import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  // Configure your SMTP settings (e.g., Gmail, Outlook, or SMTP server)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "your-email@gmail.com",
      pass: "your-app-password", // Use an App Password, not your real password
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "target-notification-email@gmail.com",
      subject: "New Contact Form Submission",
      text: message as string,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    return new Response(JSON.stringify({ message: "Success!" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
  }
};