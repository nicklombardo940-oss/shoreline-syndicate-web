"use client";
import { useState, useEffect } from 'react';

type Job = { id: string; name: string; area: string; lvl: number; eng: number; cashMin: number; cashMax: number; rep: number; heat: number; order: number; needs: string[]; desc: string; icon: string; };
type Item = { id: string; name: string; type: 'tool' | 'vehicle' | 'weapon'; cost: number; desc: string; icon: string; };

const JOBS: Job[] = [
  { id: 'marina', name: 'RUN THE MARINA', area: 'Port Haven', lvl: 1, eng: 2, cashMin: 85, cashMax: 130, rep: 16, heat: 1, order: 0, needs: [], desc: 'Shake down charter captains.', icon: '⚓' },
  { id: 'cherries', name: 'SMUGGLE CHERRIES', area: 'Port Haven', lvl: 3, eng: 4, cashMin: 170, cashMax: 260, rep: 28, heat: 2, order: 1, needs: ['box_cutter'], desc: 'Truckload past checkpoint.', icon: '🍒' },
  { id: 'flavors', name: 'COLLECT AT Salty Cow Creamery', area: 'Port Haven', lvl: 6, eng: 7, cashMin: 320, cashMax: 480, rep: 40, heat: 3, order: 2, needs: ['skiff'], desc: 'Ice cream parlor owes protection.', icon: '🍦' },
  { id: 'ferry', name: 'MIDNIGHT FERRY RUN', area: 'Port Haven', lvl: 9, eng: 10, cashMin: 580, cashMax: 820, rep: 60, heat: 4, order: 3, needs: ['dock_hook', 'harbor_runner'], desc: 'Ironport crossing.', icon: '⛴' },
  { id: 'statepark', name: 'SECURE STATE PARK', area: 'Port Haven', lvl: 12, eng: 13, cashMin: 900, cashMax: 1350, rep: 84, heat: 5, order: 4, needs: ['harbor_runner'], desc: 'Snack stands work for you now.', icon: '🌲' },
  { id: 'bait_shop', name: 'SHAKE DOWN BAIT SHOP', area: 'Port Haven', lvl: 16, eng: 15, cashMin: 700, cashMax: 1050, rep: 64, heat: 6, order: 5, needs: ['bolt_cutters'], desc: 'Worm buckets and cash register.', icon: '🪱' },
  { id: 'arcade', name: 'RUN THE ARCADE', area: 'Port Haven', lvl: 20, eng: 17, cashMin: 950, cashMax: 1350, rep: 76, heat: 7, order: 6, needs: ['brass_knuckles'], desc: 'Tourist kids losing quarters.', icon: '🕹' },
  { id: 'fish_market', name: 'SECURE FISH MARKET', area: 'Port Haven', lvl: 24, eng: 19, cashMin: 1200, cashMax: 1750, rep: 96, heat: 8, order: 7, needs: ['dock_hook', 'bolt_cutters'], desc: 'Morning catch tax.', icon: '🐟' },
  { id: 'harbor_motel', name: 'TAKE OVER MOTEL', area: 'Port Haven', lvl: 28, eng: 20, cashMin: 1550, cashMax: 2200, rep: 130, heat: 9, order: 8, needs: ['motel_master_key', 'burner_phone'], desc: 'Rent by the hour, pay by the week.', icon: '🏨' },
  { id: 'diner', name: 'SKIM THE DINER', area: 'Port Haven', lvl: 33, eng: 22, cashMin: 1850, cashMax: 2600, rep: 120, heat: 10, order: 9, needs: ['burner_phone', 'box_cutter'], desc: 'Main Wharf greasy spoon.', icon: '🍳' },
  { id: 'car_wash', name: 'CONTROL THE CAR WASH', area: 'Port Haven', lvl: 38, eng: 24, cashMin: 2350, cashMax: 3300, rep: 140, heat: 11, order: 10, needs: ['rusted_pickup', 'fuel_siphon'], desc: 'Launder money and trucks.', icon: '🚿' },
  { id: 'fuel_dock', name: 'HEIST THE FUEL DOCK', area: 'Port Haven', lvl: 43, eng: 26, cashMin: 2900, cashMax: 4100, rep: 160, heat: 12, order: 11, needs: ['fuel_siphon', 'harbor_runner'], desc: 'Diesel is liquid gold.', icon: '⛽' },
  { id: 'mini_golf', name: 'RIG THE MINI GOLF', area: 'Port Haven', lvl: 48, eng: 27, cashMin: 3400, cashMax: 4700, rep: 176, heat: 13, order: 12, needs: ['golf_cart', 'bolt_cutters'], desc: 'Windmill hole always wins.', icon: '⛳' },
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
];

