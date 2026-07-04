import type { Activity, Restaurant, ScheduledItem } from './types'
import { TRIP } from './config'

// ---------------------------------------------------------------------------
// Activity library — curated across Jordan. IDs are stable; don't reuse them.
// ---------------------------------------------------------------------------

export const ACTIVITIES: Activity[] = [
  // — Amman: history & culture —
  { id: 'act-citadel', title: 'Amman Citadel (Jabal al-Qal‘a)', emoji: '🏛️', category: 'history', region: 'amman', duration: '2–3 hrs', description: 'Temple of Hercules, the Umayyad Palace, and the best panorama of downtown Amman. Go late afternoon for golden light.' },
  { id: 'act-roman-theater', title: 'Roman Theater & Odeon', emoji: '🎭', category: 'history', region: 'amman', duration: '1–2 hrs', description: '2nd-century, 6,000-seat theater carved into the hillside downtown. Climb to the top row for the view.' },
  { id: 'act-jordan-museum', title: 'The Jordan Museum', emoji: '🏺', category: 'history', region: 'amman', duration: '2 hrs', description: 'Home of the Dead Sea Scrolls and the ‘Ain Ghazal statues — some of the oldest human statues ever found.' },
  { id: 'act-king-abdullah-mosque', title: 'King Abdullah I Mosque', emoji: '🕌', category: 'history', region: 'amman', duration: '1 hr', description: 'The iconic blue-domed mosque — one of the few in Amman open to non-Muslim visitors.' },
  { id: 'act-darat-funun', title: 'Darat al Funun art houses', emoji: '🎨', category: 'history', region: 'amman', duration: '1–2 hrs', description: 'Contemporary Arab art in a cluster of beautiful 1920s villas above downtown, with a Byzantine ruin in the garden.' },
  { id: 'act-car-museum', title: 'Royal Automobile Museum', emoji: '🏎️', category: 'history', region: 'amman', duration: '1–2 hrs', description: 'King Hussein’s remarkable car collection — from Rolls-Royces to the Mars rover prop from The Martian.' },
  { id: 'act-duke-diwan', title: 'Duke’s Diwan & downtown walk', emoji: '🚶', category: 'history', region: 'amman', duration: '2 hrs', description: 'Amman’s oldest surviving townhouse, then wander Al-Balad’s stairways, arches, and street art.' },

  // — Amman: markets & shopping —
  { id: 'act-rainbow-street', title: 'Rainbow Street evening stroll', emoji: '🌈', category: 'market', region: 'amman', duration: '2–3 hrs', description: 'Cafés, galleries, and people-watching along Jabal Amman’s liveliest street. Best after sunset.' },
  { id: 'act-souk-jara', title: 'Souk Jara flea market', emoji: '🧺', category: 'market', region: 'amman', duration: '2 hrs', description: 'Open-air Friday market off Rainbow Street — crafts, vintage finds, food stalls, live music. Summer Fridays only.' },
  { id: 'act-gold-souk', title: 'Downtown souks & gold market', emoji: '💛', category: 'market', region: 'amman', duration: '2 hrs', description: 'Spices, sweets, perfume, and gold in the bustling heart of Al-Balad. Haggling encouraged.' },
  { id: 'act-sweifieh', title: 'Sweifieh & Wakalat Street', emoji: '🛍️', category: 'market', region: 'amman', duration: '2–3 hrs', description: 'Amman’s pedestrian shopping street plus malls nearby — good for gifts to bring home.' },

  // — Amman: relax —
  { id: 'act-hammam', title: 'Turkish bath (hammam) afternoon', emoji: '🧖', category: 'relax', region: 'amman', duration: '2–3 hrs', description: 'Steam, scrub, and massage — the classic post-flight or post-Petra recovery. Book couples’ slots ahead.' },
  { id: 'act-cafe-culture', title: 'Coffee crawl in Jabal al-Weibdeh', emoji: '☕', category: 'relax', region: 'amman', duration: '2–3 hrs', description: 'Amman’s artsiest hill: specialty coffee, quiet galleries, and leafy side streets made for wandering.' },
  { id: 'act-shisha-night', title: 'Rooftop shisha & mint lemonade', emoji: '🌙', category: 'relax', region: 'amman', duration: '2 hrs', description: 'Watch the city lights come on from a rooftop café with argileh and limonana.' },
  { id: 'act-family-time', title: 'Family visits & wedding prep', emoji: '👨‍👩‍👧', category: 'relax', region: 'amman', duration: 'Flexible', description: 'Time with Bissan’s family — visits, fittings, and everything leading up to the big day.' },

  // — Day trips: north —
  { id: 'act-jerash', title: 'Jerash Roman ruins', emoji: '🏺', category: 'daytrip', region: 'north', duration: 'Half–full day', description: 'One of the best-preserved Roman cities anywhere — colonnaded streets, temples, and the huge Oval Plaza. ~1 hr from Amman.' },
  { id: 'act-ajloun', title: 'Ajloun Castle & forest reserve', emoji: '🏰', category: 'daytrip', region: 'north', duration: 'Half day', description: '12th-century hilltop castle with sweeping views; pair with Jerash for a full northern loop.' },
  { id: 'act-umm-qais', title: 'Umm Qais (Gadara)', emoji: '⛰️', category: 'daytrip', region: 'north', duration: 'Full day', description: 'Roman ruins overlooking the Sea of Galilee and Golan Heights — dramatic views and far fewer crowds.' },

  // — Day trips: Petra —
  { id: 'act-petra', title: 'Petra — the Treasury & beyond', emoji: '🏜️', category: 'daytrip', region: 'petra', duration: 'Full day', description: 'Walk the Siq to the Treasury, then on to the Street of Facades and the Royal Tombs. Start early — it’s a lot of walking in summer heat. ~3 hrs from Amman.' },
  { id: 'act-petra-monastery', title: 'Petra: hike to the Monastery', emoji: '🥾', category: 'nature', region: 'petra', duration: '3–4 hrs', description: '850 rock-cut steps up to Petra’s biggest monument — tougher than the Treasury but worth every step.' },
  { id: 'act-petra-night', title: 'Petra by Night', emoji: '🕯️', category: 'nature', region: 'petra', duration: '2 hrs', description: 'The Siq and Treasury lit by 1,500 candles with Bedouin music. Mon/Wed/Thu evenings — plan around it.' },
  { id: 'act-little-petra', title: 'Little Petra (Siq al-Barid)', emoji: '🪨', category: 'daytrip', region: 'petra', duration: '1–2 hrs', description: 'A quieter miniature Petra with painted frescoes — easy add-on before or after the main site.' },

  // — Day trips: Dead Sea & Madaba —
  { id: 'act-dead-sea', title: 'Float in the Dead Sea', emoji: '🌊', category: 'daytrip', region: 'deadsea', duration: 'Full day', description: 'The lowest point on Earth. Float, mud up, rinse, repeat — then catch the sunset over the water. ~1 hr from Amman.' },
  { id: 'act-dead-sea-spa', title: 'Dead Sea resort & spa day', emoji: '💆', category: 'relax', region: 'deadsea', duration: 'Full day', description: 'Day passes at the resorts get you pools, private beach, and mud treatments — the easy way to do the Dead Sea.' },
  { id: 'act-wadi-mujib', title: 'Wadi Mujib Siq Trail', emoji: '💦', category: 'nature', region: 'deadsea', duration: 'Half day', description: 'Wade and scramble up a river canyon between towering sandstone walls. Wet, wild, unforgettable. Water shoes required.' },
  { id: 'act-madaba', title: 'Madaba mosaic map & St. George’s', emoji: '🗺️', category: 'daytrip', region: 'madaba', duration: 'Half day', description: 'The famous 6th-century mosaic map of the Holy Land, in Jordan’s most Christian-heritage town.' },
  { id: 'act-mount-nebo', title: 'Mount Nebo', emoji: '⛰️', category: 'daytrip', region: 'madaba', duration: '1–2 hrs', description: 'Where Moses looked over the Promised Land — on a clear day you can see Jericho and Jerusalem. Pairs with Madaba.' },
  { id: 'act-baptism-site', title: 'Bethany Beyond the Jordan', emoji: '🕊️', category: 'daytrip', region: 'madaba', duration: 'Half day', description: 'The baptism site of Jesus on the Jordan River — UNESCO-listed and moving regardless of faith.' },
  { id: 'act-main-springs', title: 'Ma‘in Hot Springs', emoji: '♨️', category: 'relax', region: 'madaba', duration: 'Half day', description: 'Thermal waterfalls in a desert canyon near the Dead Sea — soak under a hot cascade.' },

  // — Day trips: Wadi Rum & Aqaba —
  { id: 'act-wadi-rum-jeep', title: 'Wadi Rum jeep safari', emoji: '🚙', category: 'daytrip', region: 'wadirum', duration: 'Full day', description: 'Red dunes, rock bridges, and Lawrence of Arabia country by 4x4 with a Bedouin guide. ~4 hrs from Amman — pair with Petra or Aqaba.' },
  { id: 'act-wadi-rum-camp', title: 'Overnight in a Bedouin camp', emoji: '⛺', category: 'nature', region: 'wadirum', duration: 'Overnight', description: 'Zarb dinner cooked under the sand, then the clearest starfield you’ve ever seen. Bubble tents available for AC comfort.' },
  { id: 'act-wadi-rum-balloon', title: 'Hot air balloon over Wadi Rum', emoji: '🎈', category: 'nature', region: 'wadirum', duration: '3 hrs (dawn)', description: 'Sunrise over the protected desert from above — splurge-worthy if the schedule allows.' },
  { id: 'act-aqaba-snorkel', title: 'Snorkel or dive the Red Sea', emoji: '🤿', category: 'nature', region: 'aqaba', duration: 'Half–full day', description: 'Coral reefs, the Cedar Pride wreck, and warm clear water at Jordan’s only coastline.' },
  { id: 'act-aqaba-boat', title: 'Aqaba glass-bottom boat & beach', emoji: '⛵', category: 'relax', region: 'aqaba', duration: 'Half day', description: 'Lazy Red Sea afternoon — boat trip over the reefs, swim stops, and beach time.' },

  // — More nature near Amman —
  { id: 'act-desert-castles', title: 'Eastern desert castles loop', emoji: '🏯', category: 'daytrip', region: 'amman', duration: 'Half–full day', description: 'Qasr Amra’s UNESCO frescoes, Qasr Kharana, and Azraq’s black basalt fort — an easy loop east of Amman.' },
  { id: 'act-dana', title: 'Dana Biosphere Reserve viewpoint', emoji: '🦅', category: 'nature', region: 'petra', duration: 'Half day', description: 'Jordan’s grandest canyon views from the stone village of Dana — a scenic stop en route to Petra.' },
]

