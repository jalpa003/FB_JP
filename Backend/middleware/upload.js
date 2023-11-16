//create middleware.js to upload profile picture and resume pdfs

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'profilePicture') {
            cb(null, './public/uploads/images');
        } else if (file.fieldname === 'resume') {
            cb(null, './public/uploads/resumes');
        }
        // Handle errors
        if (!file.fieldname || !ext) {
            return cb(new Error('Invalid file type'));
        }
    },
    filename: function (req, file, cb) {
        let ext;
        switch (file.mimetype) {
            case "image/jpeg":
                ext = ".jpg";
                break;
            case "image/png":
                ext = ".png";
                break;
            default:
                ext = "";
                break;
        }
        cb(null, req.body.firstName + '-' + Date.now() + ext);
    }
});
module.exports = multer({ storage }).fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]);
