const fs = require('fs');
const path = require('path');

const deployTxtPath = path.resolve(__dirname, '../../../contracts/deploy.txt');
const constantsJsPath = path.resolve(__dirname, 'constants.js');

try {
    let str = fs.readFileSync(deployTxtPath, 'utf16le');
    // stellar CLI deploy output might have other encodings, so also try utf8 just in case
    if (!str.includes('C')) {
        str = fs.readFileSync(deployTxtPath, 'utf8');
    }

    // Clean up any newlines or invisible characters before checking
    const cleanStr = str.replace(/\s+/g, '');
    const match = cleanStr.match(/C[A-Z2-7]{55}/);

    if (match) {
        const newId = match[0];
        console.log("Successfully extracted NEW ID:", newId);

        let constantsContent = fs.readFileSync(constantsJsPath, 'utf8');
        constantsContent = constantsContent.replace(
            /export const CONTRACT_ID = "C[A-Z2-7]{55}";/,
            `export const CONTRACT_ID = "${newId}";`
        );

        fs.writeFileSync(constantsJsPath, constantsContent);
        console.log("constants.js updated with new CONTRACT_ID");
    } else {
        console.log("Contract ID not found in deploy.txt");
    }
} catch (e) {
    console.error("Error updating ID:", e);
}
