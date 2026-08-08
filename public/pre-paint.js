/* Superbyte UI v4 — pre-paint bootstrap.
   Loaded synchronously in <head> (non-module). Reads saved preferences from
   localStorage (same keys as v1) and applies theme + layout before first paint
   so there is no flash and no scroll-jump on refresh. */
(function () {
  try {
    var L = localStorage, m = {};
    m.mode = L.getItem('grid_admin_theme');
    m.accent = L.getItem('grid_admin_accent');
    m.base = L.getItem('grid_admin_basetheme');
    m.font = L.getItem('grid_admin_font');
    m.radius = L.getItem('grid_admin_radius');
    m.fs = L.getItem('grid_admin_fontsize');
    m.compact = L.getItem('grid_admin_compact');
    m.boxed = L.getItem('grid_admin_boxed');

    var THEMES = {"indigo":{"name":"Brand","base":"#2961fd","hi":"#5b8bfc","rgb":"41,97,253"},"violet":{"name":"Violet","base":"#8b5cf6","hi":"#a78bfa","rgb":"139,92,246"},"fuchsia":{"name":"Fuchsia","base":"#d946ef","hi":"#e879f9","rgb":"217,70,239"},"pink":{"name":"Pink","base":"#ec4899","hi":"#f472b6","rgb":"236,72,153"},"rose":{"name":"Rose","base":"#f43f5e","hi":"#fb7185","rgb":"244,63,94"},"red":{"name":"Red","base":"#ef4444","hi":"#f87171","rgb":"239,68,68"},"orange":{"name":"Orange","base":"#f97316","hi":"#fb923c","rgb":"249,115,22"},"amber":{"name":"Amber","base":"#f59e0b","hi":"#fbbf24","rgb":"245,158,11"},"yellow":{"name":"Yellow","base":"#eab308","hi":"#facc15","rgb":"234,179,8"},"lime":{"name":"Lime","base":"#84cc16","hi":"#a3e635","rgb":"132,204,22"},"green":{"name":"Green","base":"#22c55e","hi":"#4ade80","rgb":"34,197,94"},"emerald":{"name":"Emerald","base":"#10b981","hi":"#34d399","rgb":"16,185,129"},"teal":{"name":"Teal","base":"#14b8a6","hi":"#2dd4bf","rgb":"20,184,166"},"cyan":{"name":"Cyan","base":"#06b6d4","hi":"#22d3ee","rgb":"6,182,212"},"sky":{"name":"Sky","base":"#0ea5e9","hi":"#38bdf8","rgb":"14,165,233"},"blue":{"name":"Blue","base":"#3b82f6","hi":"#60a5fa","rgb":"59,130,246"},"purple":{"name":"Purple","base":"#a855f7","hi":"#c084fc","rgb":"168,85,247"},"white":{"name":"White","base":"#ffffff","hi":"#e5e7eb","rgb":"255,255,255"},"dark":{"name":"Dark","base":"#111827","hi":"#1f2937","rgb":"17,24,39"}};
    var FONTS = {"ubuntu":{"name":"Ubuntu","stack":"'Ubuntu', sans-serif"},"inter":{"name":"Inter","stack":"'Inter', 'Ubuntu', sans-serif"},"notosans":{"name":"Noto Sans","stack":"'Noto Sans', 'Ubuntu', sans-serif"},"nunitosans":{"name":"Nunito Sans","stack":"'Nunito Sans', 'Ubuntu', sans-serif"},"figtree":{"name":"Figtree","stack":"'Figtree', 'Ubuntu', sans-serif"},"roboto":{"name":"Roboto","stack":"'Roboto', 'Ubuntu', sans-serif"},"raleway":{"name":"Raleway","stack":"'Raleway', 'Ubuntu', sans-serif"},"dmsans":{"name":"DM Sans","stack":"'DM Sans', 'Ubuntu', sans-serif"},"publicsans":{"name":"Public Sans","stack":"'Public Sans', 'Ubuntu', sans-serif"},"outfit":{"name":"Outfit","stack":"'Outfit', 'Ubuntu', sans-serif"},"oxanium":{"name":"Oxanium","stack":"'Oxanium', 'Ubuntu', sans-serif"},"manrope":{"name":"Manrope","stack":"'Manrope', 'Ubuntu', sans-serif"},"spacegrotesk":{"name":"Space Grotesk","stack":"'Space Grotesk', 'Ubuntu', sans-serif"},"montserrat":{"name":"Montserrat","stack":"'Montserrat', 'Ubuntu', sans-serif"},"ibmplexsans":{"name":"IBM Plex Sans","stack":"'IBM Plex Sans', 'Ubuntu', sans-serif"},"sourcesans3":{"name":"Source Sans 3","stack":"'Source Sans 3', 'Ubuntu', sans-serif"},"instrumentsans":{"name":"Instrument Sans","stack":"'Instrument Sans', 'Ubuntu', sans-serif"}};

    var R = { '4px': ['4px', '2px'], '8px': ['8px', '4px'], '14px': ['14px', '8px'] };
    function accentText(base) {
      var c = base.replace('#', '');
      var r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.72 ? '#111827' : '#ffffff';
    }
    var mode = (m.mode === 'light' || m.mode === 'dark') ? m.mode : 'dark';
    var html = document.documentElement;
    html.classList.add(mode === 'light' ? 'light' : 'dark');

    var hl = html.style;
    if (m.fs) hl.fontSize = Math.min(17, Math.max(13, parseInt(m.fs, 10))) + 'px';
    if (m.font && FONTS[m.font]) hl.setProperty('--sans', FONTS[m.font].stack);
    if (m.accent && THEMES[m.accent]) {
      var t = THEMES[m.accent];
      hl.setProperty('--accent', t.base);
      hl.setProperty('--accent-h', t.hi);
      hl.setProperty('--accent-text', accentText(t.base));
      hl.setProperty('--accent-rgb', t.rgb);
    }
    if (m.radius && R[m.radius]) {
      var p = R[m.radius];
      hl.setProperty('--radius', p[0]);
      hl.setProperty('--radius-sm', p[1]);
    }
    if (m.base && m.base !== 'neutral') html.setAttribute('data-base-theme', m.base);

    function applyBody() {
      var b = document.body, bs = b.style;
      if (m.base && m.base !== 'neutral') b.setAttribute('data-base-theme', m.base);
      var nav = null, width = null, dens = null;
      var cPage = /layout-(vertical|horizontal|mini-sidebar)(?:-(boxed|contained))?\.html$/.exec(location.pathname);
      var wPage = /layout-(boxed|fluid|contained)\.html$/.exec(location.pathname);
      var dPage = /layout-(condensed|comfy)\.html$/.exec(location.pathname);
      if (cPage) { nav = cPage[1]; width = cPage[2] || 'fluid'; }
      if (wPage) width = wPage[1];
      if (dPage) dens = dPage[1];
      if (!nav) nav = L.getItem('grid_admin_layout_mode');
      if (!width) width = L.getItem('grid_admin_width_mode') || (m.boxed === '1' ? 'boxed' : 'fluid');
      if (!dens) dens = (nav === 'condensed' || nav === 'comfy') ? nav : (m.compact === '1' ? 'condensed' : 'comfy');
      var mobile = window.matchMedia('(max-width: 991.98px)').matches;
      if (nav === 'horizontal') b.classList.add('layout-horizontal');
      else if (nav === 'mini-sidebar' && !mobile) b.classList.add('layout-mini-sidebar');
      if (width === 'boxed') b.classList.add('layout-boxed');
      else if (width === 'contained') b.classList.add('layout-contained');
      else b.classList.add('layout-fluid');
      b.classList.toggle('layout-compact', dens === 'condensed');
      var light = mode === 'light';
      if (m.accent && THEMES[m.accent]) {
        var t = THEMES[m.accent];
        bs.setProperty('--accent', t.base);
        bs.setProperty('--accent-h', t.hi);
        bs.setProperty('--accent-text', accentText(t.base));
        bs.setProperty('--accent-bg', 'rgba(' + t.rgb + ',' + (light ? '.08' : '.12') + ')');
        bs.setProperty('--accent-rgb', t.rgb);
      }
      if (m.font && FONTS[m.font]) bs.setProperty('--sans', FONTS[m.font].stack);
      if (m.radius && R[m.radius]) {
        var q = R[m.radius];
        bs.setProperty('--radius', q[0]);
        bs.setProperty('--radius-sm', q[1]);
      }
    }
    if (document.body) applyBody();
    else {
      var mo = new MutationObserver(function () { if (document.body) { mo.disconnect(); applyBody(); } });
      mo.observe(document.documentElement, { childList: true });
    }
  } catch (e) {}
})();
