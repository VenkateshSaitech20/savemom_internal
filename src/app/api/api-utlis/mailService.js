import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { responseData } from '@/utils/message';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

const prisma = new PrismaClient();

let email = '';
let pass = '';
let apiKey = '';
let emailType = '';
let emailCompany = '';

export async function getEmailCredential() {
    try {
        const email_setting = await prisma.email_setting.findFirst();
        if (!email_setting) throw new Error("No email settings found");
        ({ email, apiKey, password: pass, emailType, emailCompany } = email_setting);
        return email;
    } catch (error) {
        return NextResponse.json({ result: false, error: error.message });
    }
}

const validateCredentials = () => {
    if (emailType === 'twilio' && !apiKey)
        throw new Error(responseData.inValidEmailCredential);
    if (emailType === 'smtp' && (!email || !pass))
        throw new Error(responseData.inValidEmailCredential);
    if (emailType !== 'twilio' && emailType !== 'smtp')
        throw new Error(responseData.invalidEMailType);
};

const sendUsingTwilio = async (mailOptions) => {
    sgMail.setApiKey(apiKey);
    try {
        await sgMail.send(mailOptions);
    } catch (error) {
        throw new Error(error.response?.body?.errors?.[0]?.message || 'Failed to send email');
    }
};

const sendUsingSMTP = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
        service: emailCompany,
        auth: { user: email, pass },
    });
    await transporter.sendMail(mailOptions);
};

// Main: Send email based on the configured email type
export const sendMail = async (to, subject, message) => {
    try {
        await getEmailCredential();
        validateCredentials();
        const mailOptions = { from: email, to, subject, html: message };
        if (emailType === 'twilio') {
            return await sendUsingTwilio(mailOptions);
        } else if (emailType === 'smtp') {
            return await sendUsingSMTP(mailOptions);
        }
    } catch (error) {
        if (error.message.includes('Authenticate') || error.message.includes('Authentication Error')) {
            throw new Error(responseData.inValidEmailCredential);
        }
        throw error;
    }
};

export const getFromEmail = () => email;