// ---------------------------------------------------------------------------
// Restaurant guide — the food is half the trip. Price: 1 = cheap eats,
// 2 = casual sit-down, 3 = special night out. orderIn = delivery-friendly.
// ---------------------------------------------------------------------------

export const RESTAURANTS: Restaurant[] = [
  { id: 'res-hashem', name: 'Hashem', emoji: '🧆', cuisine: 'Falafel & hummus', neighborhood: 'Downtown (Al-Balad)', region: 'amman', vibe: 'Legendary street-side institution', price: 1, signature: 'Falafel, hummus, fuul & mint tea', orderIn: true, description: 'Open since 1952 and beloved by everyone from taxi drivers to royalty. Go hungry, pay almost nothing.' },
  { id: 'res-habibah', name: 'Habibah Sweets', emoji: '🍮', cuisine: 'Knafeh & Arabic sweets', neighborhood: 'Downtown (Al-Balad)', region: 'amman', vibe: 'Stand-in-the-alley classic', price: 1, signature: 'Knafeh nabulsiyeh, hot off the tray', orderIn: true, description: 'The knafeh benchmark for all of Jordan since 1951. The downtown alley branch is the ritual.' },
  { id: 'res-alquds', name: 'Al-Quds Restaurant', emoji: '🍛', cuisine: 'Traditional Jordanian', neighborhood: 'Downtown (Al-Balad)', region: 'amman', vibe: 'Old-school dining hall', price: 1, signature: 'Mansaf — the national dish', orderIn: true, description: 'Where downtown Amman has eaten mansaf for generations. Zero frills, all flavor.' },
  { id: 'res-reem', name: 'Reem Shawarma', emoji: '🌯', cuisine: 'Shawarma', neighborhood: '2nd Circle', region: 'amman', vibe: 'Iconic late-night kiosk', price: 1, signature: 'Lamb shawarma wrap', orderIn: true, description: 'A tiny cart with a permanent queue since 1976. The midnight shawarma of Amman legend.' },
  { id: 'res-abu-jbara', name: 'Abu Jbara', emoji: '🥙', cuisine: 'Falafel & hummus', neighborhood: 'Multiple branches', region: 'amman', vibe: 'Busy breakfast favorite', price: 1, signature: 'Hummus with shatta & falafel sandwiches', orderIn: true, description: 'The local pick for a fast, hearty Jordanian breakfast — great delivery option for lazy mornings.' },
  { id: 'res-shams-el-balad', name: 'Shams El Balad', emoji: '🥗', cuisine: 'Modern Levantine', neighborhood: 'Jabal Amman', region: 'amman', vibe: 'Sunny farm-to-table brunch', price: 2, signature: 'Seasonal mezze & brunch boards', orderIn: true, description: 'Bright rooftop terrace, local produce, and the best brunch in the city. Bissan will love it.' },
  { id: 'res-sufra', name: 'Sufra', emoji: '🍽️', cuisine: 'Upscale Jordanian', neighborhood: 'Rainbow Street', region: 'amman', vibe: 'Elegant heritage villa & garden', price: 3, signature: 'Mansaf, maqluba & mezze spreads', orderIn: false, description: 'The definitive fancy-Jordanian night out, in a gorgeous old house on Rainbow Street. Book ahead.' },
  { id: 'res-fakhreldin', name: 'Fakhr El-Din', emoji: '🥂', cuisine: 'Lebanese fine dining', neighborhood: '1st Circle, Jabal Amman', region: 'amman', vibe: 'White-tablecloth 1920s mansion', price: 3, signature: 'Hot & cold mezze, grilled meats, arak', orderIn: false, description: 'Amman’s grande dame for a celebratory dinner — perfect for a pre-wedding family gathering.' },
  { id: 'res-beit-sitti', name: 'Beit Sitti', emoji: '👵', cuisine: 'Home-style Jordanian', neighborhood: 'Jabal al-Weibdeh', region: 'amman', vibe: 'Cook-and-dine in a grandmother’s home', price: 3, signature: 'The meal you help make yourselves', orderIn: false, description: 'A hands-on dinner experience in an old family house — a fun date night that ends with a feast on the terrace.' },
  { id: 'res-levant', name: 'Levant', emoji: '🫒', cuisine: 'Levantine', neighborhood: 'Jabal Amman', region: 'amman', vibe: 'Refined old-Amman charm', price: 2, signature: 'Freekeh, kibbeh & Circassian dishes', orderIn: true, description: 'Regional homestyle dishes you won’t find elsewhere, served in a lovely heritage building.' },
  { id: 'res-mijana', name: 'Mijana', emoji: '🍷', cuisine: 'Levantine', neighborhood: 'Jabal Amman', region: 'amman', vibe: 'Leafy courtyard, live oud nights', price: 2, signature: 'Mezze & grills under the trees', orderIn: false, description: 'A garden villa near Rainbow Street with mezze, argileh, and live Arabic music some evenings.' },
  { id: 'res-cantaloupe', name: 'Cantaloupe', emoji: '🌇', cuisine: 'Mediterranean fusion', neighborhood: 'Jabal Amman', region: 'amman', vibe: 'Sunset rooftop over downtown', price: 3, signature: 'Cocktails & dinner with THE view', orderIn: false, description: 'Glass-walled lounge hanging over the old city — time your reservation for sunset.' },
  { id: 'res-rumi', name: 'Rumi Café', emoji: '☕', cuisine: 'Coffee & light bites', neighborhood: 'Jabal al-Weibdeh', region: 'amman', vibe: 'Artsy neighborhood café', price: 1, signature: 'Turkish coffee & rosewater lattes', orderIn: false, description: 'The heart of Weibdeh’s café scene — grab a sidewalk table and watch the neighborhood go by.' },
  { id: 'res-wild-jordan', name: 'Wild Jordan Center', emoji: '🌿', cuisine: 'Healthy Jordanian', neighborhood: 'Jabal Amman', region: 'amman', vibe: 'Eco café with citadel views', price: 2, signature: 'Fresh juices & organic mezze', orderIn: true, description: 'RSCN’s café overlooking downtown — light lunches, smoothies, and a great nature shop.' },
  { id: 'res-blue-fig', name: 'Blue Fig', emoji: '🫐', cuisine: 'International fusion', neighborhood: 'Abdoun', region: 'amman', vibe: 'Stylish all-day hangout', price: 2, signature: 'Wood-oven manakish & fusion plates', orderIn: true, description: 'An Amman classic for relaxed dinners and late breakfasts on the west side.' },
  { id: 'res-bab-alyemen', name: 'Bab Al Yemen', emoji: '🍖', cuisine: 'Yemeni', neighborhood: 'Gardens St / multiple', region: 'amman', vibe: 'Feast-on-the-floor seating', price: 1, signature: 'Mandi lamb & giant stone-baked bread', orderIn: true, description: 'Fall-apart mandi eaten the traditional way. Come with a group and an appetite.' },
  { id: 'res-shawerma-time', name: 'Shawerma Time / Al Nabulsi round', emoji: '🥤', cuisine: 'Late-night order-in', neighborhood: 'Citywide delivery', region: 'amman', vibe: 'Couch dinner via Careem/Talabat', price: 1, signature: 'Shawarma, kunafa & fresh juice combos', orderIn: true, description: 'For nights in at the apartment — the reliable delivery lineup locals actually order.' },
  { id: 'res-lebanese-house', name: 'Lebanese House (Umm Khalil)', emoji: '🏡', cuisine: 'Lebanese & grills', neighborhood: 'Jerash', region: 'north', vibe: 'Famous garden restaurant', price: 2, signature: 'Mixed grill after the ruins', orderIn: false, description: 'The traditional lunch stop after touring Jerash — huge mezze spreads since 1977.' },
  { id: 'res-my-moms-recipe', name: 'My Mom’s Recipe', emoji: '🍲', cuisine: 'Jordanian & international', neighborhood: 'Wadi Musa (Petra)', region: 'petra', vibe: 'Cozy traveler favorite', price: 2, signature: 'Maqluba & galayet bandora', orderIn: false, description: 'The warm, reliable dinner spot in Petra town after a long day among the tombs.' },
  { id: 'res-the-basin', name: 'The Basin Restaurant', emoji: '🥘', cuisine: 'Buffet inside Petra', neighborhood: 'Petra archaeological site', region: 'petra', vibe: 'Oasis mid-hike', price: 2, signature: 'Shaded lunch buffet by the Qasr al-Bint', orderIn: false, description: 'The sit-down lunch inside the site itself — a real break before the Monastery climb.' },
  { id: 'res-ali-baba', name: 'Ali Baba Restaurant', emoji: '🦞', cuisine: 'Seafood & grills', neighborhood: 'Aqaba center', region: 'aqaba', vibe: 'Bustling harbor-town staple', price: 2, signature: 'Sayadieh — fish over spiced rice', orderIn: false, description: 'Aqaba’s long-running seafood landmark, steps from the corniche.' },
  { id: 'res-floka', name: 'Floka', emoji: '🐟', cuisine: 'Seafood', neighborhood: 'Aqaba', region: 'aqaba', vibe: 'Fresh-catch dinner spot', price: 3, signature: 'Grilled Red Sea catch of the day', orderIn: false, description: 'Pick your fish from the ice display — the special-occasion seafood dinner in Aqaba.' },
]

