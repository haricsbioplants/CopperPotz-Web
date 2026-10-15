import express from "express";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const app = express();
const port = Number(process.env.PORT || 3000);
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
}
function validEmail(email) {
  return typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
async function sendMail({ subject, replyTo, html, text }) {
  const { RESEND_API_KEY, FROM_EMAIL, TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !FROM_EMAIL || !TO_EMAIL) {
    const err = new Error("Email configuration is missing. Check your .env file.");
    err.status = 500;
    throw err;
  }
  const resend = new Resend(RESEND_API_KEY);
  const result = await resend.emails.send({
    from: FROM_EMAIL, to: [TO_EMAIL], replyTo, subject, html, text
  });
  if (result.error) {
    console.error("Resend error:", result.error);
    const err = new Error("Email could not be sent. Check the server terminal and Resend settings.");
    err.status = 502;
    throw err;
  }
  return result.data;
}

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone = "", message } = req.body ?? {};
    if (typeof name !== "string" || !name.trim() || name.trim().length > 120 ||
        !validEmail(email) || typeof phone !== "string" || phone.length > 40 ||
        typeof message !== "string" || !message.trim() || message.length > 3000) {
      return res.status(400).json({ success: false, message: "Please enter a valid name, email, and message." });
    }
    const n = name.trim(), e = email.trim(), p = phone.trim(), m = message.trim();
    const html = `
<div style="margin:0;padding:28px 12px;background:#f5f2ed;font-family:Arial,sans-serif;color:#28231e">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:auto;background:#fffdf9;border:1px solid #e8e0d5;border-radius:12px;overflow:hidden">
<tr><td style="padding:26px 30px;background:#24372c;color:#fffdf9"><p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;color:#e7c98b">COPPER POTZ · CONTACT</p><h1 style="margin:0;font-size:24px">New website message</h1></td></tr>
<tr><td style="padding:26px 30px"><h2 style="font-size:16px">Guest details</h2><p><strong>Name:</strong> ${escapeHtml(n)}</p><p><strong>Email:</strong> <a href="mailto:${escapeHtml(e)}">${escapeHtml(e)}</a></p><p><strong>Phone:</strong> ${escapeHtml(p || "Not provided")}</p><h2 style="font-size:16px;margin-top:24px">Message</h2><div style="padding:16px;background:#f9f6f0;border-left:3px solid #b88b45;line-height:1.7">${escapeHtml(m).replace(/\n/g,"<br>")}</div><p style="font-size:12px;color:#746c60;margin-top:20px">Reply directly to this email to contact the guest.</p></td></tr>
<tr><td style="padding:16px;text-align:center;background:#f5f0e8;color:#746c60;font-size:11px">Copper potz · Website contact form</td></tr></table></div>`;
    await sendMail({ subject: `Website enquiry — ${n}`, replyTo: e, html, text: `Website enquiry\n\nName: ${n}\nEmail: ${e}\nPhone: ${p || "Not provided"}\n\nMessage:\n${m}` });
    res.json({ success: true });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message || "Something went wrong." });
  }
});

app.post("/api/reservation", async (req, res) => {
  try {
    const { name, email, phone = "", date, time, guests, occasion = "Just dining", message = "" } = req.body ?? {};
    if (typeof name !== "string" || !name.trim() || name.trim().length > 120 ||
        !validEmail(email) || typeof phone !== "string" || phone.length > 40 ||
        typeof date !== "string" || !date || typeof time !== "string" || !time ||
        typeof guests !== "string" || !guests ||
        typeof occasion !== "string" || occasion.length > 80 ||
        typeof message !== "string" || message.length > 3000) {
      return res.status(400).json({ success: false, message: "Please complete the required fields with valid details." });
    }
    const v = { name:name.trim(), email:email.trim(), phone:phone.trim(), date:date.trim(), time:time.trim(), guests:guests.trim(), occasion:occasion.trim(), message:message.trim() };
    const rows = [["Name",v.name],["Email",v.email],["Phone",v.phone || "Not provided"],["Requested date",v.date],["Requested time",v.time],["Guests",v.guests],["Occasion",v.occasion]];
    const html = `
<div style="margin:0;padding:28px 12px;background:#f5f2ed;font-family:Arial,sans-serif;color:#28231e">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:auto;background:#fffdf9;border:1px solid #e8e0d5;border-radius:12px;overflow:hidden">
<tr><td style="padding:28px 30px;background:#24372c;color:#fffdf9"><p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;color:#e7c98b">Copper potz · RESERVATIONS</p><h1 style="margin:0;font-size:25px">New table enquiry</h1><p style="margin:10px 0 0;font-size:14px;color:#e6e9df">A guest has submitted a reservation request.</p></td></tr>
<tr><td style="padding:26px 30px"><h2 style="font-size:16px;margin:0 0 14px">Guest details</h2><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">${rows.map(([k,val])=>`<tr><td style="padding:11px 12px;border:1px solid #eee7dc;background:#f9f6f0;width:38%;font-size:12px;color:#746c60">${escapeHtml(k)}</td><td style="padding:11px 12px;border:1px solid #eee7dc;font-size:14px">${escapeHtml(val)}</td></tr>`).join("")}</table><h2 style="font-size:16px;margin:24px 0 12px">Guest note</h2><div style="padding:16px;background:#f9f6f0;border-left:3px solid #b88b45;font-size:14px;line-height:1.7">${escapeHtml(v.message || "No additional note").replace(/\n/g,"<br>")}</div><p style="margin:20px 0 0;color:#746c60;font-size:12px">This is a request only, not a confirmed reservation. Reply to contact the guest.</p></td></tr>
<tr><td style="padding:17px 24px;text-align:center;background:#f5f0e8;color:#746c60;font-size:11px">Copper potz · Website reservation request</td></tr></table></div>`;
    await sendMail({ subject: `Table enquiry — ${v.name} · ${v.date}`, replyTo: v.email, html, text: `NEW TABLE ENQUIRY\n\n${rows.map(([k,val])=>`${k}: ${val}`).join("\n")}\n\nGuest note:\n${v.message || "No additional note"}\n\nThis is a request only, not a confirmed reservation.` });
    res.json({ success: true });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message || "Something went wrong." });
  }
});

app.listen(port, () => console.log(`Restaurant demo running at http://localhost:${port}`));
