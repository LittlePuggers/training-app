const fs = require("fs");
const bcrypt = require("bcryptjs");

const path = "db/users.json";

const getUserMe = (req, res) => {
  try {
    const { email } = req.params;
    const data = readFile();
    let users = [];

    if (data.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "User does not exist." });
    }

    users = JSON.parse(data);

    const user = users.find((user) => user.email === email);

    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "The email or password is incorrect." });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const getUsersByRole = (req, res) => {
  try {
    const { role } = req.params;
    const data = readFile();
    let allUsers = [];

    if (data.length === 0) {
      return res.status(404).json({ ok: false, message: "Cannot find users." });
    }

    allUsers = JSON.parse(data);

    const users = allUsers.filter((user) => user.role === role);

    if (users.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Cannot find any users by this role." });
    }

    res.json({
      ok: true,
      users,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const deleteUserMe = (req, res) => {
  try {
    const { email } = req.params;
    const data = readFile();
    let users = [];

    if (data.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "User does not exist." });
    }

    users = JSON.parse(data);

    const user = users.find((user) => user.email === email);

    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "The email or password is incorrect." });
    }

    const newUsers = users.filter((user) => user.email !== email);

    fs.writeFileSync(path, JSON.stringify(newUsers), { flag: "w" });

    res.json({
      ok: true,
      message: `The user with the email ${email} was deleted`,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const updateUserPassword = (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.params;
    const data = readFile();
    let users = [];

    if (data.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "User does not exist." });
    }

    users = JSON.parse(data);

    const user = users.find((user) => user.email === email);

    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "The email or password is incorrect." });
    }

    const validPassword = bcrypt.compareSync(oldPassword, user.password);

    if (!validPassword) {
      return res.status(403).json({
        ok: false,
        message: "The email or password is incorrect.",
      });
    }

    const salt = bcrypt.genSaltSync();
    let encriptedNewPassword;

    if (newPassword) {
      encriptedNewPassword = bcrypt.hashSync(newPassword, salt);
    }

    userUpdated = users.map((user) => {
      if (user.email === email) {
        return {
          ...user,
          password: encriptedNewPassword,
        };
      }

      return user;
    });

    fs.writeFileSync(path, JSON.stringify(userUpdated), { flag: "w" });

    res.json({
      ok: true,
      message: "The user was updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const editUser = (req, res) => {
  try {
    const newProfile = req.body;
    console.log("new profile", newProfile);
    const { email } = req.params;
    const data = readFile();
    let users = [];

    if (data.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "User does not exist." });
    }

    users = JSON.parse(data);

    const user = users.find((user) => user.email === email);
    console.log(user);

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found." });
    }

    const updatedUser = users.map((user) => {
      if (user.email === email) {
        console.log(user);
        return {
          ...user,
          name: newProfile.name,
          lastName: newProfile.lastName,
          dateBirth: newProfile.dateBirth,
          address: newProfile.address,
          email: newProfile.email,
        };
      }

      return user;
    });

    console.log(updatedUser.find((user) => user.email === email));

    fs.writeFileSync(path, JSON.stringify(updatedUser), { flag: "w" });

    res.json({
      ok: true,
      message: "The user was updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const readFile = () => {
  try {
    const data = fs.readFileSync(path);

    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserMe,
  getUsersByRole,
  deleteUserMe,
  updateUserPassword,
  editUser,
};
