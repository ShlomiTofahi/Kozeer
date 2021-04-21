const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require("../../middleware/auth");
// const speakeasy = require('speakeasy');
// const nodemailer = require('nodemailer');

//User Model
const User = require('../../models/User');

// @route   POST api/auth
// @desc    Auth user
// @access  Public
router.post('/', (req, res) => {
    const { email, password } = req.body;
    //Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    //check for existing user
    User.findOne({ email }).populate('comments')
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User Does not exist' });

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {

                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    _id: user.id,
                                    name: user.name,
                                    admin: user.admin,
                                    email: user.email,
                                    comments: user.comments
                                }
                            });
                        }
                    )
                })
        })
});

// @route   GET api/auth/user
// @desc    get user data
// @access  Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id).populate('comments')
        .select('-password')
        .then(user => res.json(user))
});

// // @route   POST api/auth/create-token
// // @desc    Create Secret
// // @access  Public
// router.post('/create-token', (req, res) => {
//     const { email } = req.body;
//     //Simple validation
//     if (!email) {
//         return res.status(400).json({ msg: 'אנא הכנס את המייל שלך' });
//     }
//     try {
//         User.findOne({ email })
//             .select('-password')
//             .then(user => {
//                 if (!user) return res.status(400).json({ msg: 'משתמש לא קיים' });

//                 const secret = speakeasy.generateSecret();
//                 token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
//                 user.updateOne({ secret: secret.base32 }).then(() => {

//                     const output = `
//                     <h2>קוד לאיפוס סיסמה</h2>
//                     <p>
//                     ${user.name} שלום,<br /> 
//                     אנא השתמש בקוד זה כדי לאפס את הסיסמה לחשבון ${user.email}<br /> 
//                     הנה הקוד שלך: ${token}<br /> 
//                     אם אינך מזהה את חשבון ${user.email} Gdog
//                     התעלם מהודעה זו.<br /><br /> 

//                     תודה, <br />
//                     צוות Gdog.
//                     </p>
//                   `;

//                     // create reusable transporter object using the default SMTP transport
//                     let transporter = nodemailer.createTransport({
//                         host: 'smtp.gmail.com',
//                         port: 587,
//                         secure: false, // true for 465, false for other ports
//                         auth: {
//                             user: config.get('adminMail'), // generated ethereal user
//                             pass: 'Golan1996!'  // generated ethereal password
//                         },
//                         tls: {
//                             rejectUnauthorized: false
//                         }
//                     });

//                     // setup email data with unicode symbols
//                     let mailOptions = {
//                         from: `"GDog" <${config.get('adminMail')}>`, // sender address
//                         to: user.email, // list of receivers
//                         subject: 'איפוס סיסמת חשבון Gdog', // Subject line
//                         text: 'Password reset code', // plain text body
//                         html: output // html body
//                     };

//                     // send mail with defined transport object
//                     transporter.sendMail(mailOptions, (error, info) => {
//                         if (error) {
//                             console.log(error);
//                             return res.status(500).json({ msg: 'בעיה בשליחת המייל' })
//                         }
//                         console.log('Message sent: %s', info.messageId);
//                         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//                     });

//                     return res.json({ secret: secret.base32, token });
//                 })
//             });
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ msg: 'Error generate the secret' })
//     }
// });

// // @route   POST api/auth/verify-token
// // @desc    Verify token and make secret perm
// // @access  Public
// router.post('/verify-token', (req, res) => {
//     const { token, email } = req.body;
//     //Simple validation
//     if (!email) {
//         return res.status(400).json({ msg: 'No email entered' });
//     }
//     if (!token) {
//         return res.status(400).json({ msg: 'אנא הכנס את קוד האימות' });
//     }

//     try {
//         User.findOne({ email })
//             .select('-password')
//             .then(user => {
//                 const secret = user.secret;
//                 verified = speakeasy.totp.verify({ secret: secret, encoding: 'base32', token, window: 1 });

//                 if (verified) {
//                     user.updateOne({ secret: '' }).then(() => {
//                         return res.json({ secret: token });
//                     })
//                 }
//                 else
//                     return res.status(400).json({ msg: 'קוד אימות שגוי' });
//             })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ msg: 'Error verify the token' })
//     }
// });

module.exports = router;