import * as xlsx from 'xlsx';
import * as fs from 'fs';

const workbook = xlsx.readFile('payroll..xlsx');

console.log(`Found ${workbook.SheetNames.length} sheets: ${workbook.SheetNames.join(', ')}`);

workbook.SheetNames.forEach(sheetName => {
    console.log(`\n================================`);
    console.log(`SHEET: ${sheetName}`);
    console.log(`================================`);

    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length === 0) {
        console.log("Empty sheet.");
        return;
    }
    if (sheetName === 'Rate_Table') {
        console.log("----- RATE TABLE JSON -----");
        console.log(JSON.stringify(data, null, 2));
    }
});
