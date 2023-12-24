const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { name, role, userId } = isTokenValid({ token });
    req.user = { name, role, userId };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to excess this route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
