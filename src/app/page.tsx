"use client";
import { useState, useEffect } from 'react';

type Job = { id: string; name: string; area: string; lvl: number; eng: number; cashMin: number; cashMax: number; rep: number; heat: number; order: number; needs: string[]; desc: string; icon: string; };
type Item = { id: string; name: string; type: 'tool' | 'vehicle' | 'weapon'; cost: number; desc: string; icon: string; area: string; };

const JOBS: Job[] = [
  { id: 'marina', name: 'RUN THE MARINA', area: 'Port Haven', lvl: 1, eng: 2, cashMin: 85, cashMax: 130, rep: 16, heat: 1, order: 0, needs: [], desc: 'Shake down charter captains.', icon: '⚓' },
  { id: 'cherries', name: 'SMUGGLE CHERRIES', area: 'Port Haven', lvl: 3, eng: 4, cashMin: 170, cashMax: 260, rep: 28, heat: 2, order: 1, needs: ['box_cutter'], desc: 'Truckload past checkpoint.', icon: '🍒' },
  { id: 'flavors', name: 'COLLECT AT Salty Cow Creamery', area: 'Port Haven', lvl: 6, eng: 7, cashMin: 320, cashMax: 480, rep: 40, heat: 3, order: 2, needs: ['skiff'], desc: 'Ice cream parlor owes protection.', icon: '🍦' },
  { id: 'ferry', name: 'MIDNIGHT FERRY RUN', area: 'Port Haven', lvl: 9, eng: 10, cashMin: 580, cashMax: 820, rep: 60, heat: 4, order: 3, needs: ['dock_hook', 'harbor_runner'], desc: 'Ironport crossing.', icon: '⛴' },
  { id: 'statepark', name: 'SECURE STATE PARK', area: 'Port Haven', lvl: 12, eng: 13, cashMin: 900, cashMax: 1350, rep: 84, heat: 5, order: 4, needs: ['harbor_runner'], desc: 'Snack stands work for you now.', icon: '🌲' },
  { id: 'bait_shop', name: 'SHAKE DOWN BAIT SHOP', area: 'Port Haven', lvl: 16, eng: 15, cashMin: 700, cashMax: 1050, rep: 92, heat: 6, order: 5, needs: ['bolt_cutters'], desc: 'Worm buckets and cash register.', icon: '🪱' },
  { id: 'arcade', name: 'RUN THE ARCADE', area: 'Port Haven', lvl: 20, eng: 17, cashMin: 950, cashMax: 1350, rep: 105, heat: 7, order: 6, needs: ['brass_knuckles'], desc: 'Tourist kids losing quarters.', icon: '🕹' },
  { id: 'fish_market', name: 'SECURE FISH MARKET', area: 'Port Haven', lvl: 24, eng: 19, cashMin: 1200, cashMax: 1750, rep: 119, heat: 8, order: 7, needs: ['dock_hook', 'bolt_cutters'], desc: 'Morning catch tax.', icon: '🐟' },
  { id: 'harbor_motel', name: 'TAKE OVER MOTEL', area: 'Port Haven', lvl: 28, eng: 20, cashMin: 1550, cashMax: 2200, rep: 130, heat: 9, order: 8, needs: ['motel_master_key', 'burner_phone'], desc: 'Rent by the hour, pay by the week.', icon: '🏨' },
  { id: 'diner', name: 'SKIM THE DINER', area: 'Port Haven', lvl: 33, eng: 22, cashMin: 1850, cashMax: 2600, rep: 145, heat: 10, order: 9, needs: ['burner_phone', 'box_cutter'], desc: 'Main Wharf greasy spoon.', icon: '🍳' },
  { id: 'car_wash', name: 'CONTROL THE CAR WASH', area: 'Port Haven', lvl: 38, eng: 24, cashMin: 2350, cashMax: 3300, rep: 158, heat: 11, order: 10, needs: ['rusted_pickup', 'fuel_siphon'], desc: 'Launder money and trucks.', icon: '🚿' },
  { id: 'fuel_dock', name: 'HEIST THE FUEL DOCK', area: 'Port Haven', lvl: 43, eng: 26, cashMin: 2900, cashMax: 4100, rep: 162, heat: 12, order: 11, needs: ['fuel_siphon', 'harbor_runner'], desc: 'Diesel is liquid gold.', icon: '⛽' },
  { id: 'mini_golf', name: 'RIG THE MINI GOLF', area: 'Port Haven', lvl: 48, eng: 27, cashMin: 3400, cashMax: 4700, rep: 189, heat: 13, order: 12, needs: ['golf_cart', 'bolt_cutters'], desc: 'Windmill hole always wins.', icon: '⛳' },
  { id: 'souvenir_row', name: 'OWN SOUVENIR ROW', area: 'Port Haven', lvl: 54, eng: 28, cashMin: 4100, cashMax: 5600, rep: 200, heat: 14, order: 13, needs: ['bait_trawler', 'brass_knuckles'], desc: 'Tourist trap row now yours.', icon: '🎁' },
  { id: 'harbor_bar', name: 'BUY THE HARBOR BAR', area: 'Port Haven', lvl: 60, eng: 30, cashMin: 5000, cashMax: 7000, rep: 236, heat: 15, order: 14, needs: ['bait_trawler', 'motel_master_key', 'harbor_runner'], desc: 'whole harbor drinks to you.', icon: '🍺' },
  { id: 'boatyard', name: 'CONTROL THE BOATYARD', area: 'Port Haven', lvl: 66, eng: 32, cashMin: 5800, cashMax: 7900, rep: 260, heat: 16, order: 15, needs: ['bait_trawler', 'drydock_crane'], desc: 'Dry dock pays protection now.', icon: '🛥' },
  { id: 'lobster_wharf', name: 'TAKE THE LOBSTER WHARF', area: 'Port Haven', lvl: 72, eng: 34, cashMin: 6600, cashMax: 8900, rep: 290, heat: 17, order: 16, needs: ['bait_trawler', 'lobster_permit', 'harbor_runner'], desc: 'Lobster traps and laundering.', icon: '🦞' },
  { id: 'lighthouse', name: 'SMUGGLE AT LIGHTHOUSE', area: 'Port Haven', lvl: 77, eng: 35, cashMin: 7600, cashMax: 10200, rep: 320, heat: 18, order: 17, needs: ['lighthouse_key', 'burner_phone'], desc: 'Beacon is your drop point.', icon: '🗼' },
  { id: 'cannery', name: 'RUN THE CANNERY', area: 'Port Haven', lvl: 82, eng: 36, cashMin: 8600, cashMax: 11500, rep: 350, heat: 19, order: 18, needs: ['cannery_press', 'rusted_pickup', 'fuel_siphon'], desc: 'Fish cannery front for product.', icon: '🥫' },
  { id: 'yacht_club', name: 'SHAKE DOWN YACHT CLUB', area: 'Port Haven', lvl: 87, eng: 38, cashMin: 9800, cashMax: 13100, rep: 390, heat: 20, order: 19, needs: ['yacht_keys', 'golf_cart', 'motel_master_key'], desc: 'Rich kids pay to dock.', icon: '⛵' },
  { id: 'customs_dock', name: 'HEIST CUSTOMS DOCK', area: 'Port Haven', lvl: 91, eng: 40, cashMin: 11000, cashMax: 14800, rep: 430, heat: 21, order: 20, needs: ['customs_badge', 'harbor_runner', 'dock_hook'], desc: 'Containers full of untaxed goods.', icon: '📦' },
  { id: 'harbor_casino', name: 'RIG HARBOR CASINO', area: 'Port Haven', lvl: 94, eng: 42, cashMin: 12500, cashMax: 16700, rep: 470, heat: 22, order: 21, needs: ['casino_ledger', 'brass_knuckles', 'burner_phone'], desc: 'House always loses now.', icon: '🎰' },
  { id: 'shipyard', name: 'OWN THE SHIPYARD', area: 'Port Haven', lvl: 97, eng: 44, cashMin: 14100, cashMax: 18800, rep: 510, heat: 23, order: 22, needs: ['drydock_crane', 'cannery_press', 'fuel_siphon'], desc: 'Every hull in the harbor is yours.', icon: '🚢' },
  { id: 'port_authority', name: 'BUY PORT AUTHORITY', area: 'Port Haven', lvl: 99, eng: 46, cashMin: 16000, cashMax: 21000, rep: 560, heat: 24, order: 23, needs: ['customs_badge', 'yacht_keys', 'bait_trawler'], desc: 'You ARE the harbor now.', icon: '🏛' },
  { id: 'harbor_empire', name: 'HARBOR EMPIRE', area: 'Port Haven', lvl: 100, eng: 48, cashMin: 18500, cashMax: 25000, rep: 640, heat: 25, order: 24, needs: ['drydock_crane', 'lobster_permit', 'lighthouse_key', 'cannery_press', 'casino_ledger'], desc: 'Final - Port Haven bows to you.', icon: '👑' },

    // --- IRONPORT - RUST BELT (NOW USES NEW ITEMS) ---
  { id: 'scrap_yard', name: 'SCRAP THE FREIGHT YARD', area: 'Ironport', lvl: 32, eng: 22, cashMin: 1850, cashMax: 2600, rep: 120, heat: 10, order: 0, needs: [], desc: 'Copper wire and rusted freight.', icon: '🚂' },
  { id: 'tool_die', name: 'SHAKE DOWN TOOL & DIE', area: 'Ironport', lvl: 36, eng: 23, cashMin: 2300, cashMax: 3200, rep: 140, heat: 11, order: 1, needs: ['iron_saw'], desc: 'Machine shop owes protection.', icon: '🔩' },
  { id: 'rust_market', name: 'RUN THE RUST MARKET', area: 'Ironport', lvl: 40, eng: 24, cashMin: 2800, cashMax: 3900, rep: 160, heat: 12, order: 2, needs: ['slag_hammer'], desc: 'Black market in the old mill.', icon: '🏚' },
  { id: 'coal_train', name: 'HIJACK COAL TRAIN', area: 'Ironport', lvl: 44, eng: 25, cashMin: 3400, cashMax: 4700, rep: 180, heat: 13, order: 3, needs: ['coal_cart'], desc: 'Coal is money in Ironport.', icon: '🚃' },
  { id: 'iron_foundry', name: 'SECURE IRON FOUNDRY', area: 'Ironport', lvl: 48, eng: 26, cashMin: 4100, cashMax: 5600, rep: 200, heat: 14, order: 4, needs: ['foundry_mask'], desc: 'Furnace runs hot day and night.', icon: '🏭' },
  { id: 'steel_mill', name: 'SMUGGLE THROUGH STEEL MILL', area: 'Ironport', lvl: 52, eng: 27, cashMin: 4800, cashMax: 6500, rep: 230, heat: 15, order: 5, needs: ['iron_saw', 'foundry_mask'], desc: 'Molten steel hides contraband.', icon: '🔥' },
  { id: 'box_factory', name: 'TAKE THE BOX FACTORY', area: 'Ironport', lvl: 56, eng: 28, cashMin: 5500, cashMax: 7400, rep: 250, heat: 16, order: 6, needs: ['scrap_magnet'], desc: 'Cardboard empire, cash inside.', icon: '📦' },
  { id: 'railyard', name: 'CONTROL THE RAILYARD', area: 'Ironport', lvl: 60, eng: 29, cashMin: 6200, cashMax: 8300, rep: 270, heat: 17, order: 7, needs: ['coal_cart', 'scrap_magnet'], desc: 'Every rail car pays tribute.', icon: '🛤' },
  { id: 'scrap_kings', name: 'SHAKE DOWN SCRAP KINGS', area: 'Ironport', lvl: 64, eng: 30, cashMin: 7000, cashMax: 9300, rep: 300, heat: 18, order: 8, needs: ['scrap_magnet', 'slag_hammer'], desc: 'Kings of rusted cars.', icon: '👑' },
  { id: 'weld_shop', name: 'RUN THE WELD SHOP', area: 'Ironport', lvl: 68, eng: 32, cashMin: 7900, cashMax: 10500, rep: 330, heat: 19, order: 9, needs: ['foundry_mask', 'iron_saw'], desc: 'Sparks and side hustles.', icon: '⚒' },
  { id: 'iron_docks', name: 'TAKE THE IRON DOCKS', area: 'Ironport', lvl: 72, eng: 34, cashMin: 8800, cashMax: 11700, rep: 360, heat: 20, order: 10, needs: ['scrap_magnet', 'coal_cart', 'drydock_crane'], desc: 'Ironport dirty harbor.', icon: '⚓' },
  { id: 'union_hall', name: 'HEIST THE UNION HALL', area: 'Ironport', lvl: 76, eng: 36, cashMin: 9800, cashMax: 13100, rep: 390, heat: 21, order: 11, needs: ['slag_hammer', 'foundry_mask', 'customs_badge'], desc: 'Union dues are yours now.', icon: '📋' },
  { id: 'iron_bar', name: 'BUY THE IRON BARON OFFICE', area: 'Ironport', lvl: 80, eng: 38, cashMin: 11000, cashMax: 14700, rep: 420, heat: 22, order: 12, needs: ['iron_saw', 'scrap_magnet', 'coal_cart'], desc: 'Baron bows to you.', icon: '🏢' },
  { id: 'iron_works', name: 'OWN THE IRON WORKS', area: 'Ironport', lvl: 85, eng: 40, cashMin: 12500, cashMax: 16700, rep: 460, heat: 23, order: 13, needs: ['iron_saw', 'foundry_mask', 'scrap_magnet', 'slag_hammer'], desc: 'Whole city works for you.', icon: '🏗' },
  { id: 'ironport_empire', name: 'IRONPORT EMPIRE', area: 'Ironport', lvl: 90, eng: 42, cashMin: 14200, cashMax: 19000, rep: 520, heat: 24, order: 14, needs: ['iron_saw', 'scrap_magnet', 'foundry_mask', 'slag_hammer', 'coal_cart'], desc: 'Final - Rust to riches.', icon: '🏴' },

    // --- SABLE DUNES - PARTY DUNES (NOW USES NEW ITEMS) ---
  { id: 'dune_rentals', name: 'RUN THE DUNE RENTALS', area: 'Sable Dunes', lvl: 50, eng: 28, cashMin: 4100, cashMax: 5600, rep: 200, heat: 14, order: 0, needs: [], desc: 'Jeep rentals and overpriced coolers.', icon: '🏜' },
  { id: 'campground', name: 'SHAKE DOWN CAMPGROUND', area: 'Sable Dunes', lvl: 53, eng: 29, cashMin: 4600, cashMax: 6200, rep: 220, heat: 15, order: 1, needs: ['bonfire_kit'], desc: 'Tents pay rent too.', icon: '⛺' },
  { id: 'state_forest', name: 'SMUGGLE THROUGH FOREST', area: 'Sable Dunes', lvl: 56, eng: 30, cashMin: 5100, cashMax: 6900, rep: 240, heat: 16, order: 2, needs: ['dune_buggy'], desc: 'State forest back roads.', icon: '🌲' },
  { id: 'bonfire_party', name: 'TAKE THE BONFIRE PARTY', area: 'Sable Dunes', lvl: 59, eng: 31, cashMin: 5700, cashMax: 7700, rep: 260, heat: 16, order: 3, needs: ['bonfire_kit', 'tiki_club'], desc: 'Kegs and cover charges.', icon: '🔥' },
  { id: 'weed_farm', name: 'RUN THE WEED FARM', area: 'Sable Dunes', lvl: 62, eng: 32, cashMin: 6300, cashMax: 8500, rep: 280, heat: 17, order: 4, needs: ['lake_float'], desc: 'Behind the dunes.', icon: '🌿' },
  { id: 'sand_bar', name: 'SECURE THE SAND BAR', area: 'Sable Dunes', lvl: 65, eng: 33, cashMin: 7000, cashMax: 9400, rep: 310, heat: 18, order: 5, needs: ['tiki_club'], desc: 'Beach bar protection.', icon: '🍹' },
  { id: 'beach_bus', name: 'HIJACK THE BEACH BUS', area: 'Sable Dunes', lvl: 68, eng: 34, cashMin: 7800, cashMax: 10500, rep: 340, heat: 19, order: 6, needs: ['party_bus'], desc: 'Tourist bus full of cash.', icon: '🚌' },
  { id: 'lake_store', name: 'TAKE THE LAKE STORE', area: 'Sable Dunes', lvl: 71, eng: 35, cashMin: 8600, cashMax: 11600, rep: 370, heat: 19, order: 7, needs: ['lake_float', 'bonfire_kit'], desc: 'Bait, beer, and bud.', icon: '🏪' },
  { id: 'dune_buggies', name: 'CONTROL DUNE BUGGIES', area: 'Sable Dunes', lvl: 74, eng: 36, cashMin: 9500, cashMax: 12800, rep: 400, heat: 20, order: 8, needs: ['dune_buggy'], desc: 'Rentals at $200/hr.', icon: '🏎' },
  { id: 'lifeguard_tower', name: 'SHAKE DOWN LIFEGUARD TOWER', area: 'Sable Dunes', lvl: 77, eng: 37, cashMin: 10500, cashMax: 14100, rep: 430, heat: 20, order: 9, needs: ['tiki_club', 'lake_float'], desc: 'Even Baywatch pays.', icon: '🛟' },
  { id: 'festival_grounds', name: 'RUN FESTIVAL GROUNDS', area: 'Sable Dunes', lvl: 80, eng: 38, cashMin: 11600, cashMax: 15600, rep: 460, heat: 21, order: 10, needs: ['party_bus', 'bonfire_kit'], desc: 'Music fest money laundering.', icon: '🎪' },
  { id: 'orchard_stands', name: 'TAKE THE ORCHARD STANDS', area: 'Sable Dunes', lvl: 83, eng: 39, cashMin: 12800, cashMax: 17200, rep: 500, heat: 21, order: 11, needs: ['dune_buggy', 'party_bus'], desc: 'Cherry season is your season.', icon: '🍒' },
  { id: 'dunes_motel', name: 'BUY THE DUNES MOTEL', area: 'Sable Dunes', lvl: 86, eng: 40, cashMin: 14100, cashMax: 18900, rep: 540, heat: 22, order: 12, needs: ['tiki_club', 'lake_float', 'dune_buggy'], desc: 'No-tell motel empire.', icon: '🏨' },
  { id: 'dune_ridge', name: 'OWN THE DUNE RIDGE', area: 'Sable Dunes', lvl: 89, eng: 42, cashMin: 15500, cashMax: 20800, rep: 580, heat: 23, order: 13, needs: ['dune_buggy', 'bonfire_kit', 'party_bus', 'tiki_club'], desc: 'Every grain of sand is yours.', icon: '⛰' },
  { id: 'sable_empire', name: 'SABLE DUNES EMPIRE', area: 'Sable Dunes', lvl: 92, eng: 44, cashMin: 17200, cashMax: 23100, rep: 640, heat: 24, order: 14, needs: ['dune_buggy', 'party_bus', 'bonfire_kit', 'tiki_club', 'lake_float'], desc: 'Final - Dunes bow to you.', icon: '👑' },

      // --- MASON HILLS - RICH HILLS (NOW USES NEW ITEMS) ---
  { id: 'gated_community', name: 'RUN THE GATED COMMUNITY', area: 'Mason Hills', lvl: 70, eng: 34, cashMin: 8200, cashMax: 11000, rep: 340, heat: 18, order: 0, needs: [], desc: 'HOA dues now come to you.', icon: '🏘' },
  { id: 'country_club', name: 'SHAKE DOWN COUNTRY CLUB', area: 'Mason Hills', lvl: 72, eng: 35, cashMin: 9100, cashMax: 12200, rep: 370, heat: 19, order: 1, needs: ['country_club_card'], desc: 'Old money, new boss.', icon: '🏌' },
  { id: 'vineyard', name: 'SMUGGLE THROUGH VINEYARD', area: 'Mason Hills', lvl: 74, eng: 36, cashMin: 10000, cashMax: 13400, rep: 400, heat: 19, order: 2, needs: ['vineyard_deed'], desc: 'Wine barrels full of product.', icon: '🍷' },
  { id: 'golf_course', name: 'TAKE THE GOLF COURSE', area: 'Mason Hills', lvl: 76, eng: 37, cashMin: 11000, cashMax: 14800, rep: 430, heat: 20, order: 3, needs: ['country_club_card', 'horse_saddle'], desc: 'Greens fees and green.', icon: '⛳' },
  { id: 'horse_stables', name: 'SECURE THE HORSE STABLES', area: 'Mason Hills', lvl: 78, eng: 38, cashMin: 12100, cashMax: 16300, rep: 460, heat: 20, order: 4, needs: ['horse_saddle'], desc: 'Thoroughbreds and dirty cash.', icon: '🐴' },
  { id: 'wine_truck', name: 'HIJACK THE WINE TRUCK', area: 'Mason Hills', lvl: 80, eng: 39, cashMin: 13300, cashMax: 17900, rep: 490, heat: 21, order: 5, needs: ['vineyard_deed', 'polo_mallet'], desc: '$400 bottles, $0 cost.', icon: '🚚' },
  { id: 'hill_mansions', name: 'TAKE THE HILL MANSIONS', area: 'Mason Hills', lvl: 82, eng: 40, cashMin: 14600, cashMax: 19600, rep: 520, heat: 21, order: 6, needs: ['hilltop_keycard'], desc: 'Estate staff work for you.', icon: '🏰' },
  { id: 'spa_resort', name: 'CONTROL THE SPA RESORT', area: 'Mason Hills', lvl: 84, eng: 41, cashMin: 16000, cashMax: 21500, rep: 560, heat: 22, order: 7, needs: ['country_club_card', 'hilltop_keycard'], desc: 'Rich wives, rich tips.', icon: '💆' },
  { id: 'charity_gala', name: 'RUN THE CHARITY GALA', area: 'Mason Hills', lvl: 86, eng: 42, cashMin: 17500, cashMax: 23500, rep: 600, heat: 22, order: 8, needs: ['vineyard_deed', 'country_club_card'], desc: 'Launder for the elite.', icon: '🥂' },
  { id: 'private_airfield', name: 'SHAKE DOWN AIRFIELD', area: 'Mason Hills', lvl: 88, eng: 43, cashMin: 19200, cashMax: 25800, rep: 640, heat: 23, order: 9, needs: ['hilltop_keycard', 'polo_mallet'], desc: 'Private jets, private product.', icon: '✈' },
  { id: 'equestrian_center', name: 'TAKE EQUESTRIAN CENTER', area: 'Mason Hills', lvl: 90, eng: 44, cashMin: 21100, cashMax: 28300, rep: 680, heat: 23, order: 10, needs: ['horse_saddle', 'polo_mallet'], desc: 'Horse shows are your show.', icon: '🏇' },
  { id: 'hills_casino', name: 'BUY THE HILLS CASINO', area: 'Mason Hills', lvl: 92, eng: 45, cashMin: 23200, cashMax: 31100, rep: 730, heat: 24, order: 11, needs: ['hilltop_keycard', 'vineyard_deed', 'yacht_keys'], desc: 'Hills house always loses.', icon: '🎲' },
  { id: 'estate_row', name: 'SECURE ESTATE ROW', area: 'Mason Hills', lvl: 94, eng: 46, cashMin: 25500, cashMax: 34200, rep: 780, heat: 24, order: 12, needs: ['hilltop_keycard', 'country_club_card', 'horse_saddle'], desc: 'Million dollar drive pays you.', icon: '🏡' },
  { id: 'hilltop', name: 'OWN THE HILLTOP', area: 'Mason Hills', lvl: 96, eng: 47, cashMin: 28000, cashMax: 37600, rep: 830, heat: 25, order: 13, needs: ['hilltop_keycard', 'vineyard_deed', 'polo_mallet', 'country_club_card'], desc: 'View of the whole empire.', icon: '🌄' },
  { id: 'mason_empire', name: 'MASON HILLS EMPIRE', area: 'Mason Hills', lvl: 98, eng: 48, cashMin: 31000, cashMax: 41500, rep: 900, heat: 25, order: 14, needs: ['hilltop_keycard', 'vineyard_deed', 'horse_saddle', 'polo_mallet', 'country_club_card'], desc: 'Final - Hills bow to you.', icon: '👑' },

      // --- MOTOR CITY - ENDGAME (NOW USES NEW ITEMS) ---
  { id: 'motor_factory', name: 'SCRAP THE MOTOR FACTORY', area: 'Motor City', lvl: 90, eng: 44, cashMin: 28000, cashMax: 37600, rep: 700, heat: 22, order: 0, needs: [], desc: 'Assembly line now assembles cash.', icon: '🏭' },
  { id: 'chop_shop', name: 'SHAKE DOWN CHOP SHOP', area: 'Motor City', lvl: 92, eng: 45, cashMin: 31000, cashMax: 41600, rep: 740, heat: 22, order: 1, needs: ['motor_press'], desc: 'Stripped cars, stacked cash.', icon: '🔧' },
  { id: 'detroit_docks', name: 'RUN THE DETROIT DOCKS', area: 'Motor City', lvl: 94, eng: 46, cashMin: 34000, cashMax: 45600, rep: 780, heat: 23, order: 2, needs: ['detroit_keycard'], desc: 'River runs dirty.', icon: '⚓' },
  { id: 'techno_warehouse', name: 'TAKE THE TECHNO WAREHOUSE', area: 'Motor City', lvl: 96, eng: 47, cashMin: 37500, cashMax: 50300, rep: 830, heat: 23, order: 3, needs: ['techno_key'], desc: 'Rave till you own it.', icon: '🎧' },
  { id: 'casino_strip', name: 'SECURE THE CASINO STRIP', area: 'Motor City', lvl: 98, eng: 48, cashMin: 41000, cashMax: 55000, rep: 880, heat: 24, order: 4, needs: ['renaissance_pass'], desc: 'Motor City jackpot.', icon: '🎰' },
  { id: 'armored_truck', name: 'HIJACK ARMORED TRUCK', area: 'Motor City', lvl: 100, eng: 49, cashMin: 45000, cashMax: 60400, rep: 930, heat: 24, order: 5, needs: ['armored_van'], desc: 'Straight out the truck.', icon: '🚛' },
  { id: 'auto_show', name: 'CONTROL THE AUTO SHOW', area: 'Motor City', lvl: 102, eng: 50, cashMin: 49500, cashMax: 66400, rep: 990, heat: 25, order: 6, needs: ['motor_press', 'detroit_keycard'], desc: 'Every whip pays tribute.', icon: '🚗' },
  { id: 'union_hq_motor', name: 'RUN THE UNION HQ', area: 'Motor City', lvl: 104, eng: 51, cashMin: 54500, cashMax: 73100, rep: 1050, heat: 25, order: 7, needs: ['motor_press', 'techno_key'], desc: 'Union works for you now.', icon: '📋' },
  { id: 'downtown_highrises', name: 'TAKE DOWNTOWN HIGHRISES', area: 'Motor City', lvl: 106, eng: 52, cashMin: 60000, cashMax: 80500, rep: 1120, heat: 26, order: 8, needs: ['renaissance_pass', 'detroit_keycard'], desc: 'Glass towers, cash showers.', icon: '🏙' },
  { id: 'riverfront_hotel', name: 'BUY THE RIVERFRONT HOTEL', area: 'Motor City', lvl: 108, eng: 53, cashMin: 66000, cashMax: 88600, rep: 1200, heat: 26, order: 9, needs: ['renaissance_pass', 'armored_van'], desc: 'Penthouse is your office.', icon: '🏨' },
  { id: 'motor_pd', name: 'SHAKE DOWN MOTOR PD', area: 'Motor City', lvl: 110, eng: 54, cashMin: 73000, cashMax: 97900, rep: 1280, heat: 27, order: 10, needs: ['detroit_keycard', 'armored_van', 'customs_badge'], desc: 'Badge? You own the badge.', icon: '🚔' },
  { id: 'stadium_district', name: 'SECURE STADIUM DISTRICT', area: 'Motor City', lvl: 112, eng: 55, cashMin: 80000, cashMax: 107300, rep: 1370, heat: 27, order: 11, needs: ['techno_key', 'motor_press'], desc: 'Game day is pay day.', icon: '🏟' },
  { id: 'renaissance_tower', name: 'TAKE RENAISSANCE TOWER', area: 'Motor City', lvl: 114, eng: 56, cashMin: 88000, cashMax: 118000, rep: 1470, heat: 28, order: 12, needs: ['renaissance_pass', 'detroit_keycard', 'techno_key'], desc: 'Tallest building, biggest take.', icon: '🗼' },
  { id: 'motor_mile', name: 'OWN THE MOTOR MILE', area: 'Motor City', lvl: 116, eng: 57, cashMin: 97000, cashMax: 130000, rep: 1580, heat: 28, order: 13, needs: ['armored_van', 'renaissance_pass', 'motor_press', 'detroit_keycard'], desc: '8 Mile is yours.', icon: '🛣' },
  { id: 'motor_empire', name: 'MOTOR CITY EMPIRE', area: 'Motor City', lvl: 120, eng: 60, cashMin: 110000, cashMax: 150000, rep: 2000, heat: 30, order: 14, needs: ['armored_van', 'detroit_keycard', 'motor_press', 'renaissance_pass', 'techno_key'], desc: 'FINAL - You own Michigan.', icon: '👑' },

];


