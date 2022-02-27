const express = require('express')
const https = require('https');
const fs = require('fs')

const app = express()

const PORT = 80;

app.disable('x-powered-by')
app.use(express.json())

fs.writeFileSync('public/index.html', 'No information at the moment. Please update the page in a minute.')

app.use(express.static('public'));

const urls = [
    'https://google.com/',
    'https://riafan.ru/',
    'https://kremlin.ru/',
    'https://lenta.ru/',
    'https://www.nornickel.com/',
    'https://yandex.ua/',
    'https://ya.ru/',
    'https://tinkoff.ru/',
]

app.listen(PORT, () => {
    console.log("listening on port " + PORT)

    urls.forEach((value, index, array) => {
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
urls.forEach((value, index, array) => {
    let url = value
    sitesInfo.set(url, new SiteAccessibilityInfo(url))
})

function writeSitesInfoToHtml() {
    let str = '<h1>Russian sites availability dashboard</h1><table style="border: 1px solid black; border-collapse: collapse"><tbody>'

    sitesInfo.forEach((value, key, map) => {
        let info = value

        str += '<tr>'
        if (info.success == null) {
            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.url
            str += '</td">'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += 'No info'
            str += '</td>'
        } else if (info.success) {
            let color = ''
            if (info.statusCode >= 200 && info.statusCode <= 299) {
                color = 'green'
            } else {
                color = 'yellow'
            }

            str += '<td style="border: 1px solid black; border-collapse: collapse; background-color: ' + color + '">'
                str += info.url
                str += '</td>'

                str += '<td style="border: 1px solid black; border-collapse: collapse; background-color: ' + color + '">'
                str += 'Status code: '
                str += info.statusCode
                str += '</td>'

                str += '<td style="border: 1px solid black; border-collapse: collapse; background-color: ' + color + '">'
                str += 'Last update: '
                str += info.updateTime.toISOString()
                str += '</td>'
        } else {
            str += '<td style="border: 1px solid black; border-collapse: collapse; background-color: red">'
            str += info.url
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse; background-color: red">'
            str += 'Error: '
            str += info.error
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse; background-color: red">'
            str += 'Last update: '
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
