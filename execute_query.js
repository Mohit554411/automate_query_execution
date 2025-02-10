import { promises as fs } from 'fs';
import { MongoClient } from 'mongodb';
import path from 'path';

const MONGO_URI = process.env.MONGO_URI;
const LOG_FILE = path.resolve("logs/execution.log");
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function executeQueries() {
    try {
        await client.connect();
        console.log("🚀 Connected to MongoDB.");

        const queryFilesPath = path.resolve('new_queries.txt');
        const queryFilesData = await fs.readFile(queryFilesPath, 'utf-8');
        const queryFiles = queryFilesData.trim().split("\n");

        for (const file of queryFiles) {
            console.log(`🔄 Running ${file}...`);
            const queryContent = await fs.readFile(file, 'utf-8');

            // Extract database name dynamically
            const dbNameMatch = queryContent.match(/db\s*\.\s*([a-zA-Z0-9_]+)\s*\./);
            if (!dbNameMatch) {
                console.error(`❌ Database name not found in ${file}`);
                continue;
            }

            const dbName = dbNameMatch[1];
            const db = client.db(dbName);

            // Execute the raw query
            const result = await db.command({ eval: queryContent });
            await fs.appendFile(LOG_FILE, `✅ ${file} executed successfully: ${JSON.stringify(result)}\n`);
        }

    } catch (error) {
        console.error(`❌ Execution failed: ${error.message}`);
        process.exit(1);
    } finally {
        await client.close();
    }
}

executeQueries();