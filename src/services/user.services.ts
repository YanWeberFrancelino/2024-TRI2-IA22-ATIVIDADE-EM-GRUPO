import { database } from "../database";

// Função para encontrar usuário pelo nome e senha
export const findUserByLoginPassword = async (name: string, password: string) => {
  const db = await database();
  return db.get('SELECT * FROM users WHERE name = ? AND password = ? LIMIT 1', [name, password]);
};

// Função para obter todos os usuários
export const getAllUsers = async () => {
  const db = await database();
  return db.all('SELECT name, email FROM users');
};

export const signinUser = async (name: string, email: string, password: string) => {
  const db = await database();

  const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (existingUser) return false
  else{
    await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    const newUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    return newUser;
  }
};

// Função para atualizar informações do usuário
export const updateUser = async (name?: string, email?: string, password?: string) => {
  if (!name && !email && !password) {
    throw new Error('Nenhuma informação para atualizar fornecida');
  }
  
  const db = await database();
  await db.run(
    `UPDATE users 
     SET name = COALESCE(?, name), 
         email = COALESCE(?, email), 
         password = COALESCE(?, password)`, 
    [name, email, password]
  );

  // Recuperar o usuário atualizado
  const updatedUser = await db.get('SELECT name, email, password FROM users WHERE email = ?', [email]);
  return updatedUser;
};
