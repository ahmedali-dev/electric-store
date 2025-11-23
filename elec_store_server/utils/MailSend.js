import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: process.env.MAILER_HOST,          // e.g., "smtp.mailersend.net"
  port: Number(process.env.MAILER_PORT),  // e.g., 587 or 2525
  secure: false,                          // true if port 465
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD
  },

});

// (async () => {
//   try {
//     await transport.verify();
//     console.log("SMTP connection verified");

//     const info = await transport.sendMail({
//       from: `"My App" <${process.env.MAILER_USERNAME}>`,
//       to: 'user@example.com',
//       subject: 'Activate your account',
//       html: '<p>Thank you for registering… <a href="https://example.com/activate">Activate here</a></p>'
//     });

//     console.log("Message sent:", info.messageId);
//   } catch (err) {
//     console.error("Mail error:", err);
//   }
// })();


export default transport