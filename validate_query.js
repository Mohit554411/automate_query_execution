import { promises as fs } from 'fs';
import path from 'path';

const LOG_FILE = path.resolve("logs/execution.log");

async function logResults() {
    try {
        if (await fs.access(LOG_FILE)) {
            console.log("📝 Query Execution Log:");
            const logContent = await fs.readFile(LOG_FILE, 'utf-8');
            console.log(logContent);
        }
    } catch (error) {
        console.log("No logs found.");
    }
}

logResults();