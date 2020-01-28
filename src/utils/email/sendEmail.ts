import * as env from "dotenv";
import nodemailer from "nodemailer";
import moment from "moment";
import { getEmailContent } from "./emailTemplate";
env.config();

const transporter = nodemailer.createTransport({
  service: "Yandex",
  auth: {
    user: "owl@rctech.club",
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendEmail = ({ user, booking, room }) => {
  const { email, first_name } = user;
  const { start, end } = booking;
  const { number, name } = room;

  const room_detail = `${name} (${number})`;
  const date = moment(start).format("Do MMM YYYY");
  const start_time = moment(start).format("h:mm");
  const end_time = moment(end).format("h:mm a");
  const emailTemplateData = {
    first_name,
    room_detail,
    date,
    start_time,
    end_time,
  };

  const mailOptions = {
    from: "owl@rctech.club",
    to: email,
    subject: "Owl booking confirmation",
    html: getEmailContent(emailTemplateData),
  };

  transporter
    .sendMail(mailOptions)
    .then(info => {
      console.log(info);
    })
    .catch(err => {
      console.log(err);
    });
};
