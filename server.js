const express = require('express')
const https = require('https');
const fs = require('fs')
const { networkInterfaces } = require('os')

const urls = require('./urls')
const categoryTranslations = require('./category-translations')

const app = express()

const PORT = 80;

app.disable('x-powered-by')
app.use(express.json())

fs.writeFileSync('public/index.html', 'No information at the moment. Please update the page in a minute.')

// Clear downloaded pages
if (fs.existsSync('public/downloaded_pages')) {
    fs.rmdirSync('public/downloaded_pages', { recursive: true })
}
fs.mkdirSync('public/downloaded_pages')

let requestsCount = 0
app.use((req, res, next) => {
    if (req.url == '/') {
        requestsCount++
        console.log('requests count: ' + requestsCount)
    }

    if (next) {
        next()
    }
})

app.use(express.static('public'))

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
urls.forEach((value, key, array) => {
    let category = key
    let categorySitesInfo = new Map()
    let urls = value
    urls.forEach((value, index, array) => {
        let url = value
        categorySitesInfo.set(url, new SiteAccessibilityInfo(url))
    })
    sitesInfo.set(category, categorySitesInfo)
})

let serverLocation = ''
app.listen(PORT, () => {
    console.log("listening on port " + PORT)

    let ip = getIp()
    if (ip == '31.172.67.184') {
        serverLocation = 'ru'
    } else if (ip == '107.152.43.221') {
        serverLocation = 'us'
    }

    urls.forEach((value, key, array) => {
        let category = key
        let urls = value
        urls.forEach((value, index, array) => {
            let url = value
            updateRegularly(category, url)
        })
    })
})

function updateRegularly(category, url) {
    const MINUTES = 2
    checkSite(category, url, () => {
        setTimeout(() => {
            updateRegularly(category, url)
        }, MINUTES * 60 * 1000)
    })
}

