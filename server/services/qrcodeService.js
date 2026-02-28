const QRCode = require("qrcode");

class QRCodeService {
  // Generate QR code as data URL
  async generateQRCode(data) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.92,
        margin: 1,
        width: 300,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      return { success: true, qrCode: qrCodeDataURL };
    } catch (error) {
      console.error("Error generating QR code:", error);
      return { success: false, error: error.message };
    }
  }

  // Generate QR code for registration
  async generateRegistrationQRCode(registrationNumber, driverName) {
    const qrData = JSON.stringify({
      type: "registration",
      registrationNumber,
      driverName,
      timestamp: Date.now(),
    });

    return await this.generateQRCode(qrData);
  }
}

module.exports = new QRCodeService();
