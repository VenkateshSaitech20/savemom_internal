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
        const cities = xlsx.utils.sheet_to_json(sheet);
        const createCity = cities.map(async (city) => {
            if (!city.name) {
                return { result: false, message: 'City field is required' };
            } else {
                const existingCity = await prisma.city.findFirst({
                    where: { name: city.name }
                });
                if (existingCity) {
                    const cityId = existingCity.id;
                    await prisma.city.update({
                        where: { id: cityId },
                        data: {
                            name: capitalizeFirstLetter(city.name),
                            countryId: city.countryId,
                            country: capitalizeFirstLetter(city.country),
                            stateId: city.stateId,
                            state: capitalizeFirstLetter(city.state)
                        }
                    });
                } else {
                    await prisma.city.create({
                        data: {
                            name: capitalizeFirstLetter(city.name),
                            countryId: city.countryId,
                            country: capitalizeFirstLetter(city.country),
                            stateId: city.stateId,
                            state: capitalizeFirstLetter(city.state)
                        }
                    });
                }
            }
            return { result: true, message: 'City uploaded successfully' };
        });
        const results = await Promise.all(createCity);
        const failedResult = results.find(result => result.result === false);
        if (failedResult) {
            return NextResponse.json(failedResult);
        }
        return NextResponse.json({ result: true, message: 'City uploaded successfully' });
    } catch (error) {
        console.error('Error in POST:', error.message);
        return NextResponse.json({ result: false, message: 'Internal Server Error' });
    }
}
