const adminM = require('../model/admin.model');
const path = require('path');
const doctor = require('../model/doctor.model')
const jwt = require('jsonwebtoken');

const { Storage } = require('@google-cloud/storage');
const { request } = require('http');
const { response } = require('express');
let bucketName = "gs://ayurveda-d6cac.appspot.com"

const storage = new Storage({
    keyFilename: "serviceFirebaseStorage.json"
});

const uploadFile = async(filename) => {

    await storage.bucket(bucketName).upload(filename, {
        gzip: true,
        metadata: {
            metadata: {
                firebaseStorageDownloadTokens: "saved-image"
            }
        },
    });

    console.log(`${filename} uploaded to ${bucketName}.`);
}

exports.SignUp = (request, response) => {

    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    let image = 'https://firebasestorage.googleapis.com/v0/b/ayurveda-d6cac.appspot.com/o/' + request.file.filename + '?alt=media&token=saved-image';
    let mobile = request.body.mobile;


    adminM.create({ name: name, email: email, password: password, image: image, mobile: mobile }).then(result => {
        uploadFile(
            path.join(__dirname, "../", "public/images/") + request.file.filename
        );
        return response.status(500).json(result);

    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: err, message: 'Cannot SignUp' });
    });
}

exports.SignIn = (request, response) => {

    let email = request.body.email;
    let password = request.body.password;

    adminM.findOne({ email: email, password: password }).then(result => {
        console.log(result);
        const payload = { subject: result._id };
        const token = jwt.sign(payload, 'ndajkfdskjvdsjfcadsfff');
        return response.status(500).json({
            result: result,
            token: token
        });
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: err, message: 'Please Enter Valid Email and Password' });
    });
}

exports.Update = (request, response) => {
    if (request.file) {
        console.log('inside if')
        let name = request.body.name;
        let email = request.body.email;
        let password = request.body.password;
        let image = 'https://firebasestorage.googleapis.com/v0/b/ayurveda-d6cac.appspot.com/o/' + request.file.filename + '?alt=media&token=saved-image';
        let mobile = request.body.mobile;

        adminM.updateOne({ _id: request.body.id }, { $set: { name: name, email: email, password: password, image: image, mobile: mobile } }).then(result => {
            uploadFile(
                path.join(__dirname, "../", "public/images/") + request.file.filename
            );
            return response.status(500).json(result);

        }).catch(err => {
            console.log(err);
            return response.status(500).json({ error: err, message: 'Cannot Update' });
        });
    } else {
        let name = request.body.name;
        let email = request.body.email;
        let password = request.body.password;
        let mobile = request.body.mobile;

        adminM.updateOne({ _id: request.body.id }, { $set: { name: name, email: email, password: password, mobile: mobile } }).then(result => {
            return response.status(200).json(result);

        }).catch(err => {
            console.log(err);
            return response.status(500).json({ error: err, message: 'Cannot Update' });
        });
    }
}

exports.isApproved = (request, response) => {
    doctor.updateOne({ _id: request.body.dId }, {
        $set: {
            isApproved: true
        }
    }).then(result => {
        console.log(result)
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err)
        return response.status(500).json({ error: err, message: 'Cannot Approved' });
    })
}