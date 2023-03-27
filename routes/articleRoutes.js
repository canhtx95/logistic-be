const express = require("express");
const articleController = require("../controllers/articleController");
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadArticle } = require("../services/uploadImageService");

const router = express.Router();
const stack = router.stack;
// const last = stack[stack.length - 1];
// const callback = last.route.stack[last.route.stack.length - 1].handle;
console.log(stack)
// Xử lý yêu cầu tải lên ảnh CKEditor
router.post('/ckeditor_image', uploadArticle.single('upload'), articleController.handleCkeditor);
router.post('/upload-images', uploadArticle.any('upload'), articleController.uploadImages);
router.post("/find-title", articleController.findArticleByTitle);
router.get("/get-all", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.getArticles);
router.post("/add", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.addArticle);
router.post("/update", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.updateArticle);
router.post("/:link", articleController.getArticleByLink);
router.post("/", articleController.getArticleById);
router.post("/:id/admin", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.adminGetArticleById);
router.post("/:id/toggle-enable", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.toggleEnabledArticles);
router.delete("/:id", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.deleteArticleById);



module.exports = router;
