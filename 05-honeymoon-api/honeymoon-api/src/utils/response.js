'use strict';

/* ── Standardised response helpers ─────────────────────────────────────── */
const ok = (res, data = {}, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, message, ...data });

const created = (res, data = {}, message = 'Created successfully') =>
  ok(res, data, message, 201);

const fail = (res, message = 'Bad request', status = 400, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
};

const notFound = (res, message = 'Resource not found') =>
  fail(res, message, 404);

const serverError = (res, err, message = 'Internal server error') => {
  console.error('[API Error]', err?.message || err);
  return fail(res, message, 500);
};

/* ── Global error handler (add last in Express chain) ───────────────────── */
const errorHandler = (err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

/* ── 404 catcher ────────────────────────────────────────────────────────── */
const notFoundHandler = (req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });

module.exports = { ok, created, fail, notFound, serverError, errorHandler, notFoundHandler };
