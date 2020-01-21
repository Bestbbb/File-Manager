const fs = require('fs');
const path = require('path');

var fileName = "a.html";

var sourceFile = path.join(__dirname, fileName);
var destPath = path.join(__dirname, "/dist", fileName);


var readStream = fs.createReadStream(sourceFile);
var writeStream = fs.createWriteStream(destPath);
readStream.pipe(writeStream);
console.log("移动完成")