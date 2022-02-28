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

const URLS = [
    // Russian resources from source 1
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

    'https://www.moex.com',

    'https://www.bestchange.ru/',

    'https://www.fsb.ru/',

    'https://cleanbtc.ru/',
    'https://bonkypay.com/',
    'https://changer.club/',
    'https://superchange.net',
    'https://mine.exchange/',
    'https://platov.co',
    'https://ww-pay.net/',
    'https://delets.cash/',
    'https://betatransfer.org',
    'https://ramon.money/',
    'https://coinpaymaster.com/',
    'https://bitokk.biz/',
    'https://www.netex24.net',
    'https://cashbank.pro/',
    'https://flashobmen.com/',
    'https://abcobmen.com/',
    'https://ychanger.net/',
    'https://multichange.net/',
    'https://24paybank.ne',
    'https://royal.cash/',
    'https://prostocash.com/',
    'https://baksman.org/',
    'https://kupibit.me/',

    'https://gosuslugi41.ru',
    'https://uslugi27.ru',
    'https://gosuslugi29.ru',
    'https://gosuslugi.astrobl.ru',





    // Russian resources from source 2
    'https://epp.genproc.gov.ru',
    'https://ach.gov.ru',
    'https://www.scrf.gov.ru',

    'https://www.government.ru',
    'https://www.council.gov.ru',
    'https://www.duma.gov.ru',
    'https://www.gossluzhba.gov.ru',
    'https://zakupki.gov.ru/epz/main/public/home.html',
    'https://www.greenpressa.ru/',
    'https://zakon.scli.ru/ru/regions/35/',
    'https://www.stratgap.ru',
    'https://www.vscc.ac.ru',

    'https://www.moex.com',

    'https://epp.genproc.gov.ru',
    'https://ach.gov.ru',
    'https://duma.gov.ru/',
    'https://president-sovet.ru/',
    'https://sovetnational.ru/',
    'https://zakupki.gov.ru/epz/main/public/home.html',
    'https://gossluzhba.gov.ru/',
    'https://defence.council.gov.ru/',
    'https://budget.council.gov.ru/',
    'https://government.ru/',
    'https://www.ksrf.ru/ru/Pages/default.aspx',
    'https://www.vsrf.ru/',
    'https://premier.gov.ru/events/',
    'https://www.mchs.gov.ru/',
    'https://minjust.gov.ru/ru/',
    'https://www.fsb.ru/',
    'https://rosguard.gov.ru/',
    'https://customs.gov.ru/',
    'https://udprf.ru/',
    'https://favt.gov.ru/',

    'https://lenta.ru/',
    'https://ria.ru/lenta/', // maybe delete as duplicate of ria.ru???
    'https://tvzvezda.ru/',
    'https://smotrim.ru/',

    'https://bitzlato.com',

    'https://yandex.by/',

    'https://onliner.by',

    'https://sevstar.net/',

    'https://krym-webcams.ru/',

    'https://crimea-media.ru/',

    'https://tinkoff.ru',
    'https://178.248.236.218:77',

    'https://194.54.14.186:53',

    'https://194.54.14.187:53',

    'https://194.67.2.109:53',

    'https://bitzlato.com/api/p2p/public/exchange/dsa/?skip=0&limit=15&type=purchase&currency=UAH&cryptocurrency=BTC&isOwnerVerificated=true&isOwnerTrusted=false&isOwnerActive=false&lang=ru',

    'https://172.67.74.48:53/udp',

    'https://unchain.team/',

    'https://104.21.13.183:21/',

    'https://ds1.mirconnect.ru',

    'https://ds2.mirconnect.ru',





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

    let str = '<h1>Russian/Belarusian websites availability</h1>'
    // Uncomment these lines before deployment on Russian server
    // str += '<h3>This table shows which Russian and Belarusian sites are available from Russian IP addresses. This list contains governmental websites, banks, pro-Russian media, corporations and other sites. The list will be increased in the future.</h3>'
    // str += '<h3>To see which of these websites are available from American IP addresses follow this link: <a href="http://107.152.43.221">http://107.152.43.221</a></h3>'
    // Uncomment these lines before deployment on American server
    // str += '<h3>This table shows which Russian and Belarusian sites are available from American IP addresses. This list contains governmental websites, banks, pro-Russian media, corporations and other sites. The list will be increased in the future.</h3>'
    // str += '<h3>To see which of these websites are available from Russian IP addresses follow this link: <a href="http://31.172.67.184">http://31.172.67.184</a></h3>'

    str += '<h3>Glory to Ukraine!!! 🇺🇦</h3>'

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
            str += '<a href="downloaded_pages/' + convertUrlToFileName(info.url) + '">Open</a>'
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
