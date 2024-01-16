import {
  ContinuousContractKlinesParams,
  KlineInterval,
  USDMClient,
} from "binance";
import { Button } from "../ui/button";
import { useAtom } from "jotai";
import { startOfWeek } from "date-fns";
import { exchangeAtom } from "./exchange";
const Fetcher = () => {
  const usdmclient = new USDMClient({
    beautifyResponses: true,
  });

  const [exchange] = useAtom(exchangeAtom);
  if (!exchange) {
    return null;
  }
  const markets = exchange.store.markets;
  const symbols: string[] = Array.from(
    new Set(markets.map((market) => market.symbol))
  );
  // const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT"];

  const fetchCandles = async (pair: string, startTime: number) => {
    try {
      const interval: KlineInterval = "1d"; // Use 1d for daily interval
      const params: ContinuousContractKlinesParams = {
        pair,
        interval,
        contractType: "PERPETUAL",
        limit: 500, // Fetch last 500 candles
        startTime,
      };

      const response = await usdmclient.getContinuousContractKlines(params);
      return response;
    } catch (error) {
      console.error(`Error fetching klines for symbol ${pair}:`, error);
      return [];
    }
  };

  const fetchData = async () => {
    const currentYear = new Date().getUTCFullYear();
    let startTime = Date.UTC(currentYear, 0, 1); // January is month 0 in JavaScript
    startTime -= 1000 * 60 * 60 * 24; // Subtract one day
    try {
      console.log("Starting to fetch data...");
      const priceData = [];

      for (const pair of symbols) {
        const candles = await fetchCandles(pair, startTime);
        if (candles.length > 0) {
          const todayCandle = candles[candles.length - 1];
          const weeklyCandle = candles.find((candle) => {
            const candleDate = new Date(candle[0]);
            const startOfWeekDate = startOfWeek(new Date(), {
              weekStartsOn: 1,
            }); // week starts on Monday

            // Compare just the dates (without time)
            return (
              candleDate.getUTCFullYear() ===
                startOfWeekDate.getUTCFullYear() &&
              candleDate.getUTCMonth() === startOfWeekDate.getUTCMonth() &&
              candleDate.getUTCDate() === startOfWeekDate.getUTCDate()
            );
          });
          const yearlyCandle = candles.find((candle) => {
            const candleDate = new Date(candle[0]);
            return (
              candleDate.getUTCFullYear() === new Date().getUTCFullYear() &&
              candleDate.getUTCMonth() === 0 &&
              candleDate.getUTCDate() === 1
            );
          });

          // Convert timestamps to human-readable format
          const dTime = todayCandle
            ? new Date(todayCandle[0]).toISOString()
            : null;
          const wTime = weeklyCandle
            ? new Date(weeklyCandle[0]).toISOString()
            : null;
          const yTime = yearlyCandle
            ? new Date(yearlyCandle[0]).toISOString()
            : null;

          const firstCandleTime = new Date(candles[0][0]).toISOString();
          const lastCandleTime = new Date(
            candles[candles.length - 1][0]
          ).toISOString();

          priceData.push({
            symbol: pair,
            dPrice: todayCandle ? todayCandle[1] : null,
            wPrice: weeklyCandle ? weeklyCandle[1] : null,
            yPrice: yearlyCandle ? yearlyCandle[1] : null,
            dTime, // Add daily time
            wTime, // Add weekly time
            yTime, // Add yearly time
            firstCandleTime, // Add time of first candle
            lastCandleTime, // Add time of last candle
          });
        }
      }

      console.log("Finished fetching data");
      localStorage.setItem("priceData", JSON.stringify(priceData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div>
      <Button onClick={fetchData}>Fetch Data</Button>
    </div>
  );
};

export default Fetcher;
