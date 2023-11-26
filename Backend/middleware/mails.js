const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/users');


const transporter = nodemailer.createTransport({
    // host: 'smtp.mail.com',
    service: 'mail.com',
    // port: 587,
    secure: true,
    auth: {
        user: 'F_B_JP@mail.com',
        pass: 'zAvBFz3Fs'
    }
});

// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: process.env.EMAIL_SECURE === 'true',
//     tls: {
//         ciphers: 'TLS13' // Specify supported TLS version
//     },
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });


function generateConfirmationToken() {
    return crypto.randomBytes(20).toString('hex');
}


module.exports = {
    generateConfirmationToken,

    sendRegistrationConfirmationEmail: async (user) => {
        console.log("start");
        const { email, firstName } = user;
        const confirmationToken = generateConfirmationToken();

        console.log("confirmationToken", confirmationToken);

        await transporter.sendMail({
            from: 'F_B_JP@mail.com',
            to: email,
            subject: 'Confirm Your Registration',
            html: `
        Hi ${firstName},

        Thank you for registering on our platform. To complete your registration, please click on the following link:

        <a href="${process.env.HOST}/auth/confirm/${confirmationToken}">Confirm Registration</a>

        This link will expire in 24 hours.

        Sincerely,
        The Team
      `
        });

        console.log("enddddddddd");

        await User.findOneAndUpdate({ email }, { confirmationToken });
    }
};
