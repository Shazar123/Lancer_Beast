import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWaitlistConfirmation(
  email: string,
  spotNumber: number
) {
  await resend.emails.send({
    from: "LancerBeast <hello@lancerbeast.com>",
    to: email,
    subject: "You're on the LancerBeast waitlist 🦁",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the LancerBeast waitlist</title>
</head>
<body style="margin:0;padding:0;background:#0F2D52;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F2D52;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0F2D52,#1A6B5A);border-radius:16px;overflow:hidden;border:1px solid rgba(45,212,191,0.2);">
          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:-1px;">
                LancerBeast 🦁
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#2DD4BF;letter-spacing:2px;text-transform:uppercase;">
                Stop wasting connects.
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:#ffffff;">
                You're in. Your Spot secured.
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.7;">
                You've claimed one of the first 50 free spots on LancerBeast. That means when the extension launches, you get it completely free & forever. No credit card. No trial. No catch.
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:rgba(255,255,255,0.75);line-height:1.7;">
                We'll send you one email when the extension is live and ready to install from the Chrome Web Store. That's it. No newsletters. No marketing sequences. Just the launch email.
              </p>
              <div style="background:rgba(45,212,191,0.1);border:1px solid rgba(45,212,191,0.3);border-radius:10px;padding:20px 24px;margin:0 0 24px;">
                <p style="margin:0;font-size:14px;color:#2DD4BF;font-weight:600;text-transform:uppercase;letter-spacing:1px;">What LancerBeast does</p>
                <p style="margin:8px 0 0;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.6;">
                  Reads every Upwork job page and tells you: Is this client trustworthy? Is this job a scam? What's your personal hire probability? Is spending your connects worth it? All in under 100 milliseconds.
                </p>
              </div>
              <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;">
                Built by a freelancer who lost $400 in connects before building this.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.35);">
                Questions? Reply to this email or write to
                <a href="mailto:hello@lancerbeast.com" style="color:#2DD4BF;text-decoration:none;">hello@lancerbeast.com</a>
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:rgba(255,255,255,0.2);">
                LancerBeast · lancerbeast.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
}
