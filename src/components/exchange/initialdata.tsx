import { positions } from "./Subscribtion";

// create simple getData() function

//// DOCs example

// a list of the data, that we modify as we go. if you are using an immutable
// data store (such as Redux) then this would be similar to your store of data.
// export var globalRowData: any[];

// // build up the test data
// export function getData() {
//   globalRowData = [];
//   for (var i = 0; i < products.length; i++) {
//     var product = products[i];
//     for (var j = 0; j < portfolios.length; j++) {
//       var portfolio = portfolios[j];

//       var bookCount = randomBetween(MAX_BOOK_COUNT, MIN_BOOK_COUNT);

//       for (var k = 0; k < bookCount; k++) {
//         var book = createBookName();
//         var tradeCount = randomBetween(MAX_TRADE_COUNT, MIN_TRADE_COUNT);
//         for (var l = 0; l < tradeCount; l++) {
//           var trade = createTradeRecord(product, portfolio, book);
//           globalRowData.push(trade);
//         }
//       }
//     }
//   }
// }

// we can use atom to store global row data

export const globalRowDataAtom = atom<StoreData | null>(null);
