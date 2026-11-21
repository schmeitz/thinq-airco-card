/*
 * ThinQ Airco Card — LG air conditioners in Home Assistant, styled like the LG ThinQ app
 * https://github.com/schmeitz/thinq-airco-card · MIT licence · (c) 2026 Michiel Schmeitz
 * Works with the smartthinq_sensors integration (climate entities of LG air conditioners).
 *
 * type: custom:thinq-airco-card
 * entity: climate.living_room_ac        (required)
 * name: Living room                     (optional, defaults to friendly_name)
 * layout: tile | full                   (tile = ThinQ overview tile, tap opens the control screen;
 *                                        full = control screen inside the card)
 * unit: wall | cassette                 (picture: wall unit or ceiling cassette)
 * background: lg | glass | theme        (lg = dark ThinQ colours; glass = frosted glass; theme = follow theme)
 * language: nl | en                     (optional, defaults to the Home Assistant user language)
 * temperature_sensor: sensor.xyz        (optional: show another room temperature)
 * jet_mode / display_light / sleep_time / filter / power / energy / ssid:
 *                                       entity overrides; found automatically on the same device.
 *                                       Set to false to hide a feature.
 */
const LG_VERSION = '1.4.0';
const LG_I18N = {
  nl: {
    'm.cool': 'Koelen', 'm.dry': 'Ontvochtigen', 'm.fan_only': 'Ventilator', 'm.heat': 'Warmte', 'm.heat_cool': 'Auto', 'm.auto': 'Auto', 'm.__on': 'Inschakelen…',
    'f.low': 'Laag', 'f.LOW_MID': 'Laag-midden', 'f.medium': 'Midden', 'f.MID_HIGH': 'Midden-hoog', 'f.high': 'Hoog', 'f.diffuse': 'Auto', 'f.auto': 'Auto',
    'f.SLOW': 'Zeer laag', 'f.SLOW_LOW': 'Zeer laag-laag', 'f.POWER': 'Turbo',
    'v.Off': 'Vast', 'v.Top': 'Boven', 'v.MiddleTop1': 'Stand 2', 'v.MiddleTop2': 'Stand 3', 'v.MiddleBottom2': 'Stand 4', 'v.MiddleBottom1': 'Stand 5', 'v.Bottom': 'Onder', 'v.Swing': 'Zwenken',
    'h.Off': 'Vast', 'h.Left': 'Links', 'h.MiddleLeft': 'Midden-links', 'h.Center': 'Midden', 'h.MiddleRight': 'Midden-rechts', 'h.Right': 'Rechts',
    'h.LeftHalf': 'Linkerhelft', 'h.RightHalf': 'Rechterhelft', 'h.Swing': 'Zwenken',
    off: 'Uit', unavailable: 'Niet beschikbaar', back: 'Terug', details: 'Details', power: 'Aan/uit', lower: 'Lager', higher: 'Hoger', prev: 'Vorige', next: 'Volgende',
    offnote: 'Uitgeschakeld — druk op de aan/uit-knop', target: 'Doeltemperatuur', fan: 'Ventilatorsnelheid', airflow: 'Luchtstroom', sleep: 'Slaaptimer', jet: 'Extra snel',
    jet_heat: 'Krachtige stroom warme lucht om de ruimte snel te verwarmen.', jet_cool: 'Krachtige stroom koude lucht om de ruimte snel te koelen.',
    filter: 'Filter', filter_clean: 'Filter schoonmaken aanbevolen', filter_life: 'Resterende levensduur', power_now: 'Stroomverbruik nu', energy_total: 'Energie totaal',
    display_light: 'Displayverlichting', wifi: 'Wifi', all_details: 'Alle details', tab_device: 'Toestel', tab_extra: 'Nuttige<br>functies',
    mode_title: 'Bedieningsmodus', updown: 'Op en neer', leftright: 'Links en rechts', swing: 'Zwenken',
    sleep_after: 'De airco gaat uit na', sleep_now: 'Nu: uit over {d}. Wijzigen naar', sleep_off: 'Slaaptimer uit', sleep_left: 'Gaat uit over {d}',
    sleep_set: 'Slaaptimer: de airco gaat uit over {d}', sleep_failed: 'Slaaptimer mislukt: {e}', failed: 'Mislukt: {e}',
    min: '{m} min', hour: '{h} uur', hourmin: '{h} u {m} min',
    err_entity: 'Geef een climate-entiteit op, bijvoorbeeld entity: climate.airco_woonkamer',
  },
  en: {
    'm.cool': 'Cool', 'm.dry': 'Dry', 'm.fan_only': 'Fan', 'm.heat': 'Heat', 'm.heat_cool': 'Auto', 'm.auto': 'Auto', 'm.__on': 'Turning on…',
    'f.low': 'Low', 'f.LOW_MID': 'Low-mid', 'f.medium': 'Medium', 'f.MID_HIGH': 'Mid-high', 'f.high': 'High', 'f.diffuse': 'Auto', 'f.auto': 'Auto',
    'f.SLOW': 'Very low', 'f.SLOW_LOW': 'Very low-low', 'f.POWER': 'Turbo',
    'v.Off': 'Fixed', 'v.Top': 'Top', 'v.MiddleTop1': 'Step 2', 'v.MiddleTop2': 'Step 3', 'v.MiddleBottom2': 'Step 4', 'v.MiddleBottom1': 'Step 5', 'v.Bottom': 'Bottom', 'v.Swing': 'Swing',
    'h.Off': 'Fixed', 'h.Left': 'Left', 'h.MiddleLeft': 'Mid-left', 'h.Center': 'Centre', 'h.MiddleRight': 'Mid-right', 'h.Right': 'Right',
    'h.LeftHalf': 'Left half', 'h.RightHalf': 'Right half', 'h.Swing': 'Swing',
    off: 'Off', unavailable: 'Unavailable', back: 'Back', details: 'Details', power: 'Power', lower: 'Lower', higher: 'Higher', prev: 'Previous', next: 'Next',
    offnote: 'Switched off — press the power button', target: 'Target temperature', fan: 'Fan speed', airflow: 'Airflow', sleep: 'Sleep timer', jet: 'Jet mode',
    jet_heat: 'Powerful stream of warm air to heat the room quickly.', jet_cool: 'Powerful stream of cold air to cool the room quickly.',
    filter: 'Filter', filter_clean: 'Cleaning recommended', filter_life: 'Remaining life', power_now: 'Power now', energy_total: 'Total energy',
    display_light: 'Display light', wifi: 'Wi-Fi', all_details: 'All details', tab_device: 'Device', tab_extra: 'Useful<br>features',
    mode_title: 'Operation mode', updown: 'Up and down', leftright: 'Left and right', swing: 'Swing',
    sleep_after: 'Turn the air conditioner off after', sleep_now: 'Now: off in {d}. Change to', sleep_off: 'Sleep timer off', sleep_left: 'Turns off in {d}',
    sleep_set: 'Sleep timer: turns off in {d}', sleep_failed: 'Sleep timer failed: {e}', failed: 'Failed: {e}',
    min: '{m} min', hour: '{h} h', hourmin: '{h} h {m} min',
    err_entity: 'Please set a climate entity, for example entity: climate.living_room_ac',
  },
};
let lgLang = 'en';
const lgSetLang = (hass, config) => {
  const l = (config && config.language) || (hass && ((hass.locale && hass.locale.language) || hass.language)) || 'en';
  lgLang = String(l).toLowerCase().startsWith('nl') ? 'nl' : 'en';
};
const lgLoc = () => (lgLang === 'nl' ? 'nl-NL' : undefined);
const lgT = (k, vars) => {
  let s = (LG_I18N[lgLang] && LG_I18N[lgLang][k]) ?? LG_I18N.en[k] ?? k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
  return s;
};
const lgMap = (prefix) => new Proxy({}, { get: (_, k) => (typeof k === 'string' && LG_I18N.en[prefix + k] ? lgT(prefix + k) : undefined) });

const LG_MODES = {
  cool:      { get label() { return lgT('m.cool'); }, icon: 'mdi:snowflake',           color: '#7b83ff', flow: '#5f86ff' },
  dry:       { get label() { return lgT('m.dry'); }, icon: 'mdi:water-opacity',       color: '#3aa6f0', flow: '#46b4f2' },
  fan_only:  { get label() { return lgT('m.fan_only'); }, icon: 'mdi:fan',                 color: '#2fc3a6', flow: '#43cfc0' },
  heat:      { get label() { return lgT('m.heat'); }, icon: 'mdi:white-balance-sunny', color: '#f6a02a', flow: '#d2453c' },
  heat_cool: { get label() { return lgT('m.heat_cool'); }, icon: 'mdi:alpha-a-circle',      color: '#7b83ff', flow: '#8f95ff' },
  auto:      { get label() { return lgT('m.auto'); }, icon: 'mdi:alpha-a-circle',      color: '#7b83ff', flow: '#8f95ff' },
  __on:      { get label() { return lgT('m.__on'); }, icon: 'mdi:power',               color: '#b4b5bc', flow: '#9a9ba3' },
};
// kleur van de luchtlijntjes op de tegel per stand
const LG_TILE_AIR = { heat: '#ff8a3d', cool: '#5f86ff', dry: '#46b4f2', fan_only: '#3cc8c0', heat_cool: '#8f95ff', auto: '#8f95ff', __on: '#9a9ba3' };
// 'aan, stand nog onbekend' is pas klaar als HA een andere toestand dan 'off' meldt
const lgPendDone = (want, actual) => String(want) === String(actual) || (want === '__on' && actual !== 'off' && actual !== undefined);
const LG_MODE_ORDER = ['cool', 'dry', 'fan_only', 'heat', 'heat_cool', 'auto'];