const ITEMS: Item[] = [
  // --- PORT HAVEN - KEEPS EVERYTHING ORIGINAL ---
  { id: 'box_cutter', name: 'Box Cutter', type: 'tool', cost: 400, desc: 'Opens boxes and mouths.', icon: '🔪', area: 'Port Haven' },
  { id: 'dock_hook', name: 'Dock Hook', type: 'weapon', cost: 1200, desc: 'Fish market enforcement.', icon: '🪝', area: 'Port Haven' },
  { id: 'brass_knuckles', name: 'Brass Knuckles', type: 'weapon', cost: 1800, desc: 'For arcade punks.', icon: '🥊', area: 'Port Haven' },
  { id: 'bolt_cutters', name: 'Bolt Cutters', type: 'tool', cost: 2200, desc: 'Bait shop locks are cheap.', icon: '🔧', area: 'Port Haven' },
  { id: 'skiff', name: 'Borrowed Skiff', type: 'vehicle', cost: 2800, desc: 'Quiet harbor moves.', icon: '🛶', area: 'Port Haven' },
  { id: 'burner_phone', name: 'Burner Phone', type: 'tool', cost: 4200, desc: 'Motel and diner calls.', icon: '📞', area: 'Port Haven' },
  { id: 'motel_master_key', name: 'Motel Master Key', type: 'tool', cost: 5500, desc: 'Every room is your room.', icon: '🔑', area: 'Port Haven' },
  { id: 'harbor_runner', name: 'Harbor Runner', type: 'vehicle', cost: 7200, desc: 'Grey Lake speed.', icon: '🚤', area: 'Port Haven' },
  { id: 'fuel_siphon', name: 'Fuel Siphon Kit', type: 'tool', cost: 8500, desc: 'For the fuel dock.', icon: '🛢', area: 'Port Haven' },
  { id: 'rusted_pickup', name: 'Rusted Pickup', type: 'vehicle', cost: 9800, desc: 'Car wash workhorse.', icon: '🛻', area: 'Port Haven' },
  { id: 'golf_cart', name: 'Golf Cart', type: 'vehicle', cost: 13500, desc: 'Mini golf patrol.', icon: '🛺', area: 'Port Haven' },
  { id: 'bait_trawler', name: 'Bait Trawler', type: 'vehicle', cost: 18500, desc: 'Own the whole harbor.', icon: '🎣', area: 'Port Haven' },
  { id: 'drydock_crane', name: 'Drydock Crane', type: 'vehicle', cost: 24000, desc: 'Lift hulls out the water.', icon: '🏗', area: 'Port Haven' },
  { id: 'lobster_permit', name: 'Harpoon Gun', type: 'weapon', cost: 28500, desc: 'For lobsters and legs.', icon: '🔱', area: 'Port Haven' },
  { id: 'lighthouse_key', name: 'Lighthouse Key', type: 'tool', cost: 34000, desc: 'Top of the beacon is your stash.', icon: '🔦', area: 'Port Haven' },
  { id: 'cannery_press', name: 'Fillet Cleaver', type: 'weapon', cost: 39500, desc: 'Cuts fish and problems.', icon: '🪓', area: 'Port Haven' },
  { id: 'yacht_keys', name: 'Yacht Club Keys', type: 'tool', cost: 47000, desc: 'VIP slips pay double.', icon: '⛵', area: 'Port Haven' },
  { id: 'customs_badge', name: 'Customs Badge', type: 'tool', cost: 56000, desc: 'Wave containers through.', icon: '🛃', area: 'Port Haven' },
  { id: 'casino_ledger', name: 'Dock Slugger', type: 'weapon', cost: 68000, desc: 'Casino collections.', icon: '🏏', area: 'Port Haven' },
  { id: 'ferry_ticket', name: 'Ferry Ticket', type: 'tool', cost: 0, desc: 'Rare drop from Midnight Ferry Run.', icon: '🎟', area: 'Port Haven' },

  // --- IRONPORT - RUST BELT NEW ---
  { id: 'iron_saw', name: 'Iron Saw', type: 'tool', cost: 14500, desc: 'Cuts freight cars open.', icon: '🪚', area: 'Ironport' },
  { id: 'scrap_magnet', name: 'Scrap Magnet', type: 'vehicle', cost: 21000, desc: 'Lift cars off the yard.', icon: '🧲', area: 'Ironport' },
  { id: 'foundry_mask', name: 'Foundry Mask', type: 'tool', cost: 16800, desc: 'Breathe in the furnace.', icon: '🥽', area: 'Ironport' },
  { id: 'slag_hammer', name: 'Slag Hammer', type: 'weapon', cost: 19500, desc: 'Ironport enforcement.', icon: '🔨', area: 'Ironport' },
  { id: 'coal_cart', name: 'Coal Cart', type: 'vehicle', cost: 26000, desc: 'Haul black gold.', icon: '🚃', area: 'Ironport' },

  // --- SABLE DUNES - PARTY DUNES NEW ---
  { id: 'dune_buggy', name: 'Dune Buggy', type: 'vehicle', cost: 22000, desc: 'Fly over the dunes.', icon: '🏎', area: 'Sable Dunes' },
  { id: 'party_bus', name: 'Party Bus', type: 'vehicle', cost: 18000, desc: 'Beach party shuttle.', icon: '🚌', area: 'Sable Dunes' },
  { id: 'bonfire_kit', name: 'Bonfire Kit', type: 'tool', cost: 12500, desc: 'For beach takeovers.', icon: '🔥', area: 'Sable Dunes' },
  { id: 'tiki_club', name: 'Tiki Club', type: 'weapon', cost: 14000, desc: 'Sand bar security.', icon: '🏏', area: 'Sable Dunes' },
  { id: 'lake_float', name: 'Lake Float Raft', type: 'vehicle', cost: 15500, desc: 'Smuggle on the water.', icon: '🦩', area: 'Sable Dunes' },

  // --- MASON HILLS - RICH HILLS NEW ---
  { id: 'vineyard_deed', name: 'Vineyard Deed', type: 'tool', cost: 52000, desc: 'Wine country protection.', icon: '🍷', area: 'Mason Hills' },
  { id: 'country_club_card', name: 'Country Club Card', type: 'tool', cost: 38000, desc: 'Back room access.', icon: '⛳', area: 'Mason Hills' },
  { id: 'horse_saddle', name: 'Horse Saddle', type: 'tool', cost: 42000, desc: 'Equestrian takeover.', icon: '🐴', area: 'Mason Hills' },
  { id: 'polo_mallet', name: 'Polo Mallet', type: 'weapon', cost: 35000, desc: 'Rich kid enforcement.', icon: '🏇', area: 'Mason Hills' },
  { id: 'hilltop_keycard', name: 'Hilltop Keycard', type: 'tool', cost: 65000, desc: 'Gated community master.', icon: '💳', area: 'Mason Hills' },

  // --- MOTOR CITY - ENDGAME NEW ---
  { id: 'armored_van', name: 'Armored Van', type: 'vehicle', cost: 75000, desc: 'For the big score.', icon: '🚐', area: 'Motor City' },
  { id: 'detroit_keycard', name: 'Detroit Keycard', type: 'tool', cost: 90000, desc: 'Opens Motor City.', icon: '🗝', area: 'Motor City' },
  { id: 'motor_press', name: 'Motor Press', type: 'tool', cost: 82000, desc: 'Stamp VINs clean.', icon: '⚙', area: 'Motor City' },
  { id: 'renaissance_pass', name: 'Renaissance Pass', type: 'tool', cost: 95000, desc: 'Tower penthouse access.', icon: '🏙', area: 'Motor City' },
  { id: 'techno_key', name: 'Techno Warehouse Key', type: 'tool', cost: 78000, desc: 'After-hours empire.', icon: '🎧', area: 'Motor City' },
];

