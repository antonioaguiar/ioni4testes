var Express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate };

var app = Express();

app.use(bodyParser.json());
app.use(Express.static(__dirname + '/'));

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).array("imgUploader", 3); //Field name and max count
/*
var arquivosFotos = fs.readdir('./Images/', (err, files) => {
    files.forEach(file => {
        console.log(JSON.stringify(file));
    });
    return files;
});
*/

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/fotos", function (req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        fs.readdir('./Images/', (err, files) => {
            files.forEach(file => {
                console.log(JSON.stringify(file));
            });
            console.log("Arquivos carregados com sucesso!!.");
            return res.end(JSON.stringify(files));
        });
});

app.post("/api/Upload", function (req, res) {
    upload(req, res, function (err) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        if (err) {
            console.log(JSON.stringify(err));
            return res.end("Something went wrong!");
        }
        console.log("File uploaded sucessfully!.");
        return res.end("File uploaded sucessfully!.");
    });
});


var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8888, function (a) {
    console.log("Listening to port 8888");
});
httpsServer.listen(8443, function (a) {
    console.log("Listening to port 8443");
});

//app.listen(8888, function (a) {
//    console.log("Listening to port 8888");
//});




/*
fieldname: Field name specified in the form.
originalname: Name of the file on the user’s computer.
encoding: Encoding type of the file.
mimetype: Mime type of the file.
size: Size of the file in bytes.
destination: The folder to which the file has been saved.
filename: The name of the file in the destination.
path: The full path to the uploaded file.
buffer: A Buffer of the entire file.
*/