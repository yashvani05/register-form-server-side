import configureSidemail from "sidemail";

// const transporter = nodemailer.createTransport({
//   service: "Gmail", // Use Gmail or another email service provider
//   auth: {
//     user: process.env.EMAIL_USER, // Add in .env file
//     pass: process.env.EMAIL_PASS, // Add in .env file
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

const sendVerificationEmail = async (email, token) => {
  const sidemail = configureSidemail({
    apiKey: "PsdfODLeXnwAU9oD7R2CP2UTL3D3cn9X4voGYqnn",
  });
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const emailResponse = await sidemail.sendEmail({
    fromName: "registration form",
    fromAddress: "anything@h08h7.via.sidemail.net",
    toAddress: "yashvani0305@gmail.com",
    templateName: "Email Verification",
    templateProps: {
      link: link,
    },
  });

  try {
    console.log("Verification email sent to:", email);
    return emailResponse;
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

export { sendVerificationEmail };