const LOCATIONS = ["Port Haven", "Ironport", "Sable Dunes", "Mason Hills", "Motor City"] as const;
const SAVE_KEY = "shoreline_save_v3_long";
const getRepNeeded = (lvl: number) => 150 + (lvl - 1) * 85 + Math.floor(Math.pow(lvl, 2) * 1.8);

export default function Game() {
  const [cash, setCash] = useState(950);
  const [inventory, setInventory] = useState({ energyPacks: 0 })
  const [rep, setRep] = useState(0);
  const [level, setLevel] = useState(1);
  const [repToNext, setRepToNext] = useState(getRepNeeded(1));
  const [energy, setEnergy] = useState(25);
  const [heat, setHeat] = useState(0);
  const [health, setHealth] = useState(100);
  const [energyTimer, setEnergyTimer] = useState(22);
  const [skillPoints, setSkillPoints] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<string>("Port Haven");
  const [progress, setProgress] = useState<Record<string, number>>({ marina: 0 });
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [skills, setSkills] = useState({ toughness: 0, endurance: 0, stamina: 0, muscle: 0, cool: 0 });
  const [ledger, setLedger] = useState<string[]>(['Washed up with $950. Build an empire.']);
  const [isInJail, setIsInJail] = useState(false);
  const [jailTime, setJailTime] = useState(0);
  const [isInHospital, setIsInHospital] = useState(false);
  const [tab, setTab] = useState<'HUSTLES' | 'SHOP' | 'SKILLS' | 'INVENTORY'>('HUSTLES')
  const [isReady, setIsReady] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showPadPrompt, setShowPadPrompt] = useState(false);
