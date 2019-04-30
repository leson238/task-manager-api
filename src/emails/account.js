const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "hoangtu200572238@gmail.com",
        subject: "thanks for joining in",
        text: `Welcome to the app, ${name}.`
    });
};

const sendFarewellEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "hoangtu200572238@gmail.com",
        subject: "goodbye",
        text: `Goodbye ${name}. Is there anything we can do to keep you stay?`
    });
};
module.exports = {
    sendWelcomeEmail,
    sendFarewellEmail
};