const ITEMS: Item[] = [
  { id: 'box_cutter', name: 'Box Cutter', type: 'tool', cost: 400, desc: 'Opens boxes and mouths.', icon: '🔪' },
  { id: 'dock_hook', name: 'Dock Hook', type: 'weapon', cost: 1200, desc: 'Fish market enforcement.', icon: '🪝' },
  { id: 'brass_knuckles', name: 'Brass Knuckles', type: 'weapon', cost: 1800, desc: 'For arcade punks.', icon: '🥊' },
  { id: 'bolt_cutters', name: 'Bolt Cutters', type: 'tool', cost: 2200, desc: 'Bait shop locks are cheap.', icon: '🔧' },
  { id: 'skiff', name: 'Borrowed Skiff', type: 'vehicle', cost: 2800, desc: 'Quiet harbor moves.', icon: '🛶' },
  { id: 'burner_phone', name: 'Burner Phone', type: 'tool', cost: 4200, desc: 'Motel and diner calls.', icon: '📞' },
  { id: 'motel_master_key', name: 'Motel Master Key', type: 'tool', cost: 5500, desc: 'Every room is your room.', icon: '🔑' },
  { id: 'harbor_runner', name: 'Harbor Runner', type: 'vehicle', cost: 7200, desc: 'Grey Lake speed.', icon: '🚤' },
  { id: 'fuel_siphon', name: 'Fuel Siphon Kit', type: 'tool', cost: 8500, desc: 'For the fuel dock.', icon: '🛢' },
  { id: 'rusted_pickup', name: 'Rusted Pickup', type: 'vehicle', cost: 9800, desc: 'Car wash workhorse.', icon: '🛻' },
  { id: 'golf_cart', name: 'Golf Cart', type: 'vehicle', cost: 13500, desc: 'Mini golf patrol.', icon: '🛺' },
  { id: 'bait_trawler', name: 'Bait Trawler', type: 'vehicle', cost: 18500, desc: 'Own the whole harbor.', icon: '🎣' },
  { id: 'ferry_ticket', name: 'Ferry Ticket', type: 'tool', cost: 0, desc: 'Rare drop from Midnight Ferry Run. Required for Ironport.', icon: '🎟' },
  { id: 'drydock_crane', name: 'Drydock Crane', type: 'vehicle', cost: 24000, desc: 'Lift hulls out the water.', icon: '🏗' },
  { id: 'lobster_permit', name: 'Harpoon Gun', type: 'weapon', cost: 28500, desc: 'For lobsters and legs.', icon: '🔱' },
  { id: 'lighthouse_key', name: 'Lighthouse Key', type: 'tool', cost: 34000, desc: 'Top of the beacon is your stash.', icon: '🔦' },
  { id: 'cannery_press', name: 'Fillet Cleaver', type: 'weapon', cost: 39500, desc: 'Cuts fish and problems.', icon: '🪓' },
  { id: 'yacht_keys', name: 'Yacht Club Keys', type: 'tool', cost: 47000, desc: 'VIP slips pay double.', icon: '⛵' },
  { id: 'customs_badge', name: 'Customs Badge', type: 'tool', cost: 56000, desc: 'Wave containers through.', icon: '🛃' },
  { id: 'casino_ledger', name: 'Dock Slugger', type: 'weapon', cost: 68000, desc: 'Casino collections.', icon: '🏏' },
];

const LOCATIONS = ["Port Haven", "Ironport"] as const;
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


  const maxHealth = 100 + skills.toughness * 10;
  const maxEnergy = 25 + skills.endurance * 5;
  const maxStamina = 10 + skills.stamina * 2;
  const cashBonus = 1 + skills.muscle * 0.02;
  const heatReduction = Math.min(0.6, skills.cool * 0.01);

  const [highlightedShopItem, setHighlightedShopItem] = useState<string | null>(null);
  const addLog = (m: string) => setLedger(l => [`[${new Date().toLocaleTimeString()}] ${m}`, ...l].slice(0, 30));
  const owns = (id: string) => (owned[id] || 0) > 0;
  const filteredJobs = JOBS.filter((j: any) => j.area === currentLocation);

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
    if (job.order > 0) { const prev = JOBS.find(j => j.order === job.order - 1); if (prev && (progress[prev.id] || 0) < 100) return false; }
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
            // Ironport gate
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
            // Normal travel
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
              {filteredJobs.map(job => {
                const pct = progress[job.id] || 0;
                const locked = !canDoJob(job);
                const mastery = pct >= 100 ? 3 : pct >= 50 ? 2 : pct > 0 ? 1 : 0;
                const extra = heat >= 85 ? 3 : heat >= 60 ? 2 : heat >= 40 ? 1 : 0;
                const totalEng = job.eng + extra;

                return (
                  <div key={job.id} className={`grid grid-cols-1 lg:grid-cols-[2.2fr_1fr_1.2fr_120px] px-4 py-3 border-b border-[#1a1a1a] gap-3 lg:gap-0 lg:items-center ${locked ? 'opacity-50 bg-[#111]' : 'bg-[#151515] hover:bg-[#1a1a1a]'} text-[15px]`}>
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