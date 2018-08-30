const express = require("express");
const app = express();
const fs = require("fs");
const db = require("./sql/db.js");
const bp = require("body-parser");
const s3 = require("./s3");
const config = require("./config");
app.use(express.static("./public"));

app.use(
    bp.urlencoded({
        extended: false
    })
);
/////////////Copied and pasted from notes/////////////////////////////////////////

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//////////////////////////////////////////////////////////////////////////////////////////

app.get("/images", (req, res) => {
    db.getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(error => {
            console.log("error:", error);
        });
});
app.get("/images/:image_id", (req, res) => {
    console.log(req.params.image_id);
    var imageID = req.params.image_id;
    db.getOneImage(imageID)
        .then(result => {
            console.log("First Result", result.rows);
            var ImageInfo = result.rows;
            db.selectComments(req.params.image_id).then(result => {
                //console.log("Second Results", result.rows);
                var totalInfo = ImageInfo.concat(result.rows);
                // console.log("All Results: ", totalInfo);
                res.json(totalInfo);
            });
            // console.log("Here are the results:", results.rows);
            // res.json = results.rows;

            // res.render("index");
        })
        .catch(err => {
            console.log("Error in extracting One Image:", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    db.writeFileTo(
        config.s3Url + req.file.filename,
        req.body.title,
        req.body.description,
        req.body.username
    )
        .then(({ rows }) => {
            res.json({
                image: rows[0]
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false
            });
        });
});

app.listen(8080, () => console.log(`I'm listening`));
