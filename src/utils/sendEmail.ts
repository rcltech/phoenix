import * as env from "dotenv";
import nodemailer from "nodemailer";
import moment from "moment";
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

  const signature = `<p>--<br/>Thanks for using our service!<br/><br/>Owl by RC Tech Club<br/>6A Sassoon Road, R.C Lee Hall<br/><a href="mailto:owl@rctech.club">owl@rctech.club</a><br/><a href="rctech.club">rctech.club</a></p>`;

  const text = `<p>Dear ${first_name},<br/><br/>Your booking for ${name} (${number}) on ${moment(
    start
  ).format("Do MMM YYYY")} at ${moment(start).format("h:mm")} to ${moment(
    end
  ).format(
    "h:mm a"
  )} has been confirmed!<br/>Thanks for using our service, have a nice day!</p><br/><br/>${signature}`;

  const mailOptions = {
    from: "owl@rctech.club",
    to: email,
    subject: "Owl booking confirmation",
    html: `<html><body>${text}</body></html>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    err ? console.log(err) : console.log(info.response);
  });
};
