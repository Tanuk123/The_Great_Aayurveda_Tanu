const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uploadImageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model("medicineimages", uploadImageSchema);