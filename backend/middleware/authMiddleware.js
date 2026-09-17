// Role-Based Access Control Middleware for Samaki Fresh API

export function verifyRole(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const roleHeader = req.headers['x-user-role'];

    // In demo / production bridge, check role from token / header
    const userRole = roleHeader || (authHeader ? 'customer' : 'guest');

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient privileges for this endpoint',
        requiredRoles: allowedRoles,
        currentRole: userRole
      });
    }

    req.user = {
      role: userRole,
      id: req.headers['x-user-id'] || 'demo-user'
    };

    next();
  };
}
