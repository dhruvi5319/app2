# User Journeys Document
## Simple Weather App

| Field | Value |
|---|---|
| **Product** | Simple Weather App |
| **Version** | 1.0 |
| **Date** | 2026-05-01 |
| **Related Personas** | PERSONAS-WeatherApp.md (PER-01, PER-02, PER-03) |
| **Related JTBD** | JTBD-WeatherApp.md (JTBD-01.1, JTBD-01.2, JTBD-02.1, JTBD-02.2, JTBD-02.3, JTBD-03.1, JTBD-03.2, JTBD-03.3) |
| **Related PRD** | PRD-WeatherApp.md (v1.0, 2026-04-29) |
| **Status** | Active |
| **Total Journeys** | 6 (PER-01: 2, PER-02: 2, PER-03: 2) |

---

## Journey Index

| JRN-ID | Persona | Scenario | Key JTBD | Stages |
|---|---|---|---|---|
| JRN-01.01 | PER-01 Maya Torres | First-time city search — morning umbrella check | JTBD-01.1 | 5 |
| JRN-01.02 | PER-01 Maya Torres | Unit toggle while texting family overseas | JTBD-01.2 | 4 |
| JRN-02.01 | PER-02 James Okafor | Hourly forecast scan — timing a bike commute | JTBD-02.1, JTBD-02.2 | 6 |
| JRN-02.02 | PER-02 James Okafor | Mid-commute city search for a client destination | JTBD-02.3 | 5 |
| JRN-03.01 | PER-03 Priya Nair | Mid-week 7-day planning for a weekend trail run | JTBD-03.1, JTBD-03.2 | 6 |
| JRN-03.02 | PER-03 Priya Nair | Morning-of trailhead check with low/no signal | JTBD-03.3 | 5 |

---

## PER-01: Maya Torres — The Casual Checker

---

### JRN-01.01: Morning Umbrella Check

**Persona:** PER-01 (Maya Torres)

**Scenario:** It is 7:45 am on a Tuesday. Maya is in her kitchen, still in her dressing gown, making coffee. She picks up her iPhone, opens a new browser tab on Safari, and navigates to the app URL. She has used it once before and bookmarked it. She has roughly 8 seconds of attention before her toast pops. She needs exactly three numbers: the temperature, the feels-like, and the rain chance. She has not been asked to create an account, and she will not.

**Related Jobs:** JTBD-01.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Open** | Taps the app bookmark on iPhone Safari; holds phone one-handed while pouring coffee | Browser / app load (F5, F9) | "Come on, load already — I've got maybe 10 seconds" | Impatient, slightly rushed | On other apps, 4–6 seconds pass before anything useful appears | Skeleton UI renders immediately; hero placeholder fills the fold before API data arrives, so she never stares at a blank screen |
| **2. Locate** | App requests GPS or shows search bar; Maya taps the GPS button to use her current location | Geolocation prompt / F0 | "I just want my local weather — let it use my location" | Neutral, expecting friction | Some apps demand "Always allow" location; she may deny if the ask feels invasive | One-shot "while using" permission request; denial never blocks the search input — she can type her city name instead with zero extra steps |
| **3. Read** | Glances at hero section above the fold — temperature, feels-like, rain probability | Current conditions hero (F1, F4) | "19°C, feels like 16°C — and 70% rain? OK, umbrella." | Relieved, satisfied | On cluttered apps the number she needs is mid-page; she sometimes gives up and checks out the window | Single dominant temperature figure at top of viewport; feels-like and precipitation probability directly beneath; all above the fold on 375px with no scroll |
| **4. Verify** | Optionally scans today's high/low pair to decide between a light jacket and a coat | Current conditions hero (F1) | "High of 22°C — so it'll warm up. Just the umbrella then." | Confident | High/low is buried in a secondary row or tab on other apps | High/low displayed as a compact paired value directly below the precipitation probability; no scroll, no tap |
| **5. Exit** | Locks phone and leaves the house | — | "Done. That took 5 seconds." | Satisfied | — | Data freshness indicator ("Updated just now") reassures her the answer was live, not cached from yesterday |

#### Key Moments

- **Decision Point — Stage 3 (Read):** This is the entire journey. If the temperature, feels-like, and precipitation probability are all above the fold in under 2 seconds, the job is done. If Maya has to scroll even once, the app has failed her use case.
- **Risk of Abandonment — Stage 1 (Open):** Any permission dialog (notifications, accounts, marketing consent) that appears before data renders will cause immediate close. The app must show weather before asking for anything.
- **Risk of Abandonment — Stage 2 (Locate):** A heavy-handed geolocation prompt ("Allow always?") registers as invasive. The "while using" framing and the visible fallback search bar reduce this friction to near zero.
- **Delight Opportunity — Stage 5 (Exit):** A subtle "Updated just now" label at the bottom of the hero costs nothing to build but dramatically increases trust. It signals the data is live, not a day-old cache.

