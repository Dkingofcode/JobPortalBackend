const nodemailer = require('nodemailer');

async function sendOTP(email, otp) {
  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'doladepo128@gmail.com', // Your Gmail address
      pass: 'anai ybbt kldh osfs',        // Your Gmail password or App Password
    },
  });

  // Email options
  let mailOptions = {
    from: 'doladepo128@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  // Send email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ' + error);
  }
}

module.exports = sendOTP;
