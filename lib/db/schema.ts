import { pgTable, text, uuid, integer, boolean, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Think of this as creating a "files" table in your database
// Just like how Google Drive stores info about every file and folder you have
export const files = pgTable("files", {
    
    // 🆔 UNIQUE ID - Every file/folder needs a unique "fingerprint"
    // Like how every person has a unique social security number
    // We use UUID because it's basically impossible to create duplicates
    id: uuid("id").defaultRandom().primaryKey(),

    // 📝 BASIC INFO - The stuff users see and care about
    name: text("name").notNull(), // "resume.pdf" or "My Photos"
    path: text("path").notNull(), // Where it lives: "/documents/work/resume.pdf"
    size: integer("size").notNull().default(0), // How big the file is (in bytes). Folders = 0
    type: text("type").notNull(), // Simple category: "file" or "folder"
    mimeType: text("mime_type"), // Technical file type: "image/jpeg", "application/pdf"

    // 🗄️ STORAGE URLS - Where the actual file data lives
    fileUrl: text("file_url"), // Direct link to download/view the file
    thumbnailUrl: text("thumbnail_url"), // Small preview image (like file icons)

    // 👤 OWNERSHIP - Who owns this file and where it belongs
    userId: text("user_id").notNull(), // Which user account owns this file
    parentId: uuid("parent_id"), // Which folder contains this file (null = root level)

    // 🏷️ FILE FLAGS - Special properties that change how files behave
    isFolder: boolean("is_folder").default(false).notNull(), // Is this a folder (true) or file (false)?
    isStarred: boolean("is_starred").default(false).notNull(), // Did user "favorite" this?
    isTrash: boolean("is_trash").default(false).notNull(), // Is it in the trash bin?
    isShared: boolean("is_shared").default(false).notNull(), // Is it shared with other people?

    // ⏰ TIMESTAMPS - When things happened (super important for tracking)
    createdAt: timestamp("created_at").defaultNow().notNull(), // When was this file first uploaded?
    updatedAt: timestamp("updated_at").defaultNow().notNull(), // When was it last changed?
    trashedAt: timestamp("trashed_at"), // When was it moved to trash? (null if not trashed)
});

// 🔗 RELATIONSHIPS - How files connect to each other
// Think of this like a family tree for files and folders
export const filesRelations = relations(files, ({ one, many }) => ({
    
    // 👨‍👩‍👧 PARENT RELATIONSHIP - Every file/folder can have ONE parent folder
    // Example: "resume.pdf" lives inside "Documents" folder
    parent: one(files, {
        fields: [files.parentId], // This file's parent ID...
        references: [files.id],   // ...points to another file's ID
    }),

    // 👶 CHILDREN RELATIONSHIP - Every folder can contain MANY files/folders
    // Example: "Documents" folder contains "resume.pdf", "photos" folder, etc.
    children: many(files) // Note: fixed the capitalization from "Children" to "children"
}));

// 🎯 TYPESCRIPT TYPES - Makes coding easier and catches errors
// These tell TypeScript exactly what data structure to expect

// When you READ from database (SELECT query)
export type File = typeof files.$inferSelect;

// When you CREATE new records (INSERT query)  
export type NewFile = typeof files.$inferInsert;