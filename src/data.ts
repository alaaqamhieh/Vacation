import type { Activity, Restaurant, ScheduledItem } from './types'
import { TRIP } from './config'

// ---------------------------------------------------------------------------
// Activity library — curated across Jordan. IDs are stable; don't reuse them.
// popularity: 1–5 must-do scale. familyPick: recommended by the family.
// coords: approximate [lat, lng] for the trip map (Maps links are exact).
// ---------------------------------------------------------------------------

export const ACTIVITIES: Activity[] = [
  // — Amman: history & culture —
  { id: 'act-citadel', title: 'Amman Citadel (Jabal al-Qal‘a)', emoji: '🏛️', category: 'history', region: 'amman', duration: '2–3 hrs', popularity: 5, familyPick: true, coords: [31.9547, 35.934], description: 'Temple of Hercules, the Umayyad Palace, and the best panorama of downtown Amman. Go late afternoon for golden light.' },
  { id: 'act-roman-theater', title: 'Roman Theater & Odeon', emoji: '🎭', category: 'history', region: 'amman', duration: '1–2 hrs', popularity: 5, familyPick: true, coords: [31.9515, 35.9394], description: '2nd-century, 6,000-seat theater carved into the hillside downtown (Jerash has its own — see both!). Climb to the top row for the view.' },
  { id: 'act-jordan-museum', title: 'The Jordan Museum', emoji: '🏺', category: 'history', region: 'amman', duration: '2 hrs', popularity: 4, coords: [31.9454, 35.9284], description: 'Home of the Dead Sea Scrolls and the ‘Ain Ghazal statues — some of the oldest human statues ever found.' },
  { id: 'act-king-abdullah-mosque', title: 'King Abdullah I Mosque', emoji: '🕌', category: 'history', region: 'amman', duration: '1 hr', popularity: 3, coords: [31.9634, 35.9187], description: 'The iconic blue-domed mosque — one of the few in Amman open to non-Muslim visitors.' },
  { id: 'act-darat-funun', title: 'Darat al Funun art houses', emoji: '🎨', category: 'history', region: 'amman', duration: '1–2 hrs', popularity: 3, coords: [31.9524, 35.9312], description: 'Contemporary Arab art in a cluster of beautiful 1920s villas above downtown, with a Byzantine ruin in the garden.' },
  { id: 'act-car-museum', title: 'Royal Automobile Museum', emoji: '🏎️', category: 'history', region: 'amman', duration: '1–2 hrs', popularity: 3, coords: [31.9762, 35.862], description: 'King Hussein’s remarkable car collection — from Rolls-Royces to the Mars rover prop from The Martian.' },
  { id: 'act-duke-diwan', title: 'Wast el Balad walk & Duke’s Diwan', emoji: '🚶', category: 'history', region: 'amman', duration: '2 hrs', popularity: 5, familyPick: true, coords: [31.9506, 35.9339], description: 'Downtown Amman on foot — stairways, arches, street art, and the city’s oldest townhouse. Pairs perfectly with Jabal al-Qal‘a above.' },

  // — Amman: markets & shopping —
  { id: 'act-rainbow-street', title: 'Rainbow Street evening stroll', emoji: '🌈', category: 'market', region: 'amman', duration: '2–3 hrs', popularity: 5, familyPick: true, coords: [31.9497, 35.9256], description: 'Cafés, galleries, and people-watching along Jabal Amman’s liveliest street. Best after sunset.' },
  { id: 'act-abdali-blvd', title: 'Abdali Boulevard walk', emoji: '🌆', category: 'market', region: 'amman', duration: '2 hrs', popularity: 4, familyPick: true, coords: [31.9628, 35.9105], description: 'The modern open-air promenade next to Abdali Mall — fountains, restaurants, and an easy evening walk for the whole family.' },
  { id: 'act-souk-jara', title: 'Souk Jara flea market', emoji: '🧺', category: 'market', region: 'amman', duration: '2 hrs', popularity: 4, coords: [31.949, 35.9245], description: 'Open-air Friday market off Rainbow Street — crafts, vintage finds, food stalls, live music. Summer Fridays only.' },
  { id: 'act-gold-souk', title: 'Souk el Dahab (gold market)', emoji: '💛', category: 'market', region: 'amman', duration: '2 hrs', popularity: 4, familyPick: true, coords: [31.9508, 35.9346], description: 'Spices, sweets, perfume, and gold in the bustling heart of Al-Balad — right next to Habibah, so knafeh after is mandatory.' },
  { id: 'act-sweifieh', title: 'Sweifieh & Wakalat Street', emoji: '🛍️', category: 'market', region: 'amman', duration: '2–3 hrs', popularity: 3, coords: [31.9561, 35.8626], description: 'Amman’s pedestrian shopping street plus malls nearby — good for gifts to bring home.' },

  // — Amman: relax —
  { id: 'act-hammam', title: 'Turkish bath (hammam) afternoon', emoji: '🧖', category: 'relax', region: 'amman', duration: '2–3 hrs', popularity: 4, coords: [31.9509, 35.9366], description: 'Steam, scrub, and massage — the classic post-flight or post-Petra recovery. Book couples’ slots ahead.' },
  { id: 'act-cafe-culture', title: 'Coffee crawl in Jabal al-Weibdeh', emoji: '☕', category: 'relax', region: 'amman', duration: '2–3 hrs', popularity: 4, familyPick: true, coords: [31.9563, 35.9236], description: 'Amman’s artsiest hill (الويبدة): specialty coffee, quiet galleries, and leafy side streets made for wandering.' },
  { id: 'act-shisha-night', title: 'Rooftop shisha & mint lemonade', emoji: '🌙', category: 'relax', region: 'amman', duration: '2 hrs', popularity: 4, coords: [31.95, 35.926], description: 'Watch the city lights come on from a rooftop café with argileh and limonana.' },
  { id: 'act-family-time', title: 'Family visits & wedding prep', emoji: '👨‍👩‍👧', category: 'relax', region: 'amman', duration: 'Flexible', popularity: 5, description: 'Time with the family — visits, fittings, and everything leading up to the big day.' },

  // — Day trips: north —
  { id: 'act-jerash', title: 'Jerash Roman ruins', emoji: '🏺', category: 'daytrip', region: 'north', duration: 'Half–full day', popularity: 5, familyPick: true, coords: [32.2745, 35.8938], description: 'One of the best-preserved Roman cities anywhere — colonnaded streets, temples, its own grand theater, and the huge Oval Plaza. ~1 hr from Amman.' },
  { id: 'act-ajloun', title: 'Ajloun Castle & forest reserve', emoji: '🏰', category: 'daytrip', region: 'north', duration: 'Half day', popularity: 3, coords: [32.3248, 35.7273], description: '12th-century hilltop castle with sweeping views; pair with Jerash for a full northern loop.' },
  { id: 'act-umm-qais', title: 'Umm Qais (Gadara)', emoji: '⛰️', category: 'daytrip', region: 'north', duration: 'Full day', popularity: 3, coords: [32.6531, 35.6853], description: 'Roman ruins overlooking the Sea of Galilee and Golan Heights — dramatic views and far fewer crowds.' },

  // — Day trips: Petra —
  { id: 'act-petra', title: 'Petra — the Treasury & beyond', emoji: '🏜️', category: 'daytrip', region: 'petra', duration: 'Full day', popularity: 5, familyPick: true, coords: [30.3285, 35.4444], description: 'Walk the Siq to the Treasury, then the Street of Facades and the Royal Tombs. Start early — a long day, and Wadi Rum can follow the same evening. ~3 hrs from Amman.' },
  { id: 'act-petra-monastery', title: 'Petra: hike to the Monastery', emoji: '🥾', category: 'nature', region: 'petra', duration: '3–4 hrs', popularity: 4, coords: [30.3379, 35.4306], description: '850 rock-cut steps up to Petra’s biggest monument — tougher than the Treasury but worth every step.' },
  { id: 'act-petra-night', title: 'Petra by Night', emoji: '🕯️', category: 'nature', region: 'petra', duration: '2 hrs', popularity: 4, coords: [30.3285, 35.4444], description: 'The Siq and Treasury lit by 1,500 candles with Bedouin music. Mon/Wed/Thu evenings — plan around it.' },
  { id: 'act-little-petra', title: 'Little Petra (Siq al-Barid)', emoji: '🪨', category: 'daytrip', region: 'petra', duration: '1–2 hrs', popularity: 3, coords: [30.4083, 35.4517], description: 'A quieter miniature Petra with painted frescoes — easy add-on before or after the main site.' },

  // — Day trips: Dead Sea & Madaba —
  { id: 'act-dead-sea', title: 'Float in the Dead Sea', emoji: '🌊', category: 'daytrip', region: 'deadsea', duration: 'Full day', popularity: 5, familyPick: true, coords: [31.716, 35.59], description: 'The lowest point on Earth. Float, mud up, rinse, repeat — then catch the sunset over the water. ~1 hr from Amman.' },
  { id: 'act-dead-sea-spa', title: 'Dead Sea resort day (Kempinski)', emoji: '💆', category: 'relax', region: 'deadsea', duration: 'Full day', popularity: 5, familyPick: true, coords: [31.71, 35.588], description: 'Day passes at the resorts — the family favorite is Kempinski Ishtar — get you pools, private beach, and mud treatments. The easy way to do the Dead Sea.' },
  { id: 'act-wadi-mujib', title: 'Wadi Mujib Siq Trail', emoji: '💦', category: 'nature', region: 'deadsea', duration: 'Half day', popularity: 4, coords: [31.4686, 35.5789], description: 'Wade and scramble up a river canyon between towering sandstone walls. Wet, wild, unforgettable. Water shoes required.' },
  { id: 'act-madaba', title: 'Madaba mosaic map & St. George’s', emoji: '🗺️', category: 'daytrip', region: 'madaba', duration: 'Half day', popularity: 3, coords: [31.7157, 35.794], description: 'The famous 6th-century mosaic map of the Holy Land, in Jordan’s most Christian-heritage town.' },
  { id: 'act-mount-nebo', title: 'Mount Nebo', emoji: '⛰️', category: 'daytrip', region: 'madaba', duration: '1–2 hrs', popularity: 3, coords: [31.7684, 35.7253], description: 'Where Moses looked over the Promised Land — on a clear day you can see Jericho and Jerusalem. Pairs with Madaba.' },
  { id: 'act-baptism-site', title: 'Bethany Beyond the Jordan', emoji: '🕊️', category: 'daytrip', region: 'madaba', duration: 'Half day', popularity: 3, coords: [31.8371, 35.5472], description: 'The baptism site of Jesus on the Jordan River — UNESCO-listed and moving regardless of faith.' },
  { id: 'act-main-springs', title: 'Ma‘in Hot Springs', emoji: '♨️', category: 'relax', region: 'madaba', duration: 'Half day', popularity: 3, coords: [31.6118, 35.611], description: 'Thermal waterfalls in a desert canyon near the Dead Sea — soak under a hot cascade.' },

  // — Day trips: Wadi Rum & Aqaba —
  { id: 'act-wadi-rum-jeep', title: 'Wadi Rum jeep safari', emoji: '🚙', category: 'daytrip', region: 'wadirum', duration: 'Half–full day', popularity: 5, familyPick: true, coords: [29.5765, 35.42], description: 'Red dunes, rock bridges, and Lawrence of Arabia country by 4x4 with a Bedouin guide. Doable the same day as Petra — they’re under 2 hrs apart.' },
  { id: 'act-wadi-rum-camp', title: 'Overnight in a Bedouin camp', emoji: '⛺', category: 'nature', region: 'wadirum', duration: 'Overnight', popularity: 4, coords: [29.55, 35.41], description: 'Zarb dinner cooked under the sand, then the clearest starfield you’ve ever seen. Bubble tents available for AC comfort.' },
  { id: 'act-wadi-rum-balloon', title: 'Hot air balloon over Wadi Rum', emoji: '🎈', category: 'nature', region: 'wadirum', duration: '3 hrs (dawn)', popularity: 3, coords: [29.63, 35.43], description: 'Sunrise over the protected desert from above — splurge-worthy if the schedule allows.' },
  { id: 'act-aqaba-snorkel', title: 'Snorkel or dive the Red Sea', emoji: '🤿', category: 'nature', region: 'aqaba', duration: 'Half–full day', popularity: 4, coords: [29.4266, 34.9713], description: 'Coral reefs, the Cedar Pride wreck, and warm clear water at Jordan’s only coastline.' },
  { id: 'act-aqaba-boat', title: 'Aqaba glass-bottom boat & beach', emoji: '⛵', category: 'relax', region: 'aqaba', duration: 'Half day', popularity: 3, coords: [29.5267, 35.0078], description: 'Lazy Red Sea afternoon — boat trip over the reefs, swim stops, and beach time.' },

  // — More nature near Amman —
  { id: 'act-desert-castles', title: 'Eastern desert castles loop', emoji: '🏯', category: 'daytrip', region: 'amman', duration: 'Half–full day', popularity: 3, coords: [31.802, 36.586], description: 'Qasr Amra’s UNESCO frescoes, Qasr Kharana, and Azraq’s black basalt fort — an easy loop east of Amman.' },
  { id: 'act-dana', title: 'Dana Biosphere Reserve viewpoint', emoji: '🦅', category: 'nature', region: 'petra', duration: 'Half day', popularity: 3, coords: [30.677, 35.611], description: 'Jordan’s grandest canyon views from the stone village of Dana — a scenic stop en route to Petra.' },
]

