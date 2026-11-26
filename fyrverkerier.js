/* Pixlade fyrverkerier på portalen, 30 december till 2 januari.
   Ritas i låg upplösning och skalas upp, så pixlarna syns. Klickar igenom och stängs av med
   "minska rörelse". Test: lägg till ?datum=2026-12-31 i adressen för att se dem utanför säsongen. */
(function () {
  var override = new URLSearchParams(location.search).get('datum');
  var nu = override ? new Date(override + 'T12:00:00') : new Date();
  var m = nu.getMonth() + 1, d = nu.getDate();
  var sasong = (m === 12 && d >= 30) || (m === 1 && d <= 2);
  if (!sasong) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SKALA = 4;
  var c = document.createElement('canvas');
  c.setAttribute('aria-hidden', 'true');
  c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9997;image-rendering:pixelated';
  document.body.appendChild(c);
  var g = c.getContext('2d'), w, h, raketer = [], gnistor = [], nasta = 0;
  var farger = ['#FF4D6D', '#FFD166', '#06D6A0', '#4CC9F0', '#F8F9FA', '#B388FF'];

  function storlek() { w = c.width = Math.ceil(innerWidth / SKALA); h = c.height = Math.ceil(innerHeight / SKALA); }
  storlek();
  addEventListener('resize', storlek);

  function skjut() {
    raketer.push({ x: w * (0.15 + Math.random() * 0.7), y: h, mal: h * (0.15 + Math.random() * 0.4),
                   farg: farger[Math.floor(Math.random() * farger.length)] });
  }
  function spraeng(r) {
    var n = 36;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * 6.283, v = 0.6 + Math.random() * 0.7;
      gnistor.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, liv: 1, farg: r.farg });
    }
  }

  function rita(t) {
    g.clearRect(0, 0, w, h);
    if (t > nasta) { skjut(); nasta = t + 700 + Math.random() * 1400; }
    raketer = raketer.filter(function (r) {
      r.y -= 1.6;
      g.fillStyle = '#FFFFFF'; g.fillRect(Math.round(r.x), Math.round(r.y), 1, 2);
      if (r.y <= r.mal) { spraeng(r); return false; }
      return true;
    });
    gnistor = gnistor.filter(function (s) {
      s.x += s.vx; s.y += s.vy; s.vy += 0.018; s.vx *= 0.985; s.liv -= 0.014;
      if (s.liv <= 0) return false;
      g.globalAlpha = Math.max(0, s.liv); g.fillStyle = s.farg;
      g.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
      return true;
    });
    g.globalAlpha = 1;
  }

  var igang = true;
  function loop(t) { if (!igang) return; rita(t); requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) igang = false; else if (!igang) { igang = true; requestAnimationFrame(loop); }
  });
  requestAnimationFrame(loop);
})();
