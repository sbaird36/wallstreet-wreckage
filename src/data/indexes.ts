// Fake market indexes loosely inspired by NASDAQ, Dow Jones, and S&P 500.

export const INDEX_DEFINITIONS = [
  {
    id: "nzdork",
    ticker: "NZDORK",
    name: "Nazdork Composite",
    description:
      "The Nazdork Composite tracks 20 technology and growth-oriented fake companies. It is the index of choice for investors who believe in the power of software to charge subscription fees for things that used to be free. When tech sneezes, the Nazdork catches pneumonia.",
    constituents: [
      "GGLE", "APCT", "MCSFT", "NVDUH", "AMZUN", "TOKTIK", "NFLUX",
      "SHPFY", "SPOTFY", "SLESF", "ORRCL", "INTLL", "UBURR", "TSLH",
      "FBRG", "PNTST", "BLOKK", "PYPLG", "SNPCHT", "COMCST",
    ],
    startingValue: 16_430,
  },
  {
    id: "djowl",
    ticker: "DJOWL",
    name: "Dow Jowls Industrial Average",
    description:
      "The Dow Jowls Industrial Average tracks 20 large-cap 'blue chip' fake companies in traditional industries. It was founded in 1896 and the methodology hasn't meaningfully changed since, which economists consider either a strength or an embarrassment depending on the day.",
    constituents: [
      "MCSFT", "APCT", "JPMRG", "MCDNK", "WALMT", "DISNY", "JNJJ",
      "PFIZR", "TOYTO", "FORDD", "STRBK", "COMCST", "NVDUH", "GGLE",
      "AMZUN", "CHIPLT", "CSTCO", "TRGTT", "NFLUX", "UBURR",
    ],
    startingValue: 38_520,
  },
  {
    id: "snp499",
    ticker: "SNP499",
    name: "Standard & Bores 499",
    description:
      "The Standard & Bores 499 is a broad market index tracking all 34 fake stocks in the game. It is considered the single best measure of the fake economy and is used as a benchmark by fund managers who will underperform it regardless. It started at exactly 4,799 for no reason anyone can recall.",
    constituents: [
      "GGLE", "APCT", "MCSFT", "AMZUN", "FBRG", "TSLH", "NFLUX", "NVDUH",
      "SPCE2", "MCDNK", "JPMRG", "SHPFY", "TWTTR", "UBURR",
      "INTLL", "ORRCL", "SLESF", "SNPCHT", "TOKTIK", "PNTST",
      "DISNY", "COMCST", "SPOTFY", "WALMT", "TRGTT", "CSTCO",
      "PYPLG", "BLOKK", "STRBK", "CHIPLT", "JNJJ", "PFIZR", "FORDD", "TOYTO",
    ],
    startingValue: 4_799,
  },
];
