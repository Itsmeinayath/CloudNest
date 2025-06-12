// 🏗️ IMPORT MIGRATION TOOLS
// These help us create and update our database tables

// The main tool that applies changes to our database
import {migrate} from "drizzle-orm/neon-http/migrator";

// Database connection tools (same as our main db file)
import {drizzle} from "drizzle-orm/neon-http"
import {neon} from "@neondatabase/serverless"

// Tool to read our secret environment variables (.env.local file)
import * as dotenv from "dotenv";

// 🔧 LOAD ENVIRONMENT VARIABLES
// Tell the app to read our .env.local file where DATABASE_URL is stored
// Like opening a secret drawer to get your database password
dotenv.config({ path: ".env.local" });

// 🛡️ SAFETY CHECK
// Make sure we actually have a database URL before trying to connect
// Like checking you have your house key before leaving
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env.local');
}

// 🏃‍♂️ THE MAIN MIGRATION FUNCTION
// This actually creates/updates your database tables
async function runMigration(){
    try{
        // Connect to the database (same setup as our main db file)
        const sql = neon(process.env.DATABASE_URL!);
        const db = drizzle(sql);
        
        // 🎯 RUN THE MIGRATION
        // This reads files in ./drizzle folder and applies them to database
        // Like following a recipe to build your database tables
        await migrate(db, { migrationsFolder: "./drizzle" });
        
        // 🎉 SUCCESS MESSAGE
        console.log("Migration completed successfully.");
    }
    catch (error) {
        // 🚨 IF SOMETHING GOES WRONG
        // Show the error and stop the program
        console.error("Migration failed:", error);
        process.exit(1); // Exit with error code
    }
}

// 🚀 START THE MIGRATION
// Actually run the function when this file is executed
runMigration();