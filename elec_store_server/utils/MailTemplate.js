import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

import mail_send from './MailSend.js';



export function activeUserAccountTemplate(activation_link, email) {
  let html_template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Activate Your Account</title>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:30px 0;">
    <tr>
      <td align="center">
        
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:10px; padding:30px;">

          <!-- Header -->
          <tr>
            <td align="center" style="font-size:24px; font-weight:bold; color:#333;">
              Welcome to Our App! 🎉
            </td>
          </tr>

          <tr><td style="height:20px;"></td></tr>

          <!-- Message -->
          <tr>
            <td style="font-size:16px; color:#444; line-height:1.6;">
              Hello <strong>{{username}}</strong>,<br><br>
              Thank you for signing up! We’re excited to have you join our web app.
              Before you get started, please activate your account by clicking the button below.
            </td>
          </tr>

          <tr><td style="height:30px;"></td></tr>

          <!-- Button -->
          <tr>
            <td align="center">
              <a href="{{activation_link}}" 
                 style="background:#4f46e5; color:#ffffff; padding:14px 28px; text-decoration:none; font-size:16px; border-radius:6px; display:inline-block;">
                Activate Account
              </a>
            </td>
          </tr>

          <tr><td style="height:30px;"></td></tr>

          <!-- Additional text -->
          <tr>
            <td style="font-size:14px; color:#666; line-height:1.6;">
              If the button above doesn’t work, copy and paste this link into your browser:
              <br><br>
              <a href="{{activation_link}}" style="color:#4f46e5;">{{activation_link}}</a>
            </td>
          </tr>

          <tr><td style="height:40px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="font-size:13px; color:#999;">
              Thank you for choosing our app ❤️<br>
              © 2025 Elec Store
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  
`
  html_template = html_template
    .replace('{{username}}', email)
    .replaceAll("{{activation_link}}", activation_link)

  return html_template
}

export function resetUserPasswordTemplate(activation_link, email) {
  let html_template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Activate Your Account</title>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:30px 0;">
    <tr>
      <td align="center">
        
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:10px; padding:30px;">

          <!-- Header -->
          <tr>
            <td align="center" style="font-size:24px; font-weight:bold; color:#333;">
              Welcome to Our App! 🎉
            </td>
          </tr>

          <tr><td style="height:20px;"></td></tr>

          <!-- Message -->
          <tr>
            <td style="font-size:16px; color:#444; line-height:1.6;">
              Hello <strong>{{username}}</strong>,<br><br>
              We have received a request to reset your password.

              If you want to reset your password click the button below
            </td>
          </tr>

          <tr><td style="height:30px;"></td></tr>

          <!-- Button -->
          <tr>
            <td align="center">
              <a href="{{activation_link}}" 
                 style="background:#4f46e5; color:#ffffff; padding:14px 28px; text-decoration:none; font-size:16px; border-radius:6px; display:inline-block;">
                Reset Password
              </a>
            </td>
          </tr>

          <tr><td style="height:30px;"></td></tr>

          <!-- Additional text -->
          <tr>
            <td style="font-size:14px; color:#666; line-height:1.6;">
              If the button above doesn’t work, copy and paste this link into your browser:
              <br><br>
              <a href="{{activation_link}}" style="color:#4f46e5;">{{activation_link}}</a>
            </td>
          </tr>

          <tr><td style="height:40px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="font-size:13px; color:#999;">
              Thank you for choosing our app ❤️<br>
              © 2025 Elec Store
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  
`
  html_template = html_template
    .replace('{{username}}', email)
    .replaceAll("{{activation_link}}", activation_link)

  return html_template
}

const from = (from) => `"Elec Store ${from}" <${process.env.MAILER_USERNAME}>`
export const sendEmailTemplate = (email, token, id, template = activeUserAccountTemplate, activation_link = '') => {
  activation_link = activation_link ? `${process.env.FRONTEND_URL || "http://localhost:3000"}/${activation_link}?token=${token}&id=${id}` : `${process.env.FRONTEND_URL || "http://localhost:3000"}/active_account?token=${token}&id=${id}`


  let html_template = template(activation_link, email);
  return mail_send.sendMail({
    from: from("active account"),
    to: email,
    subject: "Welcome in Elec Store",
    text: `${email} welcome in Elec Store`,
    html: html_template
  })
}