#### Success Outcome

Maya reads current temperature, feels-like, and today's rain probability within 5 seconds of opening the app on a 375px mobile screen, without scrolling, without dismissing any dialog, and without creating an account. (JTBD-01.1 success measure)

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Open | F5 (Responsive Layout), F9 (Attribution & Deployment — HTTPS) |
| Locate | F0 (Location Search & Detection — GPS path) |
| Read | F1 (Current Conditions Display), F4 (Weather Icons — day/night variants) |
| Verify | F1 (Current Conditions — high/low pair) |
| Exit | F7 (Data Freshness indicator) |

---

### JRN-01.02: Unit Toggle for an Overseas Conversation

**Persona:** PER-01 (Maya Torres)

**Scenario:** Maya is on a Saturday afternoon video call with her sister in Toronto, who asks what the weather is like in London today. Maya has just told her "it's about 22 degrees." Her sister uses Fahrenheit and asks "what's that in Fahrenheit?" Maya has the weather app already open on her phone from a check earlier. She needs to switch from °C to °F and read back the number — without navigating into Settings, without leaving the current screen, and without losing her place in the conversation.

**Related Jobs:** JTBD-01.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Return** | Switches back to the weather app tab from the video call app; data is already loaded | Current conditions hero (F1, F7) | "The weather is still showing — I just need to switch units" | Neutral, multi-tasking | On many apps the data has refreshed and she has to wait again after backgrounding | 10-minute stale time means data stays visible on return; no re-fetch spinner on background/foreground cycle |
| **2. Locate toggle** | Spots the °C/°F toggle directly on the main screen, no scroll required | Unit toggle control (F1) | "OK, it's right there — one tap" | Pleasantly surprised (based on past frustration) | On every previous app she tried, the toggle was buried in Settings; she has had to Google "how to change temperature unit" in multiple apps | Toggle is a small but unmissable two-state button rendered inside the hero section, adjacent to the current temperature |
| **3. Toggle** | Taps °F; all temperature values update instantly across the page | Unit toggle + all temperature displays (F1, F2, F3) | "72°F — OK, I can tell her that. And the hourly cards have updated too." | Satisfied, efficient | When only the hero temperature updates (not hourly and daily rows), she cannot trust the rest of the UI | All temperature values — current, feels-like, high/low, hourly cards, and 7-day rows — update in a single re-render within 500ms |
| **4. Return call** | Reads "72°F" back to her sister; continues the conversation | — | "Done. Didn't even have to leave the app." | Relaxed, in control | — | Preference persists in `localStorage`; next time she opens the app it will still show °F, avoiding a repeat toggle hunt |

#### Key Moments

- **Decision Point — Stage 2 (Locate toggle):** If the toggle is not visible within 2 seconds of looking at the main screen, Maya will abandon to a mental conversion or a Google search. Discoverability is the entire job.
- **Delight Opportunity — Stage 3 (Toggle):** When all temperature values across every section of the page update simultaneously, Maya's confidence in the app's consistency shoots up. Partial updates (hero only) would create distrust in the hourly and 7-day sections.
- **Delight Opportunity — Stage 4 (Return call):** The persisted unit preference is invisible to Maya — she never notices it working. But on her next morning check she will not have to re-toggle, which quietly compounds trust over daily use.

#### Success Outcome

Maya reaches and activates the °C/°F toggle within 1 tap from the main screen, all temperature values update within 500ms, and her preference is still active on the next page load. (JTBD-01.2 success measure)

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Return | F7 (Data Freshness — stale time prevents re-fetch on tab switch) |
| Locate toggle | F1 (Current Conditions — visible unit toggle on main screen) |
| Toggle | F1, F2 (Hourly), F3 (7-Day) — all temperature values update simultaneously |
| Return call | F1 (localStorage persistence of unit preference) |

---

## PER-02: James Okafor — The Daily Commuter

---

### JRN-02.01: Hourly Scan Before the Morning Bike Commute

**Persona:** PER-02 (James Okafor)

**Scenario:** It is 8:10 am on a Wednesday. James is standing in his hallway, one hand on his bike helmet. He has already loaded up his panniers. He pulls out his Android phone and opens the weather app — his thumb is already hovering over the hourly row. He needs to know: does the rain start before 8:45am when he locks his bike, or does it hold off until after? He also wants to check whether the evening window (5:30–7pm) is dry for the ride home. He has 15 seconds.

