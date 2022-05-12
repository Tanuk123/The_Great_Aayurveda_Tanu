const categoryM = require('../model/category.model');

exports.Add = (request, response) => {

    let name = request.body.name;

    categoryM.create({ name: name }).then(result => {
        return response.status(500).json({ result: result, message: 'Added' });

    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Not Add' });
    })
}

exports.View = (request, response) => {

    categoryM.find().then(result => {
        return response.status(500).json({ result: result });

    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Not Find' });
    })
}

exports.ViewOne = (request, response) => {
    let a = request.body.id;
    categoryM.findOne({ _id: a }).then(result => {
        return response.status(500).json({ result: result });

    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Cannot Find' });
    })
}
exports.Delete = (request, response) => {
    let a = request.body.id;
    categoryM.deleteOne({ _id: a }).then(result => {
        return response.status(500).json({ result: result });

    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Cannot delete' });
    })
}

exports.Update = (request, response) => {
    let name = request.body.name;
    let id = request.body.id;
    categoryM.updateOne({ _id: id }, { $set: { name: name } }).then(result => {
        return response.status(500).json({ result: result });

    }).catch(err => {
        console.log(err);
        return response.status(500).json({ error: 'Not updated' });
    })
}