import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import { capitalizeFirstLetter } from '@/utils/helper';
const prisma = new PrismaClient();
export const config = {
    api: {
        bodyParser: false,
    },
};
export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        if (!file) {
            return NextResponse.json({ result: false, message: 'No file uploaded' });
        }
        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const countries = xlsx.utils.sheet_to_json(sheet);
        const createCountry = countries.map(async (country) => {
            if (!country.name) {
                return { result: false, message: 'Country field is required' };
            } else {
                const existingCountry = await prisma.country.findFirst({
                    where: { name: country.name }
                });
                if (existingCountry) {
                    const cid = existingCountry.id;
                    await prisma.country.update({
                        where: { id: cid },
                        data: {
                            name: capitalizeFirstLetter(country.name),
                            shortname: country.shortname.toUpperCase(),
                            phoneCode: String(country.phoneCode)
                        }
                    });
                } else {
                    await prisma.country.create({
                        data: {
                            name: capitalizeFirstLetter(country.name),
                            shortname: country.shortname.toUpperCase(),
                            phoneCode: String(country.phoneCode)
                        },
                    });
                }
            }
            return { result: true, message: 'Country uploaded successfully' };
        });
        const results = await Promise.all(createCountry);
        const failedResult = results.find(result => result.result === false);
        if (failedResult) {
            return NextResponse.json(failedResult);
        }
        return NextResponse.json({ result: true, message: 'Country uploaded successfully' });
    } catch (error) {
        console.error('Error in POST:', error.message);
        return NextResponse.json({ result: false, message: 'Internal Server Error' });
    }
}
