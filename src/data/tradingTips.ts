export interface TradingTip {
  id: string;
  category: "MOMENTUM" | "RISK" | "FUNDAMENTALS" | "PSYCHOLOGY" | "STRATEGY" | "CRYPTO";
  title: string;
  body: string;
  takeaway: string;
}

export const TRADING_TIPS: TradingTip[] = [
  {
    id: "rsi_overbought",
    category: "MOMENTUM",
    title: "RSI: Don't Chase Overbought Stocks",
    body: "The Relative Strength Index (RSI) measures how fast a stock has moved recently. An RSI above 70 means the stock has risen quickly and buyers may be exhausted — a pullback becomes more likely. This doesn't mean sell immediately, but it does mean new buyers are taking on more risk.",
    takeaway: "RSI > 70 = overbought caution. RSI < 30 = oversold opportunity.",
  },
  {
    id: "rsi_divergence",
    category: "MOMENTUM",
    title: "RSI Divergence: When Price and Momentum Disagree",
    body: "If a stock makes a new high but its RSI makes a lower high, that's bearish divergence — price is rising but momentum is weakening. This often precedes a reversal. It's one of the most reliable early warning signals for a trend change.",
    takeaway: "Watch for price and RSI moving in opposite directions — it often signals a reversal.",
  },
  {
    id: "moving_averages_101",
    category: "MOMENTUM",
    title: "Moving Averages: The Trend Is Your Friend",
    body: "A moving average smooths out daily price noise to show the underlying trend. When a stock trades above its 20-day MA, short-term momentum is bullish. Above the 50-day MA means the medium-term trend is intact. When the 20-day MA crosses above the 50-day MA, traders call this a 'golden cross' — a classic buy signal.",
    takeaway: "Price above MA = bullish trend. 20-day crossing above 50-day = golden cross buy signal.",
  },
  {
    id: "death_cross",
    category: "MOMENTUM",
    title: "The Death Cross: When Averages Turn Bearish",
    body: "When the 20-day moving average crosses below the 50-day MA, it's called a 'death cross' — a bearish signal indicating short-term momentum has turned negative relative to the medium-term trend. Many institutional investors use this as a trigger to reduce exposure.",
    takeaway: "20-day crossing below 50-day = death cross sell signal. Not a guarantee, but a meaningful warning.",
  },
  {
    id: "atr_position_sizing",
    category: "RISK",
    title: "ATR: Size Your Positions by Volatility",
    body: "Average True Range (ATR) tells you how much a stock typically moves each day. A high ATR stock is volatile — it can give you big gains but also big losses. A common rule: risk no more than 1-2% of your portfolio on any single trade. If a stock has a high ATR, you need to buy fewer shares to keep your risk in check.",
    takeaway: "High ATR = more risk per share. Buy fewer shares in volatile stocks to control your downside.",
  },
  {
    id: "stop_loss",
    category: "RISK",
    title: "Stop Losses: Protect Yourself From Disaster",
    body: "A stop loss is a price level where you'll sell a losing position to prevent further losses. Many traders set stop losses at 7-10% below their purchase price. The painful truth: cutting a loss at -8% is far better than hoping for a recovery that never comes. Small losses are part of trading; catastrophic losses end portfolios.",
    takeaway: "Decide your exit price before you enter. A plan in place means emotion won't override discipline.",
  },
  {
    id: "beta_market_sensitivity",
    category: "RISK",
    title: "Beta: How Much Does the Stock Amplify the Market?",
    body: "Beta measures how much a stock moves relative to the market. A Beta of 1.5 means the stock tends to move 50% more than the market — up and down. In bull markets, high-beta stocks outperform. In bear markets, they lose more. Conservative investors prefer low-beta stocks; aggressive investors often seek high-beta.",
    takeaway: "High beta = amplified market moves. Great in bull markets, painful in bears.",
  },
  {
    id: "diversification",
    category: "RISK",
    title: "Diversification: The Only Free Lunch in Investing",
    body: "Spreading investments across multiple sectors reduces the impact of any single bad event. If all your money is in tech and tech crashes, you lose everything. With investments in tech, healthcare, retail, and crypto, a tech crash hurts — but doesn't destroy you. Nobel Prize winner Harry Markowitz called diversification 'the only free lunch in finance.'",
    takeaway: "Never put all your eggs in one sector. Diversify across industries to reduce catastrophic risk.",
  },
  {
    id: "pe_ratio",
    category: "FUNDAMENTALS",
    title: "P/E Ratio: What Are You Paying for Earnings?",
    body: "The Price-to-Earnings ratio tells you how much investors are paying for each dollar of profit. A P/E of 20 means you pay $20 for every $1 the company earns annually. High P/E (>50) suggests investors expect strong future growth — or the stock is overvalued. Low P/E (<15) suggests value or slow growth. Compare P/E within the same sector for meaningful context.",
    takeaway: "P/E < 15 may be cheap. P/E > 50 requires strong growth to justify. Always compare sector peers.",
  },
  {
    id: "eps_earnings",
    category: "FUNDAMENTALS",
    title: "EPS: The Engine Under the Hood",
    body: "Earnings Per Share (EPS) is the company's profit divided by the number of shares. It's the most fundamental measure of a stock's value. Growing EPS over time is the single strongest driver of long-term stock price appreciation. When companies 'beat earnings' — report EPS above analyst estimates — stocks often pop significantly.",
    takeaway: "Rising EPS = rising stock price over time. Earnings beats drive short-term rallies.",
  },
  {
    id: "dividend_yield",
    category: "FUNDAMENTALS",
    title: "Dividend Yield: Getting Paid to Hold",
    body: "Dividend yield is the annual dividend payment as a percentage of the stock price. A 3% yield means for every $1,000 invested, you receive $30 per year in cash. Dividends provide income while you wait for price appreciation. However, very high yields (>6%) can signal the dividend may be unsustainable and the company may be in trouble.",
    takeaway: "Dividends = income from holding. Yields over 6% deserve extra scrutiny.",
  },
  {
    id: "market_cap",
    category: "FUNDAMENTALS",
    title: "Market Cap: Size Matters in Investing",
    body: "Market cap (price × shares outstanding) tells you a company's total value. Large-caps (>$10B) are established, stable, lower risk. Mid-caps ($2B-$10B) have more growth potential but more risk. Small-caps (<$2B) can skyrocket or crash. In general, larger companies are safer but grow more slowly; smaller companies are riskier but have more upside.",
    takeaway: "Large cap = stable, slow growth. Small cap = volatile, high potential. Match your risk appetite.",
  },
  {
    id: "52_week_range",
    category: "FUNDAMENTALS",
    title: "52-Week Range: Context for Current Price",
    body: "Knowing where a stock sits relative to its year-long price range gives you context. A stock trading near its 52-week low might be a value opportunity — or it might be falling for a reason. A stock near its 52-week high is showing strength — or it might be overextended. Neither extreme is automatically good or bad; it depends on the fundamentals.",
    takeaway: "Near 52-week low = investigate why. Near 52-week high = strong momentum but exercise caution.",
  },
  {
    id: "buy_the_dip",
    category: "STRATEGY",
    title: "Buying the Dip: Opportunity or Falling Knife?",
    body: "When a fundamentally sound stock drops 10-20% on bad news, it can be a buying opportunity. But not all dips recover — sometimes the news reveals real, permanent damage to the business. The key question: is this a temporary setback or a fundamental problem? Check the RSI (is it oversold?), the reason for the drop, and the long-term trend.",
    takeaway: "Dips in strong stocks = opportunities. Dips in weak businesses = traps. Always ask why it fell.",
  },
  {
    id: "sell_the_news",
    category: "STRATEGY",
    title: "Buy the Rumor, Sell the News",
    body: "Markets are forward-looking. By the time good news is officially announced, savvy investors have already bought in anticipation. The announcement can actually cause a sell-off as those early buyers take profits. This is called 'buy the rumor, sell the news.' It explains why great earnings reports sometimes cause stocks to fall.",
    takeaway: "Good news doesn't always mean the price goes up — if it was expected, it may already be priced in.",
  },
  {
    id: "market_cycles",
    category: "STRATEGY",
    title: "Market Cycles: Bull and Bear Markets",
    body: "Markets move in cycles: bull markets (rising prices, optimism, greed) and bear markets (falling prices, pessimism, fear). Bull markets typically last longer than bear markets, but bear markets are faster and more violent. The average bear market falls 35% in about 14 months. The average bull market gains 114% over 3-5 years.",
    takeaway: "Bear markets are temporary but feel permanent. Staying invested through them has historically rewarded patience.",
  },
  {
    id: "sector_rotation",
    category: "STRATEGY",
    title: "Sector Rotation: Following the Smart Money",
    body: "Different sectors perform at different stages of the economic cycle. Early recovery: Financials, Consumer Discretionary. Mid-cycle: Technology, Industrials. Late cycle: Energy, Materials. Recession: Healthcare, Utilities, Consumer Staples. Institutional investors rotate between sectors as the cycle turns — watching which sectors lead and lag can give clues.",
    takeaway: "The sector leading the market often changes with the economic cycle. Follow strength, not just individual stocks.",
  },
  {
    id: "volume_confirmation",
    category: "STRATEGY",
    title: "Volume: The Conviction Behind Price Moves",
    body: "Price moves on high volume are more meaningful than moves on low volume. If a stock surges 10% on massive volume, institutions are buying — that's conviction. If it surges 10% on tiny volume, it might be temporary. The same applies to declines: a large drop on high volume often signals real selling pressure, not just noise.",
    takeaway: "High-volume moves are more trustworthy. Low-volume moves may reverse quickly.",
  },
  {
    id: "news_trading",
    category: "STRATEGY",
    title: "Trading News Events: Speed Isn't Everything",
    body: "Market-moving news hits algorithms before human traders can react. Instead of trying to trade the initial spike, consider: What's the second-order effect? If a major company's earnings beat, which of its suppliers will benefit? News creates ripples — the headline move is often the least profitable trade. The bigger opportunity is in what happens next.",
    takeaway: "Don't chase the headline reaction. Look for secondary effects in suppliers, competitors, and related sectors.",
  },
  {
    id: "fomo_vs_conviction",
    category: "PSYCHOLOGY",
    title: "FOMO: The Most Expensive Emotion in Investing",
    body: "Fear of Missing Out causes investors to chase stocks that have already surged. You see a stock up 40% and buy it — only to watch it fall back 30%. Professional investors call this 'buying at the top of the emotional cycle.' The best trades are often the ones where you feel no excitement, because the stock hasn't moved yet.",
    takeaway: "Boring, unexciting setups often beat exciting momentum trades. Don't buy because something has already gone up.",
  },
  {
    id: "loss_aversion",
    category: "PSYCHOLOGY",
    title: "Loss Aversion: Why Losses Hurt More Than Gains Feel Good",
    body: "Behavioral economics shows that losing $100 feels about twice as painful as gaining $100 feels good. This causes investors to hold losing positions too long (hoping to break even) and sell winning positions too early (taking profits before they run). The result: small wins and large losses. The antidote is a predefined exit plan before you enter.",
    takeaway: "Have exit rules — both stop losses and profit targets — before you buy. Don't let pain drive decisions.",
  },
  {
    id: "anchoring_bias",
    category: "PSYCHOLOGY",
    title: "Anchoring: Why Your Purchase Price Is Irrelevant",
    body: "Anchoring is the tendency to fixate on the price you paid for something. 'I'll sell when it gets back to what I paid' is not a strategy — it's an emotional anchor. The market doesn't care what you paid. The question is always: 'Given what I know today, is this the best place for my money?' If not, the right move may be to sell at a loss.",
    takeaway: "Your cost basis is irrelevant to the market. Evaluate every position based on its current prospects, not your history with it.",
  },
  {
    id: "confirmation_bias",
    category: "PSYCHOLOGY",
    title: "Confirmation Bias: Seeking Evidence for What You Already Believe",
    body: "After buying a stock, most investors unconsciously seek information that confirms their decision and ignore contradictory evidence. This leads to holding losers too long and doubling down on bad ideas. Force yourself to actively look for reasons you might be wrong — this is called 'red-teaming' your thesis and is standard practice among professional investors.",
    takeaway: "After buying, actively look for reasons you're wrong. If you can't find any, dig harder.",
  },
  {
    id: "crypto_volatility",
    category: "CRYPTO",
    title: "Crypto Volatility: 50% Swings Are Normal",
    body: "Cryptocurrency is dramatically more volatile than stocks. 30-50% corrections happen regularly even in bull markets. The psychological challenge is staying rational through these swings. Many crypto investors lose money not because the asset fell — but because they panicked and sold at the bottom. Position sizing is critical: never invest more than you can afford to see cut in half.",
    takeaway: "In crypto, 50% drops are part of the game. Size positions to withstand volatility without panic-selling.",
  },
  {
    id: "crypto_dominance",
    category: "CRYPTO",
    title: "Bitcoin Dominance: The Barometer of Crypto Risk",
    body: "Bitcoin's share of total crypto market cap (dominance) tells you the market's risk appetite. High dominance means investors are concentrating in the 'safer' crypto. When dominance falls, money is flowing into smaller, riskier coins — often called 'altcoin season.' Understanding dominance helps you gauge where we are in the crypto cycle.",
    takeaway: "Rising Bitcoin dominance = risk-off in crypto. Falling dominance = altcoin season and higher risk appetite.",
  },
  {
    id: "crypto_halving",
    category: "CRYPTO",
    title: "Halving Events: Supply Shocks That Move Markets",
    body: "Bitcoin and similar cryptocurrencies periodically 'halve' the rate at which new coins are created. This supply reduction, combined with steady or growing demand, has historically preceded major price appreciation. The 12-18 months following a halving have been consistently bullish in historical data. It's one of the most predictable catalysts in financial markets.",
    takeaway: "Halving events reduce new supply. Less supply + same demand = higher prices. Historically very reliable.",
  },
  {
    id: "interest_rates_stocks",
    category: "STRATEGY",
    title: "Interest Rates: The Gravity of Stock Valuations",
    body: "When interest rates rise, bond yields increase — making bonds more attractive relative to stocks. This puts downward pressure on stock prices, especially high-P/E growth stocks whose future earnings get 'discounted' more heavily. Warren Buffett calls interest rates 'gravity for asset prices.' Lower rates = stocks float higher. Higher rates = gravity pulls them down.",
    takeaway: "Rising rates hurt high-growth stocks most. Falling rates are a tailwind for the entire market.",
  },
  {
    id: "patience_time_horizon",
    category: "PSYCHOLOGY",
    title: "Time Horizon: Your Biggest Edge as an Individual Investor",
    body: "Institutional investors are measured quarterly and can't hold through volatility without career risk. Individual investors have no such constraint — they can wait years. This patience is a genuine competitive advantage. Stocks that are down 20% in a bad quarter often double over 3 years. The investor who can wait, when institutions must sell, often captures the best returns.",
    takeaway: "Your ability to wait is an advantage institutional investors don't have. Use it.",
  },
  {
    id: "market_efficiency",
    category: "STRATEGY",
    title: "Markets Are Mostly Efficient — But Not Always",
    body: "The Efficient Market Hypothesis says prices already reflect all available information, making it hard to consistently beat the market. For large, heavily-covered stocks, this is largely true. But smaller or less-followed companies have gaps in analyst coverage, creating inefficiencies that patient individual investors can exploit. The biggest opportunities come where information is sparse.",
    takeaway: "The biggest informational edge exists in less-covered areas. Heavily-analyzed mega-caps are hard to beat.",
  },
  {
    id: "cash_is_a_position",
    category: "STRATEGY",
    title: "Cash Is a Position: The Value of Dry Powder",
    body: "Holding cash feels unproductive when markets are rising. But cash has optionality — the ability to buy when others are forced to sell. The best investors in history often held high cash reserves during expensive markets, then deployed aggressively during crashes. 'Be greedy when others are fearful, and fearful when others are greedy' — Warren Buffett.",
    takeaway: "Cash isn't idle — it's ammunition waiting for the right opportunity. Don't feel pressure to be fully invested.",
  },
  {
    id: "correlation_in_crisis",
    category: "RISK",
    title: "When Everything Crashes Together: Correlation in Crisis",
    body: "Under normal conditions, different asset classes and sectors move somewhat independently — this is why diversification helps. But in severe market downturns, correlations spike and almost everything falls together. The only reliable diversifier in a crisis is cash, government bonds, or assets with genuinely negative correlation. Diversification reduces normal-market volatility but may not protect in a full crash.",
    takeaway: "In a real market panic, most assets fall together. True crisis protection requires cash or bonds, not just stock diversification.",
  },
];

/** Returns the tip for a given game day, rotating through the list */
export function getTipOfTheDay(currentDay: number): TradingTip {
  return TRADING_TIPS[currentDay % TRADING_TIPS.length];
}