**Related Jobs:** JTBD-02.1, JTBD-02.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Open** | Opens app on Android Chrome; location resolves from recent search (no re-search needed) | App load + F0 (recent search chips), F7 | "Good, it remembered my city — I don't have to type again" | Efficient, hurried | Apps that forget the last location waste 10 seconds on a re-search he should not need | Recent location chip is the first interactive element below the search bar; tapping it loads data instantly with no re-geocoding step |
| **2. Confirm freshness** | Glances at "Updated X min ago" indicator before trusting the forecast | Freshness indicator (F7) | "Updated 4 minutes ago — OK, this is live data" | Reassured | No freshness indicator forces him to wonder if the "clear sky" icon is from yesterday | Freshness label is always visible on the main screen — never hidden behind a toggle or info icon; colour-coded to show "fresh" vs. "stale" state at a glance |
| **3. Scan hourly row** | Swipes right along the horizontal hourly forecast row, reading the precipitation percentage on each card from 8am through 10am | Hourly row (F2, F4) | "8am: 20%. 9am: 45%. 10am: 60% — so it gets worse. I should leave now." | Focused, slightly anxious | On other apps, precipitation % is omitted from hourly cards — he can only see a rain icon with no probability figure | Every hourly card shows a percentage directly below the condition icon; no tap-to-expand, no tooltip required; minimum 44px card width for glanceable scan while moving |
| **4. Check evening window** | Continues scrolling the hourly row to the 5pm–7pm cards | Hourly row (F2, F4) | "5pm: 15%, 6pm: 10%, 7pm: 5% — dry enough for the ride home" | Relieved | Horizontal scroll row sometimes clips the evening cards behind a "see more" button or a paywall | Full 24-hour row scrollable continuously; all cards accessible without any navigation tap, account prompt, or subscription gate |
| **5. Trust check** | Glances at the condition icon for the current hour — confirms it matches the sky he can see through the hallway window | Current conditions icon (F1, F4) | "Light rain icon and it is spitting outside — that checks out. Data is trustworthy." | Confident | A sun icon during actual rain destroys his trust in the entire dataset; he has switched apps over this | Day/night icon variants correctly computed from the location's local timezone; WMO code icon mapping is tested against all 27 codes used by Open-Meteo |
| **6. Act** | Puts on his rain jacket, grabs the helmet, leaves | — | "I'd rather be dry and slightly early than wet and on time." | Decisive, prepared | — | The correct data at the right moment enabled a confident physical decision — this is the entire value proposition |

#### Key Moments

- **Decision Point — Stage 3 (Scan hourly row):** The precipitation percentage on the 8am–9am cards is the single most important data point in this journey. If those numbers are missing, James cannot make his timing decision; he defaults to guessing or checking a second app.
- **Critical Failure Point — Stage 3:** A paywall or "subscribe to see hourly data" prompt at this stage is a permanent app uninstall for James. He has cancelled two subscriptions over this exact pattern.
- **Risk of Abandonment — Stage 2 (Freshness):** If there is no freshness indicator, James does not know whether the 45% he is reading is from 4 minutes ago or 4 hours ago. The absence of a timestamp is, for him, equivalent to the data being untrustworthy.
- **Delight Opportunity — Stage 5 (Trust check):** When the icon on screen matches the actual sky he sees through his window, James experiences a moment of genuine calibration with reality. This is the fastest path to long-term retention for this persona.

#### Success Outcome

James can scan precipitation probability for his 8am–9am commute window within 10 seconds of opening the app, on the main screen, without any navigation tap or subscription prompt, and can confirm data freshness within 3 seconds. (JTBD-02.1 and JTBD-02.2 success measures)

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Open | F0 (recent search chips), F7 (stale time — no re-fetch needed) |
| Confirm freshness | F7 (freshness indicator — always visible) |
| Scan hourly row | F2 (Hourly Forecast — precipitation % per card), F4 (Icons — day/night) |
| Check evening window | F2 (full 24-hour row, no gate) |
| Trust check | F1 (Current Conditions icon), F4 (WMO code mapping, day/night) |
| Act | F5 (Responsive — 44px touch targets on Android Chrome) |

---

### JRN-02.02: Mid-Commute City Search for a Client Visit

**Persona:** PER-02 (James Okafor)

**Scenario:** James is on a train heading to a client city he visits once a month — Manchester. He has been away from his home screen for 40 minutes. The train is emerging from a tunnel; his phone is on LTE with intermittent signal. He needs to know if it is raining in Manchester right now and whether the next three hours look dry — he forgot to check before he boarded. He needs to search a new city quickly, without losing his current session state, and without the app hanging or going blank when the signal drops in and out.

