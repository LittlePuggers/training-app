const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const integers = '0123456789';
const exCharacters = '!@#$%^&*_-=+';

const createPassword = () => {
  const length = 8;
  const numbers = 564871;
  const symbols = '#&$';

  let chars = alpha;
  if (numbers) {
    chars += integers;
  }
  if (symbols) {
    chars += exCharacters;
  }

  return generatePassword(length, chars);
};

// this function formats our password to however you need
const generatePassword = (length, chars) => {
  let password = '';

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};

module.exports = {
  createPassword,
};
