import { open, Database } from 'sqlite';
import { Database as SQLite3Database } from "sqlite3";

let instance: Database<SQLite3Database> | null = null;

const filename = "./database.sqlite";

export const database = async (): Promise<Database<SQLite3Database>> => {
  if (instance) 
    return instance;

  const db = await open({ filename, driver: SQLite3Database });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  instance = db;
  return db;
}

database();
