const express = require('express')
const https = require('https');
const fs = require('fs')
const { networkInterfaces } = require('os')
const request = require('request')

const AccessibilityInfo = require('./accessibility-info')
const urls = require('./urls')
const notes = require('./notes')
const categoryTranslations = require('./category-translations')

const app = express()

const PORT = 80

app.disable('x-powered-by')
app.use(express.json())

let sitesInfo = new AccessibilityInfo(urls)

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
function writeRequestsCount() {
    console.log('write requests count to file')
    let str = new Date().toGMTString() + ': ' + requestsCount + ' requests\n'
    fs.appendFile('./requests_count', str, err => {
    if (err) {
            console.log('requests count file writing error: ' + err)
        }
    })
}
writeRequestsCount()
setInterval(writeRequestsCount, 60 * 1000)

app.use(express.static('public'))
app.get('/data', (req, res) => {
    res.status(200).send(sitesInfo)
})

printSortedUrls()

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
    str += '<link href="main.css" rel="stylesheet">'
    str += '</head>'

    str += '<body>'

    str += '<div class="centeredBlock">'

    if (serverLocation == 'ru' || serverLocation == '') {
        str += '<h2 class="violet">Відслідковуйте доступність російських та білоруських сайтів з російської IP-адреси.</h2>'
        str += '<p class="violet">Щоб подивитись доступність цих ресурсів з американського IP, перейдіть за посиланням: <a href="http://runet-status-usa.v6.army">http://runet-status-usa.v6.army</a>.</p>'
    }
    if (serverLocation == 'us' || serverLocation == '') {
        str += '<h2 class="violet">Відслідковуйте доступність російських та білоруських сайтів з американської IP-адреси.</h2>'
        str += '<p class="violet">Щоб подивитись доступність цих ресурсів з російського IP, перейдіть за посиланням: <a href="http://runet-status-rus.v6.army">http://runet-status-rus.v6.army</a>.</p>'
    }
    str += '<h4 class="violet">Слава Україні!!! 🇺🇦</h4>'
    if (serverLocation == 'ru' || serverLocation == '') {
        str += '<h2 class="violet">Отслеживайте доступность русских и белорусских сайтов с российского IP-адреса.</h2>'
        str += '<p class="violet">Чтобы посмотреть доступность этих ресурсов с американского IP, перейдите по ссылке: <a href="http://runet-status-usa.v6.army">http://runet-status-usa.v6.army</a>.</p>'
    }
    if (serverLocation == 'us' || serverLocation == '') {
        str += '<h2 class="violet">Отслеживайте доступность русских и белорусских сайтов с американского IP-адреса.</h2>'
        str += '<p class="violet">Чтобы посмотреть доступность этих ресурсов с российского IP, перейдите по ссылке: <a href="http://runet-status-rus.v6.army">http://runet-status-rus.v6.army</a>.</p>'
    }
    str += '<h4 class="violet">Слава Украине!!! 🇺🇦</h4>'
    if (serverLocation == 'ru' || serverLocation == '') {
        str += '<h2 class="violet">Monitor availability of Russian and Belarusian websites from Russian IP-address.</h2>'
        str += '<p class="violet">To monitor availability of these resources from American IP, follow the link: <a href="http://runet-status-usa.v6.army">http://runet-status-usa.v6.army</a>.</p>'
    }
    if (serverLocation == 'us' || serverLocation == '') {
        str += '<h2 class="violet">Monitor availability of Russian and Belarusian websites from American IP-address.</h2>'
        str += '<p class="violet">To monitor availability of these resources from Russian IP, follow the link: <a href="http://runet-status-rus.v6.army">http://runet-status-rus.v6.army</a>.</p>'
    }
    str += '<h4 class="violet">Glory to Ukraine!!! 🇺🇦</h4>'
    
    str += '<table><tbody>'
    str += '<tr>'
    str += '<td>'
    str += '<h4 class="violet">Категорії:</h4>'
    str += '<ul class="violet">'
    sitesInfo.categories.forEach((value, index, array) => {
        let categoryInfo = value
        let categoryName = categoryInfo.categoryName
        str += '<li><a href="#' + categoryName + '" class="violet">' + categoryName + '</a></li>'
    })
    str += '</ul>'
    str += '</td>'
    str += '<td>'
    str += '<h4 class="violet">Категории:</h4>'
    str += '<ul class="violet">'
    sitesInfo.categories.forEach((value, index, array) => {
        let categoryInfo = value
        let categoryName = categoryInfo.categoryName
        let translation = categoryTranslations.ru.get(categoryName)
        str += '<li><a href="#' + categoryName + '" class="violet">' + translation + '</a></li>'
    })
    str += '</ul>'
    str += '</td>'
    str += '<td>'
    str += '<h4 class="violet">Categories:</h4>'
    str += '<ul class="violet">'
    sitesInfo.categories.forEach((value, index, array) => {
        let categoryInfo = value
        let categoryName = categoryInfo.categoryName
        let translation = categoryTranslations.en.get(categoryName)
        str += '<li><a href="#' + categoryName + '" class="violet">' + translation + '</a></li>'
    })
    str += '</ul>'
    str += '</td>'
    str += '</tr>'
    str += '</tbody></table>'

    str += '</div>'

    sitesInfo.categories.forEach((value, index, array) => {
        let categoryInfo = value
        str += generateCategoryHtml(categoryInfo)
    })

    str += '<div class="centeredBlock">'
    str += '<p class="violet">Source code: <a href="https://github.com/sofa-cyber-forces/russian-resources-monitor" class="violet">https://github.com/sofa-cyber-forces/russian-resources-monitor</a></p>'
    str += '<p class="violet">E-mail all your questions and proposals to sofa.cyber.forces@gmail.com</p>'
    str += '</div>'

    str += '</body></html>'

    fs.writeFile('public/index.html', str, function(err) {
        if (err) {
            console.log('write file error: ' + err)
        }
    })
}
function generateCategoryHtml(categoryInfo) {
    let sortedSitesInfo = categoryInfo.sites.slice()
    sortedSitesInfo = sortedSitesInfo.sort((a, b) => {
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
        if (a.duration != null && b.duration != null) {
            if (a.duration < b.duration) {
                return -1
            }
            if (a.duration > b.duration) {
                return 1
            }
        }
        if (a.url < b.url) {
            return -1
        }
        if (a.url > b.url) {
            return 1
        }
        return 0
    })

    let str = '<div class="infoPanel centeredBlock">'

    let categoryName = categoryInfo.categoryName
    let categoryNameRu = categoryTranslations.ru.get(categoryName)
    let categoryNameEn = categoryTranslations.en.get(categoryName)
    let categoryNameStr = categoryName + ' / ' + categoryNameRu + ' / ' + categoryNameEn
    str += '<h2 id="' + categoryName + '" class="tableHeader violet">' + categoryNameStr + '</h2>'

    str += generateTable(sortedSitesInfo)
    
    str += '</div>'

    return str
}
function generateTable(sitesInfoArr) {
    let str = '<table class="tableMain"><tbody>'

    str += '<tr>'
    str += '<th class="headerCellStyle violet">'
    str += '</th>'
    str += '<th class="urlCellStyle headerCellStyle violet">'
    str += 'URL'
    str += '</th>'
    str += '<th class="statusCellStyle headerCellStyle violet">'
    str += 'Status code/Error'
    str += '</th>'
    str += '<th class="headerCellStyle violet">'
    str += 'Duration (ms)'
    str += '</th>'
    str += '<th class="headerCellStyle violet">'
    str += 'Server response'
    str += '</th>'
    str += '<th class="headerCellStyle violet">'
    str += 'Last update'
    str += '</th>'
    str += '</tr>'

    sitesInfoArr.forEach((value, index, array) => {
        let thickBottomBorder = false
        if (index < array.length - 1) {
            let nextVal = array[index + 1]
            if (value.success != nextVal.success) {
                thickBottomBorder = true
            } else if (value.success && nextVal.success) {
                let status2xxA = value.statusCode >= 200 && value.statusCode <= 299
                let status2xxB = nextVal.statusCode >= 200 && nextVal.statusCode <= 299
                if (status2xxA != status2xxB) {
                    thickBottomBorder = true
                }
            }
        } else {
            thickBottomBorder = true
        }

        let info = value
        
        if (thickBottomBorder) {
            str += '<tr class="separatorRowStyle">'
        } else {
            str += '<tr class="rowStyle">'
        }
        if (info.success == null) {
            str += '<td class="cellStyle violet">'
            str += '</td>'

            str += '<td class="urlCellStyle cellStyle violet">'
            str += '<a href="' + info.url + '" class="violet">' + info.url + '</a>'
            if (notes.has(info.url)) {
                str += ' (' + notes.get(info.url) + ')'
            }
            str += '</td">'

            str += '<td colspan="4" class="violet">'
            str += 'Please refresh the page later to get info about this URL'
            str += '</td>'
        } else if (info.success) {
            str += '<td class="cellStyle violet">'
            if (info.statusCode >= 200 && info.statusCode <= 299) {
                str += '<img src="success.png" width="20" heigth="20">'
            } else {
                str += '<img src="warning.png" width="20" heigth="20">'
            }
            str += '</td>'

            str += '<td class="urlCellStyle cellStyle violet">'
            str += '<a href="' + info.url + '" class="violet">' + info.url + '</a>'
            if (notes.has(info.url)) {
                str += ' (' + notes.get(info.url) + ')'
            }
            str += '</td>'

            str += '<td class="statusCellStyle cellStyle violet">'
            str += info.statusCode
            str += '</td>'

            str += '<td class="cellStyle violet">'
            if (info.duration != null) {
                str += numberWithSpacesGrouping(info.duration)
            }
            str += '</td>'

            str += '<td class="cellStyle violet">'
            str += '<a href="downloaded_pages/' + convertUrlToFileName(info.url) + '" class="violet">Show'
            if (info.size != null) {
                str += ' (' + formatFileSize(info.size) + ')'
            }
            str +='</a>'
            str += '</td>'

            str += '<td class="cellStyle violet">'
            str += info.updateTime.toGMTString()
            str += '</td>'
        } else {
            str += '<td class="cellStyle violet">'
            str += '<img src="failure.png" width="20" heigth="20">'
            str += '</td>'

            str += '<td class="urlCellStyle cellStyle violet">'
            str += '<a href="' + info.url + '" class="violet">' + info.url + '</a>'
            if (notes.has(info.url)) {
                str += ' (' + notes.get(info.url) + ')'
            }
            str += '</td>'

            str += '<td class="statusCellStyle cellStyle violet">'
            str += info.error
            str += '</td>'

            str += '<td class="cellStyle violet">'
            if (info.duration != null) {
                str += numberWithSpacesGrouping(info.duration)
            }
            str += '</td>'

            str += '<td class="cellStyle violet">'
            str += '</td>'

            str += '<td class="cellStyle violet">'
            str += info.updateTime.toGMTString()
            str += '</td>'
        }
        str += '</tr>'
    })

    str += '</tbody></table>'

    return str
}