function generateHtmlPage() {
    let str = '<!doctype html><html lang=en><head>'
    str += '<meta charset=utf-8>'
    str += '<title>Russian/Belarusian websites availability</title>'
    str += '</head>'

    str += '<body>'

    str += '<table><tbody>'
    str += '<tr>'
    str += '<td>'
    if (serverLocation == 'ru' || serverLocation == '') {
        str += '<h2>Відслідковуйте доступність російських та білоруських сайтів з російської IP-адреси (31.172.67.184).</h2>'
        str += '<p>Щоб подивитись доступність цих ресурсів з американського IP, перейдіть за посиланням: <a href="http://107.152.43.221">http://107.152.43.221</a>.</p>'
    }
    if (serverLocation == 'us' || serverLocation == '') {
        str += '<h2>Відслідковуйте доступність російських та білоруських сайтів з американської IP-адреси (107.152.43.221).</h2>'
        str += '<p>Щоб подивитись доступність цих ресурсів з російського IP, перейдіть за посиланням: <a href="http://31.172.67.184">http://31.172.67.184</a>.</p>'
    }
    str += '<h4>Слава Україні!!! 🇺🇦</h4>'
    str += '</td>'
    str += '<td>'
    if (serverLocation == 'ru' || serverLocation == '') {
        str += '<h2>Отслеживайте доступность русских и белорусских сайтов с российского IP-адреса (31.172.67.184).</h2>'
        str += '<p>Чтобы посмотреть доступность этих ресурсов с американского IP, перейдите по ссылке: <a href="http://107.152.43.221">http://107.152.43.221</a>.</p>'
    }
    if (serverLocation == 'us' || serverLocation == '') {
        str += '<h2>Отслеживайте доступность русских и белорусских сайтов с американского IP-адреса (107.152.43.221).</h2>'
        str += '<p>Чтобы посмотреть доступность этих ресурсов с российского IP, перейдите по ссылке: <a href="http://31.172.67.184">http://31.172.67.184</a>.</p>'
    }
    str += '<h4>Слава Украине!!! 🇺🇦</h4>'
    str += '</td>'
    str += '<td>'
    if (serverLocation == 'ru' || serverLocation == '') {
        str += '<h2>Monitor availability of Russian and Belarusian websites from Russian IP-address (31.172.67.184).</h2>'
        str += '<p>To monitor availability of these resources from American IP, follow the link: <a href="http://107.152.43.221">http://107.152.43.221</a>.</p>'
    }
    if (serverLocation == 'us' || serverLocation == '') {
        str += '<h2>Monitor availability of Russian and Belarusian websites from American IP-address (107.152.43.221).</h2>'
        str += '<p>To monitor availability of these resources from Russian IP, follow the link: <a href="http://31.172.67.184">http://31.172.67.184</a>.</p>'
    }
    str += '<h4>Glory to Ukraine!!! 🇺🇦</h4>'
    str += '</td>'
    str += '</tr>'
    str += '<tr>'
    str += '<td>'
    str += '<h4>Категорії:</h4>'
    str += '<ul>'
    sitesInfo.forEach((value, key, map) => {
        let category = key
        str += '<li><a href="#' + category + '">' + category + '</a></li>'
    })
    str += '</ul>'
    str += '</td>'
    str += '<td>'
    str += '<h4>Категории:</h4>'
    sitesInfo.forEach((value, key, map) => {
        let category = key
        let translation = categoryTranslations.ru.get(category)
        str += '<li><a href="#' + category + '">' + translation + '</a></li>'
    })
    str += '</td>'
    str += '<td>'
    str += '<h4>Categories:</h4>'
    sitesInfo.forEach((value, key, map) => {
        let category = key
        let translation = categoryTranslations.en.get(category)
        str += '<li><a href="#' + category + '">' + translation + '</a></li>'
    })
    str += '</td>'
    str += '</tr>'
    str += '</tbody></table>'

    sitesInfo.forEach((value, key, map) => {
        let category = key
        let categorySitesInfo = value
        str += generateCategoryHtml(category, categorySitesInfo)
    })

    str += '<p>Source code: <a href="https://github.com/sofa-cyber-forces/russian-resources-monitor">https://github.com/sofa-cyber-forces/russian-resources-monitor</a></p>'
    str += '<p>E-mail all your questions and proposals to sofa.cyber.forces@gmail.com</p>'

    str += '</body></html>'

    fs.writeFile('public/index.html', str, function(err) {
        if (err) {
            console.log('write file error: ' + err)
        }
    })
}
function generateCategoryHtml(category, categorySitesInfo) {
    let sitesInfoArr = Array.from(categorySitesInfo.values());
    sitesInfoArr = sitesInfoArr.sort((a, b) => {
        if (a.success != null && b.success == null) {
            return -1
        }
        if (a.success == null && b.success != null) {
            return 1
        }
        if (a.success && !b.success) {
            return -1
        }
        if (!a.success && b.success) {
            return 1
        }
        if (a.success && b.success) {
            let status2xxA = a.statusCode >= 200 && a.statusCode <= 299
            let status2xxB = b.statusCode >= 200 && b.statusCode <= 299
            if (status2xxA && !status2xxB) {
                return -1
            }
            if (!status2xxA && status2xxB) {
                return 1
            }
        }
        if (!a.success && !b.success) {
            if (a.error < b.error) {
                return -1
            }
            if (a.error > b.error) {
                return 1
            }
        }
        if (a.statusCode < b.statusCode) {
            return -1
        }
        if (a.statusCode > b.statusCode) {
            return 1
        }
        if (a.url < b.url) {
            return -1
        }
        if (a.url > b.url) {
            return 1
        }
        return 0
    })

    let categoryTranslationRu = categoryTranslations.ru.get(category)
    let categoryTranslationEn = categoryTranslations.en.get(category)
    let categoryStr = category + ' / ' + categoryTranslationRu + ' / ' + categoryTranslationEn
    let str = '<h2 id="' + category + '">' + categoryStr + '</h2>'

    str += '<table style="border: 1px solid black; border-collapse: collapse"><tbody>'

    str += '<tr>'
    str += '<th style="border: 1px solid black; border-collapse: collapse">'
    str += '</th>'
    str += '<th style="border: 1px solid black; border-collapse: collapse; word-wrap: break-word; max-width: 300px">'
    str += 'URL'
    str += '</th>'
    str += '<th style="border: 1px solid black; border-collapse: collapse; word-wrap: break-word; max-width: 200px">'
    str += 'Status code/Error'
    str += '</th>'
    str += '<th style="border: 1px solid black; border-collapse: collapse">'
    str += 'Server response'
    str += '</th>'
    str += '<th style="border: 1px solid black; border-collapse: collapse">'
    str += 'Last update'
    str += '</th>'
    str += '</tr>'

    sitesInfoArr.forEach((value, index, array) => {
        let info = value

        str += '<tr>'
        if (info.success == null) {
            str += '<td>'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse; word-wrap: break-word; max-width: 300px">'
            str += '<a href="' + info.url + '">' + info.url + '</a>'
            str += '</td">'
        } else if (info.success) {
            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            if (info.statusCode >= 200 && info.statusCode <= 299) {
                str += '<img src="success.png" width="20" height="20">'
            } else {
                str += '<img src="warning.png" width="20" height="20">'
            }
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse; word-wrap: break-word; max-width: 300px">'
            str += '<a href="' + info.url + '">' + info.url + '</a>'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse; word-wrap: break-word; max-width: 200px">'
            str += info.statusCode
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += '<a href="downloaded_pages/' + convertUrlToFileName(info.url) + '">Show</a>'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.updateTime.toGMTString()
            str += '</td>'
        } else {
            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += '<img src="failure.png" width="20" height="20">'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse; word-wrap: break-word; max-width: 300px">'
            str += '<a href="' + info.url + '">' + info.url + '</a>'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse; word-wrap: break-word; max-width: 200px">'
            str += info.error
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.updateTime.toGMTString()
            str += '</td>'
        }
        str += '</tr>'
    })

    str += '</tbody></table>'

    return str
}

