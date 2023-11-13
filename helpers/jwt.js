require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateJWT = (user) => {
  const { name, lastName, email, address, role } = user;
  const payload = { name, lastName, email, address, role };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
      (err, token) => {
        if (err) {
          console.error(err);

          reject('There was not possible to sign the token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
