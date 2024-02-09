const nodeMailer = require('nodemailer');


const EMAIL = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: "a963f2eea055ae",
            pass: "a0f51b72a49dcb"
        }
    })
    const mailOptions = {
        from: 'Enderson Gomez <enderson273014@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(mailOptions)
}

module.exports = EMAIL

