import * as env from "dotenv";
env.config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Yandex',
  auth: {
    user: 'owl@rctech.club',
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = bookingData => {
  const { recipientDetails: { email, firstName, lastName } } = bookingData;
  const { bookingDetails: { roomDetails: { roomName, roomNumber }, start, end }} = bookingData; 
  
  const text = `Dear ${firstName},\n\nYour booking for ${roomName} has been confirmed!\nThanks for using our service, have a nice day!`;
   
  const mailOptions = {
    from: 'owl@rctech.club',
    to: email,
    subject: 'Thanks for using owl!',
    text
  };

  transporter.sendMail(mailOptions, (err,info) => {
    err ? console.log(err) : console.log(info.response);
  });
}