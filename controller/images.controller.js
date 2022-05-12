const ImageM = require('../model/image.model');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

let bucketName = "gs://ayurveda-d6cac.appspot.com"

const storage = new Storage({
    keyFilename: "serviceFirebaseStorage.json"
});
const uploadFile = async(filename) => {

    await storage.bucket(bucketName).upload(filename, {
        gzip: true,
        metadata: {
            metadata: {
                firebaseStorageDownloadTokens: "image"
            }
        },
    });

    console.log(`${filename} uploaded to ${bucketName}.`);
}
exports.uploadImage = (request, response) => {
    let image = 'https://firebasestorage.googleapis.com/v0/b/ayurveda-d6cac.appspot.com/o/' + request.file.filename + '?alt=media&token=image'
    ImageM.create({ image: image }).then(result => {
        console.log(result);
        uploadFile(
            path.join(__dirname, "../", "public/images/") + request.file.filename
        );
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ message: "error" })
    })
}

exports.yogaImageUpload = (request, response) => {
    let image = 'https://firebasestorage.googleapis.com/v0/b/ayurveda-d6cac.appspot.com/o/' + request.file.filename + '?alt=media&token=image'
    ImageM.create({ image: image }).then(result => {
        console.log(result);
        uploadFile(
            path.join(__dirname, "../", "public/images/") + request.file.filename
        );
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ message: "error" })
    })
}