// ---------------------------------------------------------------------------
// Restaurant guide — the food is half the trip. Price: 1 = cheap eats,
// 2 = casual sit-down, 3 = special night out. orderIn = delivery-friendly.
// ---------------------------------------------------------------------------

export const RESTAURANTS: Restaurant[] = [
  // — Family recommendations —
  { id: 'res-shawarma-saj', name: 'Shawarma 3a Saj', emoji: '🫓', cuisine: 'Saj shawarma', neighborhood: 'Multiple branches', region: 'amman', vibe: 'The family’s shawarma pick', price: 1, signature: 'Shawarma wrapped in fresh saj bread', orderIn: true, popularity: 5, familyPick: true, coords: [31.975, 35.87], description: 'Shawarma rolled in paper-thin saj bread straight off the dome — the family says this is the one.' },
  { id: 'res-zhoor-shifa', name: 'Zhoor El Shifa', emoji: '🍢', cuisine: 'Mashawi (grills)', neighborhood: 'Amman', region: 'amman', vibe: 'Serious charcoal grills', price: 2, signature: 'Mixed mashawi platter', orderIn: true, popularity: 5, familyPick: true, coords: [31.99, 35.85], description: 'Family-endorsed mashawi — kebab, shish tawook, and lamb chops off the charcoal.' },
  { id: 'res-amman-kobra', name: 'Amman El Kobra', emoji: '🥩', cuisine: 'Mashawi (grills)', neighborhood: 'Amman', region: 'amman', vibe: 'Old-school grill house', price: 2, signature: 'Charcoal kebab & arayes', orderIn: true, popularity: 4, familyPick: true, coords: [31.962, 35.89], description: 'Another family mashawi favorite — come hungry, order the mixed grill for the table.' },
  { id: 'res-day3a', name: 'Shawarma El Day3a', emoji: '🌯', cuisine: 'Shawarma', neighborhood: 'Multiple branches', region: 'amman', vibe: 'Village-style shawarma', price: 1, signature: 'Day3a-style garlicky shawarma', orderIn: true, popularity: 4, familyPick: true, coords: [31.977, 35.844], description: '“The village’s shawarma” — loaded wraps and plates, on the family’s must-try list.' },
  { id: 'res-muheet', name: 'Al Muheet', emoji: '🐙', cuisine: 'Seafood', neighborhood: 'Amman', region: 'amman', vibe: 'The family’s seafood table', price: 2, signature: 'Fresh fish, calamari & sayadieh', orderIn: true, popularity: 4, familyPick: true, coords: [31.976, 35.873], description: '“The Ocean” — the family’s pick for seafood night in Amman without driving to Aqaba.' },
  { id: 'res-khashouka', name: 'Khashouka', emoji: '🍳', cuisine: 'Breakfast & shakshuka', neighborhood: 'Amman', region: 'amman', vibe: 'Buzzy breakfast spot', price: 1, signature: 'Khashouka — their own spin on shakshuka', orderIn: true, popularity: 4, familyPick: true, coords: [31.956, 35.862], description: 'Eggs, tomato, and fresh bread done right — the family’s breakfast-out recommendation.' },
  { id: 'res-hamada', name: 'Hamada Falafel', emoji: '🧆', cuisine: 'Falafel', neighborhood: 'Gardens St', region: 'amman', vibe: 'No-frills falafel legend', price: 1, signature: 'Falafel sandwiches by the bag', orderIn: true, popularity: 4, familyPick: true, coords: [31.979, 35.88], description: 'The Gardens Street falafel stop the family swears by — hot, crispy, and costs pennies.' },
  { id: 'res-salloura', name: 'Salloura Al-Shahba', emoji: '🍥', cuisine: 'Syrian sweets', neighborhood: 'Gardens / Wasfi Al-Tal', region: 'amman', vibe: 'Legendary Aleppo sweets house', price: 1, signature: 'حلاوة الجبن — halawet el jibn', orderIn: true, popularity: 5, familyPick: true, coords: [31.98, 35.877], description: 'The famous Aleppan sweets maker — the halawet el jibn (sweet cheese rolls with cream) is the family’s non-negotiable.' },

  // — Downtown classics —
  { id: 'res-hashem', name: 'Hashem', emoji: '🧆', cuisine: 'Falafel & hummus', neighborhood: 'Downtown (Al-Balad)', region: 'amman', vibe: 'Legendary street-side institution', price: 1, signature: 'Falafel, hummus, fuul & mint tea', orderIn: true, popularity: 5, coords: [31.9516, 35.9349], description: 'Open since 1952 and beloved by everyone from taxi drivers to royalty. Go hungry, pay almost nothing.' },
  { id: 'res-habibah', name: 'Habibah Sweets', emoji: '🍮', cuisine: 'Knafeh & Arabic sweets', neighborhood: 'Downtown (Al-Balad)', region: 'amman', vibe: 'Stand-in-the-alley classic', price: 1, signature: 'Knafeh nabulsiyeh, hot off the tray', orderIn: true, popularity: 5, familyPick: true, coords: [31.9518, 35.9345], description: 'The knafeh benchmark for all of Jordan since 1951. The downtown alley branch (بالبلد) is the ritual — right by the gold souk.' },
  { id: 'res-alquds', name: 'Al-Quds Restaurant', emoji: '🍛', cuisine: 'Traditional Jordanian', neighborhood: 'Downtown (Al-Balad)', region: 'amman', vibe: 'Old-school dining hall', price: 1, signature: 'Mansaf — the national dish', orderIn: true, popularity: 4, coords: [31.9513, 35.9337], description: 'Where downtown Amman has eaten mansaf for generations. Zero frills, all flavor.' },
  { id: 'res-reem', name: 'Reem Shawarma', emoji: '🌯', cuisine: 'Shawarma', neighborhood: '2nd Circle', region: 'amman', vibe: 'Iconic late-night kiosk', price: 1, signature: 'Lamb shawarma wrap', orderIn: true, popularity: 5, coords: [31.9497, 35.9161], description: 'A tiny cart with a permanent queue since 1976. The midnight shawarma of Amman legend.' },
  { id: 'res-abu-jbara', name: 'Abu Jbara', emoji: '🥙', cuisine: 'Falafel & hummus', neighborhood: 'Madina St + branches', region: 'amman', vibe: 'Busy breakfast favorite', price: 1, signature: 'Hummus with shatta & falafel sandwiches', orderIn: true, popularity: 5, familyPick: true, coords: [31.977, 35.871], description: 'The local pick for a fast, hearty Jordanian breakfast — the family says hit the Madina Street branch.' },

  // — Jabal Amman & Weibdeh —
  { id: 'res-shams-el-balad', name: 'Shams El Balad', emoji: '🥗', cuisine: 'Modern Levantine', neighborhood: 'Jabal Amman', region: 'amman', vibe: 'Sunny farm-to-table brunch', price: 2, signature: 'Seasonal mezze & brunch boards', orderIn: true, popularity: 4, coords: [31.9469, 35.928], description: 'Bright rooftop terrace, local produce, and the best brunch in the city.' },
  { id: 'res-sufra', name: 'Sufra', emoji: '🍽️', cuisine: 'Upscale Jordanian', neighborhood: 'Rainbow Street', region: 'amman', vibe: 'Elegant heritage villa & garden', price: 3, signature: 'Mansaf, maqluba & mezze spreads', orderIn: false, popularity: 5, coords: [31.9494, 35.9251], description: 'The definitive fancy-Jordanian night out, in a gorgeous old house on Rainbow Street. Book ahead.' },
  { id: 'res-fakhreldin', name: 'Fakhr El-Din', emoji: '🥂', cuisine: 'Lebanese fine dining', neighborhood: '1st Circle, Jabal Amman', region: 'amman', vibe: 'White-tablecloth 1920s mansion', price: 3, signature: 'Hot & cold mezze, grilled meats, arak', orderIn: false, popularity: 4, coords: [31.9515, 35.9222], description: 'Amman’s grande dame for a celebratory dinner — perfect for a pre-wedding family gathering.' },
  { id: 'res-beit-sitti', name: 'Beit Sitti', emoji: '👵', cuisine: 'Home-style Jordanian', neighborhood: 'Jabal al-Weibdeh', region: 'amman', vibe: 'Cook-and-dine in a grandmother’s home', price: 3, signature: 'The meal you help make yourselves', orderIn: false, popularity: 4, coords: [31.9569, 35.9257], description: 'A hands-on dinner experience in an old family house — a fun group night that ends with a feast on the terrace.' },
  { id: 'res-levant', name: 'Levant', emoji: '🫒', cuisine: 'Levantine', neighborhood: 'Jabal Amman', region: 'amman', vibe: 'Refined old-Amman charm', price: 2, signature: 'Freekeh, kibbeh & Circassian dishes', orderIn: true, popularity: 3, coords: [31.951, 35.923], description: 'Regional homestyle dishes you won’t find elsewhere, served in a lovely heritage building.' },
  { id: 'res-mijana', name: 'Mijana', emoji: '🍷', cuisine: 'Levantine', neighborhood: 'Jabal Amman', region: 'amman', vibe: 'Leafy courtyard, live oud nights', price: 2, signature: 'Mezze & grills under the trees', orderIn: false, popularity: 4, coords: [31.9502, 35.9247], description: 'A garden villa near Rainbow Street with mezze, argileh, and live Arabic music some evenings.' },
  { id: 'res-cantaloupe', name: 'Cantaloupe', emoji: '🌇', cuisine: 'Mediterranean fusion', neighborhood: 'Jabal Amman', region: 'amman', vibe: 'Sunset rooftop over downtown', price: 3, signature: 'Cocktails & dinner with THE view', orderIn: false, popularity: 4, coords: [31.9489, 35.9263], description: 'Glass-walled lounge hanging over the old city — time your reservation for sunset.' },
  { id: 'res-rumi', name: 'Rumi Café', emoji: '☕', cuisine: 'Coffee & light bites', neighborhood: 'Jabal al-Weibdeh', region: 'amman', vibe: 'Artsy neighborhood café', price: 1, signature: 'Turkish coffee & rosewater lattes', orderIn: false, popularity: 4, coords: [31.9563, 35.9238], description: 'The heart of Weibdeh’s café scene — grab a sidewalk table and watch the neighborhood go by.' },
  { id: 'res-wild-jordan', name: 'Wild Jordan Center', emoji: '🌿', cuisine: 'Healthy Jordanian', neighborhood: 'Jabal Amman', region: 'amman', vibe: 'Eco café with citadel views', price: 2, signature: 'Fresh juices & organic mezze', orderIn: true, popularity: 3, coords: [31.9528, 35.9312], description: 'RSCN’s café overlooking downtown — light lunches, smoothies, and a great nature shop.' },

  // — West Amman —
  { id: 'res-blue-fig', name: 'Blue Fig', emoji: '🫐', cuisine: 'International fusion', neighborhood: 'Abdoun', region: 'amman', vibe: 'Stylish all-day hangout', price: 2, signature: 'Wood-oven manakish & fusion plates', orderIn: true, popularity: 3, coords: [31.941, 35.88], description: 'An Amman classic for relaxed dinners and late breakfasts on the west side.' },
  { id: 'res-bab-alyemen', name: 'Bab Al Yemen', emoji: '🍖', cuisine: 'Yemeni', neighborhood: 'Gardens St / multiple', region: 'amman', vibe: 'Feast-on-the-floor seating', price: 1, signature: 'Mandi lamb & giant stone-baked bread', orderIn: true, popularity: 4, coords: [31.98, 35.885], description: 'Fall-apart mandi eaten the traditional way. Come with a group and an appetite.' },
  { id: 'res-shawerma-time', name: 'Shawerma Time / Al Nabulsi round', emoji: '🥤', cuisine: 'Late-night order-in', neighborhood: 'Citywide delivery', region: 'amman', vibe: 'Couch dinner via Careem/Talabat', price: 1, signature: 'Shawarma, kunafa & fresh juice combos', orderIn: true, popularity: 3, description: 'For nights in at the apartment — the reliable delivery lineup locals actually order.' },

  // — On the road —
  { id: 'res-lebanese-house', name: 'Lebanese House (Umm Khalil)', emoji: '🏡', cuisine: 'Lebanese & grills', neighborhood: 'Jerash', region: 'north', vibe: 'Famous garden restaurant', price: 2, signature: 'Mixed grill after the ruins', orderIn: false, popularity: 4, coords: [32.2685, 35.889], description: 'The traditional lunch stop after touring Jerash — huge mezze spreads since 1977.' },
  { id: 'res-my-moms-recipe', name: 'My Mom’s Recipe', emoji: '🍲', cuisine: 'Jordanian & international', neighborhood: 'Wadi Musa (Petra)', region: 'petra', vibe: 'Cozy traveler favorite', price: 2, signature: 'Maqluba & galayet bandora', orderIn: false, popularity: 3, coords: [30.3218, 35.479], description: 'The warm, reliable dinner spot in Petra town after a long day among the tombs.' },
  { id: 'res-the-basin', name: 'The Basin Restaurant', emoji: '🥘', cuisine: 'Buffet inside Petra', neighborhood: 'Petra archaeological site', region: 'petra', vibe: 'Oasis mid-hike', price: 2, signature: 'Shaded lunch buffet by the Qasr al-Bint', orderIn: false, popularity: 3, coords: [30.3286, 35.4348], description: 'The sit-down lunch inside the site itself — a real break before the Monastery climb.' },
  { id: 'res-ali-baba', name: 'Ali Baba Restaurant', emoji: '🦞', cuisine: 'Seafood & grills', neighborhood: 'Aqaba center', region: 'aqaba', vibe: 'Bustling harbor-town staple', price: 2, signature: 'Sayadieh — fish over spiced rice', orderIn: false, popularity: 3, coords: [29.5262, 35.0067], description: 'Aqaba’s long-running seafood landmark, steps from the corniche.' },
  { id: 'res-floka', name: 'Floka', emoji: '🐟', cuisine: 'Seafood', neighborhood: 'Aqaba', region: 'aqaba', vibe: 'Fresh-catch dinner spot', price: 3, signature: 'Grilled Red Sea catch of the day', orderIn: false, popularity: 3, coords: [29.525, 35.005], description: 'Pick your fish from the ice display — the special-occasion seafood dinner in Aqaba.' },
]

// ---------------------------------------------------------------------------
// Seed schedule: pinned milestones + a few starter suggestions. Everything is
// editable in the app; milestones ask for confirmation before removal.
// ---------------------------------------------------------------------------

export const SEED_SCHEDULE: ScheduledItem[] = [
  { id: 'ms-depart', date: TRIP.departDate, kind: 'milestone', milestone: true, title: 'Fly out — US ✈ Amman', emoji: '✈️', note: 'Departure day. Passports, chargers, gifts for the family!' },
  { id: 'ms-arrive', date: '2026-07-24', kind: 'milestone', milestone: true, title: 'Land in Amman 🇯🇴', emoji: '🛬', note: 'Ahlan wa sahlan! Settle in, family hellos, and a first knafeh.' },
  { id: 'ms-wedding', date: TRIP.weddingDate, kind: 'milestone', milestone: true, title: TRIP.weddingLabel, emoji: '💍', note: 'The big day — the whole reason for the trip! Outfits ready, cameras charged.' },
  { id: 'ms-return', date: TRIP.returnDate, kind: 'milestone', milestone: true, title: 'Fly home — Amman ✈ US', emoji: '🛫', note: 'Ma’a salama, Amman. Save room in the suitcase for sweets.' },

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
