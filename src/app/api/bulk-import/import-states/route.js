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
        const states = xlsx.utils.sheet_to_json(sheet);
        const createState = states.map(async (state) => {
            if (!state.name) {
                return { result: false, message: 'State field is required' };
            } else {
                const existingState = await prisma.state.findFirst({
                    where: { name: state.name }
                });
                if (existingState) {
                    const sid = existingState.id;
                    await prisma.state.update({
                        where: { id: sid },
                        data: {
                            name: capitalizeFirstLetter(state.name),
                            countryId: state.countryId,
                            country: capitalizeFirstLetter(state.country)
                        },
                    });
                } else {
                    await prisma.state.create({
                        data: {
                            name: capitalizeFirstLetter(state.name),
                            countryId: state.countryId,
                            country: capitalizeFirstLetter(state.country)
                        },
                    });
                }
            }
            return { result: true, message: 'States uploaded successfully' };
        });
        const results = await Promise.all(createState);
        const failedResult = results.find(result => result.result === false);
        if (failedResult) {
            return NextResponse.json(failedResult);
        }
        return NextResponse.json({ result: true, message: 'States uploaded successfully' });
    } catch (error) {
        console.error('Error in POST:', error.message);
        return NextResponse.json({ result: false, message: 'Internal Server Error' });
    }
}
