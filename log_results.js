const fs = require('fs');

const LOG_FILE = "logs/execution.log";
if (fs.existsSync(LOG_FILE)) {
    console.log("📝 Query Execution Log:");
    console.log(fs.readFileSync(LOG_FILE, 'utf-8'));
} else {
    console.log("No logs found.");
}