const LG_FAN = lgMap('f.');
const LG_VSWING = lgMap('v.');
const LG_HSWING = lgMap('h.');
const LG_SLEEP = [30, 60, 90, 120, 180, 240, 300, 360, 420];

const lgNum = (v) => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? null : Number(v));
const lgTemp = (v) => {
  const n = lgNum(v);
  if (n === null) return '–';
  const dec = Math.round(n * 10) % 10 === 0 ? 0 : 1;
  return n.toLocaleString(lgLoc(), { minimumFractionDigits: dec, maximumFractionDigits: dec }) + '°C';
};
const lgDur = (m) => {
  const h = Math.floor(m / 60), r = Math.round(m % 60);
  if (!h) return lgT('min', { m: r });
  return r ? lgT('hourmin', { h, m: r }) : lgT('hour', { h });
};
const lgBg = (c) => (['glass', 'theme'].includes(String(c && c.background).toLowerCase()) ? String(c.background).toLowerCase() : 'lg');
const lgEsc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function lgRelated(hass, config) {
  const re = {
    jet_mode: /^switch\..*_jet_mode$/,
    display_light: /^switch\..*_display_light$/,
    sleep_time: /^sensor\..*_sleep_time$/,
    filter: /^sensor\..*_filter_remaining_life$/,
    power: /^sensor\..*_energy_current$/,
    energy: /^sensor\..*_energ(y|ie)$/,
    ssid: /^sensor\..*_ssid$/,
  };
  const reg = hass.entities || {};
  const dev = reg[config.entity] && reg[config.entity].device_id;
  const ids = dev ? Object.values(reg).filter((e) => e.device_id === dev).map((e) => e.entity_id) : [];
  const out = {};
  for (const [k, r] of Object.entries(re)) {
    if (config[k] === false) { out[k] = null; continue; }
    out[k] = config[k] || ids.find((id) => r.test(id)) || null;
  }
  return out;
}

/* Pictogram per lamelstand.
   k = 'v' (op en neer): zijaanzicht, airco aan de muur links, pijl steeds steiler naar beneden.
   k = 'h' (links en rechts): bovenaanzicht, airco boven, pijl naar links/midden/rechts. */
