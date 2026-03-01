const nodemailer = require('nodemailer');

// Cached Ethereal test account for development
let devTransporter = null;

const getDevTransporter = async () => {
    if (devTransporter) return devTransporter;

    // Create a free Ethereal test account (no signup required)
    const testAccount = await nodemailer.createTestAccount();

    devTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    console.log('\n' + '='.repeat(60));
    console.log('   📬  Ethereal Dev Email Account Created');
    console.log('='.repeat(60));
    console.log(`   User: ${testAccount.user}`);
    console.log(`   Pass: ${testAccount.pass}`);
    console.log(`   View sent emails at: https://ethereal.email`);
    console.log('='.repeat(60) + '\n');

    return devTransporter;
};

const sendEmail = async (options) => {
    const isProduction = process.env.NODE_ENV === 'production' &&
        process.env.EMAIL_USER &&
        process.env.EMAIL_USER !== 'your_user_id';

    let transporter;

    if (isProduction) {
        // Production: use configured SMTP
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    } else {
        // Development: use Ethereal free test email
        transporter = await getDevTransporter();
    }

    const mailOptions = {
        from: 'Shekla Ride <no-reply@sheklaride.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    // In development, log the preview URL
    if (!isProduction) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('\n' + '='.repeat(60));
        console.log('   ✅  Email Sent via Ethereal');
        console.log('='.repeat(60));
        console.log(`   To:      ${options.email}`);
        console.log(`   Subject: ${options.subject}`);
        console.log(`   💌 VIEW EMAIL: ${previewUrl}`);
        console.log('='.repeat(60) + '\n');
    }

    return info;
};

module.exports = sendEmail;
