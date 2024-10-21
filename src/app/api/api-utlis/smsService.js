import twilio from 'twilio';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { responseData } from '@/utils/message';

const prisma = new PrismaClient();

let mobile = '';
let publicKey = '';
let authKey = '';
let smsType = '';

export async function getSMSCredential() {
    try {
        const sms_setting = await prisma.sms_setting.findFirst();
        if (sms_setting) {
            mobile = sms_setting.mobile;
            publicKey = sms_setting.publicKey;
            authKey = sms_setting.authKey;
            smsType = sms_setting.smsType;
        } else {
            throw new Error("No sms settings found");
        }
    } catch (error) {
        return NextResponse.json({ result: false, error: error.message });
    }
}

export const getFromMobileNumber = () => {
    return mobile;
};

export const sendSms = async (to, message) => {
    try {
        await getSMSCredential();
        if (smsType === "twilio") {
            const accountSid = publicKey;
            const authToken = authKey;
            if (accountSid && authToken) {
                const client = twilio(accountSid, authToken);
                await client.messages.create({
                    from: mobile,
                    to: to,
                    body: message,
                });
            } else {
                let errorMessage = responseData.inValidTwilioErrMSg;
                throw new Error(errorMessage);
            }
        } else {
            let errorMessage = responseData.inValidSMSType;
            throw new Error(errorMessage);
        }
    } catch (error) {
        if (error.message.includes('Authenticate') || error.message.includes('Authentication Error')) {
            throw new Error(responseData.inValidTwilioErrMSg);
        } else {
            throw error;
        }
    }
};

