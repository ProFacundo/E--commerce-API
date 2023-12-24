const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");

  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id : ${id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequestError("Please provide name and email");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide old and new password");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const checkPassword = await user.comparePassword(oldPassword);
  if (!checkPassword) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "password updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

//Update user using findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new BadRequestError("Please provide name and email");
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   console.log(req.user);
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });

//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
