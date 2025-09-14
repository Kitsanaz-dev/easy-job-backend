export const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;

            if (!userRole) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: No role assigned'
                });
            }

            // If no roles are passed, allow all authenticated users
            if (allowedRoles.length === 0) {
                return next();
            }

            // Check if the user's role is in the allowed list
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: Insufficient permissions'
                });
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({
                success: false,
                message: 'Authorization check failed'
            });
        }
    };
};