**Related Jobs:** JTBD-02.3, JTBD-02.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Open search** | Taps the search input at the top of the app while the train moves; network briefly drops through a tunnel | Search bar (F0), F7 (offline state) | "OK, just need to type Manchester — but the signal is patchy" | Slightly stressed, multi-tasking | Apps that blank out or throw an error on network transitions during search leave him stranded | If network drops mid-open, cached home-city data remains visible with a stale notice rather than a blank screen; the search input is still interactive |
| **2. Type + autocomplete** | Types "Man" — autocomplete suggestions appear after 2 characters; sees "Manchester, England" as the first result | Autocomplete dropdown (F0) | "There it is — I don't have to finish typing" | Efficient | Full city name entry is frustrating while standing in a swaying train carriage | Geocoding autocomplete triggers at 2 characters; suggestions are large enough to tap accurately on a moving train (min 44px per item); no full city spelling required |
| **3. Select result** | Taps "Manchester, England" from the autocomplete list; data loads | F0 → F1, F2 (new location) | "3 seconds — OK, we have data" | Watchful, waiting | Apps that show a blank state during the location transition cause him to wonder if the tap registered | Location transition shows a skeleton UI immediately (not a blank screen) then populates current conditions and hourly row as data arrives |
| **4. Read Manchester conditions** | Scans current temperature, condition icon, and the first 3 hours of the hourly row | F1 (Current Conditions), F2 (Hourly row), F4 (Icons) | "12°C, light rain now, 60% at 2pm — I'll stay inside until my 3pm slot" | Decisive, relieved | Precipitation probability sometimes missing from hourly cards; he gets an icon but no % | Full hourly row with precipitation % per card is present for Manchester exactly as it was for his home city — the feature is identical across all searched locations |
| **5. Return or re-check** | Locks phone; 20 minutes later, re-opens to double-check conditions before stepping off | F7 (stale time), F1, F2 | "Updated 6 minutes ago — still the same picture" | Confident | Apps that re-fetch on every open create a loading spinner right when he steps onto the platform | 10-minute stale time means data is still valid; no spinner; freshness indicator shows "6 minutes ago" rather than firing a redundant API call |

#### Key Moments

- **Decision Point — Stage 2 (Autocomplete):** The quality of the autocomplete matters most here. If "Manchester" does not appear in the first 3 suggestions after typing "Man", James will abandon and open Google. The first-result accuracy for major cities must be reliable.
- **Risk of Abandonment — Stage 1 (Open search):** Network instability on a train is the most likely environment for this journey. An app that goes entirely blank during a LTE dropout fails this user at their most common use case. The cached home-city data with a stale notice is the safety net.
- **Risk of Abandonment — Stage 3 (Select result):** A blank or stuck screen on location transition will be interpreted as "the tap didn't work" — James will tap again, creating a duplicate request race condition. The immediate skeleton UI eliminates this ambiguity.
- **Delight Opportunity — Stage 5 (Re-check):** The 10-minute stale time is invisible infrastructure that creates a visible moment of delight: no spinner, instant data, "updated 6 minutes ago." James registers this as "the app is fast and smart."

#### Success Outcome

James searches "Manchester", selects an autocomplete result, and sees current conditions and the hourly row for Manchester within 5 seconds on a mobile 4G connection, with no blank screen on the location transition. (JTBD-02.3 success measure)

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Open search | F0 (search input — always interactive), F7 (offline cached state — no blank) |
| Type + autocomplete | F0 (2-character trigger, 44px suggestion targets), F5 (responsive input on mobile) |
| Select result | F0 (geocoding → weather fetch), F1 (skeleton state during load) |
| Read Manchester conditions | F1 (Current Conditions), F2 (Hourly row), F4 (Icons) |
| Return or re-check | F7 (10-minute stale time, freshness indicator) |

---

## PER-03: Priya Nair — The Outdoor Enthusiast

---

### JRN-03.01: Mid-Week Weekend Trail Run Planning

**Persona:** PER-03 (Priya Nair)

**Scenario:** It is Wednesday evening. Priya is at her MacBook, planning whether to run the Brecon Beacons trail on Saturday or Sunday. She has the weather app open in Chrome. She needs the full 7-day forecast for the nearest village to the trailhead, a temperature trend chart to see if there is a cold snap arriving Friday night, and the UV index and wind speed for Saturday so she can decide on sun cream and whether to bring a wind layer. She is deciding right now — she needs to book a car-share spot by 10pm.

