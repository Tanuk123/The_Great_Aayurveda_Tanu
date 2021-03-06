const medicineM = require('../model/medicine.model');
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
                firebaseStorageDownloadTokens: "medicine-image"
            }
        },
    });

    console.log(`${filename} uploaded to ${bucketName}.`);
}

exports.Add = (request, response) => {

    let name = request.body.name;
    let price = request.body.price;
    let description = request.body.description;
    let stock = request.body.stock;
    let image = 'https://firebasestorage.googleapis.com/v0/b/ayurveda-d6cac.appspot.com/o/' + request.file.filename + '?alt=media&token=medicine-image';
    let keyword = request.body.keyword;
    let category = request.body.category;

    medicineM.create({ name: name, price: price, description: description, stock: stock, image: image, keyword: keyword, category: category }).then(result => {
        uploadFile(
            path.join(__dirname, "../", "public/images/") + request.file.filename
        );
        return response.status(201).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Cannot Added' });
    });
}

exports.Review = async(request, response) => {
    console.log(request.body);
    let uId = request.body.uId;
    let pId = request.body.pId;
    let reviewText = request.body.reviewText;

    let review = await medicineM.findOne({ _id: pId });
    let reviewDetail = {
        _id: uId,
        reviewText: reviewText
    }
    review.reviewerDetail.push(reviewDetail);
    review.save().then(result => {
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Cannot Review' });
    });
}

exports.ViewAll = (request, response) => {
    medicineM.find().then(result => {
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Cannot Getting' });
    });
}

exports.ViewByProduct = (request, response) => {
    medicineM.findOne({ _id: request.body.id }).then(result => {
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Cannot Getting' });
    });
}

exports.ViewByCat = (request, response) => {
    medicineM.findOne({ category: request.body.catId }).then(result => {
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Cannot Getting' });
    });
}

exports.Delete = (request, response) => {
    medicineM.deleteOne({ _id: request.body.id }).then(result => {
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Cannot Getting' });
    });
}

exports.Update = (request, response) => {
    if (request.file) {
        let name = request.body.name;
        let price = request.body.price;
        let description = request.body.description;
        let stock = request.body.stock;
        let image = 'https://firebasestorage.googleapis.com/v0/b/ayurveda-d6cac.appspot.com/o/' + request.file.filename + '?alt=media&token=medicine-image';
        let keyword = request.body.keyword;
        let category = request.body.category;
        medicineM.updateOne({ _id: request.body.pId }, { $set: { name: name, price: price, description: description, stock: stock, image: image, keyword: keyword, catgory: category } }).then(result => {
            uploadFile(
                path.join(__dirname, "../", "public/images/") + request.file.filename
            );
            return response.status(200).json(result);
        }).catch(err => {
            console.log(err);
            return response.status(500).json({ error: 'Cannot Update' });
        });
    } else {
        let name = request.body.name;
        let price = request.body.price;
        let description = request.body.description;
        let stock = request.body.stock;
        let keyword = request.body.keyword;
        let category = request.body.category;
        medicineM.updateOne({ _id: request.body.pId }, { $set: { name: name, price: price, description: description, stock: stock, keyword: keyword, catgory: category } }).then(result => {
            return response.status(200).json(result);
        }).catch(err => {
            console.log(err);
            return response.status(500).json({ error: 'Cannot Update' });
        });
    }
}