import { extractTokenData } from '@/utils/helper';
import { NextResponse } from 'next/server';
import { registerData, responseData } from '@/utils/message';
import { PrismaClient } from '@prisma/client';
import { removeHtmlTagsExceptBr, validateFields } from '../api-utlis/helper';
import { sendSms, getFromMobileNumber } from '../api-utlis/smsService';

const prisma = new PrismaClient();

// Send sms
export async function POST(req) {
    const token = extractTokenData(req.headers);
    if (!token.id) {
        return NextResponse.json({ result: false, message: { tokenExpired: responseData.tokenExpired } });
    }
    const user = await prisma.user.findUnique({ where: { id: token.id, isDeleted: "N" } });
    if (!user) {
        return NextResponse.json({ result: false, message: { userNotFound: responseData.userNotFound } });
    }
    let userId = token.id;
    const body = await req.json();
    const { to, message, sendSMSTo, templateId, templateCategory } = body;
    const emptyFieldErrors = {};
    const formattedMessage = removeHtmlTagsExceptBr(message);
    let fromMobileNumber;
    // For all-users
    if (sendSMSTo === "all-users") {
        const userContactNos = await prisma.user.findMany({
            where: {
                isDeleted: "N",
                AND: [
                    { contactNo: { not: null } },
                    { phoneCode: { not: null } },
                    { contactNo: { not: '' } },
                    { phoneCode: { not: '' } }
                ]
            },
            select: {
                contactNo: true,
                phoneCode: true
            }
        });
        // const contactNoList = userContactNos.map(userContactNo => userContactNo.contactNo);
        const sendSMSPromises = userContactNos.map(async ({ contactNo, phoneCode }) => {
            try {
                let smsTo = phoneCode + contactNo;
                await sendSms(smsTo, formattedMessage);
                fromMobileNumber = getFromMobileNumber();
            } catch (error) {
                return `Failed to send SMS to ${contactNo}: ${error.message}`;
            }
        });
        const results = await Promise.all(sendSMSPromises);
        const errors = results.filter(result => result !== undefined);
        if (errors.length > 0) {
            let err = errors[0];
            // return NextResponse.json({ result: false, message: { errors } });
            return NextResponse.json({ result: false, message: { error: err } });
        }
        const contactNoList = userContactNos.map(({ contactNo, phoneCode }) => `${phoneCode}${contactNo}`);
        await prisma.sent_sms.create({
            data: {
                from: fromMobileNumber,
                to: contactNoList.join(", "),
                message: message,
                sendSMSTo: sendSMSTo,
                sentBy: userId,
                templateId: templateId,
                templateCategory: templateCategory
            },
        });
        return NextResponse.json({ result: true, message: responseData.smsSentSuccMsg });
    } else {
        // For single user
        if (!to || to.trim() === "") {
            emptyFieldErrors.to = registerData.mobReq;
        }
        if (!message || message.trim() === "") {
            emptyFieldErrors.message = registerData.messageReq;
        }
        if (Object.keys(emptyFieldErrors).length > 0) {
            return NextResponse.json({ result: false, message: emptyFieldErrors });
        }
        const validatingFields = {
            to: { type: "customMobileNumber", message: registerData.phoneValMsg },
        };
        let fieldErrors = validateFields({ to }, validatingFields);
        if (Object.keys(fieldErrors).length > 0) {
            return NextResponse.json({ result: false, message: fieldErrors });
        }
        try {
            await sendSms(to, formattedMessage);
            fromMobileNumber = getFromMobileNumber();
            await prisma.sent_sms.create({
                data: {
                    from: fromMobileNumber,
                    to: to,
                    message: message,
                    sendSMSTo: sendSMSTo,
                    sentBy: userId,
                    templateId: templateId,
                    templateCategory: templateCategory
                },
            });
            return NextResponse.json({ result: true, message: responseData.smsSentSuccMsg });
        } catch (error) {
            return NextResponse.json({ result: false, error: error.message });
        }
    }
}
