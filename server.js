const express = require('express')
const https = require('https');
const fs = require('fs')

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

app.use(express.static('public'));

const URLS = [
    // Russian resources
    'https://www.gazprom.ru/',
    'https://lukoil.ru',
    'https://magnit.ru/',
    'https://www.nornickel.com/',
    'https://www.surgutneftegas.ru/',
    'https://www.tatneft.ru/',
    'https://www.evraz.com/ru/',
    'https://nlmk.com/',
    'https://www.sibur.ru/',
    'https://www.severstal.com/',
    'https://www.metalloinvest.com/',
    'https://nangs.org/',
    'https://rmk-group.ru/ru/',
    'https://www.tmk-group.ru/',
    'https://ya.ru/',
    'https://www.polymetalinternational.com/ru/',
    'https://www.uralkali.com/ru/',
    'https://www.eurosib.ru/',
    'https://omk.ru/',
    'https://www.sberbank.ru',
    'https://www.vtb.ru/',
    'https://www.gazprombank.ru/',
    'https://www.gosuslugi.ru/',
    'https://www.mos.ru/uslugi/',
    'https://kremlin.ru/',
    'https://government.ru/',
    'https://mil.ru/',
    'https://www.nalog.gov.ru/',
    'https://customs.gov.ru/',
    'https://pfr.gov.ru/',
    'https://rkn.gov.ru/',

    'https://109.207.1.118/',
    'https://109.207.1.97/',

    'https://mail.rkn.gov.ru/',
    'https://cloud.rkn.gov.ru',
    'https://mvd.gov.ru',
    'https://pwd.wto.economy.gov.ru/',
    'https://stroi.gov.ru/',
    'https://proverki.gov.ru/',

    'https://ria.ru',
    'https://gazeta.ru',
    'https://kp.ru',
    'https://riafan.ru',
    'https://pikabu.ru',
    'https://kommersant.ru',
    'https://mk.ru',
    'https://yaplakal.com',
    'https://rbc.ru',
    'https://bezformata.com',

    'https://api.developer.sber.ru/product/SberbankID',

    'https://api.sberbank.ru/prod/tokens/v2/oauth',
    'https://api.sberbank.ru/prod/tokens/v2/oidc',

    'https://shop-rt.com',




    // Belarusian resources
    'https://belta.by/',
    'https://sputnik.by/',
    'https://www.tvr.by/',
    'https://www.sb.by/',
    'https://belmarket.by/',
    'https://www.belarus.by/',
    'https://belarus24.by/',
    'https://ont.by/',
    'https://www.024.by/',
    'https://www.belnovosti.by/',
    'https://mogilevnews.by/',
    'https://www.mil.by/',
    'https://yandex.by/',
    'https://www.slonves.by/',
    'https://www.ctv.by/',
    'https://radiobelarus.by/',
    'https://radiusfm.by/',
    'https://alfaradio.by/',
    'https://radiomir.by/',
    'https://radiostalica.by/',
    'https://radiobrestfm.by/',
    'https://www.tvrmogilev.by/',
    'https://minsknews.by/',
    'https://zarya.by/',
    'https://grodnonews.by/',
    'https://rec.gov.by/ru',
    'https://www.mil.by',
    'https://www.government.by',
    'https://president.gov.by/ru',
    'https://www.mvd.gov.by/ru',
    'https://www.kgb.by/ru/',
    'https://www.prokuratura.gov.by',
    'https://www.nbrb.by',
    'https://belarusbank.by/',
    'https://brrb.by/',
    'https://www.belapb.by/',
    'https://bankdabrabyt.by/',
    'https://belinvestbank.by/individual',
    'https://bgp.by/ru/',
    'https://www.belneftekhim.by',
    'https://www.bellegprom.by',
    'https://www.energo.by',
    'https://belres.by/ru/',

    'https://mininform.gov.by',
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
    let sitesInfoArr = Array.from(sitesInfo.values());
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
            } else if (!status2xxA && status2xxB) {
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

    let str = '<h1>Russian/Belarusian websites availability</h1>'
    // Uncomment these lines before deployment on Russian server
    // str += '<h3>This table shows which Russian and Belarusian sites are available from Russian IP addresses. This list contains governmental websites, banks, pro-Russian media and corporations. The list will be increased in the future.</h3>'
    // str += '<h3>To see which of these websites are available from American IP addresses follow this link: <a href="http://107.152.43.221">http://107.152.43.221</a></h3>'
    // Uncomment these lines before deployment on American server
    // str += '<h3>This table shows which Russian and Belarusian sites are available from American IP addresses. This list contains governmental websites, banks, pro-Russian media and corporations. The list will be increased in the future.</h3>'
    // str += '<h3>To see which of these websites are available from Russian IP addresses follow this link: <a href="http://31.172.67.184">http://31.172.67.184</a></h3>'

    str += '<h3>Glory to Ukraine!!! 🇺🇦</h3>'

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
    str += 'Downloaded page'
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

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
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

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += '<a href="' + info.url + '">' + info.url + '</a>'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.statusCode
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += '<a href="downloaded_pages/' + convertUrlToFileName(info.url) + '">Open</a>'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += info.updateTime.toGMTString()
            str += '</td>'
        } else {
            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += '<img src="failure.png" width="20" height="20">'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
            str += '<a href="' + info.url + '">' + info.url + '</a>'
            str += '</td>'

            str += '<td style="border: 1px solid black; border-collapse: collapse">'
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

    str += '<p>Source code: <a href="https://github.com/sofa-cyber-forces/russian-resources-monitor">https://github.com/sofa-cyber-forces/russian-resources-monitor</a></p>'
    str += '<p>E-mail all your questions and proposals to sofa.cyber.forces@gmail.com</p>'

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

        let fileName = convertUrlToFileName(url)
        let filePath = 'public/downloaded_pages/' + fileName
        const file = fs.createWriteStream(filePath)
        res.pipe(file)

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

        let fileName = convertUrlToFileName(url)
        let filePath = 'public/downloaded_pages/' + fileName
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath)
        }
        
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
