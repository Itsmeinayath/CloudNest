import {pgTable,text,uuid,integer,boolean,timestamp} from "drizzle-orm/pg-core"
import { Relation } from "drizzle-orm"
import path from "path"
import { create } from "domain"

export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),
    // basic file/folder information
    name: text("name").notNull(),
    path: text("path").notNull(), // /documents/projects/resume.pdf
    size: integer("size").notNull(),
    type: text("type").notNull(), // 'file' or 'folder'

    // storage information
    fileUrl: text("file_url").notNull(), // URL to access the file
    thumbnailUrl: text("thumbnail_url"), // URL to access the thumbnail

    //owner information
     userId: text("user_id").notNull(), // ID of the user who owns the file
     parentId: uuid("parent_id"), // parent folder ID, null for root level

     //file/folder flags

     isFolder: boolean("is_folder").default(false).notNull(), // true if this is a folder, false if it's a file
     isStarred: boolean("is_starred").default(false).notNull(), // true if this file/folder is starred
     isTrash: boolean("is_trash").default(false).notNull(), // true if this file/folder is in trash

     // timestamps
        createdAt: timestamp("created_at").defaultNow().notNull(), // when the file/folder was created
        updatedAt: timestamp("updated_at").defaultNow().notNull(), // when the file/folder was last updated
});