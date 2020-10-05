require("dotenv").config()
const fetch = require("node-fetch")
const express = require("express")
const cors = require("cors")
const nodemailer = require('nodemailer')
const bodyParser = require("body-parser")
const app = express()
const port = 5000
const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    next()
})

app.post("/contact-form", (req, res) => {
    if (req.body) {
        const { name, email, subject, message } = req.body
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL_TO,
            subject: subject + ' - message from nrdstr.com',
            text: `
              name: ${name}
              email: ${email}
              message: ${message}
            `
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.json({ success: false, error: error })
            }
            res.json({ success: true })
        })
        res.send({ success: true })
    } else {
        res.send({ success: false, error: 'No body attached to request.' })
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`))