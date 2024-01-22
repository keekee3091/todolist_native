const mongoose = require('mongoose');

const picturesSchema = mongoose.Schema({
    photoUsedToken: [{ type: String, ref: 'users' }],
    photoTitle: String,
    photoDescription: String,
    photoPlace: String,
    photoDate: Date,
    photoLink: String,
});

const Picture = mongoose.model('pictures', picturesSchema);

module.exports = Picture;