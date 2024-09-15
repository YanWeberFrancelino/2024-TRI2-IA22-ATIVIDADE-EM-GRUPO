import { database } from "../database";
import { User } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/encryption"; 


export const verifyUserPassword = async (id: number, password: string): Promise<boolean> => {
  const db = await database();
  const user = await db.get<User>('SELECT * FROM users WHERE id = ?', [id]);

  if (user && await comparePassword(password, user.password)) {
    return true;
  }
  return false;
};


export const findUserByLoginPassword = async (name: string, password: string): Promise<User | null> => {
  const db = await database();
  const user = await db.get<User>('SELECT * FROM users WHERE name = ? LIMIT 1', [name]);

  if (user && await comparePassword(password, user.password)) {
    return user;
  }
  return null; 
};


export const signinUser = async (name: string, email: string, password: string): Promise<User | false> => {
  const db = await database();

  const existingUser = await db.get<User>('SELECT * FROM users WHERE email = ?', [email]);
  if (existingUser) return false; 
  const hashedPassword = await hashPassword(password);
  await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
  
  const newUser = await db.get<User>('SELECT * FROM users WHERE email = ?', [email]);
  return newUser || false;
};


export const getAllUsers = async (): Promise<Omit<User, 'password'>[]> => {
  const db = await database();
  return db.all<Omit<User, 'password'>[]>('SELECT id, name, email FROM users');
};

export const getUserById = async (id: number): Promise<Omit<User, 'password'> | null> => {
  const db = await database();
  const user = await db.get<Omit<User, 'password'> | null>('SELECT id, name, email FROM users WHERE id = ?', [id]);
  return user || null;
};


export const updateUser = async (id: number, name?: string, email?: string, newPassword?: string): Promise<Omit<User, 'password'> | null> => {
  const db = await database();
  const updates = {
    name: name || undefined,
    email: email || undefined,
    password: newPassword ? await hashPassword(newPassword) : undefined,
  };

  await db.run(
    `UPDATE users 
     SET name = COALESCE(?, name), 
         email = COALESCE(?, email), 
         password = COALESCE(?, password) 
     WHERE id = ?`,
    [updates.name, updates.email, updates.password, id]
  );

  const updatedUser = await db.get<Omit<User, 'password'> | null>('SELECT id, name, email FROM users WHERE id = ?', [id]);
  return updatedUser || null;
};


export const deleteUser = async (id: number): Promise<void> => {
  const db = await database();
  await db.run('DELETE FROM users WHERE id = ?', [id]);
};