// ---------------------------------------------------------------------------
// Seed schedule: pinned milestones + a few starter suggestions. Everything is
// editable in the app; milestones ask for confirmation before removal.
// ---------------------------------------------------------------------------

export const SEED_SCHEDULE: ScheduledItem[] = [
  { id: 'ms-depart', date: TRIP.startDate, kind: 'milestone', milestone: true, title: 'Fly out — US ✈ Amman', emoji: '✈️', note: 'Departure day. Passports, chargers, gifts for the family!' },
  { id: 'ms-arrive', date: '2026-07-24', kind: 'milestone', milestone: true, title: 'Land in Amman 🇯🇴', emoji: '🛬', note: 'Ahlan wa sahlan! Settle in, family hellos, and a first knafeh.' },
  { id: 'ms-wedding', date: TRIP.weddingDate, kind: 'milestone', milestone: true, title: TRIP.weddingLabel, emoji: '💍', note: 'The big day — the whole reason for the trip! Outfits ready, cameras charged.' },
  { id: 'ms-return', date: TRIP.endDate, kind: 'milestone', milestone: true, title: 'Fly home — Amman ✈ US', emoji: '🛫', note: 'Ma’a salama, Amman. Save room in the suitcase for sweets.' },

  // Starter suggestions — drag, edit, or remove freely.
  { id: 'seed-hashem', date: '2026-07-24', kind: 'restaurant', refId: 'res-hashem', meal: 'dinner' },
  { id: 'seed-citadel', date: '2026-07-25', kind: 'activity', refId: 'act-citadel' },
  { id: 'seed-jerash', date: '2026-07-26', kind: 'activity', refId: 'act-jerash' },
  { id: 'seed-petra', date: '2026-07-28', kind: 'activity', refId: 'act-petra' },
  { id: 'seed-dead-sea', date: '2026-07-30', kind: 'activity', refId: 'act-dead-sea' },
  { id: 'seed-family', date: '2026-08-01', kind: 'activity', refId: 'act-family-time' },
]

