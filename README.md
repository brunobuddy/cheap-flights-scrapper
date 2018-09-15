# cheap-flights-scrapper

Node scrapper to get Facebook notification when new deal on https://www.voyagespirates.fr/tag/erreur-de-pri

## Install

-   Find the Facebook IDs of the recipients (the ones that will receive notifications) with https://findmyfbid.com/ and note them somewhere
-   Copy `.env.example` into `.env` and add a Facebook account credentials and the Facebook IDs of the recipients
-   `npm install`

## Launch

-   Create a worker than runs `node main.js`. Default port is 4444
