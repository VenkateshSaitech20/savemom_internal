import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { extractTokenData } from '@/utils/helper';
import { responseData } from '@/utils/message';
const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const token = extractTokenData(req.headers);
        if (!token.id) {
            return NextResponse.json({ result: false, message: { invalidToken: responseData.invalidToken } });
        };
        let userId = token.id;
        const getUser = await prisma.user.findUnique({ where: { id: userId, isDeleted: "N" } });
        if (!getUser) {
            return NextResponse.json({ result: false, message: { userNotFound: responseData.userNotFound } });
        }

        const getRoles = await prisma.role.findUnique({ where: { id: getUser.roleId } });
        if (!getRoles && getUser.roleId !== "1") {
            return NextResponse.json({ Result: false, message: 'Role not found' });
        };

        if (getUser.roleId === "1") {
            const getAllMenus = await prisma.menus.findMany({});
            const allPermissions = getAllMenus.reduce((acc, menu) => {
                acc[menu.slugName] = {
                    readPermission: "Y",
                    writePermission: "Y",
                    editPermission: "Y",
                    deletePermission: "Y"
                };
                return acc;
            }, {});

            return NextResponse.json({ result: true, message: allPermissions });
        };

        const getAllMenus = await prisma.menus.findMany({});
        const { permissions } = getRoles;
        const { hasRead, hasWrite, hasEdit, hasDelete } = permissions;

        const hasReadSet = new Set(hasRead);
        const hasWriteSet = new Set(hasWrite);
        const hasEditSet = new Set(hasEdit);
        const hasDeleteSet = new Set(hasDelete);

        const checkSubMenuPermissions = (slugName) => {
            const menu = getAllMenus.find(menu => menu.slugName === slugName);
            if (!menu) return {
                readPermission: "N",
                writePermission: "N",
                editPermission: "N",
                deletePermission: "N"
            };
            return {
                readPermission: hasReadSet.has(menu.menuId) ? "Y" : "N",
                writePermission: hasWriteSet.has(menu.menuId) ? "Y" : "N",
                editPermission: hasEditSet.has(menu.menuId) ? "Y" : "N",
                deletePermission: hasDeleteSet.has(menu.menuId) ? "Y" : "N",
            };
        };

        const uniqueSubMenus = [...new Set(getAllMenus.map(menu => menu.slugName))];
        const permissionsResult = uniqueSubMenus.reduce((acc, slugName) => {
            acc[slugName] = checkSubMenuPermissions(slugName);
            return acc;
        }, {});
        return NextResponse.json({ result: true, message: permissionsResult });
    } catch (error) {
        return NextResponse.json({ result: false, message: error.message });
    }
}
