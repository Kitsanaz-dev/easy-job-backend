import pkg from 'jsonwebtoken';
const { sign, verify, decode } = pkg;

// Generate access token
export const generateToken = (payload) => {
    return sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Generate refresh token
export const generateRefreshToken = (payload) => {
    return sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
    });
};

// Verify access token
export const verifyToken = (token) => {
    return verify(token, process.env.JWT_SECRET);
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
    return verify(token, process.env.JWT_REFRESH_SECRET);
};

// Decode token without verification (for expired tokens)
export const decodeToken = (token) => {
    return decode(token);
};