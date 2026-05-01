# Personas Document
## Simple Weather App

| Field | Value |
|---|---|
| **Product** | Simple Weather App |
| **Version** | 1.0 |
| **Date** | 2026-05-01 |
| **Related PRD** | PRD-WeatherApp.md (v1.0, 2026-04-29) |
| **Status** | Active |
| **Personas** | 3 (PER-01, PER-02, PER-03) |

---

## Persona Summary Table

| ID | Name | Role | Primary Goal |
|---|---|---|---|
| PER-01 | Maya Torres | Casual Checker | See current temperature and today's rain chance instantly, without ads or friction |
| PER-02 | James Okafor | Daily Commuter | Scan hourly conditions for the next 24 hours to time his commute around rain windows |
| PER-03 | Priya Nair | Outdoor Enthusiast | Plan weekend hikes and rides using a 7-day forecast with wind, UV, and sunrise/sunset data |

---

## PER-01: Maya Torres — The Casual Checker

**Role & Context:**
Maya is a 34-year-old office administrator who opens a weather app 1–3 times a day, almost always on her iPhone during the morning routine. She is not tracking weather for any specialized purpose — she just needs to know whether to grab a jacket or an umbrella before leaving the house. She checks at home, sometimes while still in bed, and expects an answer in the same time it takes to glance at a clock. She has no interest in radar maps, air quality indices, or weather science. If an app makes her scroll, wait, or dismiss a notification prompt before she sees the temperature, she is already annoyed.

**Goals:**
- See the current temperature and "feels like" value immediately above the fold — no scroll required (F1)
- Know today's high/low and precipitation probability at a glance (F1)
- Switch between °C and °F from the main screen without digging into settings (F1)
- Load the app and have data on screen in under 2 seconds on her phone's mobile connection (F0, F1, F5)
- Never be prompted to create an account or grant notification permissions just to see the temperature (F0, F9)

**Pain Points:**
- Weather.com and AccuWeather load for 4–8 seconds on mobile due to ad scripts and tracking payloads — by the time data appears she may have already left the house
- She has closed apps mid-load after being hit with a "Turn on notifications?" or "Allow location always?" permission dialog before seeing any weather data
- Precision theatre: seeing "18.47°C" instead of "18°C" reads as noise, not information
- The °C/°F toggle is buried in settings on every app she has tried; she finds it by accident or not at all
- Sponsored weather stories and autoplay video compete with the one number she came for

**Technical Expertise:** Everyday consumer — comfortable with all standard smartphone apps, uses a weather widget on her home screen, has no interest in developer tools or data formats.

**Environment:** Primarily mobile (iPhone, Safari), portrait orientation, one-handed use, often checked in under 10 seconds.

**Top Tasks:**
1. Check current temperature and "feels like" for her location (daily, multiple times, critical)
2. Confirm today's precipitation probability before choosing her bag (daily, high)
3. Toggle between °C and °F when discussing weather with family overseas (occasional, medium)
4. Quick-check the high/low to decide on a coat vs. light layer (daily, high)

**Success Criteria:**
- Weather data visible on screen within 2 seconds of opening the app on a mobile 4G connection
- Current temperature, feels-like, and precipitation probability all readable above the fold without scrolling on a 375px-wide screen
- Unit toggle reachable in one tap from the main screen
- Zero account prompts, zero notification permission dialogs on first load

> *"I just want to know if I need an umbrella. That's it. Tell me in two seconds or I'll look out the window instead."*

---

## PER-02: James Okafor — The Daily Commuter

**Role & Context:**
James is a 29-year-old project coordinator who commutes by bicycle and public transit in a mid-size city. He checks weather 2–4 times daily — once before leaving home, once before heading to a client meeting, and often again before the evening ride home. His key question is not "what is it doing right now?" but "what will it be doing in 90 minutes, and does that window close before I need to leave?" He primarily uses an Android phone, often checks while walking between tasks, and has very little patience for taps or navigation steps between him and hourly data. He has cancelled app subscriptions specifically because the hourly forecast was gated behind a paywall.

