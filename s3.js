const knox = require("knox");
const fs = require("fs");
let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: "spicedling"
});
exports.upload = function(req, res, next) {
    console.log("INSIDE S3", req.file);
    const s3Request = client.put(req.file.filename, {
        "Content-Type": req.file.mimetype,
        "Content-Length": req.file.size,
        "x-amz-acl": "public-read"
    });
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    s3Request.on("response", s3Response => {
        if (s3Response.statusCode == 200) {
            fs.unlink(req.file.path, () => {});
            return next();
        } else {
            res.status(500).json({
                success: false
            });
        }
    });
};
