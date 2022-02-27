const express = require('express')
var https = require('https');

const app = express()

const PORT = 80;

app.disable('x-powered-by')
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send("hello world")
})

app.listen(PORT, () => {
    console.log("listening on port " + PORT)

    checkSite('https://google.com/')
    checkSite('https://riafan.ru/')
    checkSite('https://kremlin.ru/')
})

function checkSite(url) {
    https.get(url, function (res) {
        console.log(url + ': success, code: ' + res.statusCode)
    }).on('error', function(e) {
        console.log(url + ': error: ' + e)
    });
}
