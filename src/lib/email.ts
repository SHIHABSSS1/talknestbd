import "server-only";

import { Resend } from "resend";

export type OtpEmailType =
  | "sign-in"
  | "email-verification"
  | "forget-password"
  | "change-email";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function otpEmailContent(type: OtpEmailType) {
  const warning = "This code expires in 10 minutes. Never share it with anyone.";

  if (type === "forget-password") {
    return {
      subject: "TalkNest BD — Password reset code",
      heading: "Reset your password",
      intro: "Use the 6-digit code below to reset your TalkNest BD password.",
      warning,
    };
  }

  if (type === "sign-in") {
    return {
      subject: "TalkNest BD — Sign-in code",
      heading: "Sign-in code",
      intro: "Use the 6-digit code below to sign in to TalkNest BD.",
      warning,
    };
  }

  return {
    subject: "TalkNest BD — Verify your email",
    heading: "Verify your email",
    intro: "Use the 6-digit code below to verify your TalkNest BD account.",
    warning,
  };
}

function renderEmail(otp: string, type: OtpEmailType): string {
  const { heading, intro, warning } = otpEmailContent(type);
  const digits = otp
    .split("")
    .map(
      (digit) =>
        `<td style="padding:0 5px;"><span style="display:inline-block;width:42px;height:52px;line-height:52px;text-align:center;background:#f4f0e6;border:1px solid #d9cfb8;border-radius:8px;font:700 24px/52px Arial,sans-serif;color:#123b2a;">${digit}</span></td>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#faf7f0;font-family:Arial,Helvetica,sans-serif;color:#123b2a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e4dccb;border-radius:16px;">
      <tr><td style="padding:28px 28px 0;">
        <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a4643f;font-weight:700;">TalkNest BD</p>
        <h1 style="margin:10px 0 12px;font-size:24px;">${heading}</h1>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#4b5b52;">${intro}</p>
      </td></tr>
      <tr><td style="padding:0 28px;">
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto;"><tr>${digits}</tr></table>
      </td></tr>
      <tr><td style="padding:22px 28px 28px;">
        <p style="margin:0;font-size:12px;line-height:1.7;color:#7a6a55;">${warning}</p>
        <p style="margin:14px 0 0;font-size:11px;color:#9a8e7c;">This email was sent automatically by TalkNest BD.</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

/**
 * Sends the Better Auth one-time password through Resend.
 *
 * RESEND_API_KEY and RESEND_FROM_EMAIL are required in production. In local
 * development, when no key is configured, the code is printed to the server
 * console instead so the OTP flows can be tested without an email account.
 * The OTP is never returned to the browser or written to a log file.
 */
export async function sendOtpEmail({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: OtpEmailType;
}): Promise<void> {
  const content = otpEmailContent(type);

  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not configured — cannot deliver the OTP email.");
    }
    console.warn(
      `[dev-otp] ${content.subject} → ${email}: ${otp} (set RESEND_API_KEY to send a real email)`,
    );
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_FROM_EMAIL is not configured — cannot deliver the OTP email.");
    }
    console.warn("[dev-otp] RESEND_FROM_EMAIL is not set; falling back to console delivery.");
    console.warn(`[dev-otp] ${content.subject} → ${email}: ${otp}`);
    return;
  }

  const { error } = await resend.emails.send({
    from,
    to: [email],
    subject: content.subject,
    html: renderEmail(otp, type),
  });

  if (error) {
    console.error("[resend] failed to send OTP email:", error.message);
    throw new Error("Could not send the verification email. Please try again.");
  }
}
