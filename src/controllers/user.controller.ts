import { Request, Response } from 'express';
import * as userService from '../services/user.services';
import { validateEmail, validateName, validatePassword, validateEmailLength } from '../utils/validation';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface AuthenticatedRequest extends Request {
    user?: any;
  }

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!validateName(name)) {
    return res.status(400).json({ error: 'Nome deve ter entre 3 e 50 caracteres.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  if (!validateEmailLength(email)) {
    return res.status(400).json({ error: 'O email deve ter no máximo 50 caracteres.' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Senha deve ter entre 6 e 20 caracteres.' });
  }

  try {
    const newUser = await userService.signinUser(name, email, password);
    if (!newUser) {
      return res.status(409).json({ error: 'Email já está registrado.' });
    }
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  try {
    const user = await userService.findUserByLoginPassword(name, password);
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao efetuar login.' });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; name: string; iat: number; exp: number };
    const user = await userService.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido ou usuário não encontrado.' });
    }
    return res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

export const deleteUserController = async (req: AuthenticatedRequest, res: Response) => {
    const { password } = req.body;
    const userId = req.user.id;
  
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
  
      const passwordValid = await userService.verifyUserPassword(userId, password);
      if (!passwordValid) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }
  
      await userService.deleteUser(userId);
      return res.json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
  };

export const updateUserController = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;
  
    if (name && !validateName(name)) {
      return res.status(400).json({ error: 'Nome deve ter entre 3 e 50 caracteres.' });
    }
  
    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: 'Email inválido.' });
    }

    if (!validateEmailLength(email)) {
        return res.status(400).json({ error: 'O email deve ter no máximo 50 caracteres.' });
      }

    if (newPassword && !validatePassword(newPassword)) {
      return res.status(400).json({ error: 'Nova senha deve ter entre 6 e 20 caracteres.' });
    }
  
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
  
      const passwordValid = await userService.verifyUserPassword(userId, currentPassword);
      if (!passwordValid) {
        return res.status(401).json({ error: 'Senha atual incorreta.' });
      }
  
      const updatedUser = await userService.updateUser(userId, name, email, newPassword);
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      return res.json({ message: 'Usuário atualizado com sucesso.', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
  };
  

export const getLoggedUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
};


export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
  };

