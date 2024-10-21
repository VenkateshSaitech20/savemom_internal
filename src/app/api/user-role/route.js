import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { registerData, responseData } from '@/utils/message';
import { extractTokenData } from '@/utils/helper';
import { areAllPermissionsEmpty, validateFields } from '../api-utlis/helper';
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
        let { roleId, roleName, permissions } = body;
        const emptyFieldErrors = {};
        if (roleName.trim() === "") {
            emptyFieldErrors.roleName = registerData.roleNameReq;
        }
        if (areAllPermissionsEmpty(permissions)) {
            emptyFieldErrors.permissions = registerData.permissionValMsg;
        }
        if (Object.keys(emptyFieldErrors).length > 0) {
            return NextResponse.json({ result: false, message: emptyFieldErrors });
        };
        const validatingFields = {
            roleName: { type: "name", message: registerData.roleFieldVal },
        };
        const fields = { roleName };
        let fieldErrors = validateFields(fields, validatingFields);
        if (Object.keys(fieldErrors).length > 0) {
            return NextResponse.json({ result: false, message: fieldErrors });
        };
        const getUser = await prisma.user.findUnique({ where: { id: userId } });
        if (getUser.roleId !== '1') {
            userId = getUser.id;
        }
        const existingRole = await prisma.role.findFirst({
            where: {
                AND: [
                    { roleName: roleName },
                    { id: { not: roleId } },
                    { userId: userId },
                    { isDeleted: "N" }
                ]
            }
        });
        if (existingRole) {
            return NextResponse.json({ result: false, message: { roleExists: responseData.roleExist } });
        }
        if (roleId) {
            const updatedRole = await prisma.role.update({
                where: { id: roleId },
                data: { roleName, permissions }
            });
            return NextResponse.json({ result: true, data: updatedRole, message: responseData.roleUpdeted });
        } else {
            const newRole = await prisma.role.create({
                data: { roleName, permissions, userId }
            });
            return NextResponse.json({ result: true, data: newRole, message: responseData.roleAdded });
        }
    } catch (error) {
        return NextResponse.json({ result: false, message: { roleError: error.message } }, { status: 500 });
    }
};
