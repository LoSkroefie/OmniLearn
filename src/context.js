const jwt = require('jsonwebtoken');
const { pool } = require('./db/setup');

const createContext = async ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query(
        'SELECT id, username, email, points, role FROM users WHERE id = $1',
        [decoded.userId]
      );
      user = result.rows[0];
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  }

  return {
    user,
    db: {
      pool,
      query: (...args) => pool.query(...args),
    },
  };
};

module.exports = {
  createContext,
};
