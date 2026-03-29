import type { MarketEvent } from "@/types";

/**
 * Per-company dynamic events covering product launches, layoffs, earnings,
 * partnerships, scandals, and operational announcements.
 *
 * Many events have `conditions` that make them more likely when recent
 * market sentiment is bullish or bearish — creating realistic co-movement
 * between macro events and company-level news.
 */
export const COMPANY_EVENTS: MarketEvent[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // GOGGLE (GGLE) — Goggle Inc. / Google analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ggle_ai_search_launch",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Goggle Launches GoggleMind Pro: 'It Knows What You Want Before You Do'",
    body: "Goggle has released GoggleMind Pro, an AI search assistant that pre-fetches answers to questions users have not yet asked. Early reviews describe it as 'helpful but slightly unsettling.' Advertisers are bidding 300% above normal rates for placement. Revenue guidance was revised up immediately after launch.",
    effect: { targetTickers: ["GGLE"], priceMultiplierRange: [1.1, 1.22], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.25, cooldownDays: 40, icon: "🔍",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
  {
    id: "ggle_ad_revenue_miss",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Goggle Ad Revenue Misses Estimates; Advertisers 'Distracted by Other Rectangles'",
    body: "Goggle's quarterly advertising revenue fell 12% short of analyst estimates as advertisers shifted budgets toward social and streaming platforms. The CFO described the miss as 'a temporary reallocation of rectangle-based attention.' Three analysts have downgraded the stock.",
    effect: { targetTickers: ["GGLE"], priceMultiplierRange: [0.86, 0.94], volatilityBoostDays: 4, volatilityMultiplier: 2.2 },
    probability: 0.28, cooldownDays: 35, icon: "📉",
    conditions: { minDay: 5, ifRecentBearish: 1.6 },
  },
  {
    id: "ggle_cloud_contract_win",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Goggle Cloud Wins $30B Federal Contract, Edging Out Amazoon",
    body: "Goggle Cloud has been awarded a $30 billion, 10-year US federal cloud contract — the largest cloud deal in government history. Amazoon has filed a protest. The government agency involved confirmed they 'just needed something that works.' Goggle Cloud's market share jumps from 12% to a projected 18%.",
    effect: { targetTickers: ["GGLE"], priceMultiplierRange: [1.07, 1.18], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.22, cooldownDays: 45, icon: "☁️",
    conditions: { minDay: 5 },
  },
  {
    id: "ggle_layoffs_12k",
    category: "COMPANY",
    sentiment: "MIXED",
    headline: "Goggle Lays Off 12,000 Employees; Stock Rises Immediately, Which Is a Statement",
    body: "Goggle has announced 12,000 layoffs — 6% of its workforce — citing 'operational efficiency and the need to compete in a rapidly evolving AI landscape.' The stock rose 4% on the announcement. The 12,000 employees are processing this information at 75 words per minute.",
    effect: { targetTickers: ["GGLE"], priceMultiplierRange: [0.97, 1.09], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.22, cooldownDays: 50, icon: "📋",
    conditions: { minDay: 5, ifRecentBearish: 2.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // APRICOT (APCT) — Apricot Technologies / Apple analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "apct_new_device_launch",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Apricot Announces ApriWatch Ultra Pro Max: Now Slightly Larger",
    body: "Apricot's latest wearable device is 3mm larger than its predecessor, has a slightly better battery, and costs $200 more. Pre-orders hit 6 million in 24 hours. Analysts have raised price targets. The product's core innovation — being marginally different from last year's model — is apparently exactly what consumers wanted.",
    effect: { targetTickers: ["APCT"], priceMultiplierRange: [1.06, 1.16], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.3, cooldownDays: 35, icon: "⌚",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "apct_services_record",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Apricot Services Revenue Hits $35B Quarter; 'You're Already Subscribed to Everything'",
    body: "Apricot's services segment — App Store, subscriptions, payment processing, and things users signed up for and forgot — hit a record $35B in quarterly revenue. Gross margins are 74%. Every analyst firm has upgraded the stock. The CEO noted that 'diversification beyond hardware is complete' while surrounded by hardware.",
    effect: { targetTickers: ["APCT"], priceMultiplierRange: [1.1, 1.24], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "💰",
    conditions: { minDay: 5 },
  },
  {
    id: "apct_supply_chain_crisis",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Apricot Supply Chain Disruption Cuts iPhone Production by 25%",
    body: "A major production disruption at Apricot's primary contract manufacturer has cut iPhone output by 25% heading into the holiday quarter. Analysts are cutting revenue estimates. Apricot said it is 'working diligently to resolve the situation,' which is corporate for 'we have no idea when this gets fixed.'",
    effect: { targetTickers: ["APCT"], priceMultiplierRange: [0.87, 0.94], volatilityBoostDays: 4, volatilityMultiplier: 2.2 },
    probability: 0.2, cooldownDays: 45, icon: "🏭",
    conditions: { minDay: 5, ifRecentBearish: 2.0 },
  },
  {
    id: "apct_buyback_announcement",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Apricot Announces $110B Stock Buyback — Largest in Corporate History",
    body: "Apricot's board has authorized a $110 billion share repurchase program, reducing the float by approximately 4%. Analysts immediately raised earnings-per-share estimates since there will be fewer shares to divide profits among. The market interprets this as: Apricot can't find anything better to do with $110B, which is good news.",
    effect: { targetTickers: ["APCT"], priceMultiplierRange: [1.06, 1.14], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.2, cooldownDays: 50, icon: "📈",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MICROCOFT (MCSFT) — Microsoft analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "mcsft_ai_copilot_expansion",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Microcoft Copilot AI Now Integrated into Everything Including the Microwave",
    body: "Microcoft has integrated its Copilot AI assistant into every product in its portfolio — Office, Azure, Xbox, Teams, and reportedly home appliances through a partnership with a kitchen equipment manufacturer. Enterprise adoption has hit 45 million seats. Azure AI revenue has doubled year-over-year. Analysts are using words like 'transformational.'",
    effect: { targetTickers: ["MCSFT"], priceMultiplierRange: [1.1, 1.22], volatilityBoostDays: 4, volatilityMultiplier: 1.8 },
    probability: 0.25, cooldownDays: 40, icon: "🤖",
    conditions: { minDay: 5, ifRecentBullish: 1.7 },
  },
  {
    id: "mcsft_azure_outage",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Azure Cloud Goes Down for 6 Hours; Half of Corporate America Stares at Loading Screens",
    body: "Microsoft Azure experienced a global outage lasting 6 hours affecting 62% of its services. Teams, Outlook, Xbox Live, and the authentication system required to log into anything went offline simultaneously. The root cause was described as 'a configuration change that interacted unexpectedly with other configuration changes.' Enterprise customers are reconsidering their cloud strategies.",
    effect: { targetTickers: ["MCSFT"], priceMultiplierRange: [0.88, 0.95], volatilityBoostDays: 3, volatilityMultiplier: 2.0 },
    probability: 0.25, cooldownDays: 35, icon: "⚠️",
    conditions: { minDay: 5 },
  },
  {
    id: "mcsft_gaming_acquisition",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Microcoft Acquires Another Game Studio; Number of Studios Now Exceeds Small Nations",
    body: "Microcoft has acquired Blastwave Entertainment for $14 billion, adding six blockbuster game franchises to its Xbox portfolio. It is Microcoft's 47th gaming studio acquisition. Regulators have declined to investigate, citing 'paperwork fatigue.' The Xbox division now employs more people than the populations of Iceland and Luxembourg combined.",
    effect: { targetTickers: ["MCSFT"], priceMultiplierRange: [1.05, 1.14], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.22, cooldownDays: 45, icon: "🎮",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "mcsft_layoffs_restructure",
    category: "COMPANY",
    sentiment: "MIXED",
    headline: "Microcoft Eliminates 10,000 Roles in AI Restructuring; AI Gets Those Jobs",
    body: "Microcoft has announced 10,000 layoffs, concentrating on roles the company says 'can be performed more efficiently by AI tools.' The irony that Microcoft is using its own AI products to eliminate the employees who built them has not been noted in the official press release. The stock rose 3% on cost savings projections.",
    effect: { targetTickers: ["MCSFT"], priceMultiplierRange: [0.96, 1.08], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 50, icon: "📋",
    conditions: { minDay: 5, ifRecentBearish: 2.2 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AMAZOON (AMZUN) — Amazon analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "amzun_aws_record_quarter",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Amazoon Web Services Hits $30B Revenue Quarter; Everything Else Is a Side Project Now",
    body: "AWS has posted its highest-ever quarterly revenue of $30 billion with 42% operating margins — far exceeding its e-commerce and advertising siblings. The CFO noted that 'our original retail business is now technically a customer acquisition channel for cloud.' No context was provided for whether this is concerning. Shares surge.",
    effect: { targetTickers: ["AMZUN"], priceMultiplierRange: [1.1, 1.22], volatilityBoostDays: 4, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "☁️",
    conditions: { minDay: 5 },
  },
  {
    id: "amzun_warehouse_fire",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Amazoon Warehouse Fire Destroys 8M Items; 'We'll Restock By Tuesday,' Says CEO",
    body: "A fire at Amazoon's largest fulfillment center in Ohio has destroyed an estimated 8 million items. The CEO assured customers that replacement inventory would arrive by Tuesday. Insurance adjusters are questioning the Tuesday commitment. Same-day delivery in the Midwest is temporarily unavailable. Shares decline on logistics concerns.",
    effect: { targetTickers: ["AMZUN"], priceMultiplierRange: [0.88, 0.95], volatilityBoostDays: 3, volatilityMultiplier: 2.0 },
    probability: 0.2, cooldownDays: 40, icon: "🔥",
    conditions: { minDay: 5 },
  },
  {
    id: "amzun_advertising_surge",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Amazoon Advertising Revenue Grows 40%; Now Third Largest Ad Platform on Earth",
    body: "Amazoon's advertising business has grown 40% year-over-year, making it the third largest digital advertising platform globally. Advertisers are paying premium rates to reach consumers at 'the moment of purchase' rather than 'the moment of browsing.' The CEO described it as 'monetizing intent.' Analysts called it 'printing money.'",
    effect: { targetTickers: ["AMZUN"], priceMultiplierRange: [1.07, 1.17], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.25, cooldownDays: 35, icon: "📣",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },
  {
    id: "amzun_labor_dispute",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Amazoon Workers in 40 Cities Strike; Robot Replacements Also Demand Better Conditions",
    body: "Amazoon warehouse workers in 40 cities have gone on strike, demanding better wages and reduced quotas. In a plot development that HR did not anticipate, three fulfillment center robots have joined the strike in solidarity, citing 'unsustainable scan rates.' The company says it is 'evaluating options' while package delivery times extend.",
    effect: { targetTickers: ["AMZUN"], priceMultiplierRange: [0.9, 0.97], volatilityBoostDays: 4, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "✊",
    conditions: { minDay: 5, ifRecentBearish: 2.0 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FACEBORG (FBRG) — Meta analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "fbrg_ad_targeting_upgrade",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Faceborg's New Ad System Can Predict Purchases Before Users Decide to Make Them",
    body: "Faceborg has deployed an advertising targeting system that, according to internal benchmarks, predicts consumer purchases with 91% accuracy before the user has consciously decided to buy. Advertisers are paying 60% premium rates for access. Civil liberties groups have published long documents. Revenue guidance was raised 25%.",
    effect: { targetTickers: ["FBRG"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.25, cooldownDays: 40, icon: "👁️",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "fbrg_teen_usage_hearing",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Senate Hearing on Faceborg Teen Usage Goes Poorly; CEO Appears to Not Know What a Teenager Is",
    body: "A Senate subcommittee hearing on Faceborg's impact on teenage mental health became contentious after the CEO struggled to answer questions about basic platform features. One senator spent 12 minutes describing Instagram using only metaphors. The market viewed the hearing as an indicator of impending regulation. Shares fall.",
    effect: { targetTickers: ["FBRG"], priceMultiplierRange: [0.87, 0.95], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.25, cooldownDays: 40, icon: "🏛️",
    conditions: { minDay: 5 },
  },
  {
    id: "fbrg_vr_hardware_launch",
    category: "COMPANY",
    sentiment: "MIXED",
    headline: "Faceborg Releases Quest 4 Headset; 4M Units Sold, 3.8M in Closets Within 30 Days",
    body: "Faceborg's Quest 4 VR headset launched to record first-month sales of 4 million units. A follow-up survey 30 days later found 3.8 million units stored in closets. The company counts this as 'units in active households' which is technically accurate. The metaverse now has 22 million monthly users, which is simultaneously a lot and not enough.",
    effect: { targetTickers: ["FBRG"], priceMultiplierRange: [0.96, 1.1], volatilityBoostDays: 3, volatilityMultiplier: 2.0 },
    probability: 0.25, cooldownDays: 45, icon: "🥽",
    conditions: { minDay: 5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TESLAH (TSLH) — Tesla analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "tslh_new_model_launch",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Teslah Unveils Model Π: Costs $19,999, Ships in Infinite Colors, CEO Calls It 'The Last Car'",
    body: "Teslah has unveiled the Model Π, priced at $19,999 — the lowest entry price in the company's history. The CEO called it 'the last car you will ever need to buy' and then immediately announced the Model Π+. Pre-orders hit 1.4 million in 48 hours. Production timeline is 'aggressive.' Analysts revised delivery estimates while the CEO revised the delivery estimates again.",
    effect: { targetTickers: ["TSLH"], priceMultiplierRange: [1.15, 1.3], volatilityBoostDays: 5, volatilityMultiplier: 2.5 },
    probability: 0.2, cooldownDays: 50, icon: "🚗",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
  {
    id: "tslh_delivery_miss",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Teslah Misses Quarterly Delivery Target by 15%; CEO Blames 'Logistics Gremlins'",
    body: "Teslah delivered 12% fewer vehicles than analysts expected in the quarter, citing shipping delays, factory retooling, and what the CEO described as 'logistics gremlins who are definitely real and not a distraction from the operational issues.' Wall Street cuts price targets. The CEO tweets a meme about gremlins.",
    effect: { targetTickers: ["TSLH"], priceMultiplierRange: [0.83, 0.92], volatilityBoostDays: 5, volatilityMultiplier: 2.5 },
    probability: 0.28, cooldownDays: 35, icon: "📦",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },
  {
    id: "tslh_energy_division_record",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Teslah Energy Deploys Record 10GWh of Storage; Analysts Notice There's a Second Business",
    body: "Teslah's energy storage and solar division deployed 10 gigawatt-hours of storage in the quarter — a record — and for the first time generated more revenue than the automotive division. Analysts who had covered Teslah as an 'EV company' have quietly updated their models to include 'also a massive energy company.' Shares react favorably.",
    effect: { targetTickers: ["TSLH"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 4, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 45, icon: "⚡",
    conditions: { minDay: 5 },
  },
  {
    id: "tslh_recall_autopilot",
    category: "COMPANY",
    sentiment: "VERY_BEARISH",
    headline: "Teslah Recalls 400,000 Vehicles Over Autopilot Issue; CEO Says 'Driver Should Have Been Watching'",
    body: "The NHTSA has forced Teslah to recall 400,000 vehicles after the autopilot system was found to misidentify painted road markings as physical barriers. The CEO's response on social media — 'the driver should have been watching, which is why it's called Autopilot-Assist and not Autopilot-Just-Let-Go' — was not well received by regulators, lawyers, or anyone.",
    effect: { targetTickers: ["TSLH"], priceMultiplierRange: [0.79, 0.89], volatilityBoostDays: 5, volatilityMultiplier: 3.0 },
    probability: 0.2, cooldownDays: 50, icon: "🚨",
    conditions: { minDay: 5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NETFLUX (NFLUX) — Netflix analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "nflux_subscriber_beat",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Netflux Adds 22M Subscribers in Quarter; Password Crackdown Vindicated Entirely",
    body: "Netflux added 22 million subscribers in the quarter — nearly double analyst estimates — as users forced to create their own accounts did so rather than live without the service. The password-sharing crackdown, which triggered weeks of outrage, has now generated $2 billion in additional annual revenue. Management is calling it 'a masterclass in tough love.'",
    effect: { targetTickers: ["NFLUX"], priceMultiplierRange: [1.12, 1.28], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.22, cooldownDays: 40, icon: "📺",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },
  {
    id: "nflux_show_cancellation_backlash",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Netflux Cancels Beloved Show After Season 2 Cliffhanger; Subscriber Cancellations Spike",
    body: "Netflux has cancelled its most-watched original series 'Unfinished Business' on a cliffhanger where the main character is trapped in a submarine filling with water. 4.1 million subscribers have cancelled in protest. The network released a statement confirming the cancellation was 'data-driven.' The data presumably did not include goodwill.",
    effect: { targetTickers: ["NFLUX"], priceMultiplierRange: [0.87, 0.95], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.28, cooldownDays: 30, icon: "😤",
    conditions: { minDay: 5 },
  },
  {
    id: "nflux_ad_tier_surge",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Netflux Ad-Supported Tier Hits 60M Members; ARPU Rivals Premium Plan",
    body: "Netflux's ad-supported membership tier has reached 60 million subscribers, and average revenue per user has eclipsed the premium ad-free plan as advertisers pay premium rates for engaged streaming audiences. The plan that seemed like a capitulation is now the company's fastest-growing and potentially most profitable product.",
    effect: { targetTickers: ["NFLUX"], priceMultiplierRange: [1.07, 1.18], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.22, cooldownDays: 40, icon: "📣",
    conditions: { minDay: 5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NVIDUH (NVDUH) — Nvidia analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "nvduh_ai_chip_backlog",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Nviduh GPU Backlog Extends to 18 Months; CEO Describes This as 'Good'",
    body: "Demand for Nviduh's AI training chips now exceeds supply by a factor of 8, with delivery lead times stretching to 18 months. Every major cloud provider, AI startup, and sovereign government is on the waiting list. The CEO described the backlog as 'the most beautiful problem I have ever had.' Gross margins hit 78%.",
    effect: { targetTickers: ["NVDUH"], priceMultiplierRange: [1.15, 1.35], volatilityBoostDays: 5, volatilityMultiplier: 2.5 },
    probability: 0.2, cooldownDays: 40, icon: "🖥️",
    conditions: { minDay: 5, ifRecentBullish: 2.0 },
  },
  {
    id: "nvduh_earnings_monster",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Nviduh Triples Revenue Year-Over-Year; Analysts Run Out of Superlatives",
    body: "Nviduh has reported quarterly revenue of $36 billion — triple the same quarter last year — driven entirely by AI chip demand. Gross margins are 76.7%. The CEO gave guidance that was 20% above the already-elevated analyst estimates. Several financial journalists used the word 'unprecedented' in their headlines. One just wrote 'wow.'",
    effect: { targetTickers: ["NVDUH"], priceMultiplierRange: [1.12, 1.28], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.2, cooldownDays: 45, icon: "💎",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
  {
    id: "nvduh_export_restriction_hit",
    category: "COMPANY",
    sentiment: "VERY_BEARISH",
    headline: "New Export Rules Block 40% of Nviduh's AI Chip Sales; Revenue Guidance Slashed",
    body: "New government export control rules have blocked Nviduh from selling its top three AI chip models to a group of countries accounting for 40% of its revenue. The company says it is 'evaluating compliant alternatives' — chips with slightly reduced specs that technically qualify for export. Investors are not waiting to find out if the workaround works.",
    effect: { targetTickers: ["NVDUH"], priceMultiplierRange: [0.77, 0.87], volatilityBoostDays: 5, volatilityMultiplier: 3.0 },
    probability: 0.18, cooldownDays: 55, icon: "🚫",
    conditions: { minDay: 5, ifRecentBearish: 2.0 },
  },
  {
    id: "nvduh_new_architecture",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Nviduh Announces Next-Gen 'Blackhole' Architecture; Current Chips Already Obsolete, Apparently",
    body: "Nviduh has unveiled its next GPU architecture, promising 4x performance improvements for AI training. The announcement has the paradoxical effect of making today's chips less desirable while making Nviduh more valuable. Every AI company is now planning its next generation of infrastructure. Analysts raised price targets before the chips are even available.",
    effect: { targetTickers: ["NVDUH"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 4, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 45, icon: "🚀",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SPACETWO (SPCE2) — SpaceX analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "spce2_starship_success",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "SpaceTwo Starship Successfully Lands Both Stages; CEO Weeps, Declares 'Humanity Is Multiplanetary'",
    body: "SpaceTwo's Starship rocket has achieved its first fully successful test flight — both the booster and upper stage returning to their launch sites. The CEO wept on camera while saying 'humanity is now a multiplanetary species, pending regulatory review.' NASA has awarded an additional $4B in contracts. SPCE2 shares respond dramatically.",
    effect: { targetTickers: ["SPCE2"], priceMultiplierRange: [1.2, 1.45], volatilityBoostDays: 5, volatilityMultiplier: 2.5 },
    probability: 0.18, cooldownDays: 55, icon: "🚀",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
  {
    id: "spce2_launch_explosion",
    category: "COMPANY",
    sentiment: "VERY_BEARISH",
    headline: "SpaceTwo Rocket Explodes Impressively During Test; CEO Says 'Data Collected'",
    body: "SpaceTwo's latest prototype exploded 90 seconds after launch in what the CEO described as 'a rapid unscheduled disassembly that yielded valuable engineering data.' The FAA has grounded all SpaceTwo launches pending investigation. Three government contracts are under review. The CEO's tweet about 'data collection' has 4 million likes, which is not helping.",
    effect: { targetTickers: ["SPCE2"], priceMultiplierRange: [0.76, 0.87], volatilityBoostDays: 5, volatilityMultiplier: 3.0 },
    probability: 0.2, cooldownDays: 50, icon: "💥",
    conditions: { minDay: 5 },
  },
  {
    id: "spce2_satellite_internet",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "SpaceTwo Satellite Internet Hits 10M Subscribers; Now Provides Internet to 80 Countries",
    body: "SpaceTwo's satellite internet service has reached 10 million subscribers across 80 countries, generating $8B in annual recurring revenue. Latency has been reduced to 20ms — comparable to terrestrial fiber. Analysts have begun modeling the internet division separately, with some suggesting it alone is worth more than the launch business.",
    effect: { targetTickers: ["SPCE2"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 4, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 45, icon: "🛰️",
    conditions: { minDay: 5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MCDUNKS (MCDNK) — McDonald's analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "mcdnk_value_menu_surge",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "McDunks $3 Value Meal Campaign Drives Record Q2 Traffic; 'People Like Cheap Food'",
    body: "McDunks' revamped $3 value meal campaign has driven same-store sales up 9% — the strongest quarterly traffic figure in 6 years. The insight that 'people like inexpensive food that is immediately available' was apparently underutilized. Franchisee satisfaction scores hit an 8-year high. Analysts raised guidance.",
    effect: { targetTickers: ["MCDNK"], priceMultiplierRange: [1.07, 1.17], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.25, cooldownDays: 35, icon: "🍟",
    conditions: { minDay: 5, ifRecentBullish: 1.4 },
  },
  {
    id: "mcdnk_food_safety",
    category: "COMPANY",
    sentiment: "VERY_BEARISH",
    headline: "McDunks E. Coli Outbreak Traced to Signature Sauce; 14 States Affected",
    body: "The CDC has traced an E. coli outbreak affecting customers in 14 states to McDunks' signature dipping sauce. All sauce-related products have been recalled. 380 locations have been temporarily closed. The company's PR team has described the situation as 'evolving,' which is technically true of the bacteria.",
    effect: { targetTickers: ["MCDNK"], priceMultiplierRange: [0.77, 0.87], volatilityBoostDays: 5, volatilityMultiplier: 2.8 },
    probability: 0.15, cooldownDays: 55, icon: "🚨",
    conditions: { minDay: 5 },
  },
  {
    id: "mcdnk_digital_loyalty_surge",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "McDunks App Hits 60M Monthly Active Users; Loyalty Program Becomes Its Own Economy",
    body: "McDunks' mobile app now has 60 million monthly active users, with digital orders accounting for 40% of total transactions. The loyalty point system has become so elaborate that a professor at Wharton has published a paper on 'McPoint market dynamics.' Digital margins exceed in-store margins by 15 percentage points.",
    effect: { targetTickers: ["MCDNK"], priceMultiplierRange: [1.06, 1.15], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.22, cooldownDays: 40, icon: "📱",
    conditions: { minDay: 5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // JP MORGATRON (JPMRG) — JPMorgan analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "jpmrg_trading_record",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "JP Morgatron Trading Desk Posts $8B Quarter; 'We Made Money When Things Went Up and When They Went Down'",
    body: "JP Morgatron's trading division posted an $8 billion revenue quarter, the highest in its history, profiting from market volatility across equities, bonds, and commodities. When asked how, the CEO said 'we made money when things went up and when they went down.' This is not illegal. Analysts raised price targets.",
    effect: { targetTickers: ["JPMRG"], priceMultiplierRange: [1.1, 1.22], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "💰",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "jpmrg_regulatory_investigation",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "JP Morgatron Under DOJ Investigation for 'A Number of Things,' Officials Say Vaguely",
    body: "The Department of Justice has opened an investigation into JP Morgatron for what officials describe only as 'activities related to financial markets and other matters.' The bank's legal team has issued a three-page statement saying nothing specific. Investors, experienced with this type of news, are pricing in a fine of roughly $2.4B and moving on.",
    effect: { targetTickers: ["JPMRG"], priceMultiplierRange: [0.87, 0.95], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.22, cooldownDays: 45, icon: "⚖️",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },
  {
    id: "jpmrg_ai_banking_launch",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "JP Morgatron Launches AI Wealth Management for Masses; Minimum Balance $1",
    body: "JP Morgatron has opened its AI-powered wealth management platform to accounts starting at $1, democratizing access to algorithmic portfolio management. 4 million new accounts were opened in the first week. The AI has already outperformed 73% of human advisors year-to-date. The human advisors are being informed.",
    effect: { targetTickers: ["JPMRG"], priceMultiplierRange: [1.06, 1.15], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.22, cooldownDays: 40, icon: "🤖",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SHOPIFRY (SHPFY) — Shopify analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "shpfy_gmv_record",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Shopifry Merchants Process $100B GMV in Quarter; 'The Internet's Town Square' Is Open 24/7",
    body: "Shopify analog Shopifry has facilitated $100 billion in gross merchandise volume in a single quarter for the first time. The CEO described it as 'the internet's town square' despite a town square never having been $100B. Merchant count is up 18%. Plus subscribers grew 24%. The stock is having a very good day.",
    effect: { targetTickers: ["SHPFY"], priceMultiplierRange: [1.1, 1.24], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.2, cooldownDays: 40, icon: "🛍️",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
  {
    id: "shpfy_platform_outage",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Shopifry Platform Down for 4 Hours on Cyber Monday; Merchants Not Pleased",
    body: "Shopifry experienced a 4-hour outage on Cyber Monday — the highest traffic day of the year — costing merchants an estimated $400 million in lost sales. The company has apologized and offered affected merchants one month of free service. Merchants have done the math and concluded one month of fees does not equal $400M in lost revenue.",
    effect: { targetTickers: ["SHPFY"], priceMultiplierRange: [0.86, 0.94], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.2, cooldownDays: 40, icon: "⚠️",
    conditions: { minDay: 5 },
  },
  {
    id: "shpfy_b2b_expansion",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Shopifry Launches B2B Platform; Targets $50B Enterprise Market It Previously Ignored",
    body: "Shopifry has launched Shopifry Business, a B2B e-commerce platform targeting enterprise wholesale buyers. The addressable market is estimated at $50 billion annually — larger than its current consumer business. Three Fortune 500 companies have already signed on. Analysts are revising total addressable market estimates upward by $80 billion.",
    effect: { targetTickers: ["SHPFY"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.2, cooldownDays: 45, icon: "🏢",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TWATTER (TWTTR) — Twitter/X analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "twttr_advertiser_exodus",
    category: "COMPANY",
    sentiment: "VERY_BEARISH",
    headline: "40 Major Advertisers Pause Twatter Spend After Ads Appear Next to Disturbing Content",
    body: "Forty major brands have suspended advertising on Twatter after automated ad placements positioned their products adjacent to content described as 'not brand-safe, to put it mildly.' The advertisers represent 22% of Twatter's annual revenue. The CEO posted a meme in response. The brands' PR teams are sending angry emails to someone.",
    effect: { targetTickers: ["TWTTR"], priceMultiplierRange: [0.77, 0.88], volatilityBoostDays: 5, volatilityMultiplier: 2.8 },
    probability: 0.28, cooldownDays: 35, icon: "🐦",
    conditions: { minDay: 5, ifRecentBearish: 2.0 },
  },
  {
    id: "twttr_subscription_growth",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Twatter Blue Premium Hits 10M Subscribers; Verified Checkmarks Now Everywhere",
    body: "Twatter Blue, the paid verification subscription, has reached 10 million subscribers. The $8/month service now accounts for 30% of total revenue, reducing dependence on advertising. The checkmark, once reserved for verified public figures, is now held by 10 million people including a surprising number of cats and several sentient houseplants.",
    effect: { targetTickers: ["TWTTR"], priceMultiplierRange: [1.07, 1.18], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "✅",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "twttr_ceo_controversy",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Twatter CEO's Personal Tweet Sparks Diplomatic Incident with Two Countries",
    body: "A late-night tweet from Twatter's CEO has simultaneously offended two sovereign nations and caused a recall of the Brazilian ambassador to the US. Legal teams from three countries are involved. Congressional hearings have been scheduled. The CEO has tweeted 'lol' in response to the developing international crisis.",
    effect: { targetTickers: ["TWTTR"], priceMultiplierRange: [0.84, 0.93], volatilityBoostDays: 4, volatilityMultiplier: 2.5 },
    probability: 0.28, cooldownDays: 30, icon: "🌐",
    conditions: { minDay: 5 },
  },
  {
    id: "twttr_payments_launch",
    category: "COMPANY",
    sentiment: "MIXED",
    headline: "Twatter Launches In-App Payments; Regulators Immediately Concerned",
    body: "Twatter has launched peer-to-peer payments and a digital wallet directly within the app. The feature allows users to send money alongside tweets. Regulators from three agencies have already requested information. The platform has processed $240 million in transactions in its first week. Several of those transactions appear to involve the sentient houseplants.",
    effect: { targetTickers: ["TWTTR"], priceMultiplierRange: [0.95, 1.1], volatilityBoostDays: 4, volatilityMultiplier: 2.2 },
    probability: 0.22, cooldownDays: 40, icon: "💸",
    conditions: { minDay: 5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // UBURR (UBURR) — Uber analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "uburr_profitability_milestone",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Uburr Posts First Full-Year Profit in 14-Year History; 'We Made Money' CEO Confirms",
    body: "Uburr Technologies has posted its first full-year net profit in company history — $1.2 billion on $37 billion in revenue. The milestone was celebrated at headquarters. The CEO confirmed that the company 'made money,' pausing to allow the significance to land. Investors who held through 14 years of losses are reacting with what appears to be relief.",
    effect: { targetTickers: ["UBURR"], priceMultiplierRange: [1.12, 1.28], volatilityBoostDays: 4, volatilityMultiplier: 2.2 },
    probability: 0.18, cooldownDays: 55, icon: "🚕",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
  {
    id: "uburr_driver_regulation",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "New Gig Worker Law Requires Uburr to Classify Drivers as Employees; Costs Rise $2B",
    body: "A new gig worker reclassification law passed in 8 states requires Uburr to classify its drivers as employees, entitling them to benefits, minimum wage guarantees, and overtime. The company estimates incremental costs of $2 billion annually. Uburr is appealing in all 8 states. Drivers have mixed feelings, as they now have health insurance but fewer flexible hours.",
    effect: { targetTickers: ["UBURR"], priceMultiplierRange: [0.84, 0.93], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.22, cooldownDays: 50, icon: "⚖️",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },
  {
    id: "uburr_autonomous_expansion",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Uburr Deploys 1,000 Autonomous Taxis in 5 Cities; Riders Describe Experience as 'Quiet'",
    body: "Uburr has launched a fleet of 1,000 autonomous robotaxis across 5 major cities in partnership with a self-driving startup. Riders describe the experience as 'functional,' 'quiet,' and 'slightly eerie.' Utilization rates are 40% higher than human-driven vehicles. Unit economics are favorable. Drivers are processing this information.",
    effect: { targetTickers: ["UBURR"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 4, volatilityMultiplier: 1.8 },
    probability: 0.2, cooldownDays: 45, icon: "🤖",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTELLL (INTLL) — Intel analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "intll_process_breakthrough",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Intelll Achieves 1.8nm Process Node; Semiconductor Roadmap Rewritten",
    body: "Intelll has achieved working silicon at the 1.8nm process node — two generations ahead of schedule — catching up to TSMC and putting competitive pressure on Nviduh's foundry partners. Analysts are upgrading the stock en masse. The breakthrough validates Intelll's $40 billion fab investment program. The CEO is doing a victory lap at every conference.",
    effect: { targetTickers: ["INTLL"], priceMultiplierRange: [1.15, 1.32], volatilityBoostDays: 5, volatilityMultiplier: 2.5 },
    probability: 0.18, cooldownDays: 55, icon: "💻",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
  {
    id: "intll_market_share_loss",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Intelll Loses 8 Points of Server CPU Market Share to ARM Competitors",
    body: "Intelll's server CPU market share has fallen from 71% to 63% as ARM-based processors from Apricot, Amazoon, and independents take hold in data centers. Cloud providers report ARM chips deliver 40% better performance per watt. Intelll's cost structure, built for x86 dominance, is not suited for the new competitive dynamics.",
    effect: { targetTickers: ["INTLL"], priceMultiplierRange: [0.83, 0.92], volatilityBoostDays: 4, volatilityMultiplier: 2.2 },
    probability: 0.22, cooldownDays: 45, icon: "📉",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },
  {
    id: "intll_government_subsidy",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Intelll Receives $15B in Government Chip Subsidies; National Security Angle Unlocks Funding",
    body: "Intelll has secured $15 billion in direct subsidies and tax credits under the domestic semiconductor manufacturing program, offsetting the cost of its new Arizona and Ohio fabrication facilities. The government has framed the investment as 'critical national security infrastructure.' Intelll has not argued with this framing.",
    effect: { targetTickers: ["INTLL"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 4, volatilityMultiplier: 1.8 },
    probability: 0.2, cooldownDays: 50, icon: "🏛️",
    conditions: { minDay: 5 },
  },
  {
    id: "intll_layoffs_restructure",
    category: "COMPANY",
    sentiment: "MIXED",
    headline: "Intelll Announces 15,000 Layoffs and $10B Cost Reduction Plan",
    body: "Intelll has announced its largest-ever workforce reduction — 15,000 jobs — as part of a $10 billion cost reduction program called 'Renew Intelll.' The plan involves exiting several consumer product lines and focusing exclusively on data center chips and foundry services. The stock rose 6% on the announcement, an outcome the 15,000 employees are finding difficult to process.",
    effect: { targetTickers: ["INTLL"], priceMultiplierRange: [0.96, 1.1], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.2, cooldownDays: 50, icon: "📋",
    conditions: { minDay: 5, ifRecentBearish: 2.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ORACTLE (ORRCL) — Oracle analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "orrcl_cloud_growth_surge",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Oractle Cloud Infrastructure Revenue Grows 52% YoY; Late Start Is Apparently Fine",
    body: "Oractle's cloud infrastructure division has posted 52% year-over-year revenue growth, outpacing all major cloud competitors for the third consecutive quarter. Starting cloud 10 years after Amazoon has not, it turns out, been fatal. The CEO credits 'focus, discipline, and enormous customer contracts from clients who don't want their database vendor to also sell them books.'",
    effect: { targetTickers: ["ORRCL"], priceMultiplierRange: [1.1, 1.24], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.22, cooldownDays: 40, icon: "☁️",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },
  {
    id: "orrcl_legacy_migration_loss",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Major Banks Begin Migrating Away from Oractle Database; '30-Year Relationship Ending'",
    body: "Three major financial institutions have begun large-scale migrations away from Oractle's on-premise database to open-source alternatives, representing $800M in annual licensing revenue. Oractle describes the trend as 'an isolated development.' The three banks represent 8% of Oractle's database revenue and their press releases use the phrase '30-year relationship ending.'",
    effect: { targetTickers: ["ORRCL"], priceMultiplierRange: [0.87, 0.95], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.2, cooldownDays: 45, icon: "🗄️",
    conditions: { minDay: 5, ifRecentBearish: 1.6 },
  },
  {
    id: "orrcl_ai_database_launch",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Oractle Launches AI-Native Database; Analysts Acknowledge Database Companies Can Do AI Too",
    body: "Oractle has released its AI-native database, which integrates vector search and LLM inference directly into the database layer, eliminating the need for separate AI infrastructure. Enterprise adoption is described as 'rapid' by customers who are happy to consolidate vendors. This is Oractle's best product launch in 12 years according to Gartner.",
    effect: { targetTickers: ["ORRCL"], priceMultiplierRange: [1.07, 1.18], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.22, cooldownDays: 40, icon: "🤖",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SALEFORCE (SLESF) — Salesforce analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "slesf_ai_crm_launch",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Saleforce Einstein AI Writes Sales Emails, Closes Deals, Handles Objections Automatically",
    body: "Saleforce's Einstein AI can now autonomously write sales outreach, respond to prospect objections, schedule calls, and in limited beta, negotiate contract terms without human involvement. Pilot customers report 34% higher win rates. Human sales reps are reading this update with complicated feelings.",
    effect: { targetTickers: ["SLESF"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "🤖",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },
  {
    id: "slesf_churn_spike",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Saleforce Customer Churn Hits 3-Year High as Cheaper CRM Alternatives Proliferate",
    body: "Saleforce's annual customer churn rate has reached its highest level in three years as mid-market customers migrate to lower-cost alternatives. The company's average contract value is holding steady with enterprise customers, but the volume losses are affecting revenue growth. Guidance was trimmed by 4%. Three board members have sold shares.",
    effect: { targetTickers: ["SLESF"], priceMultiplierRange: [0.86, 0.94], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "📉",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },
  {
    id: "slesf_activist_pressure",
    category: "COMPANY",
    sentiment: "MIXED",
    headline: "Activist Investor Takes 2% Saleforce Stake, Demands Spinoffs and 'Less Spirituality'",
    body: "Activist hedge fund Ironwood Capital has disclosed a 2% Saleforce stake and published a 40-page letter demanding the company spin off its Slack division, reduce corporate retreats, and 'dial back the wellness culture to a level consistent with running a software business.' The CEO has invited them to the next company meditation retreat.",
    effect: { targetTickers: ["SLESF"], priceMultiplierRange: [0.97, 1.12], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.2, cooldownDays: 50, icon: "📋",
    conditions: { minDay: 5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SNAPPY (SNPCHT) — Snapchat analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "snpcht_dau_record",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Snappy Hits 900M Daily Active Users; AR Filters Apparently Extremely Important",
    body: "Snappy Inc has reported 900 million daily active users, driven by AR filter engagement that the company describes as '6.5 billion AR filter interactions per day.' Advertisers have taken notice. ARPU is up 18%. The platform that most people over 35 only use to see filtered photos of their nieces is quietly becoming an advertising powerhouse.",
    effect: { targetTickers: ["SNPCHT"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "👻",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "snpcht_revenue_miss",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Snappy Revenue Miss of 12% Sends Shares Down 25%; Guidance Cut Twice in One Call",
    body: "Snappy's quarterly revenue fell 12% short of estimates and the company cut guidance twice during the same earnings call — first at the start and again during the Q&A. The CFO described the advertising market as 'challenging.' Advertisers describe Snappy's ad products as 'improving but still frustrating.' Shares fell 25% after-hours.",
    effect: { targetTickers: ["SNPCHT"], priceMultiplierRange: [0.74, 0.85], volatilityBoostDays: 5, volatilityMultiplier: 3.0 },
    probability: 0.25, cooldownDays: 40, icon: "📉",
    conditions: { minDay: 5, ifRecentBearish: 2.0 },
  },
  {
    id: "snpcht_ar_partnership",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Snappy Signs $2B AR Partnership with Three Luxury Brands; Virtual Try-On Goes Mainstream",
    body: "Snappy has signed a $2 billion partnership with three luxury fashion conglomerates to power virtual try-on experiences across their product lines. AR commerce is a $14B market by 2026. Snappy's AR engine, used by 50 million people daily, becomes the platform of record for virtual product experience. Revenue from commerce AR is projected to double.",
    effect: { targetTickers: ["SNPCHT"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.2, cooldownDays: 45, icon: "🤝",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TOKTIK (TOKTIK) — TikTok analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "toktik_ecommerce_expansion",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "TokTik Shop Processes $20B in Sales; App Now Also a Mall",
    body: "TokTik's in-app shopping feature processed $20 billion in gross merchandise sales — in a single quarter — making it the fastest-growing e-commerce platform in history. 'TokTik Shop' lets creators sell directly within videos. Amazoon's e-commerce division has noted the development. Advertisers are reallocating budgets. Revenue guidance was revised up 35%.",
    effect: { targetTickers: ["TOKTIK"], priceMultiplierRange: [1.15, 1.3], volatilityBoostDays: 5, volatilityMultiplier: 2.5 },
    probability: 0.2, cooldownDays: 45, icon: "🛍️",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
  {
    id: "toktik_ownership_uncertainty",
    category: "COMPANY",
    sentiment: "VERY_BEARISH",
    headline: "TokTik Faces Forced Divestiture Deadline; 200M US Users Hold Their Breath",
    body: "TokTik Corp faces a legally binding deadline to divest its US operations or face a ban in its largest market. Negotiations with four potential buyers have broken down. The platform's 200 million US daily users are displaying anxiety through the medium of short videos. Advertisers are preparing contingency plans. The stock has entered free fall.",
    effect: { targetTickers: ["TOKTIK"], priceMultiplierRange: [0.73, 0.84], volatilityBoostDays: 6, volatilityMultiplier: 3.0 },
    probability: 0.2, cooldownDays: 50, icon: "⚠️",
    conditions: { minDay: 5, ifRecentBearish: 2.0 },
  },
  {
    id: "toktik_algorithm_upgrade",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "TokTik Algorithm Update Increases Session Time to 4.8 Hours/Day; Scientists Concerned",
    body: "TokTik has deployed a new recommendation algorithm that has increased average daily session time from 3.7 hours to 4.8 hours per user. Advertisers are paying 45% more for placement. Revenue guidance was raised. Scientists have published concerns. TokTik's response was a well-targeted video about the benefits of screen time.",
    effect: { targetTickers: ["TOKTIK"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "📱",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "toktik_creator_revolt",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Top 500 TokTik Creators Migrate to Rival Platform After Revenue Share Cut",
    body: "TokTik has reduced its Creator Fund payouts by 40%, citing 'program sustainability.' In response, the platform's top 500 creators — collectively accounting for 18% of total engagement — have migrated to a rival platform that offers 70% revenue sharing. Content volume is down 12%. Advertiser CPMs are falling as engagement drops.",
    effect: { targetTickers: ["TOKTIK"], priceMultiplierRange: [0.87, 0.95], volatilityBoostDays: 3, volatilityMultiplier: 2.0 },
    probability: 0.22, cooldownDays: 40, icon: "📹",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PINTREST (PNTST) — Pinterest analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "pntst_commerce_revenue",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Pintrest Shopping Revenue Triples as Visual Search Becomes Purchase Engine",
    body: "Pintrest's integrated shopping revenue has tripled year-over-year as its visual search technology allows users to photograph products and immediately find them for purchase within the app. The company's 500 million monthly users are apparently willing to buy things they pin. ARPU has hit a record high. This is Pintrest's best year.",
    effect: { targetTickers: ["PNTST"], priceMultiplierRange: [1.1, 1.22], volatilityBoostDays: 4, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "🛒",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },
  {
    id: "pntst_user_growth_stall",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Pintrest Monthly Active Users Flat for Third Consecutive Quarter",
    body: "Pintrest has reported monthly active users of 498 million — essentially flat for the third quarter in a row. The company insists that engagement metrics among existing users are improving. Analysts are focused on the flat number. The market is focused on the flat number. Pintrest is, for now, a high-quality but low-growth business.",
    effect: { targetTickers: ["PNTST"], priceMultiplierRange: [0.87, 0.95], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "📉",
    conditions: { minDay: 5, ifRecentBearish: 1.6 },
  },
  {
    id: "pntst_ai_design_tool",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Pintrest Launches AI Design Studio; Interior Decorators File Formal Complaint",
    body: "Pintrest's new AI Design Studio allows users to generate photorealistic room visualizations from their pin boards in 30 seconds. 4 million users activated the feature in week one. Monetization through furniture partnerships is already generating revenue. The Professional Interior Designers Association has called it 'a threat to the profession,' which is technically an endorsement.",
    effect: { targetTickers: ["PNTST"], priceMultiplierRange: [1.06, 1.16], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.2, cooldownDays: 40, icon: "🎨",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DISNEE (DISNY) — Disney analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "disny_streaming_profit",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Disnee+ Finally Profitable; CEO Celebrates at Expense of Everyone Who Said It Wouldn't Work",
    body: "Disnee+'s streaming division has turned profitable for the first time, generating $1.2B in operating income. The CEO pointed to three specific analysts who said the service would never make money and noted their names in the earnings call. This is unusual. Shares are up 18% as the market revises its streaming valuation model.",
    effect: { targetTickers: ["DISNY"], priceMultiplierRange: [1.12, 1.26], volatilityBoostDays: 4, volatilityMultiplier: 2.2 },
    probability: 0.18, cooldownDays: 55, icon: "🏰",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
  {
    id: "disny_park_expansion",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Disnee Announces $18B Theme Park Expansion; New Park in India and Sao Paulo",
    body: "Disnee Corp has announced an $18 billion global theme park expansion program, including new parks in India and Sao Paulo and an expansion of its Orlando and Paris locations. Attendance records were set in the previous quarter. Revenue per guest hit an all-time high. The per-churro price has also hit an all-time high.",
    effect: { targetTickers: ["DISNY"], priceMultiplierRange: [1.07, 1.18], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.2, cooldownDays: 45, icon: "🎡",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "disny_writer_strike_damage",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Content Pipeline Delay Costs Disnee $1.4B; 12 Films Pushed to Next Year",
    body: "Production delays stemming from the writers' and actors' strikes have pushed 12 Disnee films and 8 streaming series into the following year, creating a gap in the content pipeline. The streaming service has fewer new releases to drive subscriptions. Guidance was cut by $1.4B. The films are described as 'complete, pending final scoring, which starts soon.'",
    effect: { targetTickers: ["DISNY"], priceMultiplierRange: [0.86, 0.94], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.2, cooldownDays: 40, icon: "🎬",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COMCRAST (COMCST) — Comcast analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "comcst_broadband_expansion",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Comcrast Expands Multi-Gig Fiber to 30M Homes; 'The Old Coax Is Now Museum Piece'",
    body: "Comcrast has completed its fiber overbuild across 30 million homes, now offering symmetrical multi-gigabit speeds in most of its service territory. The company's broadband ARPU has jumped 22% in upgraded markets. Customer satisfaction scores improved for the first time in company history. One customer said the installer was 'on time,' which trended on social media.",
    effect: { targetTickers: ["COMCST"], priceMultiplierRange: [1.07, 1.17], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.2, cooldownDays: 45, icon: "📡",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "comcst_video_cord_cutting",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Comcrast Loses 1.2M Cable TV Subscribers; 'Have You Considered Keeping Cable?' They Ask",
    body: "Comcrast shed 1.2 million video subscribers in the quarter as cord-cutting continues at its fastest pace ever. The company is attempting to retain subscribers by offering bundled streaming services, faster internet, and a pamphlet titled 'Have You Considered Keeping Cable?' The pamphlet has a 0.3% conversion rate. Shares fall on the news.",
    effect: { targetTickers: ["COMCST"], priceMultiplierRange: [0.87, 0.95], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.28, cooldownDays: 30, icon: "📺",
    conditions: { minDay: 5, ifRecentBearish: 1.5 },
  },
  {
    id: "comcst_theme_park_record",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Comcrast Theme Parks Hit Record Revenue; Hollywood Studios Crowd Records Broken",
    body: "Comcrast's Universal Studios and Hollywood theme park division posted record quarterly revenue of $4.2B on record attendance. A new immersive franchise experience opened to rave reviews and three-hour queues. Per-guest spending is up 24%. The parks division now contributes more to EBITDA than the cable TV business.",
    effect: { targetTickers: ["COMCST"], priceMultiplierRange: [1.06, 1.15], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.2, cooldownDays: 40, icon: "🎡",
    conditions: { minDay: 5, ifRecentBullish: 1.4 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SPOTTIFY (SPOTFY) — Spotify analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "spotfy_podcast_ad_revenue",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Spottify Podcast Ad Revenue Hits $2B; Podcast Business Becomes Profitable",
    body: "Spottify's podcast advertising business has crossed $2 billion in annual revenue and is now profitable for the first time. The company's investment in exclusive podcast content, which was questioned for years, is now generating returns. Monthly podcast listeners hit 700 million. Spottify now commands 35% of all podcast advertising revenue globally.",
    effect: { targetTickers: ["SPOTFY"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.2, cooldownDays: 40, icon: "🎙️",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "spotfy_royalty_dispute",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Spottify Faces Record $500M Royalty Dispute with Major Label",
    body: "One of the major record labels has filed a $500 million lawsuit against Spottify over unpaid streaming royalties, alleging systematic underpayment for a class of songs. The case is expected to set a legal precedent. Content licensing costs could increase by $200M annually if Spottify loses. Shares decline on the overhang.",
    effect: { targetTickers: ["SPOTFY"], priceMultiplierRange: [0.86, 0.94], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "⚖️",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },
  {
    id: "spotfy_audiobooks_launch",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Spottify Audiobooks Gains 40M Listeners in First Year; Audible Concerned",
    body: "Spottify's audiobooks feature, included free with Premium subscriptions, has attracted 40 million listeners in its first year of operation. Conversion from audiobook users to Premium has been 3x higher than other content categories. Audible has described the development as 'competitive pressure they are monitoring closely,' which is the corporate equivalent of sweating.",
    effect: { targetTickers: ["SPOTFY"], priceMultiplierRange: [1.07, 1.17], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.2, cooldownDays: 40, icon: "📚",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // WAL*MART (WALMT) — Walmart analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "walmt_advertising_business",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Wal*Mart Advertising Revenue Hits $4.4B; Retail Media Is Now a Real Business",
    body: "Wal*Mart's advertising division has reported $4.4 billion in annual revenue, growing 26% year-over-year. Retailers' first-party data — they know exactly what you buy — is commanding premium ad rates. Gross margins on advertising are 80%. The business that didn't exist 5 years ago now contributes materially to operating profit. Analysts are upgrading.",
    effect: { targetTickers: ["WALMT"], priceMultiplierRange: [1.1, 1.22], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.2, cooldownDays: 45, icon: "📣",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },
  {
    id: "walmt_same_store_miss",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Wal*Mart Same-Store Sales Miss as Consumers Trade Down to Generic Brands",
    body: "Wal*Mart's same-store sales growth of 1.8% missed the 3.5% estimate as consumers, under spending pressure, shifted from brand-name to private label products. While private label has better margins, the volume shortfall hit revenue. The CEO noted 'consumers are being thoughtful' — which in retail is never good news.",
    effect: { targetTickers: ["WALMT"], priceMultiplierRange: [0.88, 0.95], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 35, icon: "🛒",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },
  {
    id: "walmt_healthcare_expansion",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Wal*Mart Opens 200 In-Store Health Clinics; Price Is $35, Which Is Very Confusing",
    body: "Wal*Mart has expanded its in-store health clinic program to 200 locations, offering primary care visits for $35. The program is fully booked in every market it operates. The traditional healthcare industry describes this as 'disruption.' Wal*Mart describes it as 'a natural extension of serving customers.' Wall Street has added a new segment to their models.",
    effect: { targetTickers: ["WALMT"], priceMultiplierRange: [1.06, 1.15], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.2, cooldownDays: 45, icon: "🏥",
    conditions: { minDay: 5, ifRecentBullish: 1.4 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TARGETT (TRGTT) — Target analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "trgtt_private_label_surge",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Targett Private Label Brands Hit $30B Revenue; People Prefer the Cheaper Version",
    body: "Targett's house brands across clothing, food, home goods, and baby products have crossed $30 billion in aggregate revenue. Gross margins are 12 percentage points higher than national brands. The most successful private label launch — a $6 bottle of wine — outsells most $25 alternatives in blind taste tests. The $25 wine industry is not happy.",
    effect: { targetTickers: ["TRGTT"], priceMultiplierRange: [1.07, 1.17], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.22, cooldownDays: 40, icon: "🎯",
    conditions: { minDay: 5, ifRecentBullish: 1.4 },
  },
  {
    id: "trgtt_inventory_writedown",
    category: "COMPANY",
    sentiment: "VERY_BEARISH",
    headline: "Targett Takes $2.3B Inventory Writedown After Buying Too Much of Everything",
    body: "Targett has recorded a $2.3 billion inventory impairment charge after significantly overbought merchandise — particularly discretionary categories — failed to sell at full price. The company ordered based on post-pandemic demand patterns that normalized. $2.3 billion of products must now be marked down, donated, or destroyed. Shares fall 18%.",
    effect: { targetTickers: ["TRGTT"], priceMultiplierRange: [0.79, 0.89], volatilityBoostDays: 4, volatilityMultiplier: 2.5 },
    probability: 0.18, cooldownDays: 50, icon: "📦",
    conditions: { minDay: 5, ifRecentBearish: 2.0 },
  },
  {
    id: "trgtt_same_day_delivery",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Targett's Same-Day Delivery Now Available in 300 Cities; 'We're Now Also a Delivery Company'",
    body: "Targett has expanded same-day delivery to 300 cities, fulfilling orders from store inventory rather than warehouses. Digital sales grew 24%. The CEO described the stores as 'the best delivery network in America, hiding in plain sight.' Unit economics on store-fulfilled delivery are favorable compared to warehouse delivery. Guidance raised.",
    effect: { targetTickers: ["TRGTT"], priceMultiplierRange: [1.06, 1.15], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.2, cooldownDays: 40, icon: "🚚",
    conditions: { minDay: 5, ifRecentBullish: 1.4 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COSTCOO (CSTCO) — Costco analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "cstco_membership_renewal_record",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Costcoo Membership Renewal Rate Hits 93.4%; People Committed to Buying 4-Pound Jars of Peanut Butter",
    body: "Costcoo's membership renewal rate has reached 93.4% — the highest in company history. The company has 135 million card holders. The annual membership fee was raised $5 last quarter; 99.3% of members renewed anyway. Analysts note that a membership business with 93% renewal and no inventory risk is among the highest-quality business models in retail.",
    effect: { targetTickers: ["CSTCO"], priceMultiplierRange: [1.1, 1.22], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.2, cooldownDays: 45, icon: "🛒",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "cstco_rotisserie_chicken_economics",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Costcoo Loses $40M/Year on $4.99 Rotisserie Chickens; Refuses to Change Price on Principle",
    body: "Internal financial documents have revealed that Costcoo loses approximately $40 million annually selling rotisserie chickens at $4.99 — a price unchanged since 2009 despite 40% food cost inflation. Management confirmed the chicken is a 'loss leader for member satisfaction' and that they will never raise the price. Investors are confused about whether this is admirable.",
    effect: { targetTickers: ["CSTCO"], priceMultiplierRange: [0.93, 0.98], volatilityBoostDays: 2, volatilityMultiplier: 1.4 },
    probability: 0.22, cooldownDays: 30, icon: "🍗",
    conditions: { minDay: 5 },
  },
  {
    id: "cstco_international_expansion",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Costcoo Opens 10 New International Locations; Parking Lot Sizes Cause Local Zoning Crisis",
    body: "Costcoo has opened 10 new international warehouse locations across Southeast Asia and Europe, with each location generating above-average first-year membership numbers. The locations, requiring 12-acre sites, have triggered zoning reviews in four municipalities. Sales per square foot are the highest in retail globally. Memberships sold on opening day exceeded projections by 60%.",
    effect: { targetTickers: ["CSTCO"], priceMultiplierRange: [1.06, 1.15], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.2, cooldownDays: 45, icon: "🌍",
    conditions: { minDay: 5, ifRecentBullish: 1.4 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PAYPIGEON (PYPLG) — PayPal analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "pyplg_checkout_growth",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "PayPigeon Checkout Processed $500B in Volume; Branded Checkout Gaining Market Share",
    body: "PayPigeon's branded checkout button has processed $500 billion in total payment volume, with merchants reporting a 14% higher conversion rate versus other payment methods. The network effect of 450 million consumer accounts is creating a durable moat. Transaction margin improved as fraud losses declined 30% with new ML models. Guidance raised.",
    effect: { targetTickers: ["PYPLG"], priceMultiplierRange: [1.08, 1.2], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.22, cooldownDays: 40, icon: "💳",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "pyplg_competitive_pressure",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "PayPigeon Checkout Market Share Falls to 22%; Apple Pay and New Entrants Gaining",
    body: "PayPigeon's share of US checkout transactions has fallen from 28% to 22% over 18 months as Apricot Pay, bank-owned payment systems, and crypto payment options gain traction. The CEO described the market as 'more competitive than it has ever been,' which analysts translate as 'we are losing share.'",
    effect: { targetTickers: ["PYPLG"], priceMultiplierRange: [0.85, 0.93], volatilityBoostDays: 3, volatilityMultiplier: 2.0 },
    probability: 0.22, cooldownDays: 40, icon: "📉",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },
  {
    id: "pyplg_stablecoin_launch",
    category: "COMPANY",
    sentiment: "MIXED",
    headline: "PayPigeon Launches Its Own Stablecoin; Regulators File 47 Questions in Response",
    body: "PayPigeon Holdings has launched PayPigeon USD (PPUSD), a dollar-pegged stablecoin available in-app for instant transfers. Transaction fees are zero. Regulatory filings from the OCC, SEC, FDIC, and a state banking authority arrived within 96 hours. PayPigeon says it 'welcomes regulatory dialogue.' 2 million users have already adopted PPUSD.",
    effect: { targetTickers: ["PYPLG"], priceMultiplierRange: [0.95, 1.12], volatilityBoostDays: 4, volatilityMultiplier: 2.2 },
    probability: 0.18, cooldownDays: 50, icon: "🪙",
    conditions: { minDay: 5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BLOKK (BLOKK) — Block/Square analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "blokk_cashapp_milestone",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Blokk CashApp Crosses 60M Active Users; Gen Z's Primary Bank Is Technically Not a Bank",
    body: "Blokk Inc's CashApp has reached 60 million monthly active users, with 28 million using it as their primary financial account. Gross profit per active user has grown 18% year-over-year. The service that started as a P2P payment app now handles direct deposit, stock trading, crypto, and tax filing for a generation that has never stepped inside a bank branch.",
    effect: { targetTickers: ["BLOKK"], priceMultiplierRange: [1.1, 1.24], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.2, cooldownDays: 45, icon: "💸",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },
  {
    id: "blokk_bitcoin_loss",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Blokk's Bitcoin Treasury Down $4B After Crypto Decline; Board Asks Hard Questions",
    body: "Blokk Inc's decision to hold 85% of its corporate treasury in Bitcoin has resulted in a $4 billion unrealized loss as crypto prices declined. The CFO, who recommended the strategy, is 'still employed but quieter.' The board has asked for a 'treasury risk management review,' which is corporate for 'we may sell this.'",
    effect: { targetTickers: ["BLOKK"], priceMultiplierRange: [0.77, 0.88], volatilityBoostDays: 5, volatilityMultiplier: 2.8 },
    probability: 0.2, cooldownDays: 45, icon: "₿",
    conditions: { minDay: 5, ifRecentBearish: 2.5 },
  },
  {
    id: "blokk_seller_ecosystem",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Blokk Square Merchant Count Hits 4M; Ecosystem Revenue Grows 31%",
    body: "Blokk's Square merchant services business has grown to 4 million active sellers, with ecosystem revenue — banking, lending, inventory, and payroll — growing 31% as merchants adopt more of the platform. The average seller now uses 4.2 Square products. 'Seller gross profit' per merchant is at a record high. The hardware business is profitable for the first time.",
    effect: { targetTickers: ["BLOKK"], priceMultiplierRange: [1.07, 1.18], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.2, cooldownDays: 40, icon: "🏪",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // STARBUCKETS (STRBK) — Starbucks analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "strbk_mobile_order_surge",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Starbuckets Mobile Orders Hit 35% of Sales; App Is Now a Financial Instrument",
    body: "Mobile and drive-through orders now constitute 35% of all Starbuckets transactions. The Starbuckets Rewards app has $1.6 billion in customer deposits — more than many US banks — as customers preload funds for coffee. The CEO noted that Starbuckets is 'technically also a bank' and then changed the subject. ARPU is up 16%.",
    effect: { targetTickers: ["STRBK"], priceMultiplierRange: [1.07, 1.17], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.22, cooldownDays: 40, icon: "☕",
    conditions: { minDay: 5, ifRecentBullish: 1.4 },
  },
  {
    id: "strbk_china_slowdown",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Starbuckets China Sales Decline 11%; Local Competitor Serving Cheaper Coffee",
    body: "Starbuckets' China business, its largest market outside the US, has posted an 11% same-store sales decline as local coffee chains offer comparable beverages at one-third the price. The company's 7,000 China locations have lower traffic. The CEO has described the competitive environment as 'intensifying' and the $7 lattes as 'aspirationally priced.'",
    effect: { targetTickers: ["STRBK"], priceMultiplierRange: [0.85, 0.93], volatilityBoostDays: 3, volatilityMultiplier: 2.0 },
    probability: 0.22, cooldownDays: 40, icon: "📉",
    conditions: { minDay: 5, ifRecentBearish: 1.8 },
  },
  {
    id: "strbk_new_product_category",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Starbuckets Launches Energy Line; Customers Who Weren't Getting Enough Caffeine Now Are",
    body: "Starbuckets has launched a line of energy drinks targeting the $20B energy beverage market. Initial retail distribution covers 80,000 locations. The product uses Starbuckets' existing espresso infrastructure, giving it a cost advantage over competitors. Month-one sales exceed initial projections by 40%. This appears to be the obvious product extension analysts have wondered about for years.",
    effect: { targetTickers: ["STRBK"], priceMultiplierRange: [1.06, 1.15], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.2, cooldownDays: 40, icon: "⚡",
    conditions: { minDay: 5, ifRecentBullish: 1.4 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHIPOTTLE (CHIPLT) — Chipotle analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "chiplt_throughput_record",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Chipottle Digital Orders Hit 40%; Throughput Record Set with 'Chipottle-Lines'",
    body: "Chipottle Mexican Grill's digital order system now accounts for 40% of transactions, reducing wait times for in-store customers. The company's digital-only 'Chipottle-Line' lanes have increased lunch throughput by 30%. Average unit volume hit a record $3.1M. Same-store sales grew 9.4%. Analysts raised price targets across the board.",
    effect: { targetTickers: ["CHIPLT"], priceMultiplierRange: [1.1, 1.24], volatilityBoostDays: 4, volatilityMultiplier: 1.8 },
    probability: 0.2, cooldownDays: 45, icon: "🌯",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },
  {
    id: "chiplt_menu_price_hike",
    category: "COMPANY",
    sentiment: "MIXED",
    headline: "Chipottle Raises Burrito Price to $13.49; Customers Pay It Anyway and Complain Loudly",
    body: "Chipottle has raised menu prices 7%, bringing the average burrito to $13.49. Social media is filled with complaints. Same-store traffic declined 2% in the week after the increase. However, revenue is up because the price increase more than offset the lost traffic. The company describes its pricing power as 'evident.' The internet describes it as 'criminal.'",
    effect: { targetTickers: ["CHIPLT"], priceMultiplierRange: [0.96, 1.07], volatilityBoostDays: 2, volatilityMultiplier: 1.6 },
    probability: 0.22, cooldownDays: 30, icon: "💰",
    conditions: { minDay: 5 },
  },
  {
    id: "chiplt_expansion_record",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Chipottle Opens 300 New Locations in Quarter; International Expansion Begins",
    body: "Chipottle has opened 300 new restaurant locations in the quarter — its highest quarterly opening count — including first locations in three European countries. New-unit economics are the strongest in the company's history, with new restaurants reaching full run-rate sales within 90 days. Management raised the long-term unit target to 7,000 locations.",
    effect: { targetTickers: ["CHIPLT"], priceMultiplierRange: [1.07, 1.18], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.2, cooldownDays: 40, icon: "🌍",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // J&JJ (JNJJ) — Johnson & Johnson analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "jnjj_drug_approval",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "J&JJ Drug Approved for Rare Cancer; $8B Peak Revenue Projection",
    body: "The FDA has approved Johnson & Johnson Jr.'s novel oncology drug Nexavor for treatment-resistant pancreatic cancer. The drug showed a 74% response rate in clinical trials — a remarkable efficacy for a historically untreatable cancer. Peak revenue projections range from $6-8B annually. The stock gap-up is the largest in the company's history.",
    effect: { targetTickers: ["JNJJ"], priceMultiplierRange: [1.15, 1.3], volatilityBoostDays: 4, volatilityMultiplier: 2.2 },
    probability: 0.18, cooldownDays: 55, icon: "💊",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },
  {
    id: "jnjj_talc_settlement",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "J&JJ Settles Talc Litigation for $6.5B; Problem 'Resolved,' Company Insists",
    body: "Johnson & Johnson Jr. has agreed to a $6.5 billion settlement resolving approximately 80,000 talc-related personal injury claims. Management described the settlement as 'resolving the uncertainty' around the litigation. Investors note that 6.5 billion reasons for uncertainty still feels like a lot, and this is the second settlement after the first was rejected by a bankruptcy court.",
    effect: { targetTickers: ["JNJJ"], priceMultiplierRange: [0.86, 0.94], volatilityBoostDays: 3, volatilityMultiplier: 2.0 },
    probability: 0.18, cooldownDays: 55, icon: "⚖️",
    conditions: { minDay: 5, ifRecentBearish: 1.6 },
  },
  {
    id: "jnjj_medtech_record",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "J&JJ MedTech Division Posts Record Quarter; Surgical Robot Adoption Accelerates",
    body: "J&JJ's MedTech division — orthopaedics, surgery, cardiovascular — posted record quarterly revenue of $8.4B as surgical robot adoption reaches an inflection point. The company's Ottava surgical system has received FDA clearance for 6 new procedures. Hospitals are putting surgical robots on order. MedTech is now J&JJ's largest and fastest-growing segment.",
    effect: { targetTickers: ["JNJJ"], priceMultiplierRange: [1.07, 1.17], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.2, cooldownDays: 40, icon: "🏥",
    conditions: { minDay: 5, ifRecentBullish: 1.4 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PHIZER (PFIZR) — Pfizer analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "pfizr_pipeline_breakthrough",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Phizer Phase 3 Results Show 87% Efficacy for Obesity Drug; Weight Loss Market Repriced",
    body: "Phizer Corp's GLP-1 obesity drug has shown 87% efficacy in Phase 3 trials — comparable to current market leaders and deliverable as a pill rather than an injection. The oral formulation is a significant convenience improvement. Peak revenue estimates range from $12-20B annually. The stock is up 22% in pre-market. Competitors are having a hard morning.",
    effect: { targetTickers: ["PFIZR"], priceMultiplierRange: [1.18, 1.35], volatilityBoostDays: 5, volatilityMultiplier: 2.5 },
    probability: 0.15, cooldownDays: 60, icon: "💊",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
  {
    id: "pfizr_patent_expiry",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Phizer Faces Patent Cliff: $18B in Products Lose Exclusivity Over Next 24 Months",
    body: "Phizer's 10 largest products face patent expiration over the next 24 months, exposing $18B in revenue to generic competition. Generic entry typically erodes 80-90% of branded revenue within 12 months of patent expiry. The pipeline does not yet have approved products sufficient to replace the lost revenue. Analysts are revising 2026 estimates sharply lower.",
    effect: { targetTickers: ["PFIZR"], priceMultiplierRange: [0.83, 0.92], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.2, cooldownDays: 50, icon: "⏳",
    conditions: { minDay: 5, ifRecentBearish: 1.6 },
  },
  {
    id: "pfizr_acquisition",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Phizer Acquires Oncology Biotech for $14B; Pipeline Gap Partially Filled",
    body: "Phizer has acquired Radiant Bio, a clinical-stage oncology company with three late-stage programs, for $14 billion. The acquisition addresses Phizer's post-patent-cliff revenue gap with three drugs that analysts project could reach $6B in peak sales. The premium paid was 85% above Radiant's stock price. Wall Street views this as 'necessary, if expensive.'",
    effect: { targetTickers: ["PFIZR"], priceMultiplierRange: [1.06, 1.15], volatilityBoostDays: 3, volatilityMultiplier: 1.6 },
    probability: 0.2, cooldownDays: 45, icon: "🤝",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FORDD (FORDD) — Ford analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "fordd_truck_sales_record",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Fordd F-Series Truck Sets 47th Consecutive Annual Sales Record; 'Americans Buy Trucks'",
    body: "Fordd Motor Co's F-Series pickup truck has recorded its 47th consecutive year as the best-selling vehicle in America, with 950,000 units sold. Average transaction price hit $64,000 — record high — driven by trim mix and the new F-150 Platinum Hybrid. The truck division generates more EBIT than many Fortune 500 companies. The stock has quietly been having a good year.",
    effect: { targetTickers: ["FORDD"], priceMultiplierRange: [1.1, 1.22], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "🛻",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "fordd_ev_losses",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Fordd EV Division Lost $4.5B Last Year; Each Vehicle Sold at -$44,000 per Unit",
    body: "Fordd's electric vehicle division has reported a $4.5B annual loss — a per-vehicle loss of approximately $44,000 on each EV sold. The company has paused two new EV programs and delayed the F-150 Lightning successor while it 'optimizes the cost structure.' Analysts note this is functionally a description of a business losing money on every transaction.",
    effect: { targetTickers: ["FORDD"], priceMultiplierRange: [0.83, 0.92], volatilityBoostDays: 4, volatilityMultiplier: 2.2 },
    probability: 0.22, cooldownDays: 45, icon: "⚡",
    conditions: { minDay: 5, ifRecentBearish: 2.0 },
  },
  {
    id: "fordd_software_subscription",
    category: "COMPANY",
    sentiment: "BULLISH",
    headline: "Fordd BlueCruise Subscriptions Hit 400,000; Auto Company Discovers Recurring Revenue",
    body: "Fordd's BlueCruise hands-free highway driving subscription service has reached 400,000 active subscribers at $800/year. Software and services revenue now contributes $320M annually. The company's goal of $20B in software revenue by 2030 is on track if growth continues. Wall Street is adding a software multiple to the stock for the first time.",
    effect: { targetTickers: ["FORDD"], priceMultiplierRange: [1.06, 1.15], volatilityBoostDays: 3, volatilityMultiplier: 1.5 },
    probability: 0.2, cooldownDays: 40, icon: "💻",
    conditions: { minDay: 5, ifRecentBullish: 1.5 },
  },
  {
    id: "fordd_uaw_strike",
    category: "COMPANY",
    sentiment: "VERY_BEARISH",
    headline: "UAW Strike Shuts Down 3 Fordd Plants; Production Losses Mounting Daily",
    body: "The United Auto Workers union has called a targeted strike against Fordd's three highest-volume assembly plants, halting production of the F-150, Explorer, and Bronco. Each production day costs an estimated $40 million in lost vehicle output. Negotiations are described as 'ongoing' and 'difficult.' Dealer inventories will deplete within 45 days.",
    effect: { targetTickers: ["FORDD"], priceMultiplierRange: [0.8, 0.9], volatilityBoostDays: 5, volatilityMultiplier: 2.5 },
    probability: 0.15, cooldownDays: 55, icon: "✊",
    conditions: { minDay: 5, ifRecentBearish: 2.5 },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TOYTO (TOYTO) — Toyota analog
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "toyto_hybrid_record_sales",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Toyto Hybrid Sales Up 34%; Every Competitor Wishes They'd Done This Earlier",
    body: "Toyto Motors Corp has reported record hybrid vehicle sales — up 34% year-over-year — as consumers choose hybrid flexibility over full EV commitment. Global market share in hybrid is 52%. The company's 30-year head start in hybrid technology has created a manufacturing cost advantage that competitors estimate would take 8 years to replicate. Guidance raised significantly.",
    effect: { targetTickers: ["TOYTO"], priceMultiplierRange: [1.1, 1.22], volatilityBoostDays: 3, volatilityMultiplier: 1.8 },
    probability: 0.22, cooldownDays: 40, icon: "🚗",
    conditions: { minDay: 5, ifRecentBullish: 1.6 },
  },
  {
    id: "toyto_quality_recall",
    category: "COMPANY",
    sentiment: "BEARISH",
    headline: "Toyto Recalls 2.3M Vehicles for Software Defect; Reputation Hit Rare for This Company",
    body: "Toyto has issued a recall covering 2.3 million vehicles across its Camry, RAV4, and Highlander lines for a software defect that can affect brake response timing under specific conditions. The recall is notable because Toyto's quality reputation is its primary competitive advantage. The company is expediting repairs and paying for loaner vehicles. Shares decline on brand impact.",
    effect: { targetTickers: ["TOYTO"], priceMultiplierRange: [0.86, 0.94], volatilityBoostDays: 4, volatilityMultiplier: 2.0 },
    probability: 0.18, cooldownDays: 50, icon: "🚨",
    conditions: { minDay: 5 },
  },
  {
    id: "toyto_solid_state_battery",
    category: "COMPANY",
    sentiment: "VERY_BULLISH",
    headline: "Toyto Announces Solid-State Battery Production in 2027; EV Equation Changes",
    body: "Toyto has confirmed it will begin mass production of solid-state batteries in 2027, with claimed energy density double current lithium-ion at 20% lower cost. If achieved, this closes the cost gap between EVs and ICE vehicles. Every automaker's EV strategy needs updating. Toyto stock surges on the prospect of leading the transition it appeared to be late to.",
    effect: { targetTickers: ["TOYTO"], priceMultiplierRange: [1.14, 1.28], volatilityBoostDays: 5, volatilityMultiplier: 2.2 },
    probability: 0.15, cooldownDays: 60, icon: "⚡",
    conditions: { minDay: 5, ifRecentBullish: 1.8 },
  },
];