**Goals:**
- See an at-a-glance 24-hour hourly strip directly on the main screen without navigating to a separate tab (F2)
- Know the precipitation probability for each hour — especially the window between 8–9am and 5–7pm (F2)
- Confirm whether conditions improve or worsen over a 2–3 hour window to time his bike commute (F2, F1)
- Trust that the data is fresh and know exactly how old it is (F7)
- Access hourly data for free, with no paywall or account requirement (F0, F9)

**Pain Points:**
- On most apps, the hourly forecast is a second- or third-level screen — he has to tap "More" or navigate to a "Hourly" tab while standing at a bus stop
- Several apps he has tried show hourly data only for paying subscribers; he found this out after completing signup
- Precipitation probability is often missing from hourly cards, forcing him to guess from a small rain icon
- Apps with heavy data loads visibly stutter or fail to update when he switches networks (WiFi → cellular) during his commute
- Day/night icon rendering errors (a blazing sun icon at 7pm) erode his trust in the data accuracy

**Technical Expertise:** Tech-comfortable — uses productivity apps, syncs calendars across devices, knows what a "stale cache" means but does not want to think about it in a weather app.

**Environment:** Android phone (Chrome), mix of WiFi and mobile data, often used while moving, intermittent network transitions during commute hours.

**Top Tasks:**
1. Scan the 24-hour hourly row for rain probability across morning and evening commute windows (daily, critical)
2. Confirm current conditions match the last check before stepping outside (daily, high)
3. Check whether a rain window closes before a planned afternoon departure (daily, high)
4. Verify data freshness before making a "should I bring the rain jacket?" call (daily, medium)
5. Search for weather at a different city when travelling for a client visit (occasional, medium)

**Success Criteria:**
- Hourly forecast row visible on the main screen without any navigation tap
- Precipitation probability displayed on every hourly card without exception
- Day/night icon variants correct for the location's local timezone at all times
- "Updated X minutes ago" freshness indicator always visible when data is loaded
- App displays cached data with a notice rather than a blank screen on a dropped connection

> *"I don't need a 10-day forecast. I need to know if it'll be raining when I lock my bike up at 8:45am — and I need that answer in one scroll, not three taps."*

---

## PER-03: Priya Nair — The Outdoor Enthusiast

**Role & Context:**
Priya is a 41-year-old software engineer and weekend trail runner who plans her outdoor activities — trail runs, day hikes, and occasional cycling sportives — around weather windows. She checks weather 3–7 times over the 4 days leading up to a weekend activity, watching how the forecast evolves. She is the most data-hungry of the three personas: she wants the 7-day forecast, yes, but she also wants to know the UV index at midday, the wind speed and direction, the visibility forecast, and exactly when the sun rises so she can hit the trailhead at first light. She uses a mix of desktop and mobile depending on whether she is at her desk or on the trail. Because she has a technical background, she trusts data more than she trusts design — but she will still abandon an app that makes her work to find the numbers she needs.

**Goals:**
- Read a full 7-day daily forecast with high/low and precipitation probability without hitting a paywall or account wall (F3)
- Access secondary metrics — UV index, wind speed, wind direction, visibility, sunrise/sunset — without navigating to a different app (F6)
- See a temperature trend visualization across the week to spot cold snaps or warming patterns at a glance (F3)
- Trust that sunrise/sunset times are shown in the location's local timezone, not her browser's local time (F6, F4)
- Use the app meaningfully on both her phone (scouting the trail) and her desktop (trip planning mid-week) (F5)

**Pain Points:**
- Most mobile weather apps truncate the forecast to 3 days on small screens — she has to switch to desktop to see days 4–7
- Wind data and UV index are typically buried 3–4 taps deep inside a "More Details" modal or a separate "Weather for Athletes" premium tier
- Sunrise and sunset times display in the browser's local timezone on poorly built apps — useless when she is planning a trip to a different region
- The 7-day forecast view on mainstream apps is cluttered with sponsored "Weekend Planner" content and in-app promotions for premium tiers
- Apps with no visible data age indicator cause her to second-guess whether she is looking at the current model run or a 6-hour-old forecast

