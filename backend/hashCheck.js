const crypto = require('crypto');

const password = 'password123';
const hashedPassword = crypto
  .createHash('sha256')
  .update(password)
  .digest('hex')
  .slice(0, 32);

console.log('Computed Hash:', hashedPassword);
