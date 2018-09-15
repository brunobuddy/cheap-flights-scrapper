const puppeteer = require('puppeteer')
const fs = require('fs')
;(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://www.voyagespirates.fr/tag/erreur-de-pri')

    // execute standard javascript in the context of the page.
    const lastDeal = await page.$$eval('h2 > a', anchors => {
        return anchors[0].innerText
    })

    await browser.close()

    // We use try/catch to prevent throwing error if no JSON file
    let previousDeal
    try {
        const json = fs.readFileSync('previous-deal.json')
        previousDeal = JSON.parse(json).name
    } catch (err) {}

    // We don't do anything if not updated
    if (lastDeal === previousDeal) {
        return false
    }

    // Create or update JSON
    const data = JSON.stringify({ name: lastDeal })
    fs.writeFileSync('previous-deal.json', data)

    // TODO: Send message
})()
