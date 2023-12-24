const createTokenUser = (user) => {
  const userToken = { name: user.name, role: user.role, userId: user._id };
  return userToken;
};

module.exports = createTokenUser;
