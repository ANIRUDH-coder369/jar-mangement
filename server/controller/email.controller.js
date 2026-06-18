const nodemailer = require("nodemailer")
const Customer = require("../model/customer.model.js")

exports.sendJarEmail = async (req, res) => {
    try {
        const { customerId, date, noOfJars, pricing } = req.body

        const customer = await Customer.findById(customerId)
        if (!customer) return res.status(404).json({ message: "Customer not found" })

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customer.email,
            subject: "JAR Delivery Update – Thank You!",
            html: `
                <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:8px;">
                    <h2 style="color:#2563eb;">JAR Delivery Update</h2>
                    <p>Dear <strong>${customer.name}</strong>,</p>
                    <p>Thank you for your continued support! Here are the details of your recent JAR delivery:</p>
                    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:600;">Date</td><td style="padding:8px;border:1px solid #ddd;">${date}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:600;">No. of JARs</td><td style="padding:8px;border:1px solid #ddd;">${noOfJars}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:600;">Total Price</td><td style="padding:8px;border:1px solid #ddd;">₹${Number(pricing).toFixed(2)}</td></tr>
                    </table>
                    <p>We look forward to serving you again!</p>
                    <p style="color:#666;font-size:13px;">Best regards,<br/><strong>JAR Management Team</strong></p>
                </div>
            `,
        }

        await transporter.sendMail(mailOptions)
        res.status(200).json({ message: "Email sent successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to send email" })
    }
}
