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

const urls = [
    'https://google.com/',
    'https://riafan.ru/',
    'https://kremlin.ru/'
]

class SiteAccessibilityInfo {
    constructor(url, success, statusCode, error) {
        this.url = url
        this.success = success
        this.statusCode = statusCode
        this.error = error
    }
}
let sitesInfo = new Map()
urls.forEach((value, index, array) => {
    let url = value
    sitesInfo.set(url, new SiteAccessibilityInfo(url))
})

function writeSitesInfoToHtml() {
    let str = ''
    sitesInfo.forEach((value, key, map) => {
        let info = value
        console.log(info)

        if (info.success === undefined) {
            str = str + info.url + ': no info<br>'
        } else if (info.success) {
            str = str + info.url + ': success, code: ' + info.statusCode + '<br>'
        } else {
            str = str + info.url + ': error: ' + info.error + '<br>'
        }
    })

    console.log('index.html:')
    console.log(str)

    fs.writeFile('public/index.html', str, function(err) {
        if (err) {
            console.log('write file error: ' + err)
        } else {
            console.log('write file success')
        }
    })
}

function checkSite(url) {
    https.get(url, function (res) {
        let str = url + ': success, code: ' + res.statusCode
        console.log(str)

        let info = sitesInfo.get(url)
        if (!info) {
            return
        }
        info.success = true
        info.statusCode = res.statusCode
        info.error = null

        writeSitesInfoToHtml()
    }).on('error', function(e) {
        let str = url + ': error: ' + e
        console.log(str)

        let info = sitesInfo.get(url)
        if (!info) {
            return
        }
        info.success = false
        info.statusCode = null
        info.error = e

        writeSitesInfoToHtml()
    })
}
