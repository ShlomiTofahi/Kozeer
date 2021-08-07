// const config = require('config');
// const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('config');

module.exports = {
    sendMail: function (recipients,
        output = `
                <div align='left'>
                <h2 style="color:gray;">New Post Arrived!!</h2><br />
                <hr />
                <p>
                Hello Kozeer's members,<br /> 
                New episodes have been posted on our site.<br /> 
                For more information visit:<br /> 
                <a href='www.kozeerofficial.com'>www.kozeerofficial.com</a>
                <br />
                <br />
                Thanks, <br />
                Kozeer team.
                </p>
                <div>
            `) {
        try {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for 465, false for other ports,
                requireTLS: true,
                auth: {
                    user: config.get('adminMail'), // generated ethereal user
                    pass: '17David17'  // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: `"Kozeer" <${config.get('adminMail')}>`, // sender address
                to: recipients, // list of receivers
                subject: 'Kozeer - New Manga Post', // Subject line
                text: 'kozeer is the best', // plain text body
                html: output // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    // return res.status(500).json({ msg: 'Failed to send email' })
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            });
        } catch (e) {
            console.log(e);
            // res.status(400).json({ msg: "error" });
        }
    }
}