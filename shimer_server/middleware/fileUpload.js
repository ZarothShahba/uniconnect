import multer from "multer";

const upload = multer({
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === "picture") {
        cb(null, "public/assets/picture");
      } else if (file.fieldname === "video") {
        cb(null, "public/assets/videos");
      }
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    const allowedFileTypes = /jpeg|jpg|png|mp4/;
    const isAllowed = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (isAllowed) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, JPG, PNG, and MP4 files are allowed."
        )
      );
    }
  },
}).fields([
  { name: "picture", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

export default upload;
