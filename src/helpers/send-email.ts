const nodemailer =require('nodemailer');
import { errorHandler } from '../helpers/errorHandler';
import { logger } from './logger';
const mailServer = process.env.MAIL_SERVER;
const mailServerPassword = process.env.MAIL_SERVER_PASSWORD;
const sendEmail = (newUser: any, token: string) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailServer,
            pass: mailServerPassword
        }
    });

    var mailOptions = {
        from: mailServer,
        to: newUser.email,
        subject: 'localhost Activation',
        html: 'Hello <strong>' + newUser.username + '</strong>, <br><br>Thank you for rgestring' +
            ', please click the link below to activate your account<br><a href="http://localhost:3000/api/users/activate?token=' + token + '">Activate Account</a>'

    };

    transporter.sendMail(mailOptions, function (error: Error, info: { response: string; }) {
        if (error) {
            errorHandler.handleError(error);
        } else {

            logger.info('Email sent: ' + info.response);
        }
    });
}
export default sendEmail;