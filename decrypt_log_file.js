const fs = require("fs");
const crypto = require("crypto");


//!\ It is strongly recommended to modify the encryption key and store it more securely for real engagements. /!\\
const ENCRYPTION_KEY = "HyP3r-M3g4_S3cURe-EnC4YpT10n_k3Y";


const clArguments = process.argv;
if (clArguments.length !== 3) {
    console.error(`/!\\ Usage: ${clArguments[0]} ${clArguments[1]} $ENCRYPTED_LOG_FILE_PATH /!\\`);
    process.exit(1);
}

const decryptedLogFile = decryptLogFile(clArguments[2]);
console.log(decryptedLogFile);

function decryptData(iv, encryptedData) {
    try {
        const decipher = crypto.createDecipheriv("aes-256-ctr", ENCRYPTION_KEY, Buffer.from(iv, "hex"));

        let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
        decryptedData += decipher.final("utf-8");

        return decryptedData;
    }
    catch (error) {
        throw new Error(`Log file decryption failed: ${error.message}`);
    }
}

function decryptLogFile(logFilePath) {
    try {
        if (!fs.existsSync(logFilePath)) {
            throw new Error(`The ${logFilePath} file does not exist`);
        }
        const encryptedLogs = fs.readFileSync(logFilePath, "utf8").split("\n");
        let decryptedData = "";

        for (const encryptedLog of encryptedLogs) {
            if (!encryptedLog.trim()) continue;
            const encryptedEntry = JSON.parse(encryptedLog);
            const [[iv, encryptedData]] = Object.entries(encryptedEntry);
            decryptedData += decryptData(iv, encryptedData);
        }
        return decryptedData;
        
    } catch (error) {
        console.error(error);
    }
}