**Related Jobs:** JTBD-03.1, JTBD-03.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Search destination** | Types the nearest village name "Brecon" into the search bar; selects the autocomplete result | F0 (search + geocoding) | "Let's see what Saturday and Sunday look like compared" | Focused, methodical | Ambiguous village names sometimes return the wrong location; she checks the displayed city name to verify | Autocomplete shows country/region disambiguator next to each result (e.g., "Brecon, Powys, Wales") so she can confirm the right location without a second search |
| **2. Read 7-day forecast** | Scans down the 7-day daily forecast list — checking high/low and precipitation probability for each day | 7-day forecast list (F3, F4) | "Friday: 14/8°C, 80% rain. Saturday: 16/10°C, 20% rain. Sunday: 15/9°C, 35% rain. Saturday it is." | Analytical, decisive | Most mobile apps show only 3 days; she is forced to switch to desktop for days 4–7 | All 7 days visible in a single scroll on both 375px mobile and 1024px+ desktop; precipitation probability on every row; no paywall or "see more days" prompt interrupts the read |
| **3. Read temperature trend chart** | Scrolls to the Recharts AreaChart below the daily list; traces the curve with her eye | Temperature trend chart (F3) | "There's a dip Friday into Saturday morning — temps recover by Saturday noon. That confirms Saturday." | Confident, evidence-based | Without the chart she has to mentally compare 7 rows of numbers to detect a trend; text-only forecasts make pattern recognition slow | AreaChart renders the temperature curve across all 7 days at a glance; high/low range shown as a shaded area so she can see both the peak and the trough without scanning individual rows |
| **4. Expand Details panel** | Taps the "Details" expand chevron to reveal secondary metrics | Secondary Details panel (F6) | "OK — UV index 5 for Saturday. Wind 22 km/h from the NW. Visibility 20km. Sunrise 06:14." | Efficient, satisfied | On other apps these numbers are either in a separate "Weather for Athletes" premium tier, or require 3–4 taps to reach | Single tap on the collapsible panel reveals all secondary metrics at once: UV index, wind speed/direction (cardinal + degrees), visibility, humidity, sunrise, and sunset — all for the searched location |
| **5. Verify sunrise timezone** | Reads the sunrise time "06:14" and cross-checks against her knowledge that Brecon in May is UTC+1 | F6 (sunrise/sunset in local timezone), F4 | "06:14 BST — that's right for late April Wales. I'll be there at 06:00." | Reassured, precise | Apps that display sunrise in the browser's local timezone (UTC) produce a wrong time that invalidates her pre-dawn planning entirely | All times in the Details panel use `timezone=auto` from Open-Meteo + `Intl.DateTimeFormat` with the location's IANA timezone — sunrise is always shown in the location's local time, never the browser's timezone |
| **6. Plan and book** | Closes the Details panel, takes a screenshot of the 7-day view, books the car-share slot for Saturday | — | "Saturday confirmed. UV medium, wind manageable, dry. Done." | Confident, decisive | — | The ability to get from city search to a fully informed activity decision in 5–6 taps, without leaving the app or hitting a paywall, is the product's highest-value moment for this persona |

#### Key Moments

- **Decision Point — Stage 2 (7-day forecast):** The comparison of Saturday vs. Sunday precipitation probability is the entire job. If the 7-day list is truncated, paywalled, or shows sponsored content between days 3 and 4, Priya switches tools immediately — she has `wttr.in` as a fallback and is not afraid to use it.
- **Decision Point — Stage 4 (Details panel):** If UV index or wind direction requires more than 1 tap to reveal, or is hidden behind a paywall, Priya opens Windy and UV Index as separate apps. The single-tap expand is the gate to retaining her for this job.
- **Critical Failure Point — Stage 5 (Sunrise timezone):** An incorrect sunrise time (browser timezone instead of location timezone) will cause Priya to either catch the error and lose trust in the entire data set, or not catch it and arrive at the trailhead an hour early in the dark. This is the highest-consequence data accuracy issue in the entire product.
- **Delight Opportunity — Stage 3 (Temperature trend chart):** The chart converts 7 rows of numbers into a pattern she can read in 2 seconds. This is not decoration — it is the feature that makes the 7-day view qualitatively better than `wttr.in` and every other text-only competitor.

#### Success Outcome

Priya reads all 7 days of high/low temperatures, precipitation probability, and the temperature trend curve on a 1024px+ desktop within 5 seconds of searching the destination, accesses UV index, wind direction, and sunrise time (in local timezone) via one expand tap, with zero paywall prompts or sponsored content interruptions. (JTBD-03.1 and JTBD-03.2 success measures)

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Search destination | F0 (geocoding with region disambiguator) |
| Read 7-day forecast | F3 (7-day list — all 7 days, precipitation % per row), F4 (daily icons) |
| Read temperature trend chart | F3 (Recharts AreaChart — high/low range, full 7-day curve) |
| Expand Details panel | F6 (collapsible Details — UV, wind, visibility, sunrise/sunset) |
| Verify sunrise timezone | F6 (timezone=auto + Intl.DateTimeFormat), F4 |
| Plan and book | F5 (Responsive — readable on desktop and mobile), F9 (no ads/promoted content) |

---

### JRN-03.02: Trailhead Morning Check with No Signal

**Persona:** PER-03 (Priya Nair)

