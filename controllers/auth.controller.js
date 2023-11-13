const fs = require("fs");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const path = "db/users.json";

const register = async (req, res) => {
  try {
    const {
      name,
      lastName,
      dateBirth,
      address,
      email,
      password,
      role,
      specialization,
    } = req.body;
    const data = readFile();
    let users = [];

    if (data.length > 0) {
      users = JSON.parse(data);
    }

    const salt = bcrypt.genSaltSync();
    let encriptedPassword;

    if (password) {
      encriptedPassword = bcrypt.hashSync(password, salt);
    }

    const newStudent = {
      name,
      lastName,
      dateBirth,
      address,
      email,
      role,
      password: encriptedPassword,
      specialization,
    };

    users.push(newStudent);

    fs.writeFileSync(path, JSON.stringify(users), { flag: "w" });

    delete newStudent.password;

    const token = await generateJWT(newStudent);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
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

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(403).json({
        ok: false,
        message: "The email or password is incorrect.",
      });
    }

    const token = await generateJWT({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });

    res.json({
      ok: true,
      token,
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
  register,
  login,
};
