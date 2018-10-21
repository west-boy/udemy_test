'use strict';
const ccxt = require ('ccxt');

const bitflyer = new ccxt.bitflyer (config)
const interval = 4000
const profitPrice_puls = 30
const profitPrice_mainus = 100
const orderSize = 0.01
const records = []
var i = 0

let orderInfo = null

const sleep = (timer) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        },timer)
    })
}

(async function () {
 const config = require ('./config')

  while (true) {
   for( i ;  i < 100000; ) {
    const ticker = await bitflyer.fetchTicker ('FX_BTC_JPY')
    records.push(ticker.ask)
    if (records.length > 3) {
      records.shift()
    }
    console.log(records)
    if (orderInfo) {
      console.log('latest bid price: ' + ticker.bid)
      console.log('order price: ' + orderInfo.price)
      console.log('deff: ' + (ticker.bid - orderInfo.price))
      if (ticker.bid - orderInfo.price > profitPrice_puls) {
        const order = await bitflyer.createMarketSellOrder ('FX_BTC_JPY', orderSize)
        orderInfo = null
        console.log('利確しました',order)
        break;
      } else if (ticker.bid - orderInfo.price < -profitPrice_mainus) {
        const order = await bitflyer.createMarketSellOrder ('FX_BTC_JPY', orderSize)
        orderInfo = null
       console.log('ロスカットしました',order)
       break;
      }

    } else {
      if (records[0] < records[1] && records[1] < records[2]) {
        const order = await bitflyer.createMarketBuyOrder ('FX_BTC_JPY', orderSize)
        orderInfo = {
          order: order,
          price: ticker.ask
        }
        console.log('買い注文しました',orderInfo)
      }
    }

    await sleep(interval)
   console.log('売買回数　i=',i + 1)
   i ++;
   }
  }

}) ();