**Scenario:** It is Saturday morning, 5:50 am. Priya has driven two hours to the trailhead car park in Brecon. Her phone shows one bar of signal, flickering between EDGE and no service. She checked the forecast at home at 11 pm (7 hours ago) and again at 5:30 am from her car on the motorway (25 minutes ago). She opens the app one more time standing at the car park gate to make a final go/no-go call. The sky looks promising but she wants to double-check the wind speed and the 11am–2pm precipitation window before she commits to the high ridge route. Her phone's LTE is effectively absent.

**Related Jobs:** JTBD-03.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Open at trailhead** | Opens the app with no meaningful network signal; the last fetch was 25 minutes ago | App load (F7, F5) | "No signal. Will it just show a blank screen like every other app?" | Apprehensive, tense | Apps without offline caching show a white screen or an infinite spinner — she cannot make a decision with nothing to look at | TanStack Query's cache serves the 25-minute-old data immediately on load; there is no loading state, no blank screen, and no spinner |
| **2. Read stale notice** | Notices the "Showing cached data from 25 minutes ago" banner at the top of the page | Stale data notice (F7) | "25 minutes old. The forecast hasn't changed that fast — this is still valid for a go/no-go call." | Reassured, analytical | Without a staleness notice she has no idea if she is looking at 25-minute-old or 7-hour-old data; the difference matters | Stale notice is always displayed when network is unavailable; shows exact age of cache in human-readable form ("25 minutes ago", not a raw timestamp) |
| **3. Check current conditions + hourly window** | Reads the current conditions and scans the 11am–1pm hourly cards for precipitation probability | F1 (Current Conditions), F2 (Hourly row), F7 (offline) | "Cached at 5:31am. 11am: 15%, noon: 20%, 1pm: 25% — low enough for the ridge. Wind 18 km/h. Let's go." | Determined, confident | Cached data sometimes covers only current conditions, not the full hourly or 7-day view — she needs the full dataset | Cached state covers the full API response: current conditions, hourly row, and 7-day forecast; the cache is not partial |
| **4. Expand Details panel** | Expands the Details panel to read the cached UV index and wind direction one last time | F6 (Details panel), F7 (offline) | "UV 4, wind from the SW at 18 km/h — manageable. Sunrise was 06:12, it's 06:00 now." | Calm, ready | Details panel sometimes re-fetches on expand rather than reading from cache — triggering a spinner when offline | Panel reads from TanStack Query's cache on expand; no additional API call is made when the data is already cached; no spinner, no error |
| **5. Go/no-go decision** | Closes the app, pockets phone, clips on pack, heads for the trailhead gate | — | "Good enough. 25-minute-old data on a stable forecast is more than enough to go." | Decisive, satisfied | — | The cached forecast, paired with the transparent staleness notice, gave her enough confidence to make a high-stakes physical decision from a location where most apps gave her nothing |

#### Key Moments

- **Critical Failure Point — Stage 1 (Open at trailhead):** A blank screen or infinite spinner at this moment is the most damaging possible outcome for this persona — she has driven 2 hours and cannot make an informed decision. The offline cache is not a nice-to-have; it is the reason she trusts the app in the field.
- **Decision Point — Stage 2 (Read stale notice):** The staleness indicator is what converts "I see data" into "I can use this data." Without it, Priya cannot tell if she is looking at 25-minute-old data or the 11pm forecast she saw before she left home. The explicit age display is load-bearing for her decision confidence.
- **Decision Point — Stage 3 (Hourly window):** The cached hourly precipitation % for 11am–1pm is the final decision input. If the cache only covers current conditions (a common partial-cache pattern in other apps), this journey ends in uncertainty rather than confidence.
- **Delight Opportunity — Stage 4 (Details panel offline):** Opening the Details panel without a spinner or error when fully offline is a quiet moment of product excellence. Priya notices it because every previous app she has used either errors or spins here. Seamless offline UX is this persona's version of delight.

#### Success Outcome

The app displays a complete cached forecast — current conditions, full 24-hour hourly row, 7-day view, and secondary metrics from the Details panel — with a visible "Showing cached data from X minutes ago" notice, within 3 seconds of opening on a device with no network connectivity, with zero blank screens or infinite spinner states. (JTBD-03.3 success measure)

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Open at trailhead | F7 (TanStack Query offline cache — full data set), F5 (responsive layout — mobile) |
| Read stale notice | F7 (cached-data notice with human-readable age) |
| Check conditions + hourly | F1 (Current Conditions — from cache), F2 (Hourly row — from cache), F7 |
| Expand Details panel | F6 (Details panel — reads from cache, no API call), F7 |
| Go/no-go decision | F4 (Icons render from cached data — no broken icon states offline) |

---

## Cross-Journey Patterns

### Common Pain Points Across All Three Personas

