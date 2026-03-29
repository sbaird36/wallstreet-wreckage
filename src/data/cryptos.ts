import type { Crypto } from "@/types";

export const INITIAL_CRYPTOS: Omit<
  Crypto,
  "priceHistory" | "currentPrice" | "previousPrice"
>[] = [
  {
    ticker: "BYC",
    name: "Bytecoin",
    type: "crypto",
    sector: "Crypto",
    description:
      "The original cryptocurrency, Bytecoin was invented by an anonymous person who has never been identified but has definitely definitely not already spent all of it. There will only ever be 21 million Bytecoins, which sounds fine until you realize a pizza once cost 10,000 of them. Stored in digital wallets that are frequently lost down digital sofa cushions.",
    volatility: 0.065,
    trend: 0.0015,
    circulatingSupply: 19_700_000,
    allTimeHigh: 73_750,
    dominancePercent: 52.4,
  },
  {
    ticker: "ETHM",
    name: "Eithereum",
    type: "crypto",
    sector: "Crypto",
    description:
      "Eithereum is a blockchain platform where you can run smart contracts that automatically execute unless there's a bug, in which case someone loses $600 million and blames the code. Their upgrade to 'Proof of Stake' reduced energy consumption by 99.95% and disappointingly failed to kill the planet, annoying critics.",
    volatility: 0.072,
    trend: 0.0012,
    circulatingSupply: 120_000_000,
    allTimeHigh: 4_878,
    dominancePercent: 17.2,
  },
  {
    ticker: "DOJE",
    name: "Dojercoin",
    type: "crypto",
    sector: "Crypto",
    description:
      "Dojercoin started as a joke in 2013 and now has a market cap larger than several countries, which is either a triumph or a warning. The mascot is a Shiba Inu dog. It was endorsed by a billionaire with a rocket company, which is exactly as weird as it sounds. Financial advisors describe it as 'technically money'.",
    volatility: 0.11,
    trend: 0.0005,
    circulatingSupply: 143_000_000_000,
    allTimeHigh: 0.7376,
    dominancePercent: 1.4,
  },
  {
    ticker: "SOLN",
    name: "Solanar",
    type: "crypto",
    sector: "Crypto",
    description:
      "Solanar is blazingly fast and cheap to use, except during the periods when it goes completely offline, which crypto enthusiasts call 'scheduled maintenance' and everyone else calls 'an outage'. Their proof-of-history consensus mechanism is explained in a white paper that is 47 pages long and gets less clear as you read it.",
    volatility: 0.089,
    trend: 0.001,
    circulatingSupply: 450_000_000,
    allTimeHigh: 260,
    dominancePercent: 3.1,
  },
  {
    ticker: "RIPPL",
    name: "Ripplon",
    type: "crypto",
    sector: "Crypto",
    description:
      "Ripplon is designed for banks, by people who hate banks, creating a philosophical tension that drives the price up and down randomly. It has been in a lawsuit with the SEC for so long that both parties have forgotten what they're arguing about. Described as 'the banker's crypto' in a tone that implies this is either good or bad.",
    volatility: 0.094,
    trend: 0.0008,
    circulatingSupply: 53_800_000_000,
    allTimeHigh: 3.84,
    dominancePercent: 2.8,
  },
  {
    ticker: "MNCAT",
    name: "Mooncat",
    type: "crypto",
    sector: "Crypto",
    description:
      "Mooncat is a meme token inspired by a meme dog coin. Its value is $0.00001 and change, but the community insists it's going to $1, which would give it a market cap larger than the global economy. The mascot is a cat on the moon. There is no whitepaper. There is no roadmap. There is only the cat.",
    volatility: 0.145,
    trend: 0.0002,
    circulatingSupply: 589_735_030_408_323,
    allTimeHigh: 0.000088,
    dominancePercent: 0.6,
  },
];

export const STARTING_CRYPTO_PRICES: Record<string, number> = {
  BYC: 67420.0,
  ETHM: 3480.0,
  DOJE: 0.1842,
  SOLN: 148.6,
  RIPPL: 0.592,
  MNCAT: 0.00001247,
};
