/* Test "¿Qué Isapre calza contigo?" de Planiapp.
   Uso: <div data-quiz data-ubicacion="home" data-modo="compacto"></div> y <script src="/quiz.js" defer></script>
   No guarda datos personales. Los puntajes salen de la tabla comparativa publicada (septiembre 2026). */
(function () {
  'use strict';

  var ISAPRES = {
    'banmedica': ['Banmédica', 152, 40], 'colmena': ['Colmena', 151, 32], 'consalud': ['Consalud', 79, 26],
    'cruz-blanca': ['Cruz Blanca', 141, 29], 'esencial': ['Esencial', 187, 40], 'nueva-masvida': ['Nueva Masvida', 98, 29], 'vida-tres': ['Vida Tres', 147, 28]
  };
  var CLAVES = Object.keys(ISAPRES);
  var nombre = function (k) { return ISAPRES[k][0]; };

  // p: { isapre: [puntos, razon opcional] }  cob: chip del formulario que se deja marcado
  var PREGUNTAS = [
    { id: 'zona', t: '¿Dónde vives?', op: [
      { v: 'santiago', l: 'Santiago' },
      { v: 'regiones', l: 'En regiones', p: {
        consalud: [3.5, 'Tiene copago de urgencia en 17 clínicas de regiones y 7 clínicas propias fuera de Santiago'],
        colmena: [1, 'Tiene copago de urgencia en 4 clínicas de regiones'],
        'cruz-blanca': [1, 'Tiene copago de urgencia en Bupa Antofagasta y Bupa Reñaca'],
        'nueva-masvida': [0.5, 'Tiene convenio preferente con clínicas en regiones'] } }
    ] },
    { id: 'clinica', t: '¿En qué clínica te gustaría atenderte?', op: [
      { v: 'redsalud', l: 'RedSalud', p: {
        consalud: [4, 'Las clínicas RedSalud son de su mismo holding'],
        colmena: [1, 'Tiene copago de urgencia en RedSalud Vitacura'], 'cruz-blanca': [-2] } },
      { v: 'smd', l: 'Santa María o Dávila', p: {
        banmedica: [4, 'Santa María y Dávila son de su holding'], 'vida-tres': [4, 'Santa María y Dávila son de su holding'] } },
      { v: 'alemana', l: 'Clínica Alemana', p: {
        esencial: [5, 'Clínica Alemana es de su holding'], 'vida-tres': [1], 'nueva-masvida': [-3] } },
      { v: 'bupa', l: 'Clínicas Bupa', p: {
        'cruz-blanca': [5, 'Las Clínicas Bupa e Integramédica son de su holding'],
        'nueva-masvida': [1, 'Tiene copago de urgencia en Clínicas Bupa'], banmedica: [-2], 'vida-tres': [-2] } },
      { v: 'uc', l: 'UC Christus', p: {
        colmena: [3, 'Su red GES y CAEC es la más amplia e incluye la Red UC'],
        esencial: [0.5, 'Su red GES y CAEC incluye UC Christus'] } },
      { v: 'igual', l: 'Me da lo mismo' }
    ] },
    { id: 'prioridad', t: '¿Qué es lo que más te importa?', sub: 'Elige hasta 2.', multi: 2, op: [
      { v: 'urgencias', l: 'Urgencias con niños', cob: 'Urgencias con copago fijo', p: {
        consalud: [2.5, 'Tiene copago de urgencia en 9 clínicas de Santiago'],
        'cruz-blanca': [1.5, 'Tiene copago de urgencia en 6 clínicas de Santiago'],
        'nueva-masvida': [1.5, 'Tiene copago de urgencia en 6 clínicas de Santiago'],
        colmena: [1, 'Tiene copago de urgencia en 5 clínicas de Santiago'] },
        // En regiones cuentan las urgencias de regiones (la razon ya sale en la pregunta de zona)
        pReg: { consalud: [2.5], colmena: [1], 'cruz-blanca': [1] } },
      { v: 'kine', l: 'Kinesiología', cob: 'Kinesiología', p: {
        consalud: [3, 'Kinesiología sin tope en prestadores preferentes'], esencial: [3, 'Kinesiología sin tope'],
        colmena: [-2], 'nueva-masvida': [-2], 'cruz-blanca': [-2] } },
      { v: 'psico', l: 'Psicología', cob: 'Psicología o psiquiatría', p: {
        colmena: [3, 'Psicología sin tope anual'], 'nueva-masvida': [3, 'Psicología sin tope anual'] } },
      { v: 'grave', l: 'Protección ante algo grave', cob: 'Hospitalización', p: {
        banmedica: [3, 'Sin tope en prótesis, órtesis y quimioterapia'], 'vida-tres': [3, 'Sin tope en prótesis, órtesis y quimioterapia'],
        esencial: [3, 'Sin tope en prótesis y quimioterapia, salvo algunas líneas de planes'],
        colmena: [1, 'Quimioterapia hasta 1.000 UF y la red GES y CAEC más amplia'],
        'nueva-masvida': [-3], 'cruz-blanca': [-2] } },
      { v: 'reembolsos', l: 'Reembolsos rápidos', p: {
        colmena: [3, 'Reembolsa en 24 a 48 horas'], consalud: [2, 'Reembolsa en 48 a 72 horas'], 'nueva-masvida': [2, 'Reembolsa en 48 a 72 horas'],
        banmedica: [1, 'Reembolsa en hasta 5 días'], 'vida-tres': [1, 'Reembolsa en hasta 5 días'], 'cruz-blanca': [-3], esencial: [-2] } },
      { v: 'precio', l: 'Pagar lo menos posible', cob: 'Bajar costo del plan', p: {
        'nueva-masvida': [2, 'Tiene planes accesibles'], colmena: [2, 'Tiene planes de entrada de bajo precio'],
        banmedica: [1, 'Tiene planes de entrada accesibles'],
        'cruz-blanca': [1], esencial: [-2], 'vida-tres': [-1] } }
    ] },
    { id: 'cargas', t: '¿Tienes cargas?', op: [
      { v: 'Sin cargas', l: 'Sin cargas' }, { v: '1 carga', l: '1 carga' },
      { v: '2 cargas', l: '2 cargas' }, { v: '3 cargas', l: '3 cargas' }, { v: '4 o más cargas', l: '4 o más' }
    ] },
    { id: 'renta', t: '¿En qué rango está tu renta imponible?', sub: 'Es solo para orientarte. No la guardamos.', op: [
      { v: 'baja', l: 'Menos de $900.000', p: { 'nueva-masvida': [2], colmena: [2], banmedica: [0.5], esencial: [-3], 'vida-tres': [-2] } },
      { v: 'media', l: '$900.000 a $1.800.000', p: { esencial: [-1], 'vida-tres': [-0.5] } },
      { v: 'alta', l: '$1.800.000 a $3.500.000', p: { banmedica: [1], 'vida-tres': [1], esencial: [1] } },
      { v: 'tope', l: 'Más de $3.500.000', p: {
        'vida-tres': [2, 'Cubre procedimientos sin código Fonasa, algo muy valorado en el segmento alto'],
        esencial: [2, 'Sus planes están pensados para el segmento alto'], banmedica: [1] } }
    ] }
  ];

  var DUENOS = { redsalud: ['consalud'], smd: ['banmedica', 'vida-tres'], alemana: ['esencial'], bupa: ['cruz-blanca'] };

  function ojo(k, r) {
    var reg = r.zona === 'regiones';
    return ({
      consalud: 'La psicología tiene tope anual, y los planes con Las Condes o Alemana salen bastante más caros.',
      banmedica: reg ? 'En regiones no tiene copago de urgencia, ni siquiera en sus clínicas.' : 'La psicología tiene tope anual.',
      'vida-tres': reg ? 'En regiones no tiene copago de urgencia, ni siquiera en sus clínicas.' : 'La psicología tiene tope anual y tiene pocos beneficios para jóvenes.',
      esencial: 'Tiene una sola sucursal y los reembolsos pueden tardar hasta 30 días.',
      colmena: 'La kinesiología tiene un tope muy bajo y sus planes de entrada cubren cerca del 40%.',
      'cruz-blanca': 'Los reembolsos pueden tardar hasta 45 días y la kinesiología no tiene bono.',
      'nueva-masvida': 'Tiene topes bajos en prótesis, quimioterapia y kinesiología, y la diferencia de precio con otras Isapres suele ser mínima.'
    })[k];
  }

  function calcular(r) {
    var pts = {}, raz = {};
    CLAVES.forEach(function (k) { pts[k] = 0; raz[k] = []; });
    PREGUNTAS.forEach(function (q) {
      var vals = q.multi ? (r[q.id] || []) : [r[q.id]];
      vals.forEach(function (v) {
        var op = q.op.filter(function (o) { return o.v === v; })[0];
        if (!op || !op.p) return;
        var tabla = (r.zona === 'regiones' && op.pReg) ? op.pReg : op.p;
        Object.keys(tabla).forEach(function (k) {
          var d = tabla[k];
          pts[k] += d[0];
          if (d[1] && d[0] > 0 && raz[k].every(function (x) { return x[1] !== d[1]; })) raz[k].push([d[0], d[1]]);
        });
      });
    });
    var orden = CLAVES.slice().sort(function (a, b) { return pts[b] - pts[a]; });
    raz = Object.keys(raz).reduce(function (acc, k) {
      acc[k] = raz[k].sort(function (a, b) { return b[0] - a[0]; }).map(function (x) { return x[1]; });
      return acc;
    }, {});
    return { orden: orden, pts: pts, raz: raz };
  }

  var CSS = '' +
    '.qz{--qz-p:var(--purple,#534AB7);--qz-pd:var(--purple-dark,#26215C);--qz-pl:var(--purple-light,#EEEDFE);--qz-b:var(--border,#E7E5F5);--qz-m:var(--text-muted,#6b6b8a);--qz-t:var(--text,#1a1830);font-family:inherit;color:var(--qz-t);}' +
    '.qz *{box-sizing:border-box;}' +
    '.qz-card{background:#fff;border:1px solid var(--qz-b);border-radius:18px;padding:1.5rem 1.6rem;box-shadow:0 14px 34px -24px rgba(38,33,92,.45);}' +
    '.qz-kicker{display:inline-block;font-size:12px;font-weight:600;color:#0F6E56;background:#E1F5EE;border:1px solid #CFEEE3;border-radius:20px;padding:2px 11px;margin-bottom:.6rem;}' +
    '.qz-title{font-family:"Inter",sans-serif;font-size:24px;font-weight:900;color:var(--qz-pd);letter-spacing:-.02em;line-height:1.2;margin:0 0 .35rem;}' +
    '.qz-text{font-size:15px;color:var(--qz-m);line-height:1.55;margin:0 0 1rem;}' +
    '.qz-btn{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;background:var(--qz-p);color:#fff;border:none;border-radius:24px;padding:.8rem 1.5rem;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;text-decoration:none;transition:background .2s,opacity .2s;}' +
    '.qz-btn:hover{background:var(--purple-deep,#3C3489);}' +
    '.qz-btn[disabled]{opacity:.45;cursor:default;}' +
    '.qz.compacto .qz-start{display:flex;align-items:center;justify-content:space-between;gap:1.25rem;flex-wrap:wrap;}' +
    '.qz.compacto .qz-start .qz-text{margin:0;}' +
    '.qz.compacto .qz-start>div{flex:1;min-width:230px;}' +
    '.qz-top{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:.55rem;}' +
    '.qz-back{background:none;border:none;color:var(--qz-p);font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;padding:.25rem 0;}' +
    '.qz-back[hidden]{display:inline-block!important;visibility:hidden;}' +
    '.qz-prog{font-size:12.5px;color:var(--qz-m);}' +
    '.qz-bar{height:6px;background:var(--qz-pl);border-radius:6px;overflow:hidden;margin-bottom:1.1rem;}' +
    '.qz-bar span{display:block;height:100%;background:var(--qz-p);border-radius:6px;transition:width .3s;}' +
    '.qz-q{font-family:"Inter",sans-serif;font-size:21px;font-weight:800;color:var(--qz-pd);line-height:1.3;margin:0 0 .25rem;}' +
    '.qz-sub{font-size:13.5px;color:var(--qz-m);margin:0 0 .2rem;}' +
    '.qz-ops{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-top:.9rem;}' +
    '.qz-op{min-height:52px;text-align:left;background:#fff;border:1.5px solid var(--qz-b);border-radius:14px;padding:.75rem 1rem;font-family:inherit;font-size:15px;font-weight:500;color:var(--qz-t);cursor:pointer;transition:border-color .15s,background .15s;}' +
    '.qz-op:hover{border-color:var(--purple-mid,#7F77DD);}' +
    '.qz-op.on{border-color:var(--qz-p);background:var(--qz-pl);color:var(--qz-pd);font-weight:600;}' +
    '.qz-op.on::after{content:" ✓";color:var(--qz-p);}' +
    '.qz-next{margin-top:1rem;}' +
    '.qz-main{border:1.5px solid var(--qz-p);border-radius:16px;padding:1.1rem 1.2rem;background:#FCFBFF;margin-top:.2rem;}' +
    '.qz-main-h{display:flex;align-items:center;gap:.9rem;margin-bottom:.7rem;}' +
    '.qz-main-h img{flex-shrink:0;}' +
    '.qz-main-t{font-family:"Inter",sans-serif;font-size:22px;font-weight:900;color:var(--qz-pd);line-height:1.15;}' +
    '.qz-main-s{font-size:13px;color:var(--qz-m);}' +
    '.qz-why{list-style:none;margin:0 0 .7rem;padding:0;}' +
    '.qz-why li{position:relative;padding:.3rem 0 .3rem 1.6rem;font-size:14.5px;line-height:1.5;}' +
    '.qz-why li::before{content:"✓";position:absolute;left:0;top:.35rem;width:18px;height:18px;border-radius:50%;background:#1D9E75;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;}' +
    '.qz-ojo{font-size:13.5px;line-height:1.5;background:#FBECEC;color:#7A2E33;border-radius:10px;padding:.55rem .75rem;margin:0 0 .7rem;}' +
    '.qz-link{font-size:14px;font-weight:600;color:var(--qz-p);text-decoration:none;}' +
    '.qz-alt{font-size:14px;line-height:1.5;color:var(--qz-t);margin:.9rem 0 0;padding:.75rem 1rem;border:1px solid var(--qz-b);border-radius:12px;}' +
    '.qz-alt a{font-weight:700;color:var(--qz-p);text-decoration:none;}' +
    '.qz-nota{font-size:13.5px;line-height:1.5;color:var(--qz-m);margin:.7rem 0 0;}' +
    '.qz-cta{background:linear-gradient(160deg,#534AB7 0%,#3C3489 100%);border-radius:16px;padding:1.2rem 1.25rem;margin-top:1rem;color:#fff;text-align:center;}' +
    '.qz-cta-t{font-family:"Inter",sans-serif;font-size:19px;font-weight:800;margin:0 0 .3rem;}' +
    '.qz-cta p{font-size:14px;line-height:1.55;color:rgba(255,255,255,.88);margin:0 auto .9rem;max-width:520px;}' +
    '.qz-cta .qz-btn{background:#fff;color:var(--purple-deep,#3C3489);}' +
    '.qz-cta .qz-btn:hover{background:var(--qz-pl);}' +
    '.qz-reset{display:block;margin:.8rem auto 0;background:none;border:none;color:var(--qz-p);font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;}' +
    '.qz-aviso{font-size:12px;line-height:1.5;color:var(--qz-m);margin:.7rem 0 0;text-align:center;}' +
    '@media (max-width:680px){.qz-card{padding:1.2rem 1.05rem;border-radius:16px;}.qz-title{font-size:20px;}.qz-q{font-size:18.5px;}.qz-ops{grid-template-columns:1fr;}.qz-btn{width:100%;}.qz-next{width:100%;}.qz-main-t{font-size:20px;}}';

  function ga(evento, params) { if (typeof window.gtag === 'function') window.gtag('event', evento, params); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function logo(k, area) {
    var d = ISAPRES[k], alto = Math.sqrt(area * d[2] / d[1]);
    return '<img src="/logos/mini/' + k + '.png" alt="" width="' + Math.round(alto * d[1] / d[2]) + '" height="' + Math.round(alto) + '">';
  }

  function montar(el) {
    var ubicacion = el.getAttribute('data-ubicacion') || 'sin_ubicacion';
    var modo = el.getAttribute('data-modo') || 'completo';
    var paso = -1, resp = {}, empezado = false, avanzando = false;
    el.classList.add('qz', modo);
    el.setAttribute('aria-live', 'polite');

    function subir() {
      var top = el.getBoundingClientRect().top;
      if (top < 70) window.scrollTo({ top: window.pageYOffset + top - 90, behavior: 'smooth' });
    }

    function pintar() {
      var h;
      if (paso === -1) {
        h = '<div class="qz-card"><div class="qz-start"><div><span class="qz-kicker">Test de 1 minuto</span>' +
          '<div class="qz-title">¿Qué Isapre calza contigo?</div>' +
          '<p class="qz-text">Responde 5 preguntas y te mostramos las Isapres que mejor calzan con tu perfil. Sin dejar tus datos.</p></div>' +
          '<button type="button" class="qz-btn qz-empezar">Empezar el test →</button></div></div>';
      } else if (paso < PREGUNTAS.length) {
        var q = PREGUNTAS[paso], sel = resp[q.id];
        h = '<div class="qz-card"><div class="qz-top"><button type="button" class="qz-back"' + (paso === 0 ? ' hidden' : '') + '>← Atrás</button>' +
          '<span class="qz-prog">Pregunta ' + (paso + 1) + ' de ' + PREGUNTAS.length + '</span></div>' +
          '<div class="qz-bar"><span style="width:' + Math.round((paso / PREGUNTAS.length) * 100) + '%"></span></div>' +
          '<div class="qz-q">' + q.t + '</div>' + (q.sub ? '<p class="qz-sub">' + q.sub + '</p>' : '') +
          '<div class="qz-ops" role="group" aria-label="' + esc(q.t) + '">' +
          q.op.map(function (o) {
            var on = q.multi ? (sel || []).indexOf(o.v) > -1 : sel === o.v;
            return '<button type="button" class="qz-op' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-v="' + esc(o.v) + '">' + o.l + '</button>';
          }).join('') + '</div>' +
          (q.multi ? '<button type="button" class="qz-btn qz-next"' + ((sel || []).length ? '' : ' disabled') + '>Continuar →</button>' : '') +
          '</div>';
      } else {
        h = resultado();
      }
      el.innerHTML = h;
    }

    function resultado() {
      var c = calcular(resp), a = c.orden[0], b = c.orden[1];
      var why = c.raz[a].slice(0, 3);
      if (!why.length) why = ['Es la que mejor equilibra lo que respondiste'];
      var altRazon = c.raz[b][0] ? ' ' + c.raz[b][0] + '.' : '';
      var nota = '';
      var duenos = DUENOS[resp.clinica];
      if (duenos && duenos.indexOf(a) === -1 && duenos.indexOf(b) === -1) {
        var op = PREGUNTAS[1].op.filter(function (o) { return o.v === resp.clinica; })[0];
        nota = '<p class="qz-nota">Si ' + op.l + ' es imprescindible para ti, mira también ' +
          duenos.map(function (k) { return '<a class="qz-link" href="/isapre-' + k + '">' + nombre(k) + '</a>'; }).join(' y ') +
          (duenos.length > 1 ? ': son' : ': es') + ' de su mismo holding.</p>';
      }
      return '<div class="qz-card"><span class="qz-kicker">Tu resultado</span>' +
        '<div class="qz-main"><div class="qz-main-h">' + logo(a, 2400) + '<div><div class="qz-main-t">' + nombre(a) + '</div>' +
        '<div class="qz-main-s">Es la que mejor calza con tu perfil</div></div></div>' +
        '<ul class="qz-why">' + why.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
        '<p class="qz-ojo"><strong>Ojo:</strong> ' + (function (s) { return s.charAt(0).toLowerCase() + s.slice(1); })(ojo(a, resp)) + '</p>' +
        '<a class="qz-link" href="/isapre-' + a + '">Ver la ficha completa de ' + nombre(a) + ' →</a></div>' +
        '<p class="qz-alt">También te puede servir: <a href="/isapre-' + b + '">' + nombre(b) + '</a>.' + altRazon + '</p>' + nota +
        '<div class="qz-cta"><div class="qz-cta-t">¿Quieres que te armemos el plan?</div>' +
        '<p>Con lo que respondiste, tu ejecutivo prepara propuestas de ' + nombre(a) + ' y de otras opciones que calcen contigo. Gratis y sin compromiso.</p>' +
        '<button type="button" class="qz-btn qz-go">Quiero mi asesoría gratis →</button></div>' +
        '<button type="button" class="qz-reset">Volver a hacer el test</button>' +
        '<p class="qz-aviso">Orientación referencial según la oferta vigente a septiembre de 2026. No reemplaza una cotización: coberturas y precios dependen de cada plan, de tu edad y de tu declaración de salud.</p></div>';
    }

    function irAlFormulario() {
      var c = calcular(resp), a = c.orden[0], b = c.orden[1];
      var cobs = (resp.prioridad || []).map(function (v) {
        return PREGUNTAS[2].op.filter(function (o) { return o.v === v; })[0].cob;
      }).filter(Boolean);
      var datos = { cob: cobs.join('|'), cargas: resp.cargas || '', sug: nombre(a) + ', ' + nombre(b) };
      ga('quiz_cta', { resultado: nombre(a), ubicacion: ubicacion });
      var destino = document.getElementById('opciones');
      if (destino && typeof window.prefillDesdeTest === 'function') {
        window.prefillDesdeTest(datos);
        window.scrollTo({ top: window.pageYOffset + destino.getBoundingClientRect().top - 80, behavior: 'smooth' });
      } else {
        var qs = Object.keys(datos).filter(function (k) { return datos[k]; })
          .map(function (k) { return k + '=' + encodeURIComponent(datos[k]); }).join('&');
        window.location.href = '/?' + qs + '#opciones';
      }
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t || !el.contains(t)) return;
      if (t.classList.contains('qz-empezar')) {
        paso = 0; if (!empezado) { empezado = true; ga('quiz_start', { ubicacion: ubicacion }); }
        pintar(); subir(); return;
      }
      if (t.classList.contains('qz-back')) { paso = Math.max(0, paso - 1); pintar(); return; }
      if (t.classList.contains('qz-reset')) { paso = 0; resp = {}; pintar(); subir(); return; }
      if (t.classList.contains('qz-go')) { irAlFormulario(); return; }
      if (t.classList.contains('qz-next')) {
        paso++; if (paso === PREGUNTAS.length) ga('quiz_complete', { resultado: nombre(calcular(resp).orden[0]), ubicacion: ubicacion });
        pintar(); subir(); return;
      }
      if (t.classList.contains('qz-op')) {
        var q = PREGUNTAS[paso], v = t.getAttribute('data-v');
        if (q.multi) {
          var lista = (resp[q.id] || []).slice(), i = lista.indexOf(v);
          if (i > -1) lista.splice(i, 1); else { lista.push(v); if (lista.length > q.multi) lista.shift(); }
          resp[q.id] = lista; pintar();
        } else {
          if (avanzando) return;
          avanzando = true; resp[q.id] = v; t.classList.add('on');
          setTimeout(function () {
            avanzando = false; paso++;
            if (paso === PREGUNTAS.length) ga('quiz_complete', { resultado: nombre(calcular(resp).orden[0]), ubicacion: ubicacion });
            pintar(); subir();
          }, 160);
        }
      }
    });

    pintar();
  }

  function iniciar() {
    if (!document.getElementById('qz-css')) {
      var s = document.createElement('style'); s.id = 'qz-css'; s.textContent = CSS; document.head.appendChild(s);
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-quiz]'), function (el) {
      if (!el.getAttribute('data-quiz-listo')) { el.setAttribute('data-quiz-listo', '1'); montar(el); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();

  window.planiappQuiz = { calcular: calcular, PREGUNTAS: PREGUNTAS };
})();