// ---------------------------------------------------------------------------
// Trip essentials & packing (static content)
// ---------------------------------------------------------------------------

export const ESSENTIALS = [
  { emoji: '💵', title: 'Currency', body: 'Jordanian Dinar (JOD) — about $1.41 per JD. Cards work in nicer places; keep small cash for souks, taxis, and falafel joints.' },
  { emoji: '☀️', title: 'Late-July weather', body: 'Amman: hot, dry days ~32–35°C (90s°F), cool evenings ~20°C. Dead Sea, Aqaba & Wadi Rum run 5–8°C hotter — plan those for early morning.' },
  { emoji: '🗣️', title: 'A few phrases', body: 'Ahlan (hi) · Shukran (thanks) · Sahtain! (bon appétit) · Ala rasi (with pleasure) · Mabrouk! (congratulations — you’ll need this on Aug 2!)' },
  { emoji: '🔌', title: 'Plugs & data', body: 'Type C/G plugs, 230V — bring a UK+EU adapter. Grab a local eSIM (Zain/Orange) on arrival for cheap data.' },
  { emoji: '🚕', title: 'Getting around', body: 'Careem and Uber both work well in Amman. For day trips, negotiate a private driver or book a small-group tour.' },
  { emoji: '💳', title: 'Tipping', body: '~10% in restaurants if service isn’t included; round up taxis; 1–2 JD for hotel staff and guides per bag/day.' },
]

export const PACKING_SEED = [
  { id: 'pack-passports', label: 'Passports + printed copies' },
  { id: 'pack-wedding', label: 'Wedding outfits (pressed & packed on top!)' },
  { id: 'pack-gifts', label: 'Gifts for the family' },
  { id: 'pack-sunscreen', label: 'High-SPF sunscreen & hats' },
  { id: 'pack-water-shoes', label: 'Water shoes (Wadi Mujib / Dead Sea)' },
  { id: 'pack-walking-shoes', label: 'Broken-in walking shoes for Petra' },
  { id: 'pack-adapter', label: 'UK+EU plug adapters & power bank' },
  { id: 'pack-meds', label: 'Medications + small first-aid kit' },
  { id: 'pack-swimwear', label: 'Swimwear + cover-ups' },
  { id: 'pack-layers', label: 'Light layers for cool Amman evenings' },
  { id: 'pack-camera', label: 'Camera + extra memory card' },
  { id: 'pack-jd', label: 'Some JOD cash or plan an ATM stop' },
]
