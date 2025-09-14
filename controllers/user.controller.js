import User from '../models/User.js';
import { hashPassword } from '../utils/passwordUtils.js';

export const getAllUsers = async (req, res) => {
    try {
        const { role, isActive, limit = 50, page = 1 } = req.query;

        let query = {};

        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const skip = (page - 1) * limit;

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: users,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: users.length,
                totalUsers: total
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
}


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
}

export const createUser = async (req, res) => {
    try {
        const { email, username, password, role = 'user' } = req.body;
        const currentUserRole = req.user.role;

        // Check for existing users
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: existingUser.email === email ?
                    'Email already registered' :
                    'Username already taken'
            });
        }

        // Create user
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password: hashedPassword,
            role,
            isActive: true,
            createdBy: req.user.userId
        });

        await newUser.save();

        // Remove sensitive data from response
        newUser.password = undefined;
        newUser.refreshTokens = undefined;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { user: newUser }
        });

    } catch (error) {
        console.error('User creation error:', error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({
                success: false,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
}