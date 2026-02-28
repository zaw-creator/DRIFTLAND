const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send registration pending email
  async sendRegistrationPendingEmail(registrationData) {
    const { driver, registration, event, magicLink } = registrationData;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: driver.email,
      subject: `Registration Received - ${event.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .reg-number { font-size: 24px; font-weight: bold; color: #e74c3c; text-align: center; padding: 15px; background: white; margin: 20px 0; border-radius: 5px; }
            .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; }
            .button { display: inline-block; padding: 12px 30px; background-color: #e74c3c; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏁 DriftLand Registration Received</h1>
            </div>
            <div class="content">
              <p>Dear ${driver.fullName},</p>
              
              <p>Thank you for registering for <strong>${event.name}</strong>!</p>
              
              <div class="reg-number">
                Registration #: ${registration.registrationNumber}
              </div>
              
              <div class="info-box">
                <h3>📋 Registration Status</h3>
                <p><strong>Status:</strong> <span style="color: #f39c12;">Pending Approval</span></p>
                <p>Your registration is currently under review by our team. You will receive a confirmation email once your registration is approved.</p>
              </div>
              
              <div class="info-box">
                <h3>📅 Event Details</h3>
                <p><strong>Event:</strong> ${event.name}</p>
                <p><strong>Date:</strong> ${new Date(event.eventDate).toLocaleDateString()}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Drive Type:</strong> ${registration.driveType}</p>
              </div>
              
              <div class="info-box">
                <h3>🔐 Access Your Registration</h3>
                <p>Use the secure link below to check your registration status and make updates (if needed):</p>
                <center>
                  <a href="${magicLink}" class="button">View Registration Status</a>
                </center>
                <p style="font-size: 12px; color: #666;">This link expires in 7 days. You can also check your status using your registration number and email on our website.</p>
              </div>
              
              <div class="info-box">
                <h3>⏱️ What's Next?</h3>
                <ol>
                  <li>Our team will review your registration within 24-48 hours</li>
                  <li>You'll receive an approval email with payment instructions</li>
                  <li>Complete the payment to confirm your spot</li>
                  <li>Attend the mandatory safety briefing before the event</li>
                  <li>Have your vehicle inspected on event day</li>
                </ol>
              </div>
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>See you at the track! 🏎️</p>
              
              <p>Best regards,<br><strong>DriftLand Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply directly to this message.</p>
              <p>&copy; ${new Date().getFullYear()} DriftLand. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("Error sending pending email:", error);
      return { success: false, error: error.message };
    }
  }

  // Send registration verified email (with QR code)
  async sendRegistrationVerifiedEmail(registrationData) {
    const { driver, registration, event, qrCode } = registrationData;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: driver.email,
      subject: `Registration Approved - ${event.name} ✅`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .approved { font-size: 24px; font-weight: bold; color: #27ae60; text-align: center; padding: 15px; background: white; margin: 20px 0; border-radius: 5px; }
            .qr-code { text-align: center; padding: 20px; background: white; margin: 20px 0; }
            .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #27ae60; }
            .checklist { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Registration Approved!</h1>
            </div>
            <div class="content">
              <p>Dear ${driver.fullName},</p>
              
              <div class="approved">
                ✅ Your registration has been APPROVED!
              </div>
              
              <p>We're excited to have you at <strong>${event.name}</strong>!</p>
              
              <div class="info-box">
                <h3>📅 Event Details</h3>
                <p><strong>Event:</strong> ${event.name}</p>
                <p><strong>Date:</strong> ${new Date(event.eventDate).toLocaleDateString()}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Drive Type:</strong> ${registration.driveType}</p>
                <p><strong>Registration #:</strong> ${registration.registrationNumber}</p>
              </div>
              
              <div class="qr-code">
                <h3>📱 Your Check-In QR Code</h3>
                <img src="${qrCode}" alt="QR Code" style="max-width: 250px;" />
                <p style="font-size: 12px; color: #666;">Show this QR code at event check-in</p>
              </div>
              
              <div class="checklist">
                <h3>✅ Safety Requirements Checklist</h3>
                <p><strong>Safety Wear:</strong></p>
                <ul>
                  <li>Fire-Resistant Racing Suit</li>
                  <li>Racing Helmet (must cover whole face)</li>
                  <li>Racing Gloves (closed-finger, wrist coverage)</li>
                  <li>Racing Shoes (closed-toe, ankle coverage, fire-resistant)</li>
                </ul>
                <p><strong>Car Components:</strong></p>
                <ul>
                  <li>Safety Switch</li>
                  <li>Roll Cage or Full Mirror Sticker</li>
                  <li>Hood Pin Lock</li>
                  <li>Full Bucket Seat</li>
                  <li>4-Point Racing Seat Belt</li>
                  <li>Battery Terminal Covers</li>
                  <li>Fire Extinguisher</li>
                  <li>Tow Hooks (Front and Rear)</li>
                </ul>
              </div>
              
              <div class="info-box">
                <h3>💳 Payment Information</h3>
                <p>To complete your registration, please contact us directly:</p>
                <p><strong>📱 Contact via social media for payment QR code</strong></p>
                <p style="font-size: 12px; color: #666;">Payment must be completed before the event to secure your spot.</p>
              </div>
              
              <div class="info-box">
                <h3>⚠️ Important Reminders</h3>
                <ul>
                  <li>Attend the mandatory safety briefing before the event</li>
                  <li>Vehicle inspection is required on event day</li>
                  <li>Bring all safety gear to the event</li>
                  <li>Arrive early for check-in</li>
                </ul>
              </div>
              
              <p>We look forward to seeing you at the track! 🏁</p>
              
              <p>Best regards,<br><strong>DriftLand Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply directly to this message.</p>
              <p>&copy; ${new Date().getFullYear()} DriftLand. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("Error sending verified email:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
