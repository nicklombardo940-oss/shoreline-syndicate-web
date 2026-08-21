"use client";
import { useState, useEffect, useRef } from 'react';

type Job = { id: string; name: string; area: string; lvl: number; eng: number; cashMin: number; cashMax: number; rep: number; heat: number; order: number; needs: string[]; desc: string; icon: string; };
type Item = { id: string; name: string; type: 'tool' | 'vehicle' | 'weapon'; cost: number; desc: string; icon: string; };

const JOBS: Job[] = [
  { id: 'marina', name: 'RUN THE MARINA', area: 'Port Haven', lvl: 1, eng: 1, cashMin: 140, cashMax: 210, rep: 8, heat: 1, order: 0, needs: [], desc: 'Shake down charter captains.', icon: '⚓' },
  { id: 'cherries', name: 'SMUGGLE CHERRIES', area: 'Port Haven', lvl: 2, eng: 3, cashMin: 280, cashMax: 420, rep: 15, heat: 2, order: 1, needs: ['box_cutter'], desc: 'Truckload past checkpoint.', icon: '🍒' },
  { id: 'flavors', name: 'COLLECT AT Salty Cow Creamery', area: 'Port Haven', lvl: 3, eng: 5, cashMin: 520, cashMax: 740, rep: 22, heat: 3, order: 2, needs: ['skiff'], desc: 'Ice cream parlor owes protection.', icon: '🍦' },
  { id: 'ferry', name: 'MIDNIGHT FERRY RUN', area: 'Port Haven', lvl: 5, eng: 7, cashMin: 920, cashMax: 1280, rep: 35, heat: 4, order: 3, needs: ['dock_hook', 'harbor_runner'], desc: 'Ironport crossing.', icon: '⛴' },
  { id: 'statepark', name: 'SECURE STATE PARK', area: 'Port Haven', lvl: 7, eng: 9, cashMin: 1500, cashMax: 2200, rep: 50, heat: 5, order: 4, needs: ['harbor_runner'], desc: 'Snack stands work for you now.', icon: '🌲' },
  { id: 'bait_shop', name: 'SHAKE DOWN BAIT SHOP', area: 'Port Haven', lvl: 9, eng: 12, cashMin: 600, cashMax: 900, rep: 28, heat: 6, order: 5, needs: ['bolt_cutters'], desc: 'Worm buckets and cash register.', icon: '🪱' },
  { id: 'arcade', name: 'RUN THE ARCADE', area: 'Port Haven', lvl: 11, eng: 15, cashMin: 850, cashMax: 1200, rep: 32, heat: 7, order: 6, needs: ['brass_knuckles'], desc: 'Tourist kids losing quarters.', icon: '🕹' },
  { id: 'fish_market', name: 'SECURE FISH MARKET', area: 'Port Haven', lvl: 13, eng: 18, cashMin: 1300, cashMax: 1900, rep: 45, heat: 8, order: 7, needs: ['dock_hook', 'bolt_cutters'], desc: 'Morning catch tax.', icon: '🐟' },
  { id: 'harbor_motel', name: 'TAKE OVER MOTEL', area: 'Port Haven', lvl: 15, eng: 21, cashMin: 1700, cashMax: 2400, rep: 58, heat: 9, order: 8, needs: ['motel_master_key', 'burner_phone'], desc: 'Rent by the hour, pay by the week.', icon: '🏨' },
  { id: 'diner', name: 'SKIM THE DINER', area: 'Port Haven', lvl: 18, eng: 24, cashMin: 2000, cashMax: 2800, rep: 62, heat: 10, order: 9, needs: ['burner_phone', 'box_cutter'], desc: 'Main Wharf greasy spoon.', icon: '🍳' },
  { id: 'car_wash', name: 'CONTROL THE CAR WASH', area: 'Port Haven', lvl: 21, eng: 24, cashMin: 2600, cashMax: 3600, rep: 75, heat: 11, order: 10, needs: ['rusted_pickup', 'fuel_siphon'], desc: 'Launder money and trucks.', icon: '🚿' },
  { id: 'fuel_dock', name: 'HEIST THE FUEL DOCK', area: 'Port Haven', lvl: 24, eng: 27, cashMin: 3200, cashMax: 4500, rep: 85, heat: 12, order: 11, needs: ['fuel_siphon', 'harbor_runner'], desc: 'Diesel is liquid gold.', icon: '⛽' },
  { id: 'mini_golf', name: 'RIG THE MINI GOLF', area: 'Port Haven', lvl: 27, eng: 25, cashMin: 3800, cashMax: 5200, rep: 95, heat: 13, order: 12, needs: ['golf_cart', 'bolt_cutters'], desc: 'Windmill hole always wins.', icon: '⛳' },
  { id: 'souvenir_row', name: 'OWN SOUVENIR ROW', area: 'Port Haven', lvl: 30, eng: 24, cashMin: 4500, cashMax: 6200, rep: 110, heat: 14, order: 13, needs: ['bait_trawler', 'brass_knuckles'], desc: 'Tourist trap row now yours.', icon: '🎁' },
  { id: 'harbor_bar', name: 'BUY THE HARBOR BAR', area: 'Port Haven', lvl: 33, eng: 27, cashMin: 5500, cashMax: 7800, rep: 130, heat: 15, order: 14, needs: ['bait_trawler', 'motel_master_key', 'harbor_runner'], desc: 'Endgame - whole harbor drinks to you.', icon: '🍺' },
];

