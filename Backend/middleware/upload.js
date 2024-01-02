const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        file.fieldname === "resume" ?
            cb(null, 'uploads/resumes') : cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

const fileUploadMiddleware = (fields) => {
    return upload.fields(fields);
};

module.exports = fileUploadMiddleware;