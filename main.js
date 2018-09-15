require('dotenv').config()

const puppeteer = require('puppeteer')
const fs = require('fs')
const login = require('facebook-chat-api')
;(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://www.voyagespirates.fr/tag/erreur-de-pri')

    // standard JS : Get first occurrence of item, in our case titles are <a> inside <h2>
    const lastDeal = await page.$$eval('h2 > a', anchors => {
        return anchors[0].innerText
    })

    await browser.close()

    // Use JSON file instead of DB (one string only to store) We use try/catch to prevent throwing error if no JSON file
    let previousDeal
    try {
        const json = fs.readFileSync('previous-deal.json')
        previousDeal = JSON.parse(json).name
    } catch (err) {}

    // We don't do anything if not updated
    if (lastDeal === previousDeal) {
        console.log('Nothing new')
        return false
    }

    // Create or update JSON
    const data = JSON.stringify({ name: lastDeal })
    fs.writeFileSync('previous-deal.json', data)

    // Send message through a Facebook account
    login(
        {
            email: process.env.SENDER_USERNAME,
            password: process.env.SENDER_PASSWORD
        },
        (err, api) => {
            if (err) return console.error(err)

            const recipients = process.env.RECIPIENTS.split(',')

            recipients.forEach(recipient => {
                var facebookId = recipient
                var msg =
                    lastDeal +
                    ' ' +
                    'https://www.voyagespirates.fr/tag/erreur-de-pri'
                api.sendMessage(msg, facebookId)
            })
        }
    )
})()