const ITEMS: Item[] = [
  { id: 'box_cutter', name: 'Box Cutter', type: 'tool', cost: 250, desc: 'Opens boxes and mouths.', icon: '🔪' },
  { id: 'brass_knuckles', name: 'Brass Knuckles', type: 'weapon', cost: 650, desc: 'For arcade punks.', icon: '🥊' },
  { id: 'bolt_cutters', name: 'Bolt Cutters', type: 'tool', cost: 950, desc: 'Bait shop locks are cheap.', icon: '🔧' },
  { id: 'dock_hook', name: 'Dock Hook', type: 'weapon', cost: 800, desc: 'Fish market enforcement.', icon: '🪝' },
  { id: 'skiff', name: 'Borrowed Skiff', type: 'vehicle', cost: 1200, desc: 'Quiet harbor moves.', icon: '🛶' },
  { id: 'burner_phone', name: 'Burner Phone', type: 'tool', cost: 1800, desc: 'Motel and diner calls.', icon: '📞' },
  { id: 'motel_master_key', name: 'Motel Master Key', type: 'tool', cost: 2400, desc: 'Every room is your room.', icon: '🔑' },
  { id: 'harbor_runner', name: 'Harbor Runner', type: 'vehicle', cost: 2600, desc: 'Grey Lake speed.', icon: '🚤' },
  { id: 'fuel_siphon', name: 'Fuel Siphon Kit', type: 'tool', cost: 3000, desc: 'For the fuel dock.', icon: '🛢' },
  { id: 'rusted_pickup', name: 'Rusted Pickup', type: 'vehicle', cost: 3200, desc: 'Car wash workhorse.', icon: '🛻' },
  { id: 'golf_cart', name: 'Golf Cart', type: 'vehicle', cost: 4500, desc: 'Mini golf patrol.', icon: '🛺' },
  { id: 'bait_trawler', name: 'Bait Trawler', type: 'vehicle', cost: 6800, desc: 'Own the whole harbor.', icon: '🎣' },
  { id: 'ferry_ticket', name: 'Ferry Ticket', type: 'tool', cost: 0, desc: 'Rare drop from Midnight Ferry Run. Required for Ironport.', icon: '🎟️' },
];

