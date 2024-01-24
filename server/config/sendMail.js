import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const Mail = async (receiver, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const mailOptions = {
    from: process.env.USERNAME, // sender address
    to: `${receiver}`, // list of receivers
    subject: "Your One Time Password(OTP) to UniConnect", // Subject line
    text: "Please Enter this OTP To Create Your Account", // plain text bod y
    html: `<b>Please Enter this OTP To Create Your Account <br/> OTP: ${otp}</b>`, // html body
  };

  const sendMail = async (transporter, mailOptions) => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email has been sent Successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  sendMail(transporter, mailOptions);
};
