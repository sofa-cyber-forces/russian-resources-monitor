const express = require('express')
const https = require('https');
const fs = require('fs')

const app = express()

const PORT = 80;

app.disable('x-powered-by')
app.use(express.json())

fs.writeFileSync('public/index.html', 'No information at the moment. Please update the page in a minute.')

app.use(express.static('public'));

const URLS = [
    'https://google.com/',
    'https://riafan.ru/',
    'https://kremlin.ru/',
    'https://lenta.ru/',
    'https://www.nornickel.com/',
    'https://yandex.ua/',
    'https://ya.ru/',
    'https://tinkoff.ru/',
]
class SiteAccessibilityInfo {
    constructor(url) {
        this.url = url
        
        this.success = null
        this.statusCode = null
        this.error = null
        this.updateTime = null
    }
}
let sitesInfo = new Map()
URLS.forEach((value, index, array) => {
    let url = value
    sitesInfo.set(url, new SiteAccessibilityInfo(url))
})

app.listen(PORT, () => {
    console.log("listening on port " + PORT)

    URLS.forEach((value, index, array) => {
        let url = value
        updateRegularly(url)
    })
})

function updateRegularly(url) {
    const MINUTES = 2
    checkSite(url, () => {
        setTimeout(() => {
            updateRegularly(url)
        }, MINUTES * 60 * 1000)
    })
}

function writeSitesInfoToHtml() {
    let str = '<h1>Russian sites availability dashboard</h1>'
    
    str += '<table style="border: 1px solid black; border-collapse: collapse"><tbody>'

    str += '<tr>'
    str += '<th style="border: 1px solid black; border-collapse: collapse">'
    str += '</th>'
    str += '<th style="border: 1px solid black; border-collapse: collapse">'
    str += 'URL'
    str += '</th>'
    str += '<th style="border: 1px solid black; border-collapse: collapse">'
    str += 'Status code/Error'
    str += '</th>'
    str += '<th style="border: 1px solid black; border-collapse: collapse">'
    str += 'Last update'
    str += '</th>'
    str += '</tr>'

    sitesInfo.forEach((value, key, map) => {
        let info = value

        str += '<tr>'
        if (info.success == null) {
            str += '<td>'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.url
            str += '</td">'
        } else if (info.success) {
            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            if (info.statusCode >= 200 && info.statusCode <= 299) {
                str += '<img src="success.png" width="20" height="20">'
            } else {
                str += '<img src="warning.png" width="20" height="20">'
            }
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.url
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.statusCode
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.updateTime.toISOString()
            str += '</td>'
        } else {
            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += '<img src="failure.png" width="20" height="20">'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.url
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.error
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.updateTime.toISOString()
            str += '</td>'
        }
        str += '</tr>'
    })

    str += '</tbody></table>'

    fs.writeFile('public/index.html', str, function(err) {
        if (err) {
            console.log('write file error: ' + err)
        }
    })
}

function checkSite(url, cb) {
    console.log('checking ' + url)
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
        info.updateTime = new Date()

        writeSitesInfoToHtml()

        cb()
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
        info.updateTime = new Date()

        writeSitesInfoToHtml()

        cb()
    })
}
