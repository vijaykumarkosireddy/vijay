import nodemailer from "nodemailer"

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Email template for user confirmation
function getUserConfirmationEmailHTML(data: {
  name: string
  email: string
  phone: string
  interest: string
  message: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.8;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background: #f5f5f5;
          }
          .email-container {
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #C5A059;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 900;
            letter-spacing: -0.5px;
            line-height: 1.3;
          }
          .content {
            background: #ffffff;
            padding: 50px 40px;
          }
          .content p {
            margin: 0 0 20px 0;
            font-size: 16px;
            line-height: 1.8;
          }
          .highlight {
            background: #fafafa;
            border-left: 4px solid #C5A059;
            padding: 25px 30px;
            margin: 30px 0;
            border-radius: 8px;
          }
          .highlight-title {
            margin: 0 0 20px 0;
            font-weight: bold;
            color: #C5A059;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          .detail-row {
            margin: 15px 0;
            padding: 8px 0;
          }
          .detail-label {
            font-weight: 600;
            color: #666;
            margin-bottom: 4px;
          }
          .detail-value {
            color: #1a1a1a;
          }
          .footer {
            background: #f8f8f8;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
          }
          .footer p {
            margin: 10px 0;
            font-size: 13px;
            color: #666;
            line-height: 1.6;
          }
          .footer strong {
            color: #1a1a1a;
            font-size: 14px;
          }
          .divider {
            height: 2px;
            background: linear-gradient(90deg, #C5A059 0%, transparent 100%);
            margin: 25px 0;
          }
          .signature {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #f0f0f0;
          }
          .signature p {
            margin: 8px 0;
          }
          .signature-name {
            color: #C5A059;
            font-size: 20px;
            font-weight: bold;
            margin-top: 10px;
          }
          ul {
            line-height: 2;
            margin: 25px 0;
            padding-left: 25px;
          }
          ul li {
            margin: 10px 0;
            font-size: 15px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>✨ Thank You for Reaching Out</h1>
          </div>
          
          <div class="content">
            <p>Dear <strong>${data.name}</strong>,</p>
            
            <p>Thank you for your inquiry! I've received your message and will get back to you as soon as possible.</p>
            
            <div class="highlight">
              <p class="highlight-title">Your Inquiry Details</p>
              <div class="divider"></div>
              
              <div class="detail-row">
                <div class="detail-label">Interest:</div>
                <div class="detail-value">${data.interest}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Email:</div>
                <div class="detail-value">${data.email}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Phone:</div>
                <div class="detail-value">${data.phone}</div>
              </div>
              
              ${data.message ? `
              <div class="detail-row" style="margin-top: 20px;">
                <div class="detail-label">Message:</div>
                <div class="detail-value" style="margin-top: 8px; font-style: italic; color: #555;">${data.message}</div>
              </div>
              ` : ""}
            </div>
            
            <p>I typically respond within 24-48 hours. In the meantime, feel free to explore more of my work:</p>
            
            <ul>
              <li><strong>Music Performances:</strong> Carnatic vocal music and concerts</li>
              <li><strong>Art Gallery:</strong> Mono-realistic pencil sketches</li>
              <li><strong>Testimonials:</strong> What others are saying</li>
            </ul>
            
            <div class="signature">
              <p><strong>Looking forward to connecting with you!</strong></p>
              <p style="margin-top: 20px;"><strong>Warm regards,</strong></p>
              <p class="signature-name">Vijay Kumar Kosireddy</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Poornima Kala Samskruthika Kendram</strong></p>
            <p>Jaggampeta, Andhra Pradesh</p>
            <p style="margin-top: 20px; color: #999; font-size: 12px;">
              This is an automated confirmation email. Please do not reply directly to this message.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Email template for admin notification
function getAdminNotificationEmailHTML(data: {
  name: string
  email: string
  phone: string
  interest: string
  message: string
}) {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "long",
  })

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.8;
            color: #333;
            max-width: 650px;
            margin: 0 auto;
            padding: 0;
            background: #f5f5f5;
          }
          .container {
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin: 20px;
          }
          .header {
            background: linear-gradient(135deg, #C5A059 0%, #D4AF37 100%);
            color: #1a1a1a;
            padding: 40px 35px;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 15px 0;
            font-size: 28px;
            font-weight: 900;
            line-height: 1.3;
          }
          .badge {
            display: inline-block;
            background: rgba(0,0,0,0.15);
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 13px;
            font-weight: bold;
            margin-top: 5px;
            letter-spacing: 0.5px;
          }
          .content {
            padding: 45px 40px;
          }
          .intro-text {
            font-size: 17px;
            margin: 0 0 35px 0;
            color: #555;
            line-height: 1.7;
          }
          .info-grid {
            display: grid;
            gap: 20px;
            margin: 30px 0;
          }
          .info-item {
            background: #fafafa;
            padding: 20px 25px;
            border-radius: 10px;
            border-left: 5px solid #C5A059;
            transition: all 0.3s ease;
          }
          .info-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #888;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .info-value {
            font-size: 17px;
            color: #1a1a1a;
            font-weight: 600;
            line-height: 1.5;
          }
          .info-value a {
            color: #C5A059;
            text-decoration: none;
            transition: color 0.2s;
          }
          .message-box {
            background: #f8f8f8;
            padding: 25px 30px;
            border-radius: 10px;
            margin: 30px 0;
            white-space: pre-wrap;
            font-family: 'Georgia', serif;
            font-style: italic;
            font-size: 15px;
            line-height: 1.8;
            color: #444;
            border: 1px solid #e8e8e8;
          }
          .message-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #888;
            font-weight: bold;
            margin-bottom: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-style: normal;
          }
          .footer {
            background: #f8f8f8;
            padding: 30px 40px;
            text-align: center;
            font-size: 13px;
            color: #666;
            border-top: 2px solid #e8e8e8;
          }
          .footer p {
            margin: 8px 0;
            line-height: 1.6;
          }
          .timestamp {
            font-size: 12px;
            color: #999;
            text-align: center;
            margin-top: 30px;
            padding-top: 25px;
            border-top: 2px solid #f0f0f0;
            font-style: italic;
          }
          .quick-actions {
            margin: 35px 0;
            padding: 30px;
            background: #fafafa;
            border-radius: 10px;
            text-align: center;
            border: 1px solid #e8e8e8;
          }
          .actions-title {
            margin: 0 0 20px 0;
            font-weight: bold;
            color: #555;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .action-link {
            display: inline-block;
            margin: 8px;
            padding: 12px 24px;
            background: #C5A059;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Inquiry Received</h1>
            <div class="badge">${data.interest}</div>
          </div>
          
          <div class="content">
            <p class="intro-text">You have received a new inquiry through your portfolio website.</p>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Name</div>
                <div class="info-value">${data.name}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Email Address</div>
                <div class="info-value">
                  <a href="mailto:${data.email}">${data.email}</a>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Phone Number</div>
                <div class="info-value">
                  <a href="tel:${data.phone}">${data.phone}</a>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Area of Interest</div>
                <div class="info-value">${data.interest}</div>
              </div>
            </div>
            
            ${data.message
      ? `
              <div class="message-label">Message</div>
              <div class="message-box">${data.message || "No message provided."}</div>
            `
      : ""
    }
            
            <div class="quick-actions">
              <p class="actions-title">Quick Actions</p>
              <a href="mailto:${data.email}" class="action-link">✉️ Reply via Email</a>
              <a href="tel:${data.phone}" class="action-link">📞 Call Now</a>
            </div>
            
            <div class="timestamp">
              Received on ${timestamp}
            </div>
          </div>
          
          <div class="footer">
            <p>
              <strong>Portfolio Website</strong> • Automated Notification System
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Send confirmation email to user
export async function sendUserConfirmationEmail(data: {
  name: string
  email: string
  phone: string
  interest: string
  message: string
}) {
  try {
    await transporter.sendMail({
      from: `"Vijay Kumar Kosireddy" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: "Thank you for your inquiry! 🎵🎨",
      html: getUserConfirmationEmailHTML(data),
    })
    console.log(`✅ Confirmation email sent to ${data.email}`)
    return { success: true }
  } catch (error) {
    console.error("❌ Error sending confirmation email:", error)
    return { success: false, error }
  }
}

// Send notification email to admin
export async function sendAdminNotificationEmail(data: {
  name: string
  email: string
  phone: string
  interest: string
  message: string
}) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER
    await transporter.sendMail({
      from: `"Portfolio Website" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: `🔔 New Inquiry: ${data.interest} - ${data.name}`,
      html: getAdminNotificationEmailHTML(data),
      replyTo: data.email, // Allow direct reply to the user
    })
    console.log(`✅ Notification email sent to admin: ${adminEmail}`)
    return { success: true }
  } catch (error) {
    console.error("❌ Error sending admin notification email:", error)
    return { success: false, error }
  }
}