const [padConnected, setPadConnected] = useState(false);



  const maxHealth = 100 + skills.toughness * 10;
  const maxEnergy = 25 + skills.endurance * 5;
  const maxStamina = 10 + skills.stamina * 2;
  const cashBonus = 1 + skills.muscle * 0.02;
  const heatReduction = Math.min(0.6, skills.cool * 0.01);

  const [highlightedShopItem, setHighlightedShopItem] = useState<string | null>(null);
  const addLog = (m: string) => setLedger(l => [`[${new Date().toLocaleTimeString()}] ${m}`, ...l].slice(0, 30));
  const owns = (id: string) => (owned[id] || 0) > 0;
  const filteredJobs = JOBS.filter((j: any) => j.area === currentLocation);

  // CONTROLLER SUPPORT - 2 BUTTON LAYOUT MODE
useEffect(() => { setSelectedIdx(0); }, [currentLocation, tab]);

useEffect(() => {
  let lastPress = 0;
  let raf = 0;
  const loop = () => {
    const gp = navigator.getGamepads?.()[0];
    if (gp) {
      const jobs = JOBS.filter(j => j.area === currentLocation);
      const now = Date.now();
      if (now - lastPress > 150) {
        const up = gp.buttons[12]?.pressed || gp.axes[1] < -0.5;
        const down = gp.buttons[13]?.pressed || gp.axes[1] > 0.5;
        const a = gp.buttons[0]?.pressed;
        const b = gp.buttons[1]?.pressed;
        const lb = gp.buttons[4]?.pressed;
        const rb = gp.buttons[5]?.pressed;
        const lt = gp.buttons[6]?.pressed;
        const rt = gp.buttons[7]?.pressed;

        if (up) { setSelectedIdx(i => Math.max(0, i - 1)); lastPress = now; }
        if (down) { setSelectedIdx(i => Math.min(jobs.length - 1, i + 1)); lastPress = now; }
        if (a && tab === 'HUSTLES') {
          const job = jobs[selectedIdx];
          if (job) doJob(job);
          lastPress = now;
        }
        if (b) { layLow(); lastPress = now; }
        if (lb || rb) {
          const order = ['HUSTLES','SHOP','SKILLS','INVENTORY'] as const;
          const idx = order.indexOf(tab);
          const next = rb? order[(idx + 1) % 4] : order[(idx - 1 + 4) % 4];
          setTab(next); setSelectedIdx(0); lastPress = now;
        }
        if (lt || rt) {
          const locIdx = LOCATIONS.indexOf(currentLocation as any);
          const next = lt? (locIdx - 1 + LOCATIONS.length) % LOCATIONS.length : (locIdx + 1) % LOCATIONS.length;
          setCurrentLocation(LOCATIONS[next]); setSelectedIdx(0); lastPress = now;
        }
      }
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}, [tab, selectedIdx, currentLocation]);

  // SHOW BANNER WHEN CONTROLLER CONNECTS
useEffect(() => {
  const onConnect = () => { setPadConnected(true); setShowPadPrompt(true); setTimeout(()=> setShowPadPrompt(false), 5000); };
  const onDisconnect = () => setPadConnected(false);
  window.addEventListener('gamepadconnected', onConnect);
  window.addEventListener('gamepaddisconnected', onDisconnect);
  return () => {
    window.removeEventListener('gamepadconnected', onConnect);
    window.removeEventListener('gamepaddisconnected', onDisconnect);
  };
}, []);

  useEffect(() => {
    const e = setInterval(() => {
      setEnergyTimer((prev) => {
        if (prev <= 1) {
          setEnergy((en: number) => {
            if (en < maxEnergy) return en + 1;
            return en;
          });
          return 22;
        }
        return prev - 1;
      });
    }, 1000);
    const h = setInterval(() => setHeat((v: number) => Math.max(0, v - 1)), 35000);
    return () => { clearInterval(e); clearInterval(h); }
  }, [maxEnergy]);

  useEffect(() => {
    if (rep >= repToNext) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setRep((r: number) => r - repToNext);
      setRepToNext(getRepNeeded(newLevel));
      setSkillPoints((p: number) => p + 3);
      setEnergy(maxEnergy);
      setHealth(maxHealth);
      addLog(`LEVEL UP! LVL ${newLevel} - Full HP/Energy restored! Next needs ${getRepNeeded(newLevel)} REP`);
    }
  }, [rep, repToNext, level, maxEnergy, maxHealth]);

  useEffect(() => {
    if (heat >= 100 && !isInJail) {
      setIsInJail(true);
      setJailTime(30);
      setCash((c: number) => Math.floor(c * 0.60));
      setHealth((h: number) => Math.max(0, h - 15));
      setHeat(20);
      setEnergy(0);
      addLog(`🚨 BUSTED! 30s in Mason County Jail -40% cash`);
    }
  }, [heat, isInJail]);

  useEffect(() => {
    if (!isInJail) return;
    const timer = setInterval(() => {
      setJailTime((t: number) => {
        if (t <= 1) { setIsInJail(false); addLog(`Freed from jail.`); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isInJail]);

  useEffect(() => {
    if (health <= 0 && !isInHospital) {
      setIsInHospital(true);
      setEnergy(0);
      addLog(`🏥 FLATLINED! Need $10,000 to recover`);
    }
  }, [health, isInHospital]);

  // LOAD - runs once after hydration
  // LOAD - runs once
  useEffect(() => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (s.cash !== undefined) setCash(s.cash);
        if (s.rep !== undefined) setRep(s.rep);
        if (s.level !== undefined) setLevel(s.level);
        if (s.repToNext !== undefined) setRepToNext(s.repToNext);
        if (s.energy !== undefined) setEnergy(s.energy);
        if (s.heat !== undefined) setHeat(s.heat);
        if (s.health !== undefined) setHealth(s.health);
        if (s.skillPoints !== undefined) setSkillPoints(s.skillPoints);
        if (s.currentLocation) setCurrentLocation(s.currentLocation);
        if (s.progress) setProgress(s.progress);
        if (s.owned) {
          const fixed: Record<string, number> = {};
          for (const [k, v] of Object.entries(s.owned as any)) fixed[k] = typeof v === 'number' ? v : v ? 1 : 0;
          setOwned(fixed);
        }
        if (s.skills) setSkills(s.skills);
        if (s.ledger) setLedger(s.ledger);
        if (s.isInJail !== undefined) setIsInJail(s.isInJail);
        if (s.jailTime !== undefined) setJailTime(s.jailTime);
        if (s.isInHospital !== undefined) setIsInHospital(s.isInHospital);
        if (s.inventory) setInventory(s.inventory);
      } catch { }
    }
    setIsReady(true);
  }, []);

  // AUTOSAVE - only runs AFTER isReady is true
  useEffect(() => {
    if (!isReady) return;
    const data = {
      cash, rep, level, repToNext, energy, heat, health,
      skillPoints, currentLocation, progress, owned, skills,
      ledger: ledger.slice(0, 10),
      isInJail, jailTime, isInHospital, inventory,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }, [isReady, cash, rep, level, repToNext, energy, heat, health, skillPoints, currentLocation, progress, owned, skills, ledger, isInJail, jailTime, isInHospital, inventory]);

  useEffect(() => {
    const fixHeight = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    fixHeight();
    window.addEventListener('resize', fixHeight);
    window.addEventListener('orientationchange', fixHeight);
    return () => {
      window.removeEventListener('resize', fixHeight);
      window.removeEventListener('orientationchange', fixHeight);
    };
  }, []);

  const canDoJob = (job: Job) => {
    if (isInJail || isInHospital) return false;
    const extra = heat >= 85 ? 3 : heat >= 60 ? 2 : heat >= 40 ? 1 : 0;
    if (level < job.lvl) return false;
    if (energy < job.eng + extra) return false;
    if (job.order > 0) { const prev = JOBS.filter(j => j.area === job.area).find(j => j.order === job.order - 1); if (prev && (progress[prev.id] || 0) < 100) return false; }
    if (!job.needs.every(n => owns(n))) return false;
    return true;
  };

  const doJob = (job: Job) => {
    if (!canDoJob(job)) return;
    const heatPenalty = heat >= 90 ? 0.3 : heat >= 70 ? 0.5 : heat >= 40 ? 0.75 : 1;
    const extraEnergyCost = heat >= 85 ? 3 : heat >= 60 ? 2 : heat >= 40 ? 1 : 0;
    const hpDamage = heat >= 75 ? 12 : heat >= 50 ? 6 : heat >= 30 ? 2 : 0;
    if (energy < job.eng + extraEnergyCost) { addLog(`Too hot! Need ${job.eng + extraEnergyCost} ENG`); return; }
    const cashE = Math.floor((Math.random() * (job.cashMax - job.cashMin + 1) + job.cashMin) * cashBonus * heatPenalty);
    const heatGain = Math.floor(job.heat * (1 - heatReduction));
    setCash((c: number) => c + cashE); setEnergy((e: number) => e - (job.eng + extraEnergyCost)); setRep((r: number) => r + job.rep); setHeat((h: number) => Math.min(100, h + heatGain));
    if (hpDamage > 0) { setHealth((h: number) => Math.max(0, h - hpDamage)); addLog(`🔥 HEAT BURN -${hpDamage} HP`); }
    const np = Math.min(100, (progress[job.id] || 0) + 5);
    setProgress((p: any) => ({ ...p, [job.id]: np }));
    // Rare ticket drop - 5% chance from ferry job
    if (job.id === 'ferry' && !owns('ferry_ticket') && Math.random() < 0.05) {
      setOwned((o: any) => ({ ...o, ferry_ticket: (o.ferry_ticket || 0) + 1 }));
      addLog(`🎟️ RARE DROP! Ferry Ticket to Ironport!`);
    }
    // 5% rare energy pack drop for ANY job
    if (Math.random() < 0.05) {
      setInventory((inv: any) => ({ ...inv, energyPacks: (inv?.energyPacks || 0) + 1 }))
      setEnergy((e: number) => Math.min(e + 5, maxEnergy))
      addLog('⚡ RARE DROP! Energy Pack +5 - sent to INVENTORY')
    }
    addLog(`Did ${job.name} +$${cashE} [${np}%]`);
  };

  const bribeCops = () => { const cost = 250 + heat * 10; if (cash < cost || heat <= 0) return; setCash((c: number) => c - cost); setHeat((h: number) => Math.max(0, h - 25)); addLog(`Bribed PD -$${cost} -25 HEAT`); };
  const layLow = () => { if (energy < 2 || heat <= 0) return; setEnergy((e: number) => e - 2); setHeat((h: number) => Math.max(0, h - 15)); addLog(`Laid low -2 ENG -15 HEAT`); };

  const payToHeal = () => {
    if (health >= maxHealth) return;
    const missing = maxHealth - health;
    const cost = missing * 30;
    if (cash < cost) { addLog(`Need $${cost} to heal ${missing} HP - you have $${cash}`); return; }
    setCash((c: number) => c - cost);
    setHealth(maxHealth);
    addLog(`🩹 Paid $${cost} for full heal at clinic`);
  };

  const payHospitalBill = () => { if (cash < 10000) return; setCash((c: number) => c - 10000); setHealth(maxHealth); setEnergy(maxEnergy); setIsInHospital(false); addLog(`Paid hospital $10,000`); };
  const payBail = () => { const bailCost = 2000 + level * 500; if (cash < bailCost) return; setCash((c: number) => c - bailCost); setIsInJail(false); setJailTime(0); addLog(`Paid bail $${bailCost}`); };
  const spendPoint = (skill: keyof typeof skills) => { if (skillPoints <= 0) return; setSkills((s: any) => ({ ...s, [skill]: s[skill] + 1 })); setSkillPoints((p: number) => p - 1); };

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-[#0e0e0e] text-[#f5e8c7]">
      <div className="w-full flex justify-center py-0 bg-[#0e0e0e] border-b border-[#222]">
        <img src="/logo.png" alt="SHORELINE" className="h-[120px] md:h-[240px] w-auto object-contain -my-8 drop-shadow-[0_0_15px_rgba(245,232,199,0.3)]" />
      </div>
      {(isInJail || isInHospital) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-3xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-3">{isInJail ? '🚔' : '🏥'}</div>
            <div className="text-xl font-black">{isInJail ? 'MASON COUNTY JAIL' : 'PORT HAVEN HOSPITAL'}</div>
            {isInJail ? <><div className="text-[15px] text-[#666] mt-2">{jailTime}s left</div><button onClick={payBail} className="mt-6 w-full py-3 rounded-full bg-[#f5e8c7] text-black font-black text-[15px]">PAY BAIL ${2000 + level * 500}</button></>
              : <><div className="text-2xl font-black mt-4 text-[#f88]">$10,000</div><button onClick={payHospitalBill} disabled={cash < 10000} className="mt-6 w-full py-3 rounded-full bg-[#e05a5a] text-white font-black text-[15px] disabled:opacity-30">{cash >= 10000 ? 'PAY $10K - RECOVER' : `NEED $${10000 - cash}`}</button></>}
          </div>
        </div>
      )}

      {showPadPrompt && (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#f5e8c7] text-black px-6 py-3 rounded-full font-black text-[15px] shadow-xl animate-bounce">
    🎮 CONTROLLER CONNECTED - Press A to play • LB/RB to change tabs
  </div>
)}

      <div className="bg-[#1a1a1a] border-b border-[#222] px-6 py-2 flex gap-4 text-[15px] font-bold flex-wrap items-center w-full max-w-full overflow-hidden">
        <span className="text-[#f5e8c7]">💰 CASH ${cash.toFixed(0)}</span>
        <span className="flex items-center gap-2">
          <span className="text-[#e05a5a]">♥ {health}/{maxHealth}</span>
          {health < maxHealth && (
            <button onClick={payToHeal} className="px-2 py-0.5 rounded bg-[#2a1a1a] border border-[#e05a5a]/40 text-[#ff8a8a] text-[15px] hover:bg-[#3a2222]">
              HEAL ${(maxHealth - health) * 30}
            </button>
          )}
        </span>
        <span className="text-[#f5c842]">⚡ {energy}/{maxEnergy} {energy < maxEnergy && <span className="text- text-[#f5c842]/60">({energyTimer}s)</span>}</span>
        <span>🏃 {maxStamina} STAMINA</span>
        <span className="text-[#888]">🔥 HEAT {heat}</span>
        <span className="text-[#8bf]">REP {rep}/{repToNext} (LVL {level})</span>
        {skillPoints > 0 && <button onClick={() => setTab('SKILLS')} className="ml-auto bg-[#f5c842] text-black px-3 py-0.5 rounded-full animate-pulse hover:bg-[#ffe082]">{skillPoints} SKILL POINTS</button>}
      </div>

      <div className="bg-[#121212] border-b border-[#222] px-6 py-2 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide w-full max-w-full">
        {(['HUSTLES', 'SHOP', 'SKILLS', 'INVENTORY'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-1.5 rounded text-[15px] font-black border flex items-center gap-2 ${tab === t ? 'bg-[#f5e8c7] text-black border-[#f5e8c7]' : 'bg-[#1e1e1e] text-[#666] border-[#2a2a2a]'}`}>
            {t}
            {t === 'SKILLS' && skillPoints > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[15px] ${tab === t ? 'bg-black text-[#f5c842]' : 'bg-[#f5c842] text-black animate-pulse'}`}>
                {skillPoints}
              </span>
            )}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button onClick={bribeCops} className="px-3 py-1 rounded bg-[#222] border border-[#333] text-[15px]">BRIBE -${250 + heat * 10}</button>
          <button onClick={layLow} className="px-3 py-1 rounded bg-[#222] border border-[#333] text-[15px]">LAY LOW -2 ENG</button>
          <button onClick={() => {
            if (confirm(`WIPE SAVE? This deletes your LVL ${level} progress permanently. Are you sure?`)) {
              localStorage.removeItem(SAVE_KEY);
              location.reload();
            }
          }} className="px-3 py-1 rounded bg-[#2a1a1a] border border-[#5a2a2a] text-[15px] hover:bg-[#3a2a2a]">WIPE SAVE</button>
        </div>
      </div>

      <div className="bg-[#171717] border-b border-[#222] px-6 py-2 flex gap-2">
        {LOCATIONS.map((loc: string) => (
          <button key={loc} onClick={() => {
            if (loc === currentLocation) return;
            if (loc === 'Ironport') {
              if (level < 32) { addLog(`Ironport locked - need LVL 32 (you are ${level})`); return; }
              if (!owns('ferry_ticket')) { addLog(`Need Ferry Ticket from Midnight Ferry Run (5% drop)`); return; }
              if (cash < 15000) { addLog(`Need $15,000 to charter to Ironport - you have $${cash}`); return; }
              if (energy < 3) { addLog(`Too tired to travel to ${loc}`); return; }
              setCash((c: number) => c - 15000);
              setEnergy((e: number) => e - 3);
              addLog(`Chartered ferry to Ironport -$15,000 -3 ENG`);
              setCurrentLocation(loc);
              return;
            }
            if (loc === 'Sable Dunes') {
              if (level < 50) { addLog(`Sable Dunes locked - need LVL 50 (you are ${level})`); return; }
              if (cash < 20000) { addLog(`Need $20,000 to reach Sable Dunes`); return; }
              if (energy < 3) { addLog(`Too tired`); return; }
              setCash(c => c - 20000); setEnergy(e => e - 3);
              addLog(`Drove to Sable Dunes -$20k -3 ENG`);
              setCurrentLocation(loc); return;
            }
            if (loc === 'Mason Hills') {
              if (level < 70) { addLog(`Mason Hills locked - need LVL 70`); return; }
              if (!owns('yacht_keys')) { addLog(`Need Yacht Club Keys to get into Mason Hills`); return; }
              if (cash < 35000) { addLog(`Need $35k for Mason Hills`); return; }
              if (energy < 3) { addLog(`Too tired`); return; }
              setCash(c => c - 35000); setEnergy(e => e - 3);
              addLog(`Chartered to Mason Hills -$35k`);
              setCurrentLocation(loc); return;
            }
            if (loc === 'Motor City') {
              if (level < 90) { addLog(`Motor City locked - need LVL 90`); return; }
              if (!owns('casino_ledger') || !owns('customs_badge')) { addLog(`Need Casino Ledger + Customs Badge for Motor City`); return; }
              if (cash < 50000) { addLog(`Need $50k for Motor City`); return; }
              if (energy < 4) { addLog(`Too tired`); return; }
              setCash(c => c - 50000); setEnergy(e => e - 4);
              addLog(`Took the convoy to Motor City -$50k -4 ENG`);
              setCurrentLocation(loc); return;
            }
            // Normal travel (Port Haven)
            if (energy < 2) { addLog(`Too tired to travel to ${loc}`); return; }
            setEnergy((e: number) => e - 2);
            addLog(`Traveled to ${loc} -2 ENG`);
            setCurrentLocation(loc);
          }}
            className={`px-4 py-1 rounded text-[15px] font-bold border-b-2 ${currentLocation === loc ? 'bg-[#1e1e1e] text-[#f5e8c7] border-[#f5e8c7]' : 'text-[#666] border-transparent'}`}>
            {loc.toUpperCase()} ({JOBS.filter((j: any) => j.area === loc).length})
          </button>
        ))}
      </div>

      {/* THIS IS THE LEDGER FIX - GRID WITH RIGHT RAIL */}
      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div>
          {tab === 'HUSTLES' && (
            <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg overflow-hidden">
              <div className="bg-[#1a1a1a] p-4 flex gap-4 items-center border-b border-[#2a2a2a]">
                <div className="w-16 h-16 bg-[#222] rounded-lg flex items-center justify-center text-3xl">{JOBS.find(j => j.area === currentLocation)?.icon || "📍"}</div>
                <div>
                  <div className="font-black text-[15px]">{currentLocation.toUpperCase()} - {filteredJobs.length} HUSTLES</div>
                  <div className="text-[15px] text-[#888]">{filteredJobs.filter(j => canDoJob(j)).length} available</div>
                </div>
              </div>
              <div className="hidden lg:grid grid-cols-[2.2fr_1fr_1.2fr_120px] bg-[#1e1e1e] border-b border-[#2a2a2a] px-4 py-2 text-[15px] font-black text-[#666]"><div>DESCRIPTION</div><div>PAYOUT</div><div>REQUIRES</div><div className="text-right">ACTION</div></div>
              {filteredJobs.map((job, idx) => {
                const isSelected = idx === selectedIdx;
                const pct = progress[job.id] || 0;
                const locked = !canDoJob(job);
                const mastery = pct >= 100 ? 3 : pct >= 50 ? 2 : pct > 0 ? 1 : 0;
                const extra = heat >= 85 ? 3 : heat >= 60 ? 2 : heat >= 40 ? 1 : 0;
                const totalEng = job.eng + extra;
                return (
                  <div key={job.id} className={`${isSelected ? 'ring-2 ring-[#f5e8c7] ' : ''}grid grid-cols-1 lg:grid-cols-[2.2fr_1fr_1.2fr_120px] px-4 py-3 border-b border-[#1a1a1a] gap-3 lg:gap-0 lg:items-center ${locked ? 'opacity-50 bg-[#111]' : 'bg-[#151515] hover:bg-[#1a1a1a]'} text-`}>
                    <div className="flex gap-3">
                      <div className="text-xl">{job.icon}</div>
                      <div>
                        <div className="font-bold text-[#f5e8c7] flex items-center gap-2">
                          {job.name}
                          <span className="flex gap-0.5 ml-1">{[0, 1, 2].map(i => <span key={i} className={`${i < mastery ? 'text-[#f5c842]' : 'text-[#2a2a2a]'}`}>★</span>)}</span>
                        </div>
                        <div className="text-[15px] text-[#666]">LVL {job.lvl}+ {pct > 0 ? `[${pct}%]` : ''} • {job.desc}</div>
                      </div>
                    </div>
                    <div className="flex lg:block gap-3 text-[15px]"><span className="text-[#8f8]">${job.cashMin}-${job.cashMax}</span><span className="text-[#888]">REP +{job.rep}</span></div>
                    <div className="flex gap-1 flex-wrap">
                      {job.needs.length ? job.needs.map(n => {
                        const owned = owns(n);
                        const item = ITEMS.find(i => i.id === n);
                        return (
                          <button
                            key={n}
                            onClick={() => {
                              setTab('SHOP');
                              setHighlightedShopItem(n);
                              setTimeout(() => setHighlightedShopItem(null), 3000); // clear glow after 3s
                              addLog(`Looking for ${item?.name || n} in shop`);
                            }}
                            className={`px-2 py-0.5 rounded text-[15px] border cursor-pointer hover:scale-105 transition-all ${owned ? 'bg-[#1a2e1a] text-[#6f6] border-[#2a4a2a] hover:border-[#4a8a4a]' : 'bg-[#2e1a1a] text-[#f88] border-[#4a2a2a] hover:border-[#8a4a4a]'}`}
                          >
                            {item?.icon} {item?.name || n}
                          </button>
                        )
                      }) : <span className="text-[#555] text-[15px]">None</span>}
                    </div>
                    <div className="text-right flex lg:block justify-between items-center">
                      <button disabled={locked} onClick={() => doJob(job)} className={`min-w-[90px] px-3 py-2 rounded font-black leading-tight ${locked ? 'bg-[#222] text-[#555]' : 'bg-[#f5e8c7] text-black hover:bg-white'}`}>
                        {locked ? (
                          <span className="text-[11px]">LOCKED</span>
                        ) : (
                          <>
                            <div className="text-[11px]">DO JOB</div>
                            <div className="text-[9px] opacity-70 font-bold">-{totalEng} ENG</div>
                          </>
                        )}
                      </button>
                      {extra > 0 && !locked && <div className="text-[9px] text-[#f88] mt-1">+{extra} HEAT TAX</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'SHOP' && (
            <div className="space-y-4 max-w-[900px] w-full mr-auto">
              {[{ key: 'tool', label: 'TOOLS' }, { key: 'weapon', label: 'WEAPONS' }, { key: 'vehicle', label: 'VEHICLES' }].map(cat => {
                const catItems = ITEMS.filter(i => i.type === cat.key && i.id !== 'ferry_ticket');
                return (
                  <div key={cat.key} className="bg-[#121212] border border-[#2a2a2a] rounded-lg overflow-hidden">
                    <div className="bg-[#1e1e1e] px-4 py-2 font-black text-[#f5e8c7]">{cat.label} ({catItems.length})</div>
                    <div className="divide-y divide-[#1a1a1a]">
                      {catItems.map(item => {
                        const count = owned[item.id] || 0;
                        return (
                          <div key={item.id} className="px-4 py-3 bg-[#151515] flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                              <span>{item.icon}</span>
                              <div>
                                <div className="font-bold text-[#ddd] flex items-center gap-2">{item.name} {count > 0 && <span className="text-[#f5e8c7]">x{count}</span>} <span className="text-[#f5c842] text- font-normal">{item.cost === 0 ? 'FREE' : `$${item.cost.toLocaleString()}`}</span></div>
                                <div className="text-xs text-[#666]">{item.desc}</div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                disabled={count > 0 || cash < item.cost}
                                onClick={() => {
                                  setCash(c => c - item.cost);
                                  setOwned(o => ({ ...o, [item.id]: 1 }));
                                  addLog(`Bought ${item.name} -$${item.cost}`);
                                }}
                                className={`px-3 py-1.5 rounded text-xs font-black ${count > 0 ? 'bg-[#1a2e1a] text-[#6f6]' : cash >= item.cost ? 'bg-[#f5e8c7] text-black' : 'bg-[#222] text-[#555]'}`}
                              >
                                {count > 0 ? 'OWNED' : `BUY $${item.cost.toLocaleString()}`}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'INVENTORY' && (
            <div className="space-y-4 max-w-[900px] w-full mr-auto ml-0">
              <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg overflow-hidden">
                <div className="bg-[#1e1e1e] px-4 py-2 flex justify-between">
                  <div className="font-black text-[#f5e8c7]">INVENTORY</div>
                  <div className="text-[#666] text-xs">{Object.values(owned).reduce((a, b) => a + (b as number), 0) + inventory.energyPacks} items</div>
                </div>
                <div className="p-4 space-y-2">
                  {inventory.energyPacks > 0 && (
                    <div className="flex justify-between items-center bg-[#171717] p-3 rounded border border-[#f5e8c7]/20">
                      <div className="flex gap-2 items-center"><span>⚡</span><div><div className="font-bold text-[#ddd]">Energy Pack x{inventory.energyPacks}</div><div className="text-xs text-[#888]">+5 Energy</div></div></div>
                      <button onClick={() => {
                        if (inventory.energyPacks <= 0) return;
                        if (energy >= maxEnergy) { addLog('Energy already full'); return; }
                        setInventory((i: any) => ({ ...i, energyPacks: i.energyPacks - 1 }))
                        setEnergy((e: number) => Math.min(e + 5, maxEnergy))
                      }} className="px-4 py-1.5 rounded-full bg-[#f5e8c7] text-black font-black text-xs">USE</button>
                    </div>
                  )}
                  {Object.entries(owned).filter(([_, c]) => (c as number) > 0).map(([id, count]) => {
                    const it = ITEMS.find(i => i.id === id);
                    if (!it) return null;
                    return (
                      <div key={id} className="flex justify-between items-center bg-[#171717] p-3 rounded border border-[#2a2a2a]">
                        <div className="flex gap-2 items-center"><span>{it.icon}</span><span className="font-bold text-[#ddd]">{it.name}</span><span className="text-[#f5e8c7]">x{count as number}</span></div>
                        <div className="text-xs text-[#666]">{it.type}</div>
                      </div>
                    )
                  })}
                  {Object.values(owned).reduce((a, b) => a + (b as number), 0) === 0 && inventory.energyPacks === 0 && (
                    <div className="p-8 text-center text-[#666] text-sm">Empty</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'SKILLS' && (
            <div className="space-y-2">
              <div className="bg-[#171717] rounded-lg p-4 border border-[#f5c842]/30 text-[15px]"><span className="font-black">YOU HAVE {skillPoints} POINTS</span> <span className="text-[#666]">- LVL {level} → {level + 1} needs {repToNext} REP</span></div>
              {[{ id: 'toughness', name: 'Toughness', desc: `+10 Max HP (Now ${maxHealth} HP)`, val: skills.toughness }, { id: 'endurance', name: 'Endurance', desc: `+5 Max Energy (Now ${maxEnergy} ENG)`, val: skills.endurance }, { id: 'stamina', name: 'Stamina', desc: `+2 Max Stamina (Now ${maxStamina})`, val: skills.stamina }, { id: 'muscle', name: 'Muscle', desc: `+2% Cash (Now x${cashBonus.toFixed(2)})`, val: skills.muscle }, { id: 'cool', name: 'Cool', desc: `-${(heatReduction * 100).toFixed(0)}% Heat`, val: skills.cool }].map(s => (
                <div key={s.id} className="bg-[#151515] border border-[#222] rounded-lg px-4 py-3 flex justify-between items-center"><div><div className="font-bold text-[15px]">{s.name} LVL {s.val}</div><div className="text-[15px] text-[#666]">{s.desc}</div></div><button disabled={skillPoints <= 0} onClick={() => spendPoint(s.id as any)} className={`px-4 py-1.5 rounded text-[15px] font-black ${skillPoints > 0 ? 'bg-[#f5e8c7] text-black' : 'bg-[#222] text-[#555]'}`}>+1</button></div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-6 h-fit space-y-3">
          <div className="bg-[#f5e8c7] text-black rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[11px] font-black tracking-widest">LEDGER</div>
              <div className="flex gap-2 items-center">
                <div className="text-[11px] bg-black/10 px-2 py-0.5 rounded-full">{ledger.length} LOGS</div>
                <button onClick={() => setLedger(['Ledger cleared.'])} className="text-[11px] font-black px-2 py-1 rounded bg-black/15 hover:bg-black/25 border border-black/10">CLEAR</button>
              </div>
            </div>
            <div className="text-[11px] text-black/60 mb-2">Autosaves to browser</div>
            <div className="h-[420px] overflow-y-auto text-[11px] space-y-1 font-mono pr-1">{ledger.map((l, i) => <div key={i} className="border-b border-black/10 py-1 leading-tight">{l}</div>)}</div>
          </div>
        </div>
      </div>
    </div>

  );
}