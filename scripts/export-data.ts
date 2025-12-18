import { PrismaClient, Prisma } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    const exportDir = path.join(__dirname, '../exports/data');
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
    }

    // Get all model names from Prisma DMMF
    const modelNames = Prisma.dmmf.datamodel.models.map(m => m.name);

    console.log(`Found ${modelNames.length} models to export.`);

    for (const modelName of modelNames) {
        try {
            console.log(`Exporting ${modelName}...`);
            // @ts-ignore - Dynamic access to prisma delegate
            const data = await prisma[modelName.charAt(0).toLowerCase() + modelName.slice(1)].findMany();

            if (data.length === 0) {
                console.log(`No data for ${modelName}, skipping.`);
                continue;
            }

            // Convert dates to ISO strings for better CSV compatibility
            const processedData = data.map((row: any) => {
                const newRow: any = { ...row };
                for (const key in newRow) {
                    if (newRow[key] instanceof Date) {
                        newRow[key] = newRow[key].toISOString();
                    }
                    // Handle JSON fields if any (convert to string)
                    if (typeof newRow[key] === 'object' && newRow[key] !== null && !(newRow[key] instanceof Date)) {
                        newRow[key] = JSON.stringify(newRow[key]);
                    }
                }
                return newRow;
            });

            const worksheet = xlsx.utils.json_to_sheet(processedData);
            const csvContent = xlsx.utils.sheet_to_csv(worksheet);

            fs.writeFileSync(path.join(exportDir, `${modelName}.csv`), csvContent);
            console.log(`Exported ${data.length} records to ${modelName}.csv`);
        } catch (error) {
            console.error(`Error exporting ${modelName}:`, error);
        }
    }

    console.log('Export completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
