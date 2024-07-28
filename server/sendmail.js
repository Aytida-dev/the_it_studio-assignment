const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

const FROM = 'cicada.raj@gmail.com'
const TO = 'info@redpositive.in'
const SUBJECT = "User data"


const sendMail = async (users) => {
    //users is an array of objects

    await transporter.sendMail({
        from: FROM,
        to: TO,
        subject: SUBJECT,
        text: JSON.stringify(users, null, 2)
    })
}

module.exports = {
    sendMail
}


