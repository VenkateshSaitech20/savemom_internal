import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req) {
    try {
        // const body = await req.json();
        // let { userId } = body;
        // const getUser = await prisma.user.findUnique({ where: { id: userId } });
        // if (getUser.roleId !== "1") {
        //     userId = getUser.id
        // };
        const getUserMenus = await prisma.menus.findMany({});
        getUserMenus.sort((a, b) => a.sequence - b.sequence);
        return NextResponse.json({ result: true, message: getUserMenus });
    } catch (error) {
        return NextResponse.json({ result: false, message: error });
    }
}    
