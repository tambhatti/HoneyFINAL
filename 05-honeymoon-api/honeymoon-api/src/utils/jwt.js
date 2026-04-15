'use strict';
const jwt = require('jsonwebtoken');

/* B-05: access and refresh tokens use separate secrets */
const sign = (payload, expiresIn = process.env.JWT_EXPIRES_IN) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

const signRefresh = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);

const verifyRefresh = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

const tokenPair = (payload) => ({
  accessToken:  sign(payload),
  refreshToken: signRefresh(payload),
  expiresIn: process.env.JWT_EXPIRES_IN,
});

module.exports = { sign, signRefresh, verify, verifyRefresh, tokenPair };
