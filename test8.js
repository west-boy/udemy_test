//売買条件での行動を、意図的に反対の売買とする

'use strict';
const ccxt = require ('ccxt');

const bitflyer = new ccxt.bitflyer ({config)
const interval1 = 10000
const interval2 = 2000
const profitPrice_plus = 50
const profitPrice_mainus = 500
const orderSize = 0.1
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

  if (records[0] < records[1] && records[1] < records[2]) {
   if (orderInfo_Buy) {

    for (var i = 0 ;  i < 10; ) {
     const ticker = await bitflyer.fetchTicker ('FX_BTC_JPY')
     records.push(ticker.ask)
     if (records.length > 3) {
      records.shift()
      }
      console.log(records)

        console.log('++latest bid price: ' + ticker.bid)
        console.log('++order price: ' + orderInfo_Buy.price)
        console.log('++deff: ' + (ticker.bid - orderInfo_Buy.price))
        if (ticker.bid - orderInfo_Buy.price > profitPrice_plus) {
          const order = await bitflyer.createMarketSellOrder ('FX_BTC_JPY', orderSize)
          orderInfo_Buy = null
          console.log('++利確しました++',order)
          break;
        } else if (ticker.bid - orderInfo_Buy.price < -profitPrice_mainus) {
          const order = await bitflyer.createMarketSellOrder ('FX_BTC_JPY', orderSize)
          orderInfo_Buy = null
         console.log('++ロスカットしました++',order)
         break;
        }
       console.log('買いループ回数　i=',i)
       await sleep(interval2)
       i ++;
      }

     } else {
          const order = await bitflyer.createMarketBuyOrder ('FX_BTC_JPY', orderSize)
          orderInfo_Buy = {
            order: order,
            price: ticker.ask
          }
          console.log('++買い注文しました++',orderInfo_Buy)
        }
//       console.log('買いループ回数　i=',i)
//      await sleep(interval)
//      i ++;
    }

//   if (orderInfo_Buy) {
//    const order = await bitflyer.createMarketSellOrder ('FX_BTC_JPY', orderSize)
//    orderInfo_Buy = null
//    console.log('++時間オーバー　成行処分しました++',order)

  if (records[0] > records[1] && records[1] > records[2]) {
      if (orderInfo_Sell) {

       for (var j = 0 ;  j < 10; ) {
        const ticker = await bitflyer.fetchTicker ('FX_BTC_JPY')
        records.push(ticker.ask)
        if (records.length > 3) {
         records.shift()
        }
       console.log(records)

        console.log('--latest ask price: ' + ticker.ask)
        console.log('--order price: ' + orderInfo_Sell.price)
        console.log('--deff: ' + (orderInfo_Sell.price - ticker.ask ))
        if (orderInfo_Sell.price - ticker.ask > profitPrice_plus) {
          const order = await bitflyer.createMarketBuyOrder ('FX_BTC_JPY', orderSize)
          orderInfo_Sell = null
          console.log('--利確しました--',order)
          break;
        } else if (orderInfo_Sell.price - ticker.ask < -profitPrice_mainus) {
          const order = await bitflyer.createMarketBuyOrder ('FX_BTC_JPY', orderSize)
          orderInfo_Sell = null
         console.log('--ロスカットしました--',order)
         break;
        }
       console.log('売りループ回数　j=',j)
       await sleep(interval2)
       j ++;
      }

      } else {
          const order = await bitflyer.createMarketSellOrder ('FX_BTC_JPY', orderSize)
          orderInfo_Sell = {
            order: order,
            price: ticker.bid
          }
          console.log('売り注文しました--',orderInfo_Sell)
        }
//      console.log('売りループ回数　j=',j)
//      await sleep(interval)
//     j ++;
       }

//      if (orderInfo_Sell) {
//      const order = await bitflyer.createMarketBuyOrder ('FX_BTC_JPY', orderSize)
//      orderInfo_Sell = null
//      console.log('--時間オーバー　成行処分しました--',order)
//    }


  await sleep(interval1)
 }

}) ();