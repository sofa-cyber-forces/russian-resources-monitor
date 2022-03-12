class SiteAccessibilityInfo {
    constructor(url) {
        this.url = url
        
        this.success = null
        this.statusCode = null
        this.error = null
        this.duration = null
        this.size = null
        this.updateTime = null
    }
}
class CategoryAccessibilityInfo {
    constructor(categoryName, categoryUrls) {
        this.categoryName = categoryName
        this.sites = []
        categoryUrls.forEach((value, index, array) => {
            let url = value

            let info = new SiteAccessibilityInfo(url)
            this.sites.push(info)
        })
    }

    getSiteInfo(url) {
        let siteInfo = this.sites.find((value, index, array) => {
            let siteInfo = value
            return siteInfo.url == url
        })
        return siteInfo
    }
}
class AccessibilityInfo {
    constructor(urls) {
        this.categories = []
        urls.forEach((value, key, map) => {
            let category = key
            let urls = value

            let categoryInfo = new CategoryAccessibilityInfo(category, urls)
            this.categories.push(categoryInfo)
        })
    }

    getSiteInfo(category, url) {
        let categoryInfo = this.categories.find((value, index, array) => {
            let categoryInfo = value
            return categoryInfo.categoryName == category
        })
        if (!categoryInfo) {
            return null
        }
        return categoryInfo.getSiteInfo(url)
    }
}

module.exports = AccessibilityInfo
