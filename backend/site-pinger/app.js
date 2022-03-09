const express = require("express");
const https = require('https');
const fs = require('fs')
const app = express();
const jsonParser = express.json();
  
app.use(express.static(__dirname + "/public"));

function convertUrlToFileName(url) {
    let fileName = url
    fileName = replaceAll(fileName, ':', '')
    fileName = replaceAll(fileName, '.', '')
    fileName = replaceAll(fileName, '/', '')
    fileName = replaceAll(fileName, '?', '')
    fileName = replaceAll(fileName, '&', '')
    fileName = replaceAll(fileName, '=', '')
    fileName += '.html'
    return fileName
}

function replaceAll(str, match, replacement){
    return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function checkSite(url) {
    let siteStatus=new Object();
    console.log('checking ' + url)
    let startTime = new Date()
    https.get(url, function (res) {
        let endTime = new Date()
        let duration = endTime - startTime

        let str = url + ': success, code: ' + res.statusCode
        console.log(str)

        let fileName = convertUrlToFileName(url)
        let filePath = 'downloaded_pages/' + fileName
        const file = fs.createWriteStream(filePath)
        res.pipe(file)

        siteStatus.success = true
        siteStatus.statusCode = res.statusCode
        siteStatus.error = null
        siteStatus.duration = duration
        siteStatus.size = null
        siteStatus.updateTime = new Date()

        file.on('close', () => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.log('getting file stats error: ' + err)
                    return
                }

                siteStatus.size = stats.size
            })
        })
    }).on('error', function(e) {
        let endTime = new Date()
        let duration = endTime - startTime

        let str = url + ': error: ' + e
        console.log(str)

        let fileName = convertUrlToFileName(url)
        let filePath = 'downloaded_pages/' + fileName
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath)
        }

        siteStatus.success = false
        siteStatus.statusCode = null
        siteStatus.error = e
        siteStatus.duration = duration
        siteStatus.size = null
        siteStatus.updateTime = new Date()
    })
    return siteStatus;
}

app.get("/api/ping/:url", function(req, res){    
    const url = decodeURIComponent(req.params.url); // retreive url
    let site = checkSite(url);
    // отправляем пользователя
    if(site){
        res.send(site);
    }
    else{
        res.status(404).send();
    }
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});