| Pattern | Journeys Affected | Root Cause | Single Solution |
|---|---|---|---|
| **Blank screen on load / transition** | JRN-01.01, JRN-02.02, JRN-03.02 | No skeleton state; no offline cache | Skeleton UI on every load state + TanStack Query offline cache across all journeys |
| **No data freshness indicator** | JRN-02.01, JRN-02.02, JRN-03.02 | Freshness is treated as an internal concern, not a user-visible one | "Updated X minutes ago" label always visible on main screen (F7) |
| **Friction before first data point** | JRN-01.01, JRN-02.01 | Apps request permissions, accounts, or notifications before showing weather | Zero prompts before first data render; location is resolved via GPS (opt-in) or search input |
| **Hourly/7-day data paywalled** | JRN-02.01, JRN-03.01 | Monetisation strategy that sacrifices usability | All forecast data free and ungated; Open-Meteo's no-key API makes this architecturally trivial |
| **Wrong timezone for time-sensitive data** | JRN-03.01 (sunrise), JRN-03.02 (hourly labels) | Browser timezone used instead of location timezone | `timezone=auto` on every Open-Meteo request + `Intl.DateTimeFormat` with IANA timezone for all time display |

### Shared Opportunities That Solve Multiple Journeys

- **Skeleton UI (F1, F2, F3):** Eliminates blank screen anxiety in JRN-01.01, JRN-02.02, and JRN-03.02 simultaneously. Costs one implementation; pays off across every persona's "waiting" moment.
- **Recent search chips (F0):** Primarily serves JRN-02.01 (James re-opening for his daily commute) but also benefits Priya in JRN-03.01 (re-checking Brecon mid-week without retyping) and Maya if she occasionally checks a second city.
- **10-minute stale time (F7):** Prevents the re-fetch spinner that disrupts JRN-02.02 (train re-check) and JRN-03.02 (trailhead re-open) while also satisfying JRN-01.02 (Maya returns to the tab mid-call without a reload).
- **Collapsed Details panel (F6):** Satisfies Priya's need for secondary metrics (JRN-03.01, JRN-03.02) without adding visual noise to Maya's morning check (JRN-01.01) or James's hourly scan (JRN-02.01). Progressive disclosure solves all three simultaneously.

### Convergence Stage: City Search (F0)
All six journeys pass through the city search / location detection stage. This is the single highest-leverage component in the app. Reliability, speed, autocomplete quality, and graceful failure (geolocation denial, network drop) at F0 determine whether every subsequent journey stage succeeds or fails. F0 is the only feature that is the entry gate for all three personas in all six journeys.

### F8 Accessibility — Cross-Cutting Quality Bar
F8 (WCAG 2.2 Level AA) is not a discrete stage in any single journey but is a prerequisite for every stage across all six journeys. Specific touchpoints where F8 is load-bearing:
- **JRN-02.01 Stage 3 (Scan hourly row):** 44px touch targets on hourly cards are the difference between James scanning one-handed on a moving train and mis-tapping cards; WCAG 2.5.8 compliance is the hire/fire criterion here.
- **JRN-01.01 Stage 3 (Read):** WCAG 1.4.3 contrast ratio (≥ 4.5:1) across all condition-aware hero backgrounds ensures Maya can read the temperature in bright outdoor light and at night without struggling.
- **JRN-03.01 Stage 3 (Trend chart):** Recharts `AreaChart` accessible fallback (data table or `aria-label`) ensures the temperature trend is usable for Priya if she is using a screen reader or if the SVG fails to render on a low-power mobile browser.
- **All journeys:** `aria-live` regions announce weather data updates when location changes, meaning keyboard-only and assistive-technology users follow the same journey map as pointer users.

---

## Journey-to-JTBD Traceability