function lgFlowSvg(k, v) {
  const rad = (d) => (d * Math.PI) / 180;
  const arrow = (x, y, ang, len, cls = '') => {
    // ang in graden: 0 = recht omlaag (h) of horizontaal (v) — omgerekend door de aanroeper
    const ex = x + Math.cos(rad(ang)) * len, ey = y + Math.sin(rad(ang)) * len;
    const a1 = rad(ang + 150), a2 = rad(ang - 150), hl = 6;
    return `<g class="${cls}"><line x1="${x}" y1="${y}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"/>`
      + `<polyline points="${(ex + Math.cos(a1) * hl).toFixed(1)},${(ey + Math.sin(a1) * hl).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)} ${(ex + Math.cos(a2) * hl).toFixed(1)},${(ey + Math.sin(a2) * hl).toFixed(1)}"/></g>`;
  };
  const fan = (x, y, from, to, len) => {
    let s = '';
    for (const a of [from, (from + to) / 2, to]) {
      const ex = x + Math.cos(rad(a)) * len, ey = y + Math.sin(rad(a)) * len;
      s += `<line class="fz" x1="${x}" y1="${y}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"/>`;
    }
    const r = len + 3, sx = x + Math.cos(rad(from)) * r, sy = y + Math.sin(rad(from)) * r;
    const ex = x + Math.cos(rad(to)) * r, ey = y + Math.sin(rad(to)) * r;
    const large = Math.abs(to - from) > 180 ? 1 : 0, sweep = to > from ? 1 : 0;
    const ah = (px, py, ang) => { const a1 = rad(ang + 145), a2 = rad(ang - 145), z = 4.2; return `<polyline points="${(px + Math.cos(a1) * z).toFixed(1)},${(py + Math.sin(a1) * z).toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)} ${(px + Math.cos(a2) * z).toFixed(1)},${(py + Math.sin(a2) * z).toFixed(1)}"/>`; };
    s += `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} A${r} ${r} 0 ${large} ${sweep} ${ex.toFixed(1)} ${ey.toFixed(1)}"/>`;
    s += ah(ex, ey, to + (sweep ? 90 : -90)) + ah(sx, sy, from + (sweep ? -90 : 90));
    return s;
  };
  const pin = (x, y) => `<circle cx="${x}" cy="${y}" r="2.6" fill="currentColor" stroke="none"/>`;
  let body = '';
  if (k === 'v') {
    body = `<line x1="4" y1="2" x2="4" y2="38" class="fz"/><rect x="4" y="5" width="13" height="8" rx="2" fill="currentColor" stroke="none" opacity=".85"/>`;
    const ox = 15, oy = 15;
    const ang = { Top: 12, MiddleTop1: 26, MiddleTop2: 40, MiddleBottom2: 54, MiddleBottom1: 68, Bottom: 82 }[v];
    if (ang !== undefined) body += arrow(ox, oy, ang, 26);
    else if (v === 'Swing') body += fan(ox, oy, 12, 82, 22);
    else body += arrow(ox, oy, 40, 24) + pin(ox, oy);
  } else {
    body = `<rect x="11" y="3" width="24" height="7" rx="2" fill="currentColor" stroke="none" opacity=".85"/>`;
    const ox = 23, oy = 12;
    const ang = { Left: 140, MiddleLeft: 115, Center: 90, MiddleRight: 65, Right: 40 }[v];
    if (ang !== undefined) body += arrow(ox, oy, ang, 24);
    else if (v === 'LeftHalf') body += fan(ox, oy, 90, 140, 21);
    else if (v === 'RightHalf') body += fan(ox, oy, 40, 90, 21);
    else if (v === 'Swing') body += fan(ox, oy, 40, 140, 21);
    else body += arrow(ox, oy, 90, 22) + pin(ox, oy);
  }
  return `<svg viewBox="0 0 46 41" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

function lgCurrentTemp(hass, config, s) {
  if (config.temperature_sensor && hass.states[config.temperature_sensor]) {
    return lgNum(hass.states[config.temperature_sensor].state);
  }
  return s ? lgNum(s.attributes.current_temperature) : null;
}

function lgUnitSvg(kind, size) {
  if (kind === 'cassette') {
    if (size === 'tile') {
      const l = [17, 21, 25, 29, 33];
      return `<svg viewBox="0 0 48 48" class="u-tile cas"><rect x="3" y="3" width="42" height="42" rx="7" fill="#efece6" stroke="#d6d0c4"/>
        <rect x="8" y="6.5" width="32" height="2.4" rx="1.2" fill="#d2ccc0"/><rect x="8" y="39.1" width="32" height="2.4" rx="1.2" fill="#d2ccc0"/>
        <rect x="13" y="13" width="22" height="22" rx="3" fill="#34353b"/>
        <g stroke="#5b5c63" stroke-width="1.3">${l.map((x) => `<line x1="${x}" y1="14" x2="${x}" y2="34"/>`).join('')}${l.map((y) => `<line x1="14" y1="${y}" x2="34" y2="${y}"/>`).join('')}</g></svg>`;
    }
    return `<svg viewBox="0 0 300 190" class="u-hero">
      <defs>
        <linearGradient id="hb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e2e4e9"/></linearGradient>
        <linearGradient id="hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--flow);stop-opacity:.8"/><stop offset="1" style="stop-color:var(--flow);stop-opacity:0"/></linearGradient>
      </defs>
      <path class="flow" d="M40 92 L260 92 L298 188 L2 188 Z" fill="url(#hf)"/>
      <polygon points="30,62 150,108 270,62 270,72 150,118 30,72" fill="#bfc2ca"/>
      <polygon points="150,16 270,62 150,108 30,62" fill="url(#hb)" stroke="#d3d6dc"/>
      <polygon points="150,38 213,62 150,86 87,62" fill="#3a3b42"/>
      <g stroke="#5d5e66" stroke-width="1.5">
        <line x1="129" y1="46" x2="192" y2="70"/><line x1="108" y1="54" x2="171" y2="78"/>
        <line x1="171" y1="46" x2="108" y2="70"/><line x1="192" y1="54" x2="129" y2="78"/>
      </g>
      <g stroke="#cfd2d8" stroke-width="3" stroke-linecap="round">
        <line x1="70" y1="58" x2="140" y2="31"/><line x1="160" y1="31" x2="230" y2="58"/>
        <line x1="70" y1="66" x2="140" y2="93"/><line x1="160" y1="93" x2="230" y2="66"/>
      </g></svg>`;
  }
  if (size === 'tile') {
    return `<svg viewBox="0 0 90 44" class="u-tile wall">
      <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5f2eb"/><stop offset="1" stop-color="#ddd7cb"/></linearGradient></defs>
      <rect x="2" y="5" width="86" height="21" rx="4" fill="url(#tg)"/>
      <rect x="6" y="21.5" width="78" height="3" rx="1.5" fill="#bdb6a7"/>
      <g class="air" style="stroke: var(--air, #3cc8c0)" stroke-width="2.2" stroke-linecap="round" fill="none">
        <path d="M22 31 l-3 8"/><path d="M38 31 l-1 8"/><path d="M52 31 l1 8"/><path d="M68 31 l3 8"/>
      </g></svg>`;
  }
  return `<svg viewBox="0 0 300 190" class="u-hero">
    <defs>
      <linearGradient id="hb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#eef0f3"/><stop offset="1" stop-color="#d3d6dc"/></linearGradient>
      <linearGradient id="hs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#dfe2e7"/><stop offset="1" stop-color="#b4b8c1"/></linearGradient>
      <linearGradient id="hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--flow);stop-opacity:.8"/><stop offset="1" style="stop-color:var(--flow);stop-opacity:0"/></linearGradient>
    </defs>
    <path class="flow" d="M80 98 L238 90 L296 188 L4 188 Z" fill="url(#hf)"/>
    <path d="M252 34 L263 39 Q268 41 268 48 L268 83 Q268 91 260 91 L252 92 Z" fill="url(#hs)"/>
    <path d="M70 30 L238 21 Q252 20 252 34 L252 82 Q252 92 241 93 L76 102 Q64 103 64 90 L64 42 Q64 31 70 30 Z" fill="url(#hb)"/>
    <path d="M77 94 L242 85.5 L240.5 91 L78 99.5 Z" fill="#c2c5cd"/>
    <path d="M78 101 L241 92.5" stroke="#9ea2ac" stroke-width="1.6"/>
  </svg>`;
}

/* ---------------------------------------------------------------- bedieningsscherm */

const LG_PANEL_CSS = `
:host { display:block; color:#fff; font-family: var(--ha-font-family-body, Roboto, "Segoe UI", sans-serif); -webkit-tap-highlight-color: transparent; --acc:#8a8ef9; --acc2:#5558ea; --card:#2c2d31; --sub:#b4b5bc; --teal:#38c6bf; --flow: transparent; }
dialog { color: inherit; font: inherit; outline: none; }
dialog:focus, dialog:focus-visible, [tabindex="-1"]:focus { outline: none; }
button:focus:not(:focus-visible) { outline: none; }
dialog.main { padding:0; border:none; background:transparent; width:100%; max-width:470px; height:100%; max-height:100%; margin:0 auto; overflow:hidden; }
dialog.main::backdrop { background: rgba(0,0,0,.65); }
@media (min-width: 620px) { dialog.main { height: calc(100% - 48px); max-height: calc(100% - 48px); margin: 24px auto; border-radius: 30px; box-shadow: 0 20px 60px rgba(0,0,0,.6); } }
.screen { position:relative; background:#000; display:flex; flex-direction:column; overflow:hidden; }
:host(:not([dialog])) .screen { border-radius: var(--ha-card-border-radius, 28px); }
dialog.main .screen { height:100%; animation: up .25s ease; }
@keyframes fade { from { opacity:0 } }
@keyframes up { from { transform: translateY(24px); opacity:0 } }
header { display:flex; align-items:center; gap:10px; padding: 14px 14px 4px; }
header .title { flex:1; font-size: 26px; font-weight: 700; letter-spacing:.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ico { width:44px; height:44px; border-radius:50%; border:none; background:transparent; color:#d9dade; display:grid; place-items:center; cursor:pointer; padding:0; }
.ico:hover { background: rgba(255,255,255,.08); }
:host(:not([dialog])) .back { display:none; }
.content { flex:1; overflow-y:auto; padding: 0 18px 100px; scrollbar-width: none; }
:host(:not([dialog])) .content { overflow: visible; padding-bottom: 10px; }
.content::-webkit-scrollbar { display:none; }
.hero { position:relative; height: 210px; margin: 0 -18px; background: radial-gradient(ellipse at 50% 30%, #23242a 0%, #0c0c0f 60%, #000 100%); display:flex; flex-direction:column; align-items:center; justify-content:flex-end; padding-bottom: 12px; overflow:hidden; }
.hero .unit { width: 72%; max-width: 300px; position:absolute; top: 4px; }
.u-hero { width:100%; display:block; }
.flow { opacity:0; transition: opacity .6s; }
:host([on]) .flow { opacity:1; animation: breathe 3s ease-in-out infinite; }
@keyframes breathe { 0%,100% { opacity:.7 } 50% { opacity:1 } }
.cur { position:relative; display:flex; align-items:center; gap:4px; font-size: 22px; font-weight: 500; }
.cur ha-icon { --mdc-icon-size: 22px; color:#e8e8ec; }
.moderow { display:flex; align-items:center; justify-content:space-between; margin: 18px 0 16px; }
.modebtn { display:flex; align-items:center; gap:6px; background:none; border:none; color:#fff; font: inherit; font-size: 32px; font-weight: 600; padding:0; cursor:pointer; }
.modebtn ha-icon { --mdc-icon-size: 30px; }
.modebtn:disabled { cursor: default; }
.modebtn:disabled ha-icon { display:none; }
.power { width:70px; height:70px; border-radius:50%; border:none; display:grid; place-items:center; cursor:pointer; background:#7f8086; color:#fff; transition: background .2s, color .2s, transform .1s; padding:0; }
.power ha-icon { --mdc-icon-size: 36px; }
.power:active { transform: scale(.94); }
:host([on]) .power { background:#e9ebf3; color: var(--acc2); }
.card { background: var(--card); border-radius: 26px; padding: 18px; box-sizing:border-box; }
.dim { opacity:.4; pointer-events:none; filter: grayscale(.4); }
.target { text-align:center; margin-bottom: 12px; }
.lbl { color:#c9cad0; font-size: 19px; }
.trow { display:flex; align-items:center; justify-content:space-between; padding: 0 6px; margin: 2px 0 10px; }
.tval { font-size: 54px; font-weight: 500; letter-spacing: -1px; }
.round { width:48px; height:48px; border-radius:50%; border:none; background:#46474e; color:#b9bac2; font-size: 30px; line-height:1; display:grid; place-items:center; cursor:pointer; padding:0; }
.round:active { background:#55565e; }
.round.sm { width:40px; height:40px; }
.round ha-icon { --mdc-icon-size: 24px; }
input[type=range] { -webkit-appearance:none; appearance:none; width: calc(100% - 12px); margin: 6px 6px 4px; height: 12px; border-radius: 6px; outline:none; background: linear-gradient(to right, var(--acc) 0%, var(--acc) var(--fill, 50%), #4a4b55 var(--fill, 50%), #4a4b55 100%); }
input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width: 34px; height: 34px; border-radius:50%; background: var(--acc); border: none; box-shadow: 0 2px 6px rgba(0,0,0,.4); cursor:pointer; }
input[type=range]::-moz-range-thumb { width: 34px; height: 34px; border-radius:50%; background: var(--acc); border:none; cursor:pointer; }
.grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.grid2 > .card { display:flex; flex-direction:column; align-items:center; justify-content:center; gap: 6px; min-height: 160px; text-align:center; }
.grid2 > .card.solo { grid-column: 1 / -1; }
button.card { border:none; color:#fff; font: inherit; cursor:pointer; }
.bigico { --mdc-icon-size: 52px; color: var(--teal); }
.lbl2 { font-size: 18px; color:#e6e6ea; }
.cyc { display:flex; align-items:center; gap: 10px; }
.val { color: var(--acc); font-size: 24px; font-weight: 500; min-width: 64px; }
.sval { color: var(--sub); font-size: 15px; }
.list { padding: 4px 18px; margin-bottom: 12px; }
.row { display:flex; align-items:center; gap: 14px; min-height: 64px; }
.row + .row { border-top: 1px solid #3c3d43; }
.row ha-icon { --mdc-icon-size: 30px; flex: none; }
.row .rt { flex:1; font-size: 19px; }
.row .rs { color: var(--sub); font-size: 14px; margin-top: 2px; }
.row .rv { color: var(--sub); font-size: 16px; text-align:right; }
.row.click { cursor:pointer; }
.sep { width:1px; height: 34px; background:#4a4b52; }
.yellow { color:#f4c542; } .teal { color: var(--teal); } .blue { color: var(--acc); } .red { color:#ff6b6b; }
.jet { display:flex; align-items:center; gap: 14px; margin-bottom: 12px; }
.jet ha-icon { --mdc-icon-size: 32px; }
.jet .rt { flex:1; font-size: 20px; }
.jet .rs { color: var(--sub); font-size: 15px; margin-top: 4px; line-height: 1.3; }
.tgl { position:relative; width: 62px; height: 36px; flex:none; cursor:pointer; }
.tgl input { opacity:0; width:0; height:0; position:absolute; }
.tgl span { position:absolute; inset:0; background:#80838f; border-radius: 18px; transition: background .2s; }
.tgl span::before { content:''; position:absolute; width: 28px; height: 28px; left: 4px; top: 4px; background:#fff; border-radius:50%; transition: transform .2s; }
.tgl input:checked + span { background: var(--acc2); }
.tgl input:checked + span::before { transform: translateX(26px); }
.offnote { display:none; text-align:center; color: var(--sub); font-size: 15px; margin: -6px 0 12px; }
:host(:not([on])) .offnote { display:block; }
.tabs { position:absolute; left:50%; bottom: 16px; transform: translateX(-50%); display:flex; background:#2b2c31; border-radius: 40px; padding: 6px; gap: 4px; box-shadow: 0 -8px 30px 10px #000; }
:host(:not([dialog])) .tabs { position: static; transform:none; margin: 6px auto 16px; box-shadow:none; width: max-content; }
.tab { border:none; background:transparent; color:#c3c4cb; font: inherit; font-size: 17px; font-weight: 600; padding: 12px 26px; border-radius: 32px; cursor:pointer; line-height:1.15; }
.tab.active { background: var(--acc2); color:#fff; }
[hidden] { display:none !important; }
:host([unavail]) .controls { opacity:.35; pointer-events:none; }
/* achtergrond: glass (zelfde glasstijl als de dashboardkaarten) */
:host([bg=glass]) .screen { background: rgba(12, 15, 22, 0.80); backdrop-filter: blur(22px) saturate(140%); -webkit-backdrop-filter: blur(22px) saturate(140%); }
:host([bg=glass]:not([dialog])) .screen { border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; background: rgba(18, 22, 30, 0.72); backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%); }
:host([bg=glass]) dialog.main { border: 1px solid rgba(255,255,255,0.10); }
:host([bg=glass]) dialog.main::backdrop { background: rgba(0,0,0,.35); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
:host([bg=glass]) .hero { background: radial-gradient(ellipse at 50% 35%, rgba(255,255,255,.07) 0%, rgba(255,255,255,0) 70%); }
:host([bg=glass]) .card { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.08); }
:host([bg=glass]) .tabs { background: rgba(38, 42, 52, 0.92); box-shadow: 0 -6px 24px 6px rgba(0,0,0,.35); }
:host([bg=glass]) .bs { background: rgba(24, 27, 35, 0.97); }
:host([bg=glass]) .opts, :host([bg=glass]) .chip:not(.sel) { background: rgba(255,255,255,0.07); }
:host([bg=glass]) .round { background: rgba(255,255,255,0.12); }
/* achtergrond: theme (volgt het actieve thema) */
:host([bg=theme]) { color: var(--primary-text-color, #fff); --card: var(--ha-card-background, var(--card-background-color, #2c2d31)); --sub: var(--secondary-text-color, #b4b5bc); }
:host([bg=theme]) .screen { background: var(--primary-background-color, #111); }
:host([bg=theme]:not([dialog])) .screen { background: var(--ha-card-background, var(--card-background-color, #1c1c1c)); border-radius: var(--ha-card-border-radius, 12px); border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, transparent)); }
:host([bg=theme]:not([dialog])) .card { background: var(--secondary-background-color, rgba(127,127,127,.12)); }
:host([bg=theme]) .hero { background: radial-gradient(ellipse at 50% 35%, rgba(127,127,127,.15) 0%, rgba(127,127,127,0) 70%); }
:host([bg=theme]) .modebtn, :host([bg=theme]) button.card, :host([bg=theme]) .lbl2, :host([bg=theme]) .row .rt, :host([bg=theme]) .jet .rt { color: var(--primary-text-color, #fff); }
:host([bg=theme]) .lbl, :host([bg=theme]) .cur ha-icon, :host([bg=theme]) header .ico { color: var(--secondary-text-color, #c9cad0); }
:host([bg=theme]) .tabs { background: var(--card); box-shadow: 0 -6px 24px 6px rgba(0,0,0,.25); }
:host([bg=theme]) .bs { background: var(--card); }
:host([bg=theme]) .opts, :host([bg=theme]) .chip:not(.sel) { background: var(--secondary-background-color, rgba(127,127,127,.15)); color: var(--primary-text-color, #fff); }
:host([bg=theme]) .tab:not(.active) { color: var(--secondary-text-color, #c3c4cb); }
/* onderblad (eigen top-layer-dialog: valt nooit buiten beeld) */
dialog.bsheet { padding:0; border:none; background:transparent; width:100%; max-width:470px; height:100%; max-height:100%; margin:0 auto; overflow:hidden; }
dialog.bsheet[open] { display:flex; flex-direction:column; }
dialog.bsheet::backdrop { background: rgba(0,0,0,.55); }
@media (min-width: 620px) { dialog.bsheet { height: calc(100% - 48px); max-height: calc(100% - 48px); margin: 24px auto; border-radius: 30px; } }
.bs-backdrop { flex: 1 1 auto; min-height: 40px; cursor: pointer; }
.bs { flex: 0 1 auto; position:relative; background:#1f2023; border-radius: 30px 30px 0 0; padding: 12px 20px 28px; max-height: 85%; overflow-y:auto; box-sizing: border-box; animation: up .22s ease; }
.grab { width: 58px; height: 6px; border-radius: 3px; background:#6b6e7a; margin: 0 auto 18px; }
.bs-title { font-size: 26px; font-weight: 700; margin: 0 0 16px 4px; }
.opts { background:#2e2f34; border-radius: 22px; padding: 0 18px; }
.opt { display:flex; align-items:center; gap: 14px; min-height: 64px; cursor:pointer; font-size: 20px; }
.opt + .opt { border-top: 1px solid #45464d; }
.opt .chk { width: 28px; color: var(--acc); --mdc-icon-size: 26px; visibility:hidden; }
.opt.sel .chk { visibility: visible; }
.opt .mi { --mdc-icon-size: 28px; }
.sub-h { color: var(--sub); font-size: 15px; margin: 16px 4px 8px; }
.chips { display:grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.chip { border:none; background:#2e2f34; color:#d6d7dc; font: inherit; font-size: 13px; line-height: 1.2; padding: 10px 4px 9px; border-radius: 18px; cursor:pointer;
  display:flex; flex-direction:column; align-items:center; gap: 5px; min-height: 84px; justify-content:center; transition: background .15s, color .15s; }
.chip svg { width: 46px; height: 38px; display:block; }
.chip .fz { opacity: .35; }
.chip.sel { background: var(--acc2); color:#fff; }
.chip.sel .fz { opacity: .55; }
@media (max-width: 360px) { .chips { grid-template-columns: repeat(3, 1fr); } }
`;

class LgAircoPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._pending = {};
    this._localTemp = null;
    this._tab = 'device';
    this._sheet = null;
    this._built = false;
  }

  set config(c) { this._config = c; this._rel = null; this.setAttribute('bg', lgBg(c)); }
  set hass(h) {
    this._hass = h;
    lgSetLang(h, this._config);
    if (!this._config) return;
    if (!this._rel && h.entities) this._rel = lgRelated(h, this._config);
    if (!this._built) this._build();
    this._update();
  }

  connectedCallback() {
    this._onResize = this._onResize || (() => { this._fit(this._dlg); if (this.$) this._fit(this.$.bsheet); });
    window.addEventListener('resize', this._onResize);
  }
  disconnectedCallback() { clearTimeout(this._tt); window.removeEventListener('resize', this._onResize); }

  /* Vangnet: past een open dialoog toch niet in het zichtbare venster (bijv. door zoom of een
     verschoven pagina), dan rekenen we de hoogte zelf uit. */
  _fit(el) {
    if (!el || !el.open) return;
    el.style.height = ''; el.style.maxHeight = ''; el.style.marginTop = ''; el.style.marginBottom = '';
    const r = el.getBoundingClientRect();
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    if (r.bottom <= vh + 1 && r.top >= -1) return;
    const z = el.offsetHeight ? (r.height / el.offsetHeight) || 1 : 1;
    const m = window.innerWidth >= 620 ? 24 : 0;
    el.style.height = el.style.maxHeight = `${Math.max(240, (vh - 2 * m) / z)}px`;
    el.style.marginTop = el.style.marginBottom = `${m / z}px`;
  }

  close() {
    if (!this.hasAttribute('dialog')) return;
    try { if (this._dlg && this._dlg.open) this._dlg.close(); } catch (e) { /* al dicht */ }
    this.remove();
    if (this.origin && this.origin._panelClosed) this.origin._panelClosed();
  }

  _st() { return this._hass && this._hass.states[this._config.entity]; }
  _rs(key) { const id = this._rel && this._rel[key]; return id ? this._hass.states[id] : null; }

  _setPending(key, value, ms = 9000) { this._pending[key] = { value, until: Date.now() + ms }; }
  _val(key, actual) {
    const p = this._pending[key];
    if (p) {
      if (Date.now() > p.until || lgPendDone(p.value, actual)) delete this._pending[key];
      else return p.value;
    }
    return actual;
  }

  _call(domain, service, data, pendKey) {
    return this._hass.callService(domain, service, data).catch((err) => {
      if (pendKey) delete this._pending[pendKey];
      this._update();
      this._toast(lgT('failed', { e: err && err.message ? err.message : err }));
    });
  }
  _toast(message) {
    const t = this.origin || this;
    t.dispatchEvent(new CustomEvent('hass-notification', { detail: { message }, bubbles: true, composed: true }));
  }
  _moreInfo(entityId) {
    if (!entityId) return;
    const t = this.origin || this;
    this.close();
    t.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
  }

  _build() {
    this._built = true;
    const r = this.shadowRoot;
    const isDlg = this.hasAttribute('dialog');
    r.innerHTML = `<style>${LG_PANEL_CSS}</style>
      ${isDlg ? '<dialog class="main">' : ''}
      <div class="screen" tabindex="-1" ${isDlg ? 'autofocus' : ''}>
        <header>
          <button class="ico back" title="${lgT('back')}"><ha-icon icon="mdi:arrow-left"></ha-icon></button>
          <div class="title"></div>
          <button class="ico gear" title="${lgT('details')}"><ha-icon icon="mdi:cog"></ha-icon></button>
        </header>
        <div class="content">
          <div class="page" data-page="device">
            <div class="hero"><div class="unit">${lgUnitSvg(this._config.unit, 'hero')}</div>
              <div class="cur"><ha-icon icon="mdi:thermometer"></ha-icon><span class="curv"></span></div></div>
            <div class="controls">
              <div class="moderow">
                <button class="modebtn"><span class="modelabel"></span><ha-icon icon="mdi:chevron-down"></ha-icon></button>
                <button class="power" title="${lgT('power')}"><ha-icon icon="mdi:power"></ha-icon></button>
              </div>
              <div class="offnote">${lgT('offnote')}</div>
              <div class="card target">
                <div class="lbl">${lgT('target')}</div>
                <div class="trow">
                  <button class="round minus" title="${lgT('lower')}">−</button>
                  <div class="tval"></div>
                  <button class="round plus" title="${lgT('higher')}">+</button>
                </div>
                <input type="range" class="slider">
              </div>
              <div class="grid2">
                <div class="card fan">
                  <ha-icon class="bigico" icon="mdi:fan"></ha-icon>
                  <div class="lbl2">${lgT('fan')}</div>
                  <div class="cyc">
                    <button class="round sm fprev" title="${lgT('prev')}"><ha-icon icon="mdi:chevron-left"></ha-icon></button>
                    <span class="val fval"></span>
                    <button class="round sm fnext" title="${lgT('next')}"><ha-icon icon="mdi:chevron-right"></ha-icon></button>
                  </div>
                </div>
                <button class="card air">
                  <ha-icon class="bigico" icon="mdi:arrow-left-right-bold"></ha-icon>
                  <div class="lbl2">${lgT('airflow')}</div>
                  <div class="sval airval"></div>
                </button>
              </div>
              <div class="card list sleepcard">
                <div class="row">
                  <ha-icon class="yellow" icon="mdi:sleep"></ha-icon>
                  <div class="rt">${lgT('sleep')}<div class="rs sleepv"></div></div>
                  <div class="sep"></div>
                  <label class="tgl"><input type="checkbox" class="sleepchk"><span></span></label>
                </div>
              </div>
              <div class="card jet">
                <ha-icon class="teal" icon="mdi:sync"></ha-icon>
                <div class="rt">${lgT('jet')}<div class="rs jetdesc"></div></div>
                <label class="tgl"><input type="checkbox" class="jetchk"><span></span></label>
              </div>
            </div>
          </div>
          <div class="page" data-page="extra" hidden>
            <div class="card list extralist">
              <div class="row click" data-k="filter"><ha-icon class="teal" icon="mdi:air-filter"></ha-icon><div class="rt">${lgT('filter')}<div class="rs filterv"></div></div><div class="rv filterp"></div></div>
              <div class="row click" data-k="power"><ha-icon class="yellow" icon="mdi:flash"></ha-icon><div class="rt">${lgT('power_now')}</div><div class="rv powerv"></div></div>
              <div class="row click" data-k="energy"><ha-icon class="blue" icon="mdi:lightning-bolt"></ha-icon><div class="rt">${lgT('energy_total')}</div><div class="rv energyv"></div></div>
              <div class="row" data-k="display_light"><ha-icon class="yellow" icon="mdi:lightbulb-on-outline"></ha-icon><div class="rt">${lgT('display_light')}</div><label class="tgl"><input type="checkbox" class="dispchk"><span></span></label></div>
              <div class="row click" data-k="ssid"><ha-icon class="blue" icon="mdi:wifi"></ha-icon><div class="rt">${lgT('wifi')}</div><div class="rv ssidv"></div></div>
              <div class="row click" data-k="climate"><ha-icon class="teal" icon="mdi:information-outline"></ha-icon><div class="rt">${lgT('all_details')}</div><div class="rv"><ha-icon icon="mdi:chevron-right" style="--mdc-icon-size:24px"></ha-icon></div></div>
            </div>
          </div>
        </div>
        <nav class="tabs">
          <button class="tab active" data-tab="device">${lgT('tab_device')}</button>
          <button class="tab" data-tab="extra">${lgT('tab_extra')}</button>
        </nav>
      </div>
      ${isDlg ? '</dialog>' : ''}
      <dialog class="bsheet"><div class="bs-backdrop"></div><div class="bs" tabindex="-1" autofocus><div class="grab"></div><div class="bs-title"></div><div class="bs-body"></div></div></dialog>`;
    const q = (s) => r.querySelector(s);
    this.$ = {
      title: q('.title'), curv: q('.curv'), modebtn: q('.modebtn'), modelabel: q('.modelabel'), power: q('.power'),
      target: q('.target'), tval: q('.tval'), slider: q('.slider'), minus: q('.minus'), plus: q('.plus'),
      fan: q('.fan'), fval: q('.fval'), air: q('.air'), airval: q('.airval'), grid2: q('.grid2'),
      sleepcard: q('.sleepcard'), sleepchk: q('.sleepchk'), sleepv: q('.sleepv'),
      jet: q('.jet'), jetchk: q('.jetchk'), jetdesc: q('.jetdesc'),
      bsheet: q('.bsheet'), bstitle: q('.bs-title'), bsbody: q('.bs-body'),
      filterv: q('.filterv'), filterp: q('.filterp'), powerv: q('.powerv'), energyv: q('.energyv'), dispchk: q('.dispchk'), ssidv: q('.ssidv'),
    };
    const $ = this.$;
    if (isDlg) {
      this._dlg = q('dialog.main');
      this._dlg.addEventListener('cancel', (e) => { e.preventDefault(); this.close(); });
      this._dlg.addEventListener('click', (e) => { if (e.target === this._dlg) this.close(); });
      try { this._dlg.showModal(); } catch (e) { this._dlg.setAttribute('open', ''); }
      requestAnimationFrame(() => this._fit(this._dlg));
    }
    $.bsheet.addEventListener('cancel', (e) => { e.preventDefault(); this._closeSheet(); });
    $.bsheet.addEventListener('click', (e) => { if (e.target === $.bsheet) this._closeSheet(); });
    q('.back').addEventListener('click', () => this.close());
    q('.gear').addEventListener('click', () => this._moreInfo(this._config.entity));
    $.power.addEventListener('click', () => this._togglePower());
    $.modebtn.addEventListener('click', () => this._openSheet('mode'));
    $.minus.addEventListener('click', () => this._stepTemp(-1));
    $.plus.addEventListener('click', () => this._stepTemp(1));
    $.slider.addEventListener('input', () => { this._localTemp = Number($.slider.value); this._update(); });
    $.slider.addEventListener('change', () => this._queueTemp(Number($.slider.value), 150));
    q('.fprev').addEventListener('click', () => this._cycleFan(-1));
    q('.fnext').addEventListener('click', () => this._cycleFan(1));
    $.air.addEventListener('click', () => this._openSheet('air'));
    $.sleepchk.addEventListener('change', () => {
      if ($.sleepchk.checked) { $.sleepchk.checked = false; this._openSheet('sleep'); }
      else this._setSleep(0);
    });
    $.jetchk.addEventListener('change', () => this._toggleSwitch('jet_mode', 'jet', $.jetchk.checked));
    $.dispchk.addEventListener('change', () => this._toggleSwitch('display_light', 'disp', $.dispchk.checked));
    r.querySelectorAll('.extralist .row.click').forEach((row) => row.addEventListener('click', () => {
      const k = row.dataset.k;
      this._moreInfo(k === 'climate' ? this._config.entity : this._rel && this._rel[k]);
    }));
    r.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => {
      this._tab = b.dataset.tab;
      r.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x === b));
      r.querySelectorAll('.page').forEach((p) => { p.hidden = p.dataset.page !== this._tab; });
    }));
    q('.bs-backdrop').addEventListener('click', () => this._closeSheet());
  }

  _mode(s) { return this._val('mode', s.state); }
  _target(s) {
    if (this._localTemp !== null) return this._localTemp;
    return lgNum(this._val('temperature', s.attributes.temperature));
  }

  _update() {
    if (!this._built) return;
    const s = this._st(), c = this._config, $ = this.$;
    const a = (s && s.attributes) || {};
    $.title.textContent = c.name || a.friendly_name || c.entity;
    const unavail = !s || s.state === 'unavailable' || s.state === 'unknown';
    this.toggleAttribute('unavail', unavail);
    if (unavail) { $.curv.textContent = lgT('unavailable'); this.toggleAttribute('on', false); $.modelabel.textContent = '–'; return; }

    const mode = this._mode(s);
    const on = mode !== 'off';
    const md = LG_MODES[mode] || { label: mode, flow: '#888' };
    this.toggleAttribute('on', on);
    this.style.setProperty('--flow', on ? md.flow : 'transparent');
    $.curv.textContent = lgTemp(lgCurrentTemp(this._hass, c, s));
    $.modelabel.textContent = on ? md.label : lgT('off');
    $.modebtn.disabled = !on || mode === '__on';

    // doeltemperatuur
    const noTarget = ['fan_only', 'dry'].includes(mode) || a.temperature === undefined;
    $.target.hidden = noTarget;
    if (!noTarget) {
      const min = lgNum(a.min_temp) ?? 16, max = lgNum(a.max_temp) ?? 30, step = lgNum(a.target_temp_step) || 1;
      const t = this._target(s);
      $.tval.textContent = t === null ? '–' : lgTemp(t);
      $.slider.min = min; $.slider.max = max; $.slider.step = step;
      if (t !== null && this._localTemp === null) $.slider.value = t;
      const v = t === null ? min : t;
      $.slider.style.setProperty('--fill', `${((v - min) / (max - min || 1)) * 100}%`);
      $.minus.disabled = t !== null && t <= min;
      $.plus.disabled = t !== null && t >= max;
    }
    $.target.classList.toggle('dim', !on);

    // ventilator + luchtstroom
    const fans = a.fan_modes || [];
    $.fan.hidden = !fans.length;
    $.fval.textContent = LG_FAN[this._val('fan', a.fan_mode)] || this._val('fan', a.fan_mode) || '–';
    const hasAir = !!((a.swing_modes && a.swing_modes.length) || (a.swing_horizontal_modes && a.swing_horizontal_modes.length));
    $.air.hidden = !hasAir;
    $.fan.classList.toggle('solo', !hasAir);
    $.air.classList.toggle('solo', !fans.length);
    $.grid2.hidden = !fans.length && !hasAir;
    const vs = this._val('swing', a.swing_mode), hs = this._val('hswing', a.swing_horizontal_mode);
    let airTxt = '';
    if (vs === 'Swing' && hs === 'Swing') airTxt = lgT('swing');
    else airTxt = [vs && `↕ ${LG_VSWING[vs] || vs}`, hs && `↔ ${LG_HSWING[hs] || hs}`].filter(Boolean).join('  ');
    $.airval.textContent = airTxt;
    $.grid2.classList.toggle('dim', !on);

    // slaaptimer
    const sl = this._rs('sleep_time');
    $.sleepcard.hidden = !sl;
    if (sl) {
      const mins = on ? this._sleepMins() : 0;
      if (!on && this._sleepMins() > 0) this._sleepStore(null);
      $.sleepchk.checked = mins > 0;
      $.sleepv.textContent = mins > 0 ? lgT('sleep_left', { d: lgDur(mins) }) : '';
    }
    $.sleepcard.classList.toggle('dim', !on);

    // extra snel (jet)
    const jet = this._rs('jet_mode');
    $.jet.hidden = !jet || !['heat', 'cool'].includes(mode);
    if (jet) {
      $.jetchk.checked = this._val('jet', jet.state) === 'on';
      $.jetdesc.textContent = mode === 'cool'
        ? lgT('jet_cool')
        : lgT('jet_heat');
    }

    // nuttige functies
    const f = this._rs('filter'), p = this._rs('power'), e = this._rs('energy'), d = this._rs('display_light'), w = this._rs('ssid');
    const show = (k, ok) => { const row = this.shadowRoot.querySelector(`.extralist [data-k="${k}"]`); if (row) row.hidden = !ok; };
    show('filter', !!f); show('power', !!p); show('energy', !!e); show('display_light', !!d); show('ssid', !!w);
    if (f) {
      const pct = lgNum(f.state);
      $.filterp.textContent = pct === null ? '–' : `${Math.round(pct)}%`;
      $.filterp.className = 'rv filterp' + (pct !== null && pct <= 10 ? ' red' : '');
      $.filterv.textContent = pct === null ? '' : pct <= 10 ? lgT('filter_clean') : lgT('filter_life');
    }
    if (p) $.powerv.textContent = lgNum(p.state) === null ? '–' : `${Math.round(lgNum(p.state))} W`;
    if (e) $.energyv.textContent = lgNum(e.state) === null ? '–' : `${lgNum(e.state).toLocaleString(lgLoc(), { maximumFractionDigits: 1 })} kWh`;
    if (d) $.dispchk.checked = this._val('disp', d.state) === 'on';
    if (w) $.ssidv.textContent = w.state;

    if (this._sheet) this._renderSheet();
  }

  /* acties */
  _togglePower() {
    const s = this._st(); if (!s) return;
    const on = this._mode(s) !== 'off';
    if (on) { this._setPending('mode', 'off'); this._call('climate', 'turn_off', { entity_id: this._config.entity }, 'mode'); }
    else { this._setPending('mode', '__on', 20000); this._call('climate', 'turn_on', { entity_id: this._config.entity }, 'mode'); }
    this._update();
  }
  _setMode(m) {
    this._setPending('mode', m);
    this._call('climate', 'set_hvac_mode', { entity_id: this._config.entity, hvac_mode: m }, 'mode');
    this._closeSheet();
    this._update();
  }
  _stepTemp(dir) {
    const s = this._st(); if (!s) return;
    const a = s.attributes, step = lgNum(a.target_temp_step) || 1;
    const min = lgNum(a.min_temp) ?? 16, max = lgNum(a.max_temp) ?? 30;
    const cur = this._target(s) ?? lgNum(a.current_temperature) ?? 21;
    const t = Math.min(max, Math.max(min, Math.round((cur + dir * step) / step) * step));
    this._localTemp = t;
    this._update();
    this._queueTemp(t, 800);
  }
  _queueTemp(t, delay) {
    this._localTemp = t;
    clearTimeout(this._tt);
    this._tt = setTimeout(() => {
      this._setPending('temperature', t);
      this._localTemp = null;
      this._call('climate', 'set_temperature', { entity_id: this._config.entity, temperature: t }, 'temperature');
      this._update();
    }, delay);
  }
  _cycleFan(dir) {
    const s = this._st(); if (!s) return;
    const list = s.attributes.fan_modes || []; if (!list.length) return;
    const cur = this._val('fan', s.attributes.fan_mode);
    let i = list.indexOf(cur); i = i < 0 ? 0 : (i + dir + list.length) % list.length;
    this._setPending('fan', list[i]);
    this._call('climate', 'set_fan_mode', { entity_id: this._config.entity, fan_mode: list[i] }, 'fan');
    this._update();
  }
  _setSwing(kind, v) {
    if (kind === 'v') {
      this._setPending('swing', v);
      this._call('climate', 'set_swing_mode', { entity_id: this._config.entity, swing_mode: v }, 'swing');
    } else {
      this._setPending('hswing', v);
      this._call('climate', 'set_swing_horizontal_mode', { entity_id: this._config.entity, swing_horizontal_mode: v }, 'hswing');
    }
    this._update();
  }
  /* De LG-sensor sleep_time meldt de ingestelde timer niet altijd terug; daarom onthoudt de
     kaart (per browser) zelf de eindtijd. Een waarde > 0 van de sensor gaat altijd voor. */
  _sleepKey() { return `thinq-airco-card:sleep:${this._config.entity}`; }
  _sleepStore(end) {
    try { if (end) localStorage.setItem(this._sleepKey(), String(end)); else localStorage.removeItem(this._sleepKey()); } catch (e) { /* geen opslag */ }
    this._sleepEndMem = end || null;
  }
  _sleepMins() {
    const sl = this._rs('sleep_time');
    const sens = sl ? lgNum(sl.state) || 0 : 0;
    if (sens > 0) return sens;
    let end = this._sleepEndMem;
    if (end === undefined) { try { end = Number(localStorage.getItem(this._sleepKey())) || null; } catch (e) { end = null; } this._sleepEndMem = end; }
    if (!end) return 0;
    const left = Math.ceil((end - Date.now()) / 60000);
    if (left <= 0) { this._sleepStore(null); return 0; }
    return left;
  }
  _setSleep(min) {
    this._sleepStore(min > 0 ? Date.now() + min * 60000 : null);
    this._hass.callService('smartthinq_sensors', 'set_sleep_time', { entity_id: this._config.entity, sleep_time: min })
      .then(() => this._toast(min > 0 ? lgT('sleep_set', { d: lgDur(min) }) : lgT('sleep_off')))
      .catch((err) => { this._sleepStore(null); this._update(); this._toast(lgT('sleep_failed', { e: err && err.message ? err.message : err })); });
    this._closeSheet();
    this._update();
  }
  _toggleSwitch(relKey, pendKey, wantOn) {
    const id = this._rel && this._rel[relKey]; if (!id) return;
    this._setPending(pendKey, wantOn ? 'on' : 'off');
    this._call('switch', wantOn ? 'turn_on' : 'turn_off', { entity_id: id }, pendKey);
    this._update();
  }

  /* onderblad */
  _openSheet(kind) {
    this._sheet = kind; this._sheetSig = null;
    this._renderSheet();
    const d = this.$.bsheet;
    try { if (!d.open) d.showModal(); } catch (e) { d.setAttribute('open', ''); }
    requestAnimationFrame(() => this._fit(d));
  }
  _closeSheet() {
    this._sheet = null; this._sheetSig = null;
    if (!this.$) return;
    try { if (this.$.bsheet.open) this.$.bsheet.close(); } catch (e) { this.$.bsheet.removeAttribute('open'); }
  }
  _renderSheet() {
    const s = this._st(); if (!s) return;
    const a = s.attributes, $ = this.$, kind = this._sheet;
    // alleen opnieuw opbouwen als er voor dit blad echt iets veranderd is; anders valt een klik
    // weg wanneer HA (meerdere keren per seconde) een nieuwe toestand stuurt
    const sig = [kind, this._mode(s), (a.hvac_modes || []).join(), this._val('swing', a.swing_mode),
      this._val('hswing', a.swing_horizontal_mode), (a.swing_modes || []).join(), (a.swing_horizontal_modes || []).join(),
      kind === 'sleep' ? this._sleepMins() : ''].join('|');
    if (sig === this._sheetSig) return;
    this._sheetSig = sig;
    if (kind === 'mode') {
      $.bstitle.textContent = lgT('mode_title');
      const cur = this._mode(s);
      const modes = LG_MODE_ORDER.filter((m) => (a.hvac_modes || []).includes(m));
      $.bsbody.innerHTML = `<div class="opts">${modes.map((m) => `
        <div class="opt ${m === cur ? 'sel' : ''}" data-v="${m}">
          <ha-icon class="chk" icon="mdi:check"></ha-icon>
          <ha-icon class="mi" icon="${LG_MODES[m].icon}" style="color:${LG_MODES[m].color}"></ha-icon>
          <span>${LG_MODES[m].label}</span></div>`).join('')}</div>`;
      $.bsbody.querySelectorAll('.opt').forEach((o) => o.addEventListener('click', () => this._setMode(o.dataset.v)));
    } else if (kind === 'air') {
      $.bstitle.textContent = lgT('airflow');
      const vs = this._val('swing', a.swing_mode), hs = this._val('hswing', a.swing_horizontal_mode);
      const chips = (list, map, cur, k) => `<div class="chips">${list.map((v) => `<button class="chip ${v === cur ? 'sel' : ''}" data-k="${k}" data-v="${lgEsc(v)}">${lgFlowSvg(k, v)}<span>${lgEsc(map[v] || v)}</span></button>`).join('')}</div>`;
      let html = '';
      if (a.swing_modes && a.swing_modes.length) html += `<div class="sub-h">${lgT('updown')}</div>${chips(a.swing_modes, LG_VSWING, vs, 'v')}`;
      if (a.swing_horizontal_modes && a.swing_horizontal_modes.length) html += `<div class="sub-h">${lgT('leftright')}</div>${chips(a.swing_horizontal_modes, LG_HSWING, hs, 'h')}`;
      $.bsbody.innerHTML = html;
      $.bsbody.querySelectorAll('.chip').forEach((b) => b.addEventListener('click', () => this._setSwing(b.dataset.k, b.dataset.v)));
    } else if (kind === 'sleep') {
      $.bstitle.textContent = lgT('sleep');
      const cur = this._sleepMins();
      const opts = (cur > 0 ? [0] : []).concat(LG_SLEEP);
      $.bsbody.innerHTML = `<div class="sub-h">${cur > 0 ? lgT('sleep_now', { d: lgDur(cur) }) : lgT('sleep_after')}</div><div class="opts">${opts.map((m) => `
        <div class="opt" data-v="${m}"><ha-icon class="chk" icon="mdi:check"></ha-icon>
          <span>${m === 0 ? lgT('sleep_off') : lgDur(m)}</span></div>`).join('')}</div>`;
      $.bsbody.querySelectorAll('.opt').forEach((o) => o.addEventListener('click', () => this._setSleep(Number(o.dataset.v))));
    }
  }
}

/* ---------------------------------------------------------------- tegel / kaart */

const LG_TILE_CSS = `
:host { display:block; -webkit-tap-highlight-color: transparent; }
ha-card.tile { background:#222326; border-radius: 26px; padding: 18px 18px 16px; color:#fff; cursor:pointer; min-height: 158px; box-sizing:border-box;
  display:flex; flex-direction:column; justify-content:space-between; border:none; box-shadow:none; transition: background .25s; backdrop-filter:none; -webkit-backdrop-filter:none;
  font-family: var(--ha-font-family-body, Roboto, "Segoe UI", sans-serif); }
ha-card.tile.on { background:#47484d; }
ha-card.tile.unavail { opacity:.5; }
.top { display:flex; justify-content:space-between; align-items:flex-start; }
.u-tile.wall { width: 88px; height: 43px; margin-top: 8px; }
.u-tile.cas { width: 52px; height: 52px; }
.u-tile .air { opacity:0; transition: opacity .3s; }
.on .u-tile .air { opacity:1; }
.pwr { width: 54px; height: 54px; border-radius:50%; border:none; background:#8b8c91; color:#fff; display:grid; place-items:center; cursor:pointer; padding:0; transition: background .2s, color .2s, transform .1s; flex:none; }
.pwr ha-icon { --mdc-icon-size: 30px; }
.pwr:active { transform: scale(.92); }
.on .pwr { background:#eef0f7; color:#5558ea; }
.name { font-size: 21px; font-weight: 500; margin-top: 14px; line-height: 1.2; }
.sub { font-size: 17px; color:#d9dade; margin-top: 2px; }
.mode { font-size: 14px; color:#b4b5bc; margin-top: 3px; display:flex; align-items:center; gap:4px; min-height: 18px; }
.mode ha-icon { --mdc-icon-size: 16px; }
/* achtergrond: glass (zelfde glasstijl als de dashboardkaarten) */
:host([bg=glass]) ha-card.tile { background: rgba(18, 22, 30, 0.72); backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; }
/* achtergrond: theme (volgt het actieve thema) */
:host([bg=theme]) ha-card.tile { background: var(--ha-card-background, var(--card-background-color, #1c1c1c)); border-radius: var(--ha-card-border-radius, 12px);
  border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, transparent)); box-shadow: var(--ha-card-box-shadow, none); color: var(--primary-text-color, #fff); }
:host([bg=theme]) .sub { color: var(--secondary-text-color, #d9dade); }
:host([bg=theme]) .mode { color: var(--secondary-text-color, #b4b5bc); }
/* aan = lichte waas over de gekozen achtergrond */
:host([bg=glass]) ha-card.tile.on, :host([bg=theme]) ha-card.tile.on { background-image: linear-gradient(rgba(255,255,255,.11), rgba(255,255,255,.11)); }
`;

class LgAircoCard extends HTMLElement {
  static getStubConfig(hass) {
    const reg = hass.entities || {};
    const ids = Object.keys(hass.states).filter((id) => id.startsWith('climate.'));
    const lg = ids.find((id) => reg[id] && reg[id].platform === 'smartthinq_sensors');
    return { entity: lg || ids[0] || 'climate.airco', background: 'lg' };
  }

  /* Visual editor (ha-form schema). Labels follow the language of the logged-in user. */
  static getConfigForm() {
    const ha = document.querySelector('home-assistant');
    lgSetLang(ha && ha.hass, null);
    const L = lgLang === 'nl' ? {
      entity: 'Airco (climate-entiteit)', name: 'Naam', layout: 'Weergave', unit: 'Afbeelding', background: 'Achtergrond', language: 'Taal',
      temperature_sensor: 'Andere temperatuursensor (optioneel)', jet_mode: 'Extra snel (Jet mode)', display_light: 'Displayverlichting', sleep_time: 'Slaaptimer-sensor',
      filter: 'Filtersensor', power: 'Stroomverbruik-sensor', energy: 'Energie-sensor', ssid: 'Wifi-sensor',
      tile: 'Tegel (opent bedieningsscherm)', full: 'Volledig bedieningsscherm', wall: 'Wandunit', cassette: 'Plafondcassette',
      lg: 'LG ThinQ (donker)', glass: 'Glas', theme: 'Volgt het thema', auto: 'Automatisch (taal gebruiker)', extra: 'LG-onderdelen (standaard automatisch gevonden)',
      h_temp: 'Bijvoorbeeld een gemiddelde kamertemperatuur als de sensor van de airco afwijkt.',
      h_extra: 'Laat leeg om ze automatisch op hetzelfde apparaat te zoeken.',
    } : {
      entity: 'Air conditioner (climate entity)', name: 'Name', layout: 'Layout', unit: 'Picture', background: 'Background', language: 'Language',
      temperature_sensor: 'Other temperature sensor (optional)', jet_mode: 'Jet mode', display_light: 'Display light', sleep_time: 'Sleep timer sensor',
      filter: 'Filter sensor', power: 'Power sensor', energy: 'Energy sensor', ssid: 'Wi-Fi sensor',
      tile: 'Tile (opens control screen)', full: 'Full control screen', wall: 'Wall unit', cassette: 'Ceiling cassette',
      lg: 'LG ThinQ (dark)', glass: 'Glass', theme: 'Follow theme', auto: 'Automatic (user language)', extra: 'LG features (found automatically)',
      h_temp: "For example an average room temperature when the unit's own sensor is off.",
      h_extra: 'Leave empty to find them automatically on the same device.',
    };
    const sel = (opts) => ({ select: { mode: 'dropdown', options: opts.map((v) => ({ value: v, label: L[v] || v })) } });
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'climate' } } },
        { name: 'name', selector: { text: {} } },
        { type: 'grid', name: '', schema: [
          { name: 'layout', selector: sel(['tile', 'full']) },
          { name: 'unit', selector: sel(['wall', 'cassette']) },
          { name: 'background', selector: sel(['lg', 'glass', 'theme']) },
          { name: 'language', selector: { select: { mode: 'dropdown', options: [{ value: '', label: L.auto }, { value: 'nl', label: 'Nederlands' }, { value: 'en', label: 'English' }] } } },
        ] },
        { name: 'temperature_sensor', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
        { type: 'expandable', name: '', title: L.extra, schema: [
          { name: 'jet_mode', selector: { entity: { domain: 'switch' } } },
          { name: 'display_light', selector: { entity: { domain: 'switch' } } },
          { name: 'sleep_time', selector: { entity: { domain: 'sensor' } } },
          { name: 'filter', selector: { entity: { domain: 'sensor' } } },
          { name: 'power', selector: { entity: { domain: 'sensor' } } },
          { name: 'energy', selector: { entity: { domain: 'sensor' } } },
          { name: 'ssid', selector: { entity: { domain: 'sensor' } } },
        ] },
      ],
      computeLabel: (s) => L[s.name] || s.name,
      computeHelper: (s) => (s.name === 'temperature_sensor' ? L.h_temp : s.name === 'jet_mode' ? L.h_extra : undefined),
    };
  }

  setConfig(config) {
    if (!config || !config.entity || !String(config.entity).startsWith('climate.')) {
      lgSetLang(this._hass, config); throw new Error(lgT('err_entity'));
    }
    this._config = { layout: 'tile', unit: 'wall', ...config };
    this._built = false;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.setAttribute('bg', lgBg(this._config));
    if (this._hass) this.hass = this._hass;
  }

  set hass(h) {
    this._hass = h;
    lgSetLang(h, this._config);
    if (!this._config) return;
    if (!this._built) this._build();
    if (this._config.layout === 'full') { this._inline.hass = h; }
    else this._updateTile();
    if (this._panel) this._panel.hass = h;
  }

  getCardSize() { return this._config && this._config.layout === 'full' ? 14 : 3; }
  getGridOptions() {
    return this._config && this._config.layout === 'full'
      ? { columns: 12, min_columns: 6 }
      : { columns: 6, min_columns: 3 };
  }

  disconnectedCallback() { if (this._panel) { this._panel.remove(); this._panel = null; } }

  _build() {
    this._built = true;
    const r = this.shadowRoot;
    if (this._config.layout === 'full') {
      r.innerHTML = '';
      this._inline = document.createElement('thinq-airco-panel');
      this._inline.config = this._config;
      this._inline.origin = this;
      r.appendChild(this._inline);
      return;
    }
    r.innerHTML = `<style>${LG_TILE_CSS}</style>
      <ha-card class="tile">
        <div class="top"><div class="ic">${lgUnitSvg(this._config.unit, 'tile')}</div>
          <button class="pwr" title="${lgT('power')}"><ha-icon icon="mdi:power"></ha-icon></button></div>
        <div><div class="name"></div><div class="sub"></div><div class="mode"></div></div>
      </ha-card>`;
    this._card = r.querySelector('ha-card');
    this._card.addEventListener('click', () => this._openPanel());
    r.querySelector('.pwr').addEventListener('click', (ev) => { ev.stopPropagation(); this._togglePower(); });
  }

  _modeOf(s) {
    const p = this._pend;
    if (p) { if (Date.now() > p.until || lgPendDone(p.value, s.state)) this._pend = null; else return p.value; }
    return s.state;
  }

  _updateTile() {
    const s = this._hass.states[this._config.entity];
    const r = this.shadowRoot, c = this._config;
    const name = c.name || (s && s.attributes.friendly_name) || c.entity;
    r.querySelector('.name').textContent = name;
    const unavail = !s || s.state === 'unavailable' || s.state === 'unknown';
    this._card.classList.toggle('unavail', unavail);
    if (unavail) { this._card.classList.remove('on'); r.querySelector('.sub').textContent = lgT('unavailable'); r.querySelector('.mode').innerHTML = ''; this._modeHtml = ''; return; }
    const mode = this._modeOf(s);
    const on = mode !== 'off';
    this._card.classList.toggle('on', on);
    this._card.style.setProperty('--air', LG_TILE_AIR[mode] || '#3cc8c0');
    r.querySelector('.sub').textContent = lgTemp(lgCurrentTemp(this._hass, c, s));
    const md = LG_MODES[mode];
    const t = lgNum(s.attributes.temperature);
    const html = on && md
      ? `<ha-icon icon="${md.icon}" style="color:${md.color}"></ha-icon>${md.label}${t !== null && !['fan_only', 'dry', '__on'].includes(mode) ? ` · ${lgEsc(lgTemp(t))}` : ''}`
      : lgT('off');
    if (html !== this._modeHtml) { this._modeHtml = html; r.querySelector('.mode').innerHTML = html; }
  }

  _togglePower() {
    const s = this._hass.states[this._config.entity]; if (!s) return;
    const on = this._modeOf(s) !== 'off';
    this._pend = on ? { value: 'off', until: Date.now() + 9000 } : { value: '__on', until: Date.now() + 20000 };
    this._hass.callService('climate', on ? 'turn_off' : 'turn_on', { entity_id: this._config.entity }).catch((err) => {
      this._pend = null; this._updateTile();
      this.dispatchEvent(new CustomEvent('hass-notification', { detail: { message: lgT('failed', { e: err && err.message ? err.message : err }) }, bubbles: true, composed: true }));
    });
    this._updateTile();
  }

  _openPanel() {
    if (this._panel) return;
    const p = document.createElement('thinq-airco-panel');
    p.setAttribute('dialog', '');
    p.config = this._config;
    p.origin = this;
    document.body.appendChild(p);
    p.hass = this._hass;
    this._panel = p;
  }
  _panelClosed() { this._panel = null; }
}

if (!customElements.get('thinq-airco-panel')) customElements.define('thinq-airco-panel', LgAircoPanel);
if (!customElements.get('thinq-airco-card')) customElements.define('thinq-airco-card', LgAircoCard);
// backwards compatible name used by early versions
if (!customElements.get('lg-airco-card')) customElements.define('lg-airco-card', class extends LgAircoCard {});
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === 'thinq-airco-card')) {
  window.customCards.push({
    type: 'thinq-airco-card',
    name: 'ThinQ Airco Card',
    description: 'LG air conditioner tile and controls in the style of the LG ThinQ app',
    preview: false,
    documentationURL: 'https://github.com/schmeitz/thinq-airco-card',
  });
}
console.info(`%c THINQ-AIRCO-CARD %c ${LG_VERSION} `, 'background:#5558ea;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px', 'background:#2c2d31;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px');
