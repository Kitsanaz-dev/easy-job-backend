import { Router } from 'express';
const router = Router();

import { register, login, refreshToken, logout, getProfile, updateProfile, changePassword } from '../controllers/auth.controller.js';
import { validateRegistration, validateLogin, validatePasswordChange, checkValidationResult } from '../middleware/validation.js';
import { loginLimiter, registerLimiter, authLimiter } from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/auth.js';

// Apply general rate limiting to all auth routes
router.use(authLimiter);

// Public routes
router.post('/register', 
    registerLimiter,
    validateRegistration, 
    checkValidationResult, 
    register
);

router.post('/login', 
    loginLimiter,
    validateLogin, 
    checkValidationResult, 
    login
);

router.post('/refresh-token', refreshToken);

// Protected routes (require authentication)
router.post('/logout', authenticate, logout);
// router.post('/logout-all', authenticate, logoutAll);
// router.get('/profile', authenticate, getProfile);
// router.put('/profile', authenticate, updateProfile);
router.put('/change-password', 
    authenticate, 
    validatePasswordChange, 
    checkValidationResult, 
    changePassword
);

export default router;