| JRN-ID | Stage | JTBD-ID | Expected Outcome |
|---|---|---|---|
| JRN-01.01 | 1. Open | JTBD-01.1 | App load + skeleton renders in ≤ 2 seconds; no blank screen |
| JRN-01.01 | 2. Locate | JTBD-01.1 | GPS permission granted → weather resolves; denial → search input fully functional |
| JRN-01.01 | 3. Read | JTBD-01.1 | Current temp, feels-like, precipitation % all above the fold on 375px; ≤ 5 seconds total |
| JRN-01.01 | 4. Verify | JTBD-01.1 | High/low visible without scroll; integer values only |
| JRN-01.01 | 5. Exit | JTBD-01.1 | "Updated just now" indicator confirms data is live |
| JRN-01.02 | 1. Return | JTBD-01.2 | Data still visible on tab switch; no re-fetch spinner (stale time) |
| JRN-01.02 | 2. Locate toggle | JTBD-01.2 | °C/°F toggle visible on main screen; reachable in 1 tap |
| JRN-01.02 | 3. Toggle | JTBD-01.2 | All temperature values update ≤ 500ms; preference stored in localStorage |
| JRN-01.02 | 4. Return call | JTBD-01.2 | Preference persists on next page load; no re-toggle needed |
| JRN-02.01 | 1. Open | JTBD-02.1, JTBD-02.2 | Recent location chip visible; city reloads without re-search |
| JRN-02.01 | 2. Confirm freshness | JTBD-02.2 | "Updated X minutes ago" always visible; freshness confirmed ≤ 3 seconds |
| JRN-02.01 | 3. Scan hourly row | JTBD-02.1 | 24-hour horizontal row on main screen; precipitation % on every card; no nav tap |
| JRN-02.01 | 4. Check evening | JTBD-02.1 | Full 24-hour row accessible; no paywall, no "see more" gate |
| JRN-02.01 | 5. Trust check | JTBD-02.2 | Day/night icon correct for local timezone; matches real-world conditions |
| JRN-02.01 | 6. Act | JTBD-02.1 | Correct data → confident departure decision in ≤ 10 seconds of opening |
| JRN-02.02 | 1. Open search | JTBD-02.3, JTBD-02.2 | Search input interactive even during network drop; cached data visible (no blank) |
| JRN-02.02 | 2. Type + autocomplete | JTBD-02.3 | Autocomplete triggers at 2 characters; major cities appear in top 3 results |
| JRN-02.02 | 3. Select result | JTBD-02.3 | Skeleton state on location transition; weather data loads ≤ 2 seconds |
| JRN-02.02 | 4. Read Manchester | JTBD-02.3 | Current conditions + hourly row with precipitation % present for new city ≤ 5 seconds |
| JRN-02.02 | 5. Return or re-check | JTBD-02.2 | Stale time prevents redundant re-fetch; freshness indicator shows exact age |
| JRN-03.01 | 1. Search destination | JTBD-03.1 | Autocomplete with region disambiguator; correct location confirmed |
| JRN-03.01 | 2. Read 7-day forecast | JTBD-03.1 | All 7 days visible on 375px and 1024px+; precipitation % on every row; no paywall |
| JRN-03.01 | 3. Read trend chart | JTBD-03.1 | Recharts AreaChart renders full 7-day curve on both viewport sizes |
| JRN-03.01 | 4. Expand Details panel | JTBD-03.2 | Single tap reveals UV, wind, visibility, sunrise/sunset; no paywall |
| JRN-03.01 | 5. Verify sunrise timezone | JTBD-03.2 | Sunrise time matches searched location's IANA timezone (not browser timezone) |
| JRN-03.01 | 6. Plan and book | JTBD-03.1, JTBD-03.2 | Complete planning decision made within the app; no second app needed |
| JRN-03.02 | 1. Open at trailhead | JTBD-03.3 | Cached data loads immediately; no blank screen; no spinner on zero-network open |
| JRN-03.02 | 2. Read stale notice | JTBD-03.3 | "Showing cached data from X minutes ago" notice always displayed on offline/stale state |
| JRN-03.02 | 3. Check conditions + hourly | JTBD-03.3 | Cached hourly row (including precipitation %) fully present; not partial |
| JRN-03.02 | 4. Expand Details panel | JTBD-03.3 | Details panel reads from cache; no API call on expand; no error or spinner offline |
| JRN-03.02 | 5. Go/no-go | JTBD-03.3 | Complete cached forecast enables confident physical decision at zero-signal trailhead |

---

## Validation Checklist

- [x] Every persona (PER-01, PER-02, PER-03) has at least 2 journeys (6 total)
- [x] Every journey maps to at least 1 JTBD (all 8 JTBD entries covered)
- [x] All stages have all columns populated (Action, Touchpoint, Thinking, Feeling, Pain Point, Opportunity)
- [x] Success outcomes trace to JTBD success measures (exact measure quoted per journey)
- [x] Key moments identified in every journey (Decision Points, Risk of Abandonment, Delight Opportunities)
- [x] Cross-journey patterns documented (5 common pain points, 4 shared opportunities, 1 convergence stage)
- [x] Feature touchpoints reference valid PRD feature IDs (F0–F9)
- [x] Journey-to-JTBD traceability table is complete (31 rows covering all 6 journeys × all stages)
- [x] No journey is a happy-path-only map (friction and risk of abandonment included in every journey)
- [x] "Thinking" column uses first-person voice throughout
- [x] "Feeling" column uses specific emotional vocabulary (not "good/bad")

---

*JOURNEYS v1.0 — generated 2026-05-01*
*Source: PERSONAS-WeatherApp.md v1.0, JTBD-WeatherApp.md v1.0, PRD-WeatherApp.md v1.0, PROJECT.md*
*Next documents: STORY-MAP-WeatherApp.md (sprint-ready stories), UX design wireframes*
