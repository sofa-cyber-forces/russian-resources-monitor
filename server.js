const express = require('express')
const https = require('https');
const fs = require('fs')

const app = express()

const PORT = 80;

app.disable('x-powered-by')
app.use(express.json())

fs.writeFileSync('public/index.html', 'No information at the moment. Please update the page in a minute.<br><br>')

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log("listening on port " + PORT)

    checkSite('https://google.com/')
    checkSite('https://riafan.ru/')
    checkSite('https://kremlin.ru/')
})

function checkSite(url) {
    https.get(url, function (res) {
        let str = url + ': success, code: ' + res.statusCode
        console.log(str)

        fs.appendFile('public/index.html', str + '<br>', function (err) {
            //
        })
    }).on('error', function(e) {
        let str = url + ': error: ' + e
        console.log(str)

        fs.appendFile('public/index.html', str + '<br>', function (err) {
            //
        })
    });
}
