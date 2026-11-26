/* Julstämning på portalen, 1 december till 6 januari: en ljusslinga längs överkanten.
   Lugn, klickar igenom och stängs av med "minska rörelse" (då står lamporna stilla).
   Test: lägg till ?datum=2026-12-24 i adressen för att se den utanför säsongen. */
(function () {
  var override = new URLSearchParams(location.search).get('datum');
  var nu = override ? new Date(override + 'T12:00:00') : new Date();
  var m = nu.getMonth() + 1, d = nu.getDate();
  var sasong = m === 12 || (m === 1 && d <= 6);
  if (!sasong) return;
  var stilla = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var c = document.createElement('canvas');
  c.setAttribute('aria-hidden', 'true');
  c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:60px;pointer-events:none;z-index:9998';
  document.body.appendChild(c);
  var g = c.getContext('2d'), w, h = 60, lampor = [];
  var farger = ['#E5484D', '#F5C542', '#3FB950', '#4C8DF6'];

  function storlek() {
    w = c.width = innerWidth; c.height = h;
    lampor = [];
    var steg = 46, n = Math.ceil(w / steg) + 1;
    for (var i = 0; i < n; i++) {
      var x = i * steg;
      lampor.push({ x: x, y: 8 + 14 * Math.sin((x / w) * Math.PI * 4) * 0.5 + 6, farg: farger[i % 4], fas: i * 1.3 });
    }
  }

  function rita(t) {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(40,60,40,0.7)'; g.lineWidth = 2;
    g.beginPath();
    lampor.forEach(function (l, i) { i ? g.lineTo(l.x, l.y) : g.moveTo(l.x, l.y); });
    g.stroke();
    lampor.forEach(function (l) {
      var glod = stilla ? 1 : 0.55 + 0.45 * Math.sin(t / 600 + l.fas);
      g.globalAlpha = 0.25 * glod; g.fillStyle = l.farg;
      g.beginPath(); g.arc(l.x, l.y + 8, 11, 0, 6.283); g.fill();
      g.globalAlpha = 0.6 + 0.4 * glod; g.beginPath(); g.ellipse(l.x, l.y + 7, 4, 6, 0, 0, 6.283); g.fill();
    });
    g.globalAlpha = 1;
  }

  storlek();
  addEventListener('resize', function () { storlek(); if (stilla) rita(0); });
  if (stilla) { rita(0); return; }
  var igang = true;
  function loop(t) { if (!igang) return; rita(t); requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) igang = false; else if (!igang) { igang = true; requestAnimationFrame(loop); }
  });
  requestAnimationFrame(loop);
})();
