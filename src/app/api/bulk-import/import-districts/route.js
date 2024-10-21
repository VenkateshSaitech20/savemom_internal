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
        const districts = xlsx.utils.sheet_to_json(sheet);
        const createDistrict = districts.map(async (dist) => {
            if (!dist.name) {
                return { result: false, message: 'District field is required' };
            } else {
                const existingDist = await prisma.district.findFirst({
                    where: { name: dist.name }
                });
                if (existingDist) {
                    const distId = existingDist.id;
                    await prisma.district.update({
                        where: { id: distId },
                        data: {
                            name: capitalizeFirstLetter(dist.name),
                            countryId: dist.countryId,
                            country: capitalizeFirstLetter(dist.country),
                            stateId: dist.stateId,
                            state: capitalizeFirstLetter(dist.state),
                            cityId: dist.cityId,
                            city: capitalizeFirstLetter(dist.city)
                        }
                    });
                } else {
                    await prisma.district.create({
                        data: {
                            name: capitalizeFirstLetter(dist.name),
                            countryId: dist.countryId,
                            country: capitalizeFirstLetter(dist.country),
                            stateId: dist.stateId,
                            state: capitalizeFirstLetter(dist.state),
                            cityId: dist.cityId,
                            city: capitalizeFirstLetter(dist.city)
                        },
                    });
                }
                return { result: true, message: 'District uploaded successfully' };
            }
        });
        const results = await Promise.all(createDistrict);
        const failedResult = results.find(result => result.result === false);
        if (failedResult) {
            return NextResponse.json(failedResult);
        }
        return NextResponse.json({ result: true, message: 'District uploaded successfully' });
    } catch (error) {
        console.error('Error in POST:', error.message);
        return NextResponse.json({ result: false, message: 'Internal Server Error' });
    }
}
