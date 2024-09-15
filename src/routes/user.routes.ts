import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/token/:token', userController.validateToken);

router.get('/users/logged', authenticateToken, userController.getLoggedUser);
router.get('/users/all', authenticateToken, userController.getAllUsers);
router.put('/users', authenticateToken, userController.updateUserController);
router.delete('/users', authenticateToken, userController.deleteUserController);

export default router;
