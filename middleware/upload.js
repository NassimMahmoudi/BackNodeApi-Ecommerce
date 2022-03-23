const multer = require("multer");
var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"../uploads");
  },
  filename :function(req, file, cb){
    cb(null,file.fieldname+ "_" + Date.now() + "_" + file.originalname);
  },
});
// the parameter is the name of input tag (in html view: <input type="file" name="file">) will store the single file in req.file
var upload = multer({
   storage: storage
   }).single("file");
module.exports = upload;