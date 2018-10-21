'use strict';
const ccxt = require ('ccxt');

const bitflyer = new ccxt.bitflyer (config)
const interval = 3000
const profitPrice_plus = 500
const profitPrice_mainus = 500
const orderSize = 0.01
const records = []

let orderInfo_Buy = null
let orderInfo_Sell = null

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
    const ticker = await bitflyer.fetchTicker ('FX_BTC_JPY')
    records.push(ticker.ask)
    if (records.length > 3) {
      records.shift()
    }
    console.log(records)
    if (orderInfo_Buy) {
      console.log('++latest bid price: ' + ticker.bid)
      console.log('++order price: ' + orderInfo_Buy.price)
      console.log('++deff: ' + (ticker.bid - orderInfo_Buy.price))
      if (ticker.bid - orderInfo_Buy.price > profitPrice_plus) {
        const order = await bitflyer.createMarketSellOrder ('FX_BTC_JPY', orderSize)
        orderInfo_Buy = null
        console.log('++利確しました++',order)
      } else if (ticker.bid - orderInfo_Buy.price < -profitPrice_mainus) {
        const order = await bitflyer.createMarketSellOrder ('FX_BTC_JPY', orderSize)
        orderInfo_Buy = null
       console.log('++ロスカットしました++',order)
      }

    } else {
      if (records[0] < records[1] && records[1] < records[2]) {
        const order = await bitflyer.createMarketBuyOrder ('FX_BTC_JPY', orderSize)
        orderInfo_Buy = {
          order: order,
          price: ticker.ask
        }
        console.log('++買い注文しました++',orderInfo_Buy)
      }
    }

    if (orderInfo_Sell) {
      console.log('--latest ask price: ' + ticker.ask)
      console.log('--order price: ' + orderInfo_Sell.price)
      console.log('--deff: ' + (orderInfo_Sell.price - ticker.ask ))
      if (orderInfo_Sell.price - ticker.ask > profitPrice_plus) {
        const order = await bitflyer.createMarketBuyOrder ('FX_BTC_JPY', orderSize)
        orderInfo_Sell = null
        console.log('--利確しました--',order)
      } else if (orderInfo_Sell.price - ticker.ask < -profitPrice_mainus) {
        const order = await bitflyer.createMarketBuyOrder ('FX_BTC_JPY', orderSize)
        orderInfo_Sell = null
       console.log('--ロスカットしました--',order)
      }

    } else {
      if (records[0] > records[1] && records[1] > records[2]) {
        const order = await bitflyer.createMarketSellOrder ('FX_BTC_JPY', orderSize)
        orderInfo_Sell = {
          order: order,
          price: ticker.bid
        }
        console.log('--売り注文しました--',orderInfo_Sell)
      }
    }

    await sleep(interval)
  }

}) ();