const sgMail = require('@sendgrid/mail')
//const sendgridAPIKey = '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'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/* sgMail.send({
    to: 'marcelosteler45@gmail.com',
    from: 'marcelo.steler@gmail.com',
    subject: 'my first email',
    text: 'sera que chegou?'
}) */

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'marcelo.steler@gmail.com',
        subject: 'Welcome',
        text: `welcome to the app, ${name}. hello`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'marcelo.steler@gmail.com',
        subject: 'Bye',
        text: `why did you cancel, ${name}?`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}