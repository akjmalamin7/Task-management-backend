const UserModel = require("../../models/users/usersModel");
const bcrypt = require("bcrypt");

/* registration */
exports.createProfile = async (req, res) => {
  const { email, firstName, lastName, mobile, password, photo } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "Failed",
        message: "User already exist.",
      });
    }
    const user = new UserModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile,
      photo: photo,
      password: password,
    });

    const token = user.generateJWT();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const result = await user.save();
    res.status(201).json({
      status: "Success",
      message: "Registration successful",
      token: token,
      data: {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        mobile: result.mobile,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "Failed",
      message: "Registration failed!",
    });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  let reqBody = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "Failed",
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "Failed",
        message: "Incorrect password",
      });
    }
    const token = user.generateJWT();
    const userData = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
    };
    res.status(200).json({
      status: "Success",
      message: "Login successful",
      token: token,
      data: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Failed",
      message: "Login failed",
    });
  }
};
exports.updateProfile = async (req, res) => {
  let id = req.user._id;
  let updateData = req.body;
  try {
    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "User not found!",
      });
    }
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    const updateUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");
    if (!updateUser) {
      return res.status(400).json({
        status: "Failed",
        message: "User not found!",
      });
    }
    res.status(201).json({
      status: "Success",
      message: "Successfully updated",
      data: updateUser,
    });
  } catch (err) {
    return res.status(400).json({
      status: "Failed",
      message: "User not found!",
    });
  }
};
exports.profileDetails = async (req, res) => {
  let emailFromHeader = req.user.email;
  try {
    const user = await UserModel.find({ email: emailFromHeader }).select(
      "-password"
    );

    if (!user) {
      return res
        .status(400)
        .json({ status: "Failed", message: "User not found!" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully found",
      data: user,
    });
  } catch (err) {}
};