function checkSite(category, url, cb) {
    request.get(url, {
        time: true,
        rejectUnauthorized: false,
        strictSSL: false
    }, (err, response, body) => {
        let success = !err
        let status = response ? response.statusCode : null
        let errMessage = err ? err.message : null
        let duration = response && response.timingPhases && response.timingPhases.firstByte ? response.timingPhases.firstByte : null
        if (duration != null) {
            duration = Math.round(duration)
        }
        let size = body ? body.length : null

        let siteInfo = sitesInfo.getSiteInfo(category, url)
        if (!siteInfo) {
            cb()
            return
        }
        siteInfo.success = success
        siteInfo.statusCode = status
        siteInfo.error = errMessage
        siteInfo.duration = duration
        siteInfo.size = size
        siteInfo.updateTime = new Date()
        console.log(siteInfo)

        if (body) {
            let fileName = convertUrlToFileName(url)
            let filePath = 'public/downloaded_pages/' + fileName
            fs.writeFile(filePath, body, err => {
                if (err) {
                    console.log('response file writing error: ' + err)
                }
            })
        }

        generateHtmlPage()
        cb()
    })
}

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

// Printing of sorted URLs allows to easily find duplicated URLs
function printSortedUrls() {
    let urlStrs = new Array()
    urls.forEach((value, key, array) => {
        let urls = value
        urls.forEach((value, index, array) => {
            let url = value
            url = url.replace('www.', '')
            urlStrs.push(url)
        })
    })
    urlStrs = urlStrs.sort()
    console.log('sorted urls (www. removed):')
    urlStrs.forEach((value, index, array) => {
        if (index > 0) {
            let previousVal = array[index - 1]
            if (previousVal.substring(0, 10) != value.substring(0, 10)) {
                console.log('')
            }
        }
        console.log(value)
    })
    console.log('')
}

// Source: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithSpacesGrouping(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatFileSize(nBytes) {
    if (nBytes > 1024 * 1024) {
        let nMBytes = nBytes / 1024 / 1024
        nMBytes = Math.round(nMBytes * 10) / 10
        return nMBytes + ' MB'
    } else if (nBytes > 1024) {
        let nKBytes = nBytes / 1024
        nKBytes = Math.round(nKBytes * 10) / 10
        return nKBytes + ' KB'
    } else {
        return nBytes + ' bytes'
    }
}