**Technical Expertise:** High — professional software engineer, comfortable reading API docs, uses command-line tools including `wttr.in`, but wants visual clarity for quick pre-activity decision-making rather than raw terminal output.

**Environment:** Mix of desktop (Chrome/macOS, mid-week planning) and mobile (Safari/iPhone, morning-of trail checks). Frequently checks from locations with weak or no signal — offline cache behaviour matters.

**Top Tasks:**
1. Read the 7-day daily forecast to choose the best window for a weekend trail run (weekly, critical)
2. Check UV index and wind speed for an upcoming outdoor session to decide on sun protection and clothing (weekly, high)
3. Confirm sunrise time in the destination location's timezone to plan a pre-dawn trail start (weekly, high)
4. Scan the temperature trend chart to spot a cold snap or rain band moving through the forecast week (weekly, medium)
5. Check current conditions and hourly forecast on the morning of an activity when plans may still change (weekly, medium)

**Success Criteria:**
- Full 7-day forecast visible on a 375px mobile screen without truncation or a "See more days" paywall tap
- Secondary metrics (UV, wind direction, visibility, sunrise/sunset) accessible via one expand tap from the main screen
- Temperature trend chart rendered and readable on both mobile and desktop viewports
- Sunrise/sunset times correctly reflect the searched location's local timezone, not the user's browser timezone
- App loads cached 7-day data with a staleness notice when she checks from a low-signal trailhead

> *"I can read `wttr.in` in a terminal just fine — but I shouldn't have to. Give me the UV index and the wind direction in something I can glance at before I drive two hours to the trailhead."*

---

## Persona Relationships

| Relationship | Description |
|---|---|
| PER-01 ↔ PER-02 | Both rely on current conditions (F1) as their entry point; PER-02 then goes deeper into the hourly row that PER-01 may ignore entirely |
| PER-02 ↔ PER-03 | Both care about time-accuracy of data (F7) and day/night icon correctness (F4); PER-03 extends into multi-day planning that PER-02 does not need |
| PER-01 ↔ PER-03 | Least overlap — PER-01 wants the minimum data above the fold; PER-03 wants the maximum data reachable within one tap. The progressive-disclosure Details panel (F6) satisfies PER-03 without cluttering PER-01's view |
| All three personas | All depend on F0 (location search) as the shared entry point. All are served by F5 (responsive layout) and F8 (accessibility). All benefit from F7 (data freshness) even if for different reasons |

---

## Feature-Persona Matrix

| Feature | Description | PER-01 Casual Checker | PER-02 Commuter | PER-03 Outdoor Enthusiast |
|---|---|---|---|---|
| **F0** | Location Search & Detection | Primary | Primary | Primary |
| **F1** | Current Conditions Display | Primary | Primary | Secondary |
| **F2** | Hourly Forecast (24h) | Secondary | **Primary** | Secondary |
| **F3** | 7-Day Daily Forecast | None | Secondary | **Primary** |
| **F4** | Weather Icons & Visual Indicators | Primary | Primary | Primary |
| **F5** | Responsive Layout (Desktop & Mobile) | Primary | Primary | Primary |
| **F6** | Secondary Weather Details Panel | None | None | **Primary** |
| **F7** | Data Freshness & Stale State Handling | Secondary | Primary | Primary |
| **F8** | Accessibility (WCAG AA) | Primary | Primary | Primary |
| **F9** | Attribution & Deployment | Secondary | Secondary | Secondary |

**Matrix key:** Primary = this feature directly addresses the persona's top tasks or pain points. Secondary = persona benefits from or uses the feature but it is not their primary driver. None = feature is not relevant to this persona's core use case.

---

*PERSONAS v1.0 — generated 2026-05-01*
*Source: PRD-WeatherApp.md (Section 4), PROJECT.md*
*Next documents: JTBD, UserStories, UX Journeys*
