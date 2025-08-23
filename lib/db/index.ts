// 🌐 IMPORT THE TOOLS WE NEED
// Think of these like importing different tools from a toolbox

// This is our main database "translator" - converts our code to SQL
import { drizzle } from 'drizzle-orm/neon-http';

// This connects us to Neon database (our cloud PostgreSQL database)
// It's like the "phone line" to talk to our database
import { neon } from "@neondatabase/serverless"

// Import all our table definitions (the "files" table we created)
// This tells drizzle what our database looks like
import * as schema from './schema'
// 🌱 LOAD ENVIRONMENT VARIABLES

// 🔗 CREATE THE CONNECTION
// Get the database URL from our environment variables
// This is like the "address" of our database (kept secret for security)
// The "!" tells TypeScript "trust me, this exists"
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env.local');
}
const sql = neon(process.env.DATABASE_URL!)

// 🎯 CREATE OUR MAIN DATABASE OBJECT
// This is what we'll use throughout our app to talk to the database
// It combines the connection (sql) with our table structure (schema)
// Think of it as your "database remote control"
export const db = drizzle(sql, {schema})

// 🔧 EXPORT THE RAW SQL CONNECTION
// Sometimes we might need direct database access for complex queries
// This is like having both a TV remote AND manual TV controls
export {sql}