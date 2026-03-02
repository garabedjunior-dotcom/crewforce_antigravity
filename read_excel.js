const xlsx = require('xlsx');
const fs = require('fs');
const workbook = xlsx.readFile('planilha de cadastro de funcionários.xlsx');
const sheets = {};
workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    sheets[sheetName] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
});
console.log(JSON.stringify(sheets, null, 2));