const LOCATIONS = ["Port Haven", "Ironport"] as const;
const SAVE_KEY = "shoreline_save_v2";
const getRepNeeded = (lvl: number) => 100 + (lvl - 1) * 50;

export default function Game() {
  const [cash, setCash] = useState(2850);
  const [rep, setRep] = useState(0);
  const [level, setLevel] = useState(1);
  const [repToNext, setRepToNext] = useState(getRepNeeded(1));
  const [energy, setEnergy] = useState(25);
  const [heat, setHeat] = useState(0);
  const [health, setHealth] = useState(100);
  const [skillPoints, setSkillPoints] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<string>("Port Haven");
  const [progress, setProgress] = useState<Record<string, number>>({ marina: 0 });
  const [owned, setOwned] = useState<Record<string, boolean>>({});
  const [skills, setSkills] = useState({ toughness: 0, endurance: 0, stamina: 0, muscle: 0, cool: 0 });
  const [ledger, setLedger] = useState<string[]>(['Washed up with $2,850. Build an empire.']);
  const [isInJail, setIsInJail] = useState(false);
  const [jailTime, setJailTime] = useState(0);
  const [isInHospital, setIsInHospital] = useState(false);
  const [tab, setTab] = useState<'HUSTLES' | 'SHOP' | 'SKILLS'>('HUSTLES');
  const [isReady, setIsReady] = useState(false);


  const maxHealth = 100 + skills.toughness * 10;
  const maxEnergy = 25 + skills.endurance * 5;
  const maxStamina = 10 + skills.stamina * 2;
  const cashBonus = 1 + skills.muscle * 0.12;
  const heatReduction = Math.min(0.6, skills.cool * 0.01);

  const [highlightedShopItem, setHighlightedShopItem] = useState<string | null>(null);
  const addLog = (m: string) => setLedger(l => [`[${new Date().toLocaleTimeString()}] ${m}`, ...l].slice(0, 30));
  const owns = (id: string) => !!owned[id];
  const filteredJobs = JOBS.filter((j: any) => j.area === currentLocation);

  useEffect(() => {
    const e = setInterval(() => setEnergy((v: number) => Math.min(maxEnergy, v + 1)), 15000);
    const h = setInterval(() => setHeat((v: number) => Math.max(0, v - 2)), 25000);
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
      if (s.owned) setOwned(s.owned);
      if (s.skills) setSkills(s.skills);
      if (s.ledger) setLedger(s.ledger);
      if (s.isInJail !== undefined) setIsInJail(s.isInJail);
      if (s.jailTime !== undefined) setJailTime(s.jailTime);
      if (s.isInHospital !== undefined) setIsInHospital(s.isInHospital);
    } catch {}
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
    isInJail, jailTime, isInHospital
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}, [isReady, cash, rep, level, repToNext, energy, heat, health, skillPoints, currentLocation, progress, owned, skills, ledger, isInJail, jailTime, isInHospital]);

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
    const np = Math.min(100, (progress[job.id] || 0) + 10);
    setProgress((p: any) => ({ ...p, [job.id]: np }));
    // Rare ticket drop - 5% chance from ferry job
    if (job.id === 'ferry' && !owns('ferry_ticket') && Math.random() < 0.05) {
      setOwned((o: any) => ({ ...o, ferry_ticket: true }));
      addLog(`🎟️ RARE DROP! Ferry Ticket to Ironport!`);
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
    <div className="min-h-screen bg-[#0e0e0e] text-white font-mono">
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

      <div className="bg-[#1a1a1a] border-b border-[#222] px-6 py-2 flex gap-4 text-[15px] font-bold flex-wrap items-center">
        <span className="text-[#f5e8c7]">💰 CASH ${cash.toFixed(0)}</span>
        <span className="flex items-center gap-2">
          <span className="text-[#e05a5a]">♥ {health}/{maxHealth}</span>
          {health < maxHealth && (
            <button onClick={payToHeal} className="px-2 py-0.5 rounded bg-[#2a1a1a] border border-[#e05a5a]/40 text-[#ff8a8a] text-[15px] hover:bg-[#3a2222]">
              HEAL ${(maxHealth - health) * 30}
            </button>
          )}
        </span>
        <span className="text-[#f5c842]">⚡ {energy}/{maxEnergy}</span>
        <span>🏃 {maxStamina} STAMINA</span>
        <span className="text-[#888]">🔥 HEAT {heat}</span>
        <span className="text-[#8bf]">REP {rep}/{repToNext} (LVL {level})</span>
        {skillPoints > 0 && <button onClick={() => setTab('SKILLS')} className="ml-auto bg-[#f5c842] text-black px-3 py-0.5 rounded-full animate-pulse hover:bg-[#ffe082]">{skillPoints} SKILL POINTS</button>}
      </div>

      <div className="bg-[#121212] border-b border-[#222] px-6 py-2 flex gap-2">
        {(['HUSTLES', 'SHOP', 'SKILLS'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-1.5 rounded text- font-black border flex items-center gap-2 ${tab === t ? 'bg-[#f5e8c7] text-black border-[#f5e8c7]' : 'bg-[#1e1e1e] text-[#666] border-[#2a2a2a]'}`}>
            {t}
            {t === 'SKILLS' && skillPoints > 0 && (
              <span className={`px-2 py-0.5 rounded-full text- ${tab === t ? 'bg-black text-[#f5c842]' : 'bg-[#f5c842] text-black animate-pulse'}`}>
                {skillPoints}
              </span>
            )}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button onClick={bribeCops} className="px-3 py-1 rounded bg-[#222] border border-[#333] text-">BRIBE -${250 + heat * 10}</button>
          <button onClick={layLow} className="px-3 py-1 rounded bg-[#222] border border-[#333] text-">LAY LOW -2 ENG</button>
          <button onClick={() => { localStorage.removeItem(SAVE_KEY); location.reload(); }} className="px-3 py-1 rounded bg-[#2a1a1a] border border-[#5a2a2a] text-">WIPE SAVE</button>
        </div>
      </div>

      <div className="bg-[#171717] border-b border-[#222] px-6 py-2 flex gap-2">
        {LOCATIONS.map((loc: string) => (
          <button key={loc} onClick={() => {
            if (loc === currentLocation) return;
            // Ironport gate
            if (loc === 'Ironport') {
              if (level < 35) { addLog(`Ironport locked - need LVL 35 (you are ${level})`); return; }
              if (!owns('ferry_ticket')) { addLog(`Need Ferry Ticket from Midnight Ferry Run`); return; }
              if (cash < 10000) { addLog(`Need $10,000 to charter to Ironport - you have $${cash}`); return; }
              if (energy < 2) { addLog(`Too tired to travel to ${loc}`); return; }
              setCash((c: number) => c - 10000);
              setEnergy((e: number) => e - 2);
              addLog(`Chartered ferry to Ironport -$10,000 -2 ENG`);
              setCurrentLocation(loc);
              return;
            }
            // Normal travel
            if (energy < 2) { addLog(`Too tired to travel to ${loc}`); return; }
            setEnergy((e: number) => e - 2);
            addLog(`Traveled to ${loc} -2 ENG`);
            setCurrentLocation(loc);
          }}
            className={`px-4 py-1 rounded text- font-bold border-b-2 ${currentLocation === loc ? 'bg-[#1e1e1e] text-[#f5e8c7] border-[#f5e8c7]' : 'text-[#666] border-transparent'}`}>
            {loc.toUpperCase()} ({JOBS.filter((j: any) => j.area === loc).length})
          </button>
        ))}
      </div>

      {/* THIS IS THE LEDGER FIX - GRID WITH RIGHT RAIL */}
      <div className="max-w- mx-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div>
          {tab === 'HUSTLES' && (
            <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg overflow-hidden">
              <div className="bg-[#1a1a1a] p-4 flex gap-4 items-center border-b border-[#2a2a2a]">
                <div className="w-16 h-16 bg-[#222] rounded-lg flex items-center justify-center text-3xl">{JOBS.find(j => j.area === currentLocation)?.icon || "📍"}</div>
                <div>
                  <div className="font-black text-">{currentLocation.toUpperCase()} - {filteredJobs.length} HUSTLES</div>
                  <div className="text- text-[#888]">{filteredJobs.filter(j => canDoJob(j)).length} available</div>
                </div>
              </div>
              <div className="grid grid-cols-[2.2fr_1fr_1.2fr_120px] bg-[#1e1e1e] border-b border-[#2a2a2a] px-4 py-2 text- font-black text-[#666]"><div>DESCRIPTION</div><div>PAYOUT</div><div>REQUIRES</div><div className="text-right">ACTION</div></div>
              {filteredJobs.map(job => {
                const pct = progress[job.id] || 0;
                const locked = !canDoJob(job);
                const mastery = pct >= 100 ? 3 : pct >= 50 ? 2 : pct > 0 ? 1 : 0;
                const extra = heat >= 85 ? 3 : heat >= 60 ? 2 : heat >= 40 ? 1 : 0;
                const totalEng = job.eng + extra;

                return (
                  <div key={job.id} className={`grid grid-cols-[2.2fr_1fr_1.2fr_120px] px-4 py-3 border-b border-[#1a1a1a] items-center ${locked ? 'opacity-50 bg-[#111]' : 'bg-[#151515] hover:bg-[#1a1a1a]'} text-[15px]`}>
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
                    <div><div className="text-[#8f8]">${job.cashMin}-${job.cashMax}</div><div className="text-[15px] text-[#888]">REP +{job.rep}</div></div>
                    <div className="flex gap-1 flex-wrap">
                      {job.needs.length ? job.needs.map(n => {
                        const owned = owns(n);
                        return (
                          <button
                            key={n}
                            onClick={() => {
                              setTab('SHOP');
                              setHighlightedShopItem(n);
                              setTimeout(() => setHighlightedShopItem(null), 3000); // clear glow after 3s
                              addLog(`Looking for ${n} in shop`);
                            }}
                            className={`px-2 py-0.5 rounded text- border cursor-pointer hover:scale-105 transition-all ${owned ? 'bg-[#1a2e1a] text-[#6f6] border-[#2a4a2a] hover:border-[#4a8a4a]' : 'bg-[#2e1a1a] text-[#f88] border-[#4a2a2a] hover:border-[#f88] hover:bg-[#3a2222]'}`}
                          >
                            {ITEMS.find(i => i.id === n)?.icon} {n}
                          </button>
                        )
                      }) : <span className="text-[#555] text-">None</span>}
                    </div>
                    <div className="text-right">
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
            <div className="space-y-4">
              {[{ key: 'tool', label: 'TOOLS', desc: 'Break in, stay in' }, { key: 'weapon', label: 'WEAPONS', desc: 'Enforcement' }, { key: 'vehicle', label: 'VEHICLES', desc: 'Move product & cash' }].map(cat => {
                const catItems = ITEMS.filter(i => i.type === cat.key && i.id !== 'ferry_ticket');
                return (
                  <div key={cat.key} className="bg-[#121212] border border-[#2a2a2a] rounded-lg overflow-hidden">
                    <div className="bg-[#1e1e1e] border-b border-[#2a2a2a] px-4 py-2 flex justify-between"><div className="text- font-black text-[#f5e8c7]">{cat.label} ({catItems.length})</div><div className="text- text-[#666]">{cat.desc}</div></div>
                    <div className="divide-y divide-[#1a1a1a]">
                      {catItems.map(item => {
                        const has = owns(item.id);
                        const isHighlighted = highlightedShopItem === item.id;
                        return (
                          <div
                            key={item.id}
                            id={`shop-item-${item.id}`}
                            className={`grid grid-cols-[1.6fr_80px_100px] px-4 py-2.5 items-center text- transition-all duration-300 ${isHighlighted ? 'bg-[#2a2515] ring-2 ring-[#f5c842] ring-inset animate-pulse' : 'bg-[#151515] hover:bg-[#1a1a1a]'}`}
                          >
                            <div className="flex gap-2 items-center"><span>{item.icon}</span><span className="font-bold text-[#ddd]">{item.name}</span><span className="text-[#666] text-">- {item.desc}</span>{has && <span className="ml-2 text-[#6f6] text-">✓ OWNED</span>}</div>
                            <div className="text-[#888]">${item.cost}</div>
                            <div className="text-right"><button disabled={has || cash < item.cost} onClick={() => { setCash((c: number) => c - item.cost); setOwned(o => ({ ...o, [item.id]: true })); addLog(`Bought ${item.name}`); }} className={`px-3 py-1 rounded font-bold ${has ? 'bg-[#1a2e1a] text-[#6f6]' : cash >= item.cost ? 'bg-[#f5e8c7] text-black' : 'bg-[#222] text-[#555]'}`}>{has ? 'OWNED' : `$${item.cost}`}</button></div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {tab === 'SKILLS' && (
            <div className="space-y-2">
              <div className="bg-[#171717] rounded-lg p-4 border border-[#f5c842]/30 text-"><span className="font-black">YOU HAVE {skillPoints} POINTS</span> <span className="text-[#666]">- LVL {level} → {level + 1} needs {repToNext} REP</span></div>
              {[{ id: 'toughness', name: 'Toughness', desc: `+10 Max HP (Now ${maxHealth} HP)`, val: skills.toughness }, { id: 'endurance', name: 'Endurance', desc: `+5 Max Energy (Now ${maxEnergy} ENG)`, val: skills.endurance }, { id: 'stamina', name: 'Stamina', desc: `+2 Max Stamina (Now ${maxStamina})`, val: skills.stamina }, { id: 'muscle', name: 'Muscle', desc: `+12% Cash (Now x${cashBonus.toFixed(2)})`, val: skills.muscle }, { id: 'cool', name: 'Cool', desc: `-${(heatReduction * 100).toFixed(0)}% Heat`, val: skills.cool }].map(s => (
                <div key={s.id} className="bg-[#151515] border border-[#222] rounded-lg px-4 py-3 flex justify-between items-center"><div><div className="font-bold text-">{s.name} LVL {s.val}</div><div className="text- text-[#666]">{s.desc}</div></div><button disabled={skillPoints <= 0} onClick={() => spendPoint(s.id as any)} className={`px-4 py-1.5 rounded text- font-black ${skillPoints > 0 ? 'bg-[#f5e8c7] text-black' : 'bg-[#222] text-[#555]'}`}>+1</button></div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT LEDGER - STICKY */}
        <div className="lg:sticky lg:top-6 h-fit space-y-3">
          <div className="bg-[#f5e8c7] text-black rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="text- font-black tracking-widest">LEDGER</div>
              <div className="flex gap-2 items-center">
                <div className="text- bg-black/10 px-2 py-0.5 rounded-full">{ledger.length} LOGS</div>
                <button
                  onClick={() => setLedger(['Ledger cleared. Fresh start in Port Haven.'])}
                  className="text- font-black px-2 py-1 rounded bg-black/15 hover:bg-black/25 border border-black/10"
                >
                  CLEAR
                  <div className="text- text-black/60 mt-2">Autosaves to browser</div>
                </button>
              </div>
            </div>
            <div className="h- overflow-y-auto text- space-y-1 font-mono pr-1">{ledger.map((l, i) => <div key={i} className="border-b border-black/10 py-1 leading-tight">{l}</div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}