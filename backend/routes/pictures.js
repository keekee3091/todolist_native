const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');
const User = require('../models/users');

var express = require('express');
var router = express.Router();


router.post('/updateProfileImage', async (req, res) => {
    const photoPath = `./tmp/${uniqid()}.jpg`;

    try {
        await req.files.image.mv(photoPath);

        const { token } = req.body;

        const user = await User.findOne({ token });

        if (user) {
            // Check if the user has a custom profile picture, and delete it from Cloudinary
            if (user.link && user.link !== defaultAvatar) {
                const publicId = user.link.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            const resultCloudinary = await cloudinary.uploader.upload(photoPath, { folder: 'profile' });

            fs.unlinkSync(photoPath);

            await User.updateOne({ token }, { link: resultCloudinary.secure_url });

            res.json({ result: true, message: 'Profile picture is updated!' });
        } else {
            res.json({ result: false, error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.json({ result: false, error: 'Upload to Cloudinary failed' });
    }
});


module.exports = router;
