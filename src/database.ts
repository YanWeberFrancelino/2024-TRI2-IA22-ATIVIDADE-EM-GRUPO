import { open, Database } from 'sqlite'
import { Database as driver } from "sqlite3"

let instance: Database | null = null

const filename = "./database.sqlite"

export const database = async () => {
  if (instance) 
    return instance

  const db =
    await open({ filename, driver })

  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `)

  instance = db
  return db
}

database()