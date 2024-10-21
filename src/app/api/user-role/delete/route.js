import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { responseData } from '@/utils/message';
import { extractTokenData } from '@/utils/helper';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const token = extractTokenData(req.headers);
        if (!token.id) {
            return NextResponse.json({ result: false, message: { invalidToken: responseData.invalidToken } });
        };
        let userId = token.id;
        const user = await prisma.user.findUnique({ where: { id: userId, isDeleted: "N" } });
        if (!user) {
            return NextResponse.json({ result: false, message: { userNotFound: responseData.userNotFound } });
        }

        const body = await req.json();
        const { roleId } = body;

        await prisma.role.update({
            where: { id: roleId },
            data: { isDeleted: "Y" }
        });
        return NextResponse.json({ result: true, message: responseData.roleDel })
    } catch (error) {
        return NextResponse.json({ result: false, message: "error" })
    }
}
