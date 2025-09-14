import { Router } from 'express';
const router = Router();
import { getAllUsers, getUserById, createUser } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validateUserCreation, checkValidationResult } from '../middleware/validation.js';

// All user management routes require authentication
router.use(authenticate);

// User routes (User access)
router.get('/', authorize (['user']), getAllUsers);
router.get('/:id', authorize(['user']), getUserById);
router.post('/', authorize(['user']), validateUserCreation, checkValidationResult, createUser);
// router.put(':id', authorize(['user']), updateUser);

export default router;