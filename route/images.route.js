const express = require('express');
const imageRouter = express.Router();
const imageController = require('../controller/images.controller');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'public/images',
    filename: (request, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage: storage });
imageRouter.post('/uploadImage', upload.single('image'), imageController.uploadImage);
imageRouter.post('/yogaImageUpload', upload.single('image'), imageController.yogaImageUpload);
module.exports = imageRouter;