function checkSite(category, url, cb) {
    console.log('checking ' + url)
    https.get(url, function (res) {
        let str = url + ': success, code: ' + res.statusCode
        console.log(str)

        let fileName = convertUrlToFileName(url)
        let filePath = 'public/downloaded_pages/' + fileName
        const file = fs.createWriteStream(filePath)
        res.pipe(file)

        let categoryInfo = sitesInfo.get(category)
        if (!categoryInfo) {
            cb()
            return
        }
        let siteInfo = categoryInfo.get(url)
        if (!siteInfo) {
            cb()
            return
        }
        siteInfo.success = true
        siteInfo.statusCode = res.statusCode
        siteInfo.error = null
        siteInfo.updateTime = new Date()

        generateHtmlPage()

        cb()
    }).on('error', function(e) {
        let str = url + ': error: ' + e
        console.log(str)

        let fileName = convertUrlToFileName(url)
        let filePath = 'public/downloaded_pages/' + fileName
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath)
        }
        
        let categoryInfo = sitesInfo.get(category)
        if (!categoryInfo) {
            cb()
            return
        }
        let siteInfo = categoryInfo.get(url)
        if (!siteInfo) {
            cb()
            return
        }
        siteInfo.success = false
        siteInfo.statusCode = null
        siteInfo.error = e
        siteInfo.updateTime = new Date()

        generateHtmlPage()

        cb()
    })
}


function convertUrlToFileName(url) {
    let fileName = url
    fileName = replaceAll(fileName, ':', '')
    fileName = replaceAll(fileName, '.', '')
    fileName = replaceAll(fileName, '/', '')
    fileName += '.html'
    return fileName
}
// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function replaceAll(str, match, replacement){
    return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
}

function getIp() {
    const nets = networkInterfaces()
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family == 'IPv4' && !net.internal) {
                return net.address
            }
        }
    }
    return null
}
