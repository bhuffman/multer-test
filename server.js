/* =================================================== */
/* ===== Section 1: Require all the dependencies ===== */
/* =================================================== */

const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")
const crypto = require("crypto")
const mime = require("mime")
const fs = require("fs")

const phash = require("sharp-phash")

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/")
  },
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(
        null,
        raw.toString("hex") + Date.now() + "." + mime.extension(file.mimetype)
      )
    })
  }
})
//   var upload = multer({ storage: storage });

const upload = multer({ storage: storage })
const hbs = require("hbs")
const logger = require("morgan")
var cors = require("cors")

// Define port for app to listen on
const port = process.env.PORT || 8080

/* ==================================================== */
/* ===== Section 2: Configure express middlewares ===== */
/* ==================================================== */

const app = express()
app.use(cors())
app.use(bodyParser()) // to use bodyParser (for text/number data transfer between clientg and server)
app.set("view engine", "hbs") // setting hbs as the view engine
app.use(express.static(__dirname + "/public")) // making ./public as the static directory
app.set("views", __dirname + "/views") // making ./views as the views directory
app.use(logger("dev")) // Creating a logger (using morgan)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/* ==================================== */
/* ===== Section 3: Making Routes ===== */
/* ==================================== */

// GET / route for serving index.html file
app.get("/", (req, res) => {
  console.log("index")
  res.render("index.hbs")
})

// POST /upload for file upload
/* ===== Make sure that file name matches the name attribute in your html ===== */
app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    console.log("Uploading file...", req.file.filename)
    const img1 = fs.readFileSync("./uploads/" + req.file.filename)
    phash(img1).then(e => {
      res.json({
        status: uploadStatus,
        filename: filename,
        phash: e
      })
    })
    var filename = req.file.filename
    var uploadStatus = "File Uploaded Successfully"
  } else {
    console.log("No File Uploaded")
    var filename = "FILE NOT UPLOADED"
    var uploadStatus = "File Upload Failed"
    res.json({
      status: uploadStatus,
      filename: filename
    })
  }

  /* ===== Add the function to save filename to database ===== */
})

// GET /temp to render temp.hbs, for dev purposes
app.get("/temp", (req, res) => {
  res.render("temp.hbs")
})
// GET /temp to render temp.hbs, for dev purposes
app.get("/upload", (req, res) => {
  res.render("temp.hbs")
})

// To make the server live
app.listen(port, () => {
  console.log(`App is live on port ${port}`)
})
