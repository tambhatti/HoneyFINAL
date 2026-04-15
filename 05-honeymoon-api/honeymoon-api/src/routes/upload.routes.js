'use strict';
const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { uploadImage, uploadDocument, uploadBuffer, FOLDERS, deleteFile } = require('../services/upload.service');
const prisma = require('../config/prisma');
const { ok, fail, serverError } = require('../utils/response');

/* ── Helper: extract key from existing S3 URL ───────────────────────────────── */
function keyFromUrl(url) {
  if (!url) return null;
  // https://bucket.s3.region.amazonaws.com/folder/date/key.jpg → folder/date/key.jpg
  try { return new URL(url).pathname.replace(/^\//, ''); } catch { return null; }
}

/* ── Error handler for multer ───────────────────────────────────────────────── */
function handleMulterError(err, req, res, next) {
  if (err?.code === 'LIMIT_FILE_SIZE') return fail(res, 'File too large', 413);
  if (err?.message?.startsWith('File type')) return fail(res, err.message, 415);
  next(err);
}

/* ─────────────────────────────────────────────────────────────────────────────
   USER — avatar upload
   POST /api/v1/upload/user/avatar
─────────────────────────────────────────────────────────────────────────────*/
router.post('/user/avatar',
  authenticate, authorize('user'),
  uploadImage.single('avatar'),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) return fail(res, 'No file uploaded');
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      // Delete old avatar from S3
      if (user?.avatar) await deleteFile(keyFromUrl(user.avatar));

      const { url } = await uploadBuffer(req.file.buffer, req.file.mimetype, req.file.originalname, FOLDERS.userAvatars);
      await prisma.user.update({ where: { id: req.user.id }, data: { avatar: url } });
      return ok(res, { avatarUrl: url }, 'Avatar updated');
    } catch (e) { return serverError(res, e); }
  }
);

/* ─────────────────────────────────────────────────────────────────────────────
   VENDOR — avatar, banner, trade license
─────────────────────────────────────────────────────────────────────────────*/
router.post('/vendor/avatar',
  authenticate, authorize('vendor'),
  uploadImage.single('avatar'),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) return fail(res, 'No file uploaded');
      const vendor = await prisma.vendor.findUnique({ where: { id: req.user.id } });
      if (vendor?.avatar) await deleteFile(keyFromUrl(vendor.avatar));
      const { url } = await uploadBuffer(req.file.buffer, req.file.mimetype, req.file.originalname, FOLDERS.vendorAvatars);
      await prisma.vendor.update({ where: { id: req.user.id }, data: { avatar: url } });
      return ok(res, { avatarUrl: url }, 'Avatar updated');
    } catch (e) { return serverError(res, e); }
  }
);

router.post('/vendor/banner',
  authenticate, authorize('vendor'),
  uploadImage.single('banner'),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) return fail(res, 'No file uploaded');
      const vendor = await prisma.vendor.findUnique({ where: { id: req.user.id } });
      if (vendor?.banner) await deleteFile(keyFromUrl(vendor.banner));
      const { url } = await uploadBuffer(req.file.buffer, req.file.mimetype, req.file.originalname, FOLDERS.vendorBanners);
      await prisma.vendor.update({ where: { id: req.user.id }, data: { banner: url } });
      return ok(res, { bannerUrl: url }, 'Banner updated');
    } catch (e) { return serverError(res, e); }
  }
);

router.post('/vendor/trade-license',
  authenticate, authorize('vendor', 'admin'),
  uploadDocument.single('tradeLicense'),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) return fail(res, 'No file uploaded');
      const vendorId = req.user.role === 'admin' ? req.body.vendorId : req.user.id;
      if (!vendorId) return fail(res, 'vendorId required');
      const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
      if (!vendor) return res.status(404).json({ success:false, message:'Vendor not found' });
      if (vendor.tradeLicense) await deleteFile(keyFromUrl(vendor.tradeLicense));
      const { url } = await uploadBuffer(req.file.buffer, req.file.mimetype, req.file.originalname, FOLDERS.tradeLicenses);
      await prisma.vendor.update({ where: { id: vendorId }, data: { tradeLicense: url } });
      return ok(res, { tradeLicenseUrl: url }, 'Trade license uploaded');
    } catch (e) { return serverError(res, e); }
  }
);

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICE IMAGES — up to 10 images per service
─────────────────────────────────────────────────────────────────────────────*/
router.post('/vendor/service/:serviceId/images',
  authenticate, authorize('vendor'),
  uploadImage.array('images', 10),
  handleMulterError,
  async (req, res) => {
    try {
      const { serviceId } = req.params;
      if (!req.files?.length) return fail(res, 'No files uploaded');

      const service = await prisma.service.findFirst({
        where: { id: serviceId, vendorId: req.user.id }
      });
      if (!service) return res.status(404).json({ success:false, message:'Service not found' });
      if ((service.images?.length || 0) + req.files.length > 10)
        return fail(res, 'Maximum 10 images per service');

      const uploaded = await Promise.all(
        req.files.map(f => uploadBuffer(f.buffer, f.mimetype, f.originalname, FOLDERS.serviceImages))
      );
      const newUrls  = uploaded.map(u => u.url);
      const allImages = [...(service.images || []), ...newUrls];

      await prisma.service.update({ where: { id: serviceId }, data: { images: allImages } });
      return ok(res, { images: allImages, added: newUrls }, `${newUrls.length} image(s) uploaded`);
    } catch (e) { return serverError(res, e); }
  }
);

router.delete('/vendor/service/:serviceId/images',
  authenticate, authorize('vendor'),
  async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { imageUrl } = req.body;
      const service = await prisma.service.findFirst({ where: { id: serviceId, vendorId: req.user.id } });
      if (!service) return res.status(404).json({ success:false, message:'Service not found' });
      await deleteFile(keyFromUrl(imageUrl));
      const images = (service.images || []).filter(u => u !== imageUrl);
      await prisma.service.update({ where: { id: serviceId }, data: { images } });
      return ok(res, { images }, 'Image deleted');
    } catch (e) { return serverError(res, e); }
  }
);

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN — home content images
─────────────────────────────────────────────────────────────────────────────*/
router.post('/admin/content/:contentId/image',
  authenticate, authorize('admin'),
  uploadImage.single('image'),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) return fail(res, 'No file uploaded');
      const { url } = await uploadBuffer(req.file.buffer, req.file.mimetype, req.file.originalname, FOLDERS.homeContent);
      await prisma.homeContent.update({ where: { id: req.params.contentId }, data: { imageUrl: url } });
      return ok(res, { imageUrl: url }, 'Content image updated');
    } catch (e) { return serverError(res, e); }
  }
);

/* ─────────────────────────────────────────────────────────────────────────────
   PRESIGNED URL — for large files (direct browser → S3 upload)
─────────────────────────────────────────────────────────────────────────────*/
router.post('/presign',
  authenticate,
  async (req, res) => {
    try {
      const { folder, filename, mimetype } = req.body;
      if (!folder || !filename || !mimetype) return fail(res, 'folder, filename and mimetype required');
      const { getPresignedPutUrl } = require('../services/upload.service');
      const result = await getPresignedPutUrl(folder, filename, mimetype);
      return ok(res, result, 'Pre-signed URL generated');
    } catch (e) { return serverError(res, e); }
  }
);

module.exports = router;
