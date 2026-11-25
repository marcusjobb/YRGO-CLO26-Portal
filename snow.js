/* Snö på portalen, 1 november till 15 januari. Lugn, klickar igenom och stängs av med "minska rörelse". */
(function () {
  var nu = new Date(), m = nu.getMonth() + 1, d = nu.getDate();
  var sasong = m >= 11 || m === 12 || (m === 1 && d <= 15);
  if (!sasong) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var c = document.createElement('canvas');
  c.setAttribute('aria-hidden', 'true');
  c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(c);
  var g = c.getContext('2d'), w, h, flingor = [];

  function storlek() { w = c.width = innerWidth; h = c.height = innerHeight; }
  function ny(slumpaY) {
    return { x: Math.random() * w, y: slumpaY ? Math.random() * h : -10,
             r: 1 + Math.random() * 2.5, v: 0.4 + Math.random() * 0.9,
             fas: Math.random() * 6.28, sv: 0.005 + Math.random() * 0.015 };
  }
  storlek();
  addEventListener('resize', storlek);
  var antal = Math.min(120, Math.round(w * h / 15000));
  for (var i = 0; i < antal; i++) flingor.push(ny(true));

  function rita() {
    g.clearRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,0.85)';
    g.shadowColor = 'rgba(120,150,200,0.6)';
    g.shadowBlur = 3;
    flingor.forEach(function (f, i) {
      f.fas += f.sv;
      f.y += f.v;
      f.x += Math.sin(f.fas) * 0.4;
      if (f.y > h + 10) flingor[i] = ny(false);
      g.beginPath(); g.arc(f.x, f.y, f.r, 0, 6.283); g.fill();
    });
    requestAnimationFrame(rita);
  }
  /* Pausa när fliken är dold, så datorn inte jobbar i onödan */
  var igang = true;
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && !igang) { igang = true; rita(); } else if (document.hidden) igang = false;
  });
  rita();
})();
