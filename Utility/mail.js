import nodemailer from "nodemailer"
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const sendEmail = async (name, email, token) => {
    console.log("Name is", name)
    console.log("Email is", email)
    console.log("Client url", process.env.CLIENT_URL)
    const htmlContent = `
    <div style="font-family: sans-serif;">
        <h2>Email Verfication</h2>
        <p>Hi ${capitalizeFirstLetter(name)}, This is a Verification Email to verify your Account at TechBlogs Website.</p>
        <p>If you did not Register on our website then please ignore this Email.</p>
        <p style="margin-bottom: 16px;">To Activate your account please click on this Link below.</p>
        <a href=${process.env.CLIENT_URL}/user/activate/${token} style="background: rgb(255, 120, 0);color: white;padding: 0.5rem 0.75rem;margin-top: 16px !important;border-radius: 7px;">Activate Your Account </a>
    </div>
`
    try {
        let transporter = nodemailer.createTransport({
            service: "hotmail",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SERVER_EMAIL,
                pass: process.env.SERVER_PASS,
            },
        });
        // send mail with defined transport object
        await transporter.sendMail({
            from: process.env.SERVER_EMAIL,
            to: email,
            subject: "Account Activation",
            html: htmlContent,
        });
        return true
    } catch (error) {
        console.log("Email", error.message)
        return false
    }
}

export default sendEmail