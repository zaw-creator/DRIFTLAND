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
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#000401;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background-color:#0d0d0d;border:1px solid #1a1a1a;">
            
            <!-- Top accent bar -->
            <div style="height:3px;background:linear-gradient(90deg,#FFBB00,transparent);"></div>

            <!-- Header -->
            <div style="padding:2rem;text-align:center;border-bottom:1px solid #1a1a1a;">
              <p style="color:#FFBB00;font-size:1.5rem;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;margin:0;">
                DRIFT<span style="color:#FFFFFF;">LAND</span>
              </p>
              <p style="color:#535653;font-size:0.7rem;letter-spacing:0.3em;text-transform:uppercase;margin:0.25rem 0 0;">
                Registration Confirmation
              </p>
            </div>

            <!-- Content -->
            <div style="padding:2rem;">
              <p style="color:#FFFFFF;font-size:0.9rem;margin-bottom:1.5rem;">
                Dear <strong style="color:#FFBB00;">${driver.fullName}</strong>,
              </p>
              <p style="color:#535653;font-size:0.85rem;margin-bottom:1.5rem;">
                Thank you for registering for <strong style="color:#FFFFFF;">${event.name}</strong>. Your registration has been received and is currently pending verification.
              </p>

              <!-- Registration Number -->
              <div style="background-color:#111;border:1px solid #1a1a1a;border-left:3px solid #FFBB00;border-radius:0 4px 4px 0;padding:1rem 1.25rem;margin-bottom:1.5rem;">
                <p style="color:#535653;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 0.25rem;">Registration Number</p>
                <p style="color:#FFBB00;font-family:monospace;font-size:1.25rem;font-weight:700;margin:0;">${registration.registrationNumber}</p>
              </div>

              <!-- Status -->
              <div style="background-color:#111;border:1px solid #1a1a1a;border-radius:4px;padding:1rem 1.25rem;margin-bottom:1.5rem;">
                <p style="color:#535653;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 0.5rem;">Status</p>
                <span style="background-color:#2a2000;color:#FFBB00;border:1px solid #3a3000;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
                  Pending Verification
                </span>
              </div>

              <!-- Event Details -->
              <div style="background-color:#111;border:1px solid #1a1a1a;border-radius:4px;padding:1.25rem;margin-bottom:1.5rem;">
                <p style="color:#FFBB00;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 1rem;padding-bottom:0.75rem;border-bottom:1px solid #1a1a1a;">
                  Event Details
                </p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="color:#535653;font-size:0.8rem;padding:0.35rem 0;width:40%;">Event</td>
                    <td style="color:#FFFFFF;font-size:0.8rem;padding:0.35rem 0;">${event.name}</td>
                  </tr>
                  <tr>
                    <td style="color:#535653;font-size:0.8rem;padding:0.35rem 0;">Date</td>
                    <td style="color:#FFFFFF;font-size:0.8rem;padding:0.35rem 0;">${new Date(event.eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                  </tr>
                  <tr>
                    <td style="color:#535653;font-size:0.8rem;padding:0.35rem 0;">Location</td>
                    <td style="color:#FFFFFF;font-size:0.8rem;padding:0.35rem 0;">${event.location}</td>
                  </tr>
                  <tr>
                    <td style="color:#535653;font-size:0.8rem;padding:0.35rem 0;">Drive Type</td>
                    <td style="color:#FFFFFF;font-size:0.8rem;padding:0.35rem 0;">${registration.driveType}</td>
                  </tr>
                </table>
              </div>

              <!-- What's Next -->
              <div style="background-color:#111;border:1px solid #1a1a1a;border-radius:4px;padding:1.25rem;margin-bottom:1.5rem;">
                <p style="color:#FFBB00;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 1rem;padding-bottom:0.75rem;border-bottom:1px solid #1a1a1a;">
                  What's Next?
                </p>
                <div style="display:flex;flex-direction:column;gap:0.75rem;">
                  
                  <div style="display:flex;gap:0.75rem;align-items:flex-start;">
                    <div style="background-color:#1a1200;border:1px solid #FFBB00;color:#FFBB00;font-size:0.7rem;font-weight:700;width:1.5rem;height:1.5rem;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;text-align:center;line-height:1.5rem;">1</div>
                    <div>
                      <p style="color:#FFFFFF;font-size:0.8rem;font-weight:700;margin:0 0 0.25rem;">Complete Your Payment</p>
                      <p style="color:#535653;font-size:0.75rem;margin:0;">Visit our <a href="https://www.facebook.com/profile.php?id=61555721314613" style="color:#FFBB00;">Facebook page NYO KI DRIFT</a> and message us with your registration number <strong style="color:#FFBB00;">${registration.registrationNumber}</strong> and email address to complete your payment.</p>
                    </div>
                  </div>

                  <div style="display:flex;gap:0.75rem;align-items:flex-start;">
                    <div style="background-color:#1a1200;border:1px solid #FFBB00;color:#FFBB00;font-size:0.7rem;font-weight:700;width:1.5rem;height:1.5rem;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;text-align:center;line-height:1.5rem;">2</div>
                    <div>
                      <p style="color:#FFFFFF;font-size:0.8rem;font-weight:700;margin:0 0 0.25rem;">Admin Verification</p>
                      <p style="color:#535653;font-size:0.75rem;margin:0;">Once your payment is confirmed, our admin team will verify your registration in the system.</p>
                    </div>
                  </div>

                  <div style="display:flex;gap:0.75rem;align-items:flex-start;">
                    <div style="background-color:#1a1200;border:1px solid #FFBB00;color:#FFBB00;font-size:0.7rem;font-weight:700;width:1.5rem;height:1.5rem;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;text-align:center;line-height:1.5rem;">3</div>
                    <div>
                      <p style="color:#FFFFFF;font-size:0.8rem;font-weight:700;margin:0 0 0.25rem;">Final Confirmation Email</p>
                      <p style="color:#535653;font-size:0.75rem;margin:0;">You'll receive a final confirmation email with your QR code once your registration is fully verified.</p>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Magic Link Button -->
              <div style="text-align:center;margin-bottom:1.5rem;">
                <a href="${magicLink}" style="display:inline-block;background-color:#FFBB00;color:#000401;padding:0.75rem 2rem;border-radius:4px;font-size:0.8rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;">
                  View Registration Status
                </a>
                <p style="color:#535653;font-size:0.7rem;margin-top:0.5rem;">This link expires in 7 days</p>
              </div>

              <!-- Important Note -->
              <div style="background-color:#1a1200;border:1px solid #2a2000;border-radius:4px;padding:1rem;margin-bottom:1.5rem;">
                <p style="color:#FFBB00;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 0.25rem;">Important</p>
                <p style="color:#a07800;font-size:0.8rem;margin:0;">Save your registration number <strong style="color:#FFBB00;">${registration.registrationNumber}</strong>. You'll need it to check your status or contact us on Facebook.</p>
              </div>

            </div>

            <!-- Footer -->
            <div style="padding:1.5rem;text-align:center;border-top:1px solid #1a1a1a;">
              <p style="color:#535653;font-size:0.7rem;margin:0;">This is an automated email. Please do not reply directly to this message.</p>
              <p style="color:#535653;font-size:0.7rem;margin:0.25rem 0 0;">&copy; ${new Date().getFullYear()} DriftLand. All rights reserved.</p>
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
      subject: `Registration Verified - ${event.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#000401;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background-color:#0d0d0d;border:1px solid #1a1a1a;">

            <!-- Top accent bar -->
            <div style="height:3px;background:linear-gradient(90deg,#FFBB00,transparent);"></div>

            <!-- Header -->
            <div style="padding:2rem;text-align:center;border-bottom:1px solid #1a1a1a;">
              <p style="color:#FFBB00;font-size:1.5rem;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;margin:0;">
                DRIFT<span style="color:#FFFFFF;">LAND</span>
              </p>
              <p style="color:#535653;font-size:0.7rem;letter-spacing:0.3em;text-transform:uppercase;margin:0.25rem 0 0;">
                Registration Verified
              </p>
            </div>

            <!-- Content -->
            <div style="padding:2rem;">
              <p style="color:#FFFFFF;font-size:0.9rem;margin-bottom:1.5rem;">
                Dear <strong style="color:#FFBB00;">${driver.fullName}</strong>,
              </p>

              <!-- Verified Badge -->
              <div style="text-align:center;margin-bottom:1.5rem;">
                <div style="display:inline-block;background-color:#002a00;border:1px solid #003a00;border-radius:4px;padding:1rem 2rem;">
                  <p style="color:#00cc44;font-size:1rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin:0;">
                    ✓ Registration Verified
                  </p>
                </div>
              </div>

              <p style="color:#535653;font-size:0.85rem;margin-bottom:1.5rem;">
                Your registration for <strong style="color:#FFFFFF;">${event.name}</strong> has been verified. See you at the track!
              </p>

              <!-- Registration Number -->
              <div style="background-color:#111;border:1px solid #1a1a1a;border-left:3px solid #FFBB00;border-radius:0 4px 4px 0;padding:1rem 1.25rem;margin-bottom:1.5rem;">
                <p style="color:#535653;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 0.25rem;">Registration Number</p>
                <p style="color:#FFBB00;font-family:monospace;font-size:1.25rem;font-weight:700;margin:0;">${registration.registrationNumber}</p>
              </div>

              <!-- Event Details -->
              <div style="background-color:#111;border:1px solid #1a1a1a;border-radius:4px;padding:1.25rem;margin-bottom:1.5rem;">
                <p style="color:#FFBB00;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 1rem;padding-bottom:0.75rem;border-bottom:1px solid #1a1a1a;">
                  Event Details
                </p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="color:#535653;font-size:0.8rem;padding:0.35rem 0;width:40%;">Event</td>
                    <td style="color:#FFFFFF;font-size:0.8rem;padding:0.35rem 0;">${event.name}</td>
                  </tr>
                  <tr>
                    <td style="color:#535653;font-size:0.8rem;padding:0.35rem 0;">Date</td>
                    <td style="color:#FFFFFF;font-size:0.8rem;padding:0.35rem 0;">${new Date(event.eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                  </tr>
                  <tr>
                    <td style="color:#535653;font-size:0.8rem;padding:0.35rem 0;">Location</td>
                    <td style="color:#FFFFFF;font-size:0.8rem;padding:0.35rem 0;">${event.location}</td>
                  </tr>
                  <tr>
                    <td style="color:#535653;font-size:0.8rem;padding:0.35rem 0;">Drive Type</td>
                    <td style="color:#FFFFFF;font-size:0.8rem;padding:0.35rem 0;">${registration.driveType}</td>
                  </tr>
                </table>
              </div>

              <!-- QR Code -->
              ${qrCode ? `
              <div style="background-color:#111;border:1px solid #1a1a1a;border-radius:4px;padding:1.25rem;margin-bottom:1.5rem;text-align:center;">
                <p style="color:#FFBB00;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 1rem;padding-bottom:0.75rem;border-bottom:1px solid #1a1a1a;">
                  Your Event QR Code
                </p>
                <div style="background-color:#FFFFFF;display:inline-block;padding:0.75rem;border-radius:4px;margin-bottom:0.75rem;">
                  <img src="${qrCode}" alt="QR Code" style="max-width:200px;display:block;" />
                </div>
                <p style="color:#535653;font-size:0.75rem;margin:0;">Present this QR code at the event check-in</p>
              </div>
              ` : ''}

              <!-- Safety Checklist -->
              <div style="background-color:#111;border:1px solid #1a1a1a;border-radius:4px;padding:1.25rem;margin-bottom:1.5rem;">
                <p style="color:#FFBB00;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 1rem;padding-bottom:0.75rem;border-bottom:1px solid #1a1a1a;">
                  Safety Requirements Checklist
                </p>
                <p style="color:#FFFFFF;font-size:0.8rem;font-weight:700;margin:0 0 0.5rem;">Safety Wear:</p>
                <ul style="color:#535653;font-size:0.8rem;margin:0 0 1rem;padding-left:1.25rem;">
                  <li style="margin-bottom:0.25rem;">Fire-Resistant Racing Suit</li>
                  <li style="margin-bottom:0.25rem;">Racing Helmet (must cover whole face)</li>
                  <li style="margin-bottom:0.25rem;">Racing Gloves (closed-finger, wrist coverage)</li>
                  <li style="margin-bottom:0.25rem;">Racing Shoes (closed-toe, ankle coverage, fire-resistant)</li>
                </ul>
                <p style="color:#FFFFFF;font-size:0.8rem;font-weight:700;margin:0 0 0.5rem;">Car Components:</p>
                <ul style="color:#535653;font-size:0.8rem;margin:0;padding-left:1.25rem;">
                  <li style="margin-bottom:0.25rem;">Safety Switch</li>
                  <li style="margin-bottom:0.25rem;">Roll Cage or Full Mirror Sticker</li>
                  <li style="margin-bottom:0.25rem;">Hood Pin Lock</li>
                  <li style="margin-bottom:0.25rem;">Full Bucket Seat</li>
                  <li style="margin-bottom:0.25rem;">4-Point Racing Seat Belt</li>
                  <li style="margin-bottom:0.25rem;">Battery Terminal Covers</li>
                  <li style="margin-bottom:0.25rem;">Fire Extinguisher</li>
                  <li style="margin-bottom:0.25rem;">Tow Hooks (Front and Rear)</li>
                </ul>
              </div>

              <!-- Important Reminders -->
              <div style="background-color:#1a1200;border:1px solid #2a2000;border-radius:4px;padding:1rem;margin-bottom:1.5rem;">
                <p style="color:#FFBB00;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 0.5rem;">Important Reminders</p>
                <ul style="color:#a07800;font-size:0.8rem;margin:0;padding-left:1.25rem;">
                  <li style="margin-bottom:0.25rem;">Attend the mandatory safety briefing before the event</li>
                  <li style="margin-bottom:0.25rem;">Vehicle inspection is required on event day</li>
                  <li style="margin-bottom:0.25rem;">Bring all required safety gear</li>
                  <li style="margin-bottom:0.25rem;">Arrive early for check-in</li>
                </ul>
              </div>

              <p style="color:#535653;font-size:0.85rem;">We look forward to seeing you at the track!</p>
              <p style="color:#FFFFFF;font-size:0.85rem;">— <strong>DriftLand Team</strong></p>
            </div>

            <!-- Footer -->
            <div style="padding:1.5rem;text-align:center;border-top:1px solid #1a1a1a;">
              <p style="color:#535653;font-size:0.7rem;margin:0;">This is an automated email. Please do not reply directly to this message.</p>
              <p style="color:#535653;font-size:0.7rem;margin:0.25rem 0 0;">&copy; ${new Date().getFullYear()} DriftLand. All rights reserved.</p>
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
// ```

// Now update your `server/.env` with the Gmail app password:
// ```
// EMAIL_USER=your-gmail@gmail.com
// EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
// EMAIL_FROM=DriftLand <your-gmail@gmail.com>