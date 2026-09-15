/* Test "¿Qué Isapre calza contigo?" de Planiapp.
   Uso: <div data-quiz data-ubicacion="home" data-modo="compacto"></div> y <script src="/quiz.js" defer></script>
   No guarda datos personales. Datos: fichas y tabla comparativa publicadas (septiembre 2026). */
(function () {
  'use strict';

  var ISAPRES = {
    'banmedica': ['Banmédica', 152, 40], 'colmena': ['Colmena', 151, 32], 'consalud': ['Consalud', 79, 26],
    'cruz-blanca': ['Cruz Blanca', 141, 29], 'esencial': ['Esencial', 187, 40], 'nueva-masvida': ['Nueva Masvida', 98, 29], 'vida-tres': ['Vida Tres', 147, 28]
  };
  var CLAVES = Object.keys(ISAPRES);
  var nombre = function (k) { return ISAPRES[k][0]; };

  // Beneficios por clinica. D: mismo holding, U: copago de urgencia, UA: copago de urgencia en algunos planes,
  // PR: convenio preferente, G: red GES y CAEC, SP: sin convenio preferente, SU: sin copago de urgencia
  var BEN = {
    D: [5.5, 'Es de su mismo holding'], U: [2.5, 'Tiene copago de urgencia'], UA: [1, 'Tiene copago de urgencia en algunos planes'],
    PR: [1, 'Tiene convenio preferente'], G: [1, 'Está en su red GES y CAEC'],
    SP: [-4, 'No tiene convenio preferente'], SU: [0, 'No tiene copago de urgencia'],
    SC: [1.5, 'Cubre procedimientos sin código Fonasa, muy usados en clínicas como esta']
  };
  var TODAS_PR = { banmedica: ['PR'], 'vida-tres': ['PR'], colmena: ['PR'], consalud: ['PR'], 'cruz-blanca': ['PR'], esencial: ['PR'], 'nueva-masvida': ['PR'] };
  function stgo(extra) { var o = {}; CLAVES.forEach(function (k) { o[k] = extra[k] || TODAS_PR[k]; }); return o; }

  var CLINICAS = [
    { id: 'redsalud-stgo', n: 'RedSalud Santiago o Providencia', z: 's', i: stgo({ consalud: ['D', 'U', 'PR', 'G'], 'cruz-blanca': ['SP'] }) },
    { id: 'redsalud-vitacura', n: 'RedSalud Vitacura', z: 's', i: stgo({ consalud: ['D', 'U', 'PR', 'G'], colmena: ['U', 'PR'] }) },
    { id: 'santa-maria', n: 'Clínica Santa María', z: 's', i: stgo({ banmedica: ['D', 'U', 'PR', 'G'], 'vida-tres': ['D', 'U', 'PR', 'G', 'SC'], consalud: ['U', 'PR'], 'cruz-blanca': ['U', 'PR'], esencial: ['U', 'PR'], 'nueva-masvida': ['U', 'PR'] }) },
    { id: 'davila', n: 'Clínica Dávila o Dávila Vespucio', z: 's', i: stgo({ banmedica: ['D', 'U', 'PR', 'G'], 'vida-tres': ['D', 'U', 'PR', 'G'], consalud: ['U', 'PR'], colmena: ['U', 'PR'], 'cruz-blanca': ['U', 'PR'], 'nueva-masvida': ['U', 'PR'] }) },
    { id: 'alemana', n: 'Clínica Alemana', z: 's', i: stgo({ esencial: ['D', 'U', 'PR', 'G'], 'vida-tres': ['PR', 'SC'], 'nueva-masvida': ['SP'] }), x: { 'nueva-masvida': 'Solo tiene libre elección, con topes muy bajos' } },
    { id: 'las-condes', n: 'Clínica Las Condes', z: 's', i: stgo({ consalud: ['U', 'PR'], 'cruz-blanca': ['U', 'PR'], 'nueva-masvida': ['U', 'PR'], banmedica: ['UA', 'PR'], 'vida-tres': ['UA', 'PR', 'SC'], esencial: ['SP'] }) },
    { id: 'uc-christus', n: 'UC Christus', z: 's', i: stgo({ colmena: ['U', 'PR', 'G'], consalud: ['U', 'PR'], 'cruz-blanca': ['U', 'PR'], 'nueva-masvida': ['U', 'PR'], esencial: ['PR', 'G'] }) },
    { id: 'bupa-stgo', n: 'Clínica Bupa Santiago', z: 's', i: stgo({ 'cruz-blanca': ['D', 'U', 'PR', 'G'], 'nueva-masvida': ['U', 'PR'], banmedica: ['SP'], 'vida-tres': ['SP'] }) },
    { id: 'indisa', n: 'Clínica Indisa', z: 's', i: stgo({ colmena: ['U', 'PR'], consalud: ['U', 'PR'], 'cruz-blanca': ['U', 'PR'], esencial: ['U', 'PR'], 'nueva-masvida': ['U', 'PR'] }) },
    { id: 'meds', n: 'Clínica Meds', z: 's', i: stgo({ colmena: ['U', 'PR'], consalud: ['U', 'PR'] }) },
    { id: 'uandes', n: 'Clínica Universidad de los Andes', z: 's', i: stgo({ consalud: ['U', 'PR'], 'vida-tres': ['UA', 'PR', 'G', 'SC'], banmedica: ['UA', 'PR'] }) },

    { id: 'san-jose-arica', n: 'Clínica San José', c: 'Arica', z: 'r', i: { consalud: ['U', 'PR'], colmena: ['U'] } },
    { id: 'redsalud-iquique', n: 'RedSalud Iquique', c: 'Iquique', z: 'r', i: { consalud: ['D', 'U', 'PR'] } },
    { id: 'andes-calama', n: 'Andes Salud Calama', c: 'Calama', z: 'r', i: { consalud: ['U', 'PR'] } },
    { id: 'bupa-antofagasta', n: 'Clínica Bupa Antofagasta', c: 'Antofagasta', z: 'r', i: { 'cruz-blanca': ['D', 'U', 'PR'], consalud: ['U', 'PR'] } },
    { id: 'achs-la-portada', n: 'ACHS La Portada', c: 'Antofagasta', z: 'r', i: { consalud: ['U', 'PR'], colmena: ['U'] } },
    { id: 'achs-atacama', n: 'ACHS Atacama', c: 'Copiapó', z: 'r', i: { colmena: ['U'], consalud: ['PR'] } },
    { id: 'redsalud-elqui', n: 'RedSalud Elqui', c: 'La Serena', z: 'r', i: { consalud: ['D', 'U', 'PR'] } },
    { id: 'bupa-renaca', n: 'Clínica Bupa Reñaca', c: 'Viña del Mar', z: 'r', i: { 'cruz-blanca': ['D', 'U', 'PR'], consalud: ['U', 'PR'] } },
    { id: 'ciudad-del-mar', n: 'Clínica Ciudad del Mar', c: 'Viña del Mar', z: 'r', i: { banmedica: ['D', 'PR', 'SU'], 'vida-tres': ['D', 'PR', 'SU'], consalud: ['PR'] } },
    { id: 'redsalud-valparaiso', n: 'RedSalud Valparaíso', c: 'Valparaíso', z: 'r', i: { consalud: ['D', 'U', 'PR'] } },
    { id: 'redsalud-rancagua', n: 'RedSalud Rancagua', c: 'Rancagua', z: 'r', i: { consalud: ['D', 'U', 'PR'] } },
    { id: 'fusat', n: 'Clínica Fusat', c: 'Rancagua', z: 'r', i: { consalud: ['U', 'PR'] } },
    { id: 'lircay', n: 'Clínica Lircay', c: 'Talca', z: 'r', i: { consalud: ['U', 'PR'], colmena: ['U'] } },
    { id: 'sanatorio-aleman', n: 'Sanatorio Alemán', c: 'Concepción', z: 'r', i: { consalud: ['D', 'U', 'PR'] } },
    { id: 'andes-concepcion', n: 'Andes Salud Concepción', c: 'Concepción', z: 'r', i: { consalud: ['U', 'PR'] } },
    { id: 'biobio', n: 'Clínica Biobío', c: 'Concepción', z: 'r', i: { banmedica: ['D', 'PR', 'SU'], 'vida-tres': ['D', 'PR', 'SU'], consalud: ['PR'] } },
    { id: 'redsalud-mayor', n: 'RedSalud Mayor', c: 'Temuco', z: 'r', i: { consalud: ['D', 'U', 'PR'] } },
    { id: 'alemana-temuco', n: 'Clínica Alemana de Temuco', c: 'Temuco', z: 'r', i: { esencial: ['D', 'PR', 'SU'], consalud: ['PR'] } },
    { id: 'alemana-valdivia', n: 'Clínica Alemana de Valdivia', c: 'Valdivia', z: 'r', i: { esencial: ['D', 'PR', 'SU'], consalud: ['PR'] } },
    { id: 'alemana-osorno', n: 'Clínica Alemana de Osorno', c: 'Osorno', z: 'r', i: { esencial: ['D', 'PR', 'SU'], consalud: ['PR'] } },
    { id: 'achs-puerto-montt', n: 'ACHS Puerto Montt', c: 'Puerto Montt', z: 'r', i: { consalud: ['U', 'PR'] } },
    { id: 'andes-puerto-montt', n: 'Andes Salud Puerto Montt', c: 'Puerto Montt', z: 'r', i: { consalud: ['U', 'PR'] } },
    { id: 'clinica-puerto-varas', n: 'Clínica Puerto Varas', c: 'Puerto Varas', z: 'r', i: { consalud: ['U', 'PR'] } },
    { id: 'redsalud-magallanes', n: 'RedSalud Magallanes', c: 'Punta Arenas', z: 'r', i: { consalud: ['D', 'U', 'PR'] } }
  ];
  var IGUAL = { 'igual-s': 's', 'igual-r': 'r' };
  function clinica(id) { return CLINICAS.filter(function (c) { return c.id === id; })[0]; }
  function nombreClinica(c) { return c.n + (c.c ? ' (' + c.c + ')' : ''); }
  function zonaDe(id) { return IGUAL[id] || (clinica(id) || {}).z || 's'; }

  // Red de urgencias en regiones, cuando la persona vive en regiones pero le da lo mismo la clinica
  var REGIONES = {
    consalud: [3.5, 'Tiene copago de urgencia en 17 clínicas de regiones y 7 clínicas propias fuera de Santiago'],
    colmena: [1, 'Tiene copago de urgencia en 4 clínicas de regiones'],
    'cruz-blanca': [1, 'Tiene copago de urgencia en Bupa Antofagasta y Bupa Reñaca'],
    'nueva-masvida': [0.5, 'Tiene convenio preferente con clínicas en regiones']
  };

  // p: { isapre: [puntos, razon opcional] }  pReg: puntos si vive en regiones  cob: chip del formulario
  var PREGUNTAS = [
    { id: 'clinica', t: '¿En qué clínica te gustaría atenderte?', tipo: 'clinica' },
    { id: 'prioridad', t: '¿Qué es lo que más te importa?', sub: 'Elige hasta 2.', multi: 2, op: [
      { v: 'urgencias', l: 'Urgencias con niños', cob: 'Urgencias con copago fijo', p: {
        consalud: [2.5, 'Tiene copago de urgencia en 9 clínicas de Santiago'],
        'cruz-blanca': [1.5, 'Tiene copago de urgencia en 6 clínicas de Santiago'],
        'nueva-masvida': [1.5, 'Tiene copago de urgencia en 6 clínicas de Santiago'],
        colmena: [1, 'Tiene copago de urgencia en 5 clínicas de Santiago'] },
        pReg: { consalud: [1.5, 'Tiene copago de urgencia en 17 clínicas de regiones'], colmena: [1], 'cruz-blanca': [1] } },
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
        banmedica: [2.5, 'Tiene el plan de entrada más barato en todas las edades'],
        consalud: [1, 'Tiene el segundo plan de entrada más barato en todas las edades'],
        esencial: [-2], 'vida-tres': [-1], colmena: [-0.5] } }
    ] },
    { id: 'cargas', t: '¿Tienes cargas?', op: [
      { v: 'Sin cargas', l: 'Sin cargas' }, { v: '1 carga', l: '1 carga' },
      { v: '2 cargas', l: '2 cargas' }, { v: '3 cargas', l: '3 cargas' }, { v: '4 o más cargas', l: '4 o más' }
    ] },
    { id: 'renta', t: '¿En qué rango está tu renta imponible?', sub: 'Es solo para orientarte. No la guardamos.', op: [
      { v: 'baja', l: 'Menos de $900.000', p: { banmedica: [1], esencial: [-3], 'vida-tres': [-2] } },
      { v: 'media', l: '$900.000 a $1.800.000', p: { esencial: [-1], 'vida-tres': [-0.5] } },
      { v: 'alta', l: '$1.800.000 a $3.500.000', p: { banmedica: [1], 'vida-tres': [1], esencial: [1] } },
      { v: 'tope', l: 'Más de $3.500.000', p: {
        'vida-tres': [2, 'Cubre procedimientos sin código Fonasa, algo muy valorado en el segmento alto'],
        esencial: [2, 'Sus planes están pensados para el segmento alto'], banmedica: [1] } }
    ] }
  ];

  function ojo(k, zona) {
    var reg = zona === 'r';
    return ({
      consalud: reg ? 'La psicología tiene tope anual.' : 'La psicología tiene tope anual, y los planes con Clínica Las Condes o Clínica Alemana salen bastante más caros.',
      banmedica: reg ? 'En regiones no tiene copago de urgencia, ni siquiera en sus clínicas.' : 'La psicología tiene tope anual.',
      'vida-tres': reg ? 'En regiones no tiene copago de urgencia, ni siquiera en sus clínicas.' : 'La psicología tiene tope anual y tiene pocos beneficios para jóvenes.',
      esencial: reg ? 'En regiones no tiene copago de urgencia, ni siquiera en sus clínicas, y tiene una sola sucursal.' : 'Tiene una sola sucursal y los reembolsos pueden tardar hasta 30 días.',
      colmena: 'La kinesiología tiene un tope muy bajo y sus planes de entrada cubren cerca del 40%.',
      'cruz-blanca': 'Es la Isapre con más reclamos según la Superintendencia, y los reembolsos pueden tardar hasta 45 días.',
      'nueva-masvida': 'Es la segunda Isapre con más reclamos según la Superintendencia, y tiene topes bajos en prótesis, quimioterapia y kinesiología.'
    })[k];
  }

  // Beneficios de una Isapre en la clinica elegida: [{bueno, texto}]
  function beneficios(k, idClinica) {
    var c = clinica(idClinica);
    if (!c || !c.i[k]) return [];
    return c.i[k].map(function (cod) {
      var txt = (c.x && c.x[k] && BEN[cod][0] < 0) ? c.x[k] : BEN[cod][1];
      return { bueno: BEN[cod][0] > 0, texto: txt, cod: cod };
    });
  }

  function calcular(r) {
    var zona = zonaDe(r.clinica), pts = {}, raz = {};
    CLAVES.forEach(function (k) { pts[k] = 0; raz[k] = []; });
    function sumar(k, d) {
      pts[k] += d[0];
      if (d[1] && d[0] > 0 && raz[k].every(function (x) { return x[1] !== d[1]; })) raz[k].push([d[0], d[1]]);
    }
    var c = clinica(r.clinica);
    if (c) CLAVES.forEach(function (k) {
      // En regiones, si no tenemos ningun convenio de esa Isapre en la clinica, se asume que no lo tiene
      if (!c.i[k]) { if (c.z === 'r') pts[k] -= 3; return; }
      c.i[k].forEach(function (cod) { pts[k] += BEN[cod][0]; });
    });
    else if (zona === 'r') Object.keys(REGIONES).forEach(function (k) { sumar(k, REGIONES[k]); });
    PREGUNTAS.forEach(function (q) {
      if (!q.op) return;
      var vals = q.multi ? (r[q.id] || []) : [r[q.id]];
      vals.forEach(function (v) {
        var op = q.op.filter(function (o) { return o.v === v; })[0];
        if (!op || !op.p) return;
        var tabla = (zona === 'r' && op.pReg) ? op.pReg : op.p;
        Object.keys(tabla).forEach(function (k) { sumar(k, tabla[k]); });
      });
    });
    // En Santa María, Vida Tres va siempre antes que Banmédica: mismo holding, precio parecido y cubre
    // procedimientos sin código Fonasa (Banmédica es la masiva y Vida Tres la de nicho)
    if (c && c.id === 'santa-maria' && pts['vida-tres'] <= pts.banmedica) pts['vida-tres'] = pts.banmedica + 0.5;
    // En empate, primero la Isapre que tiene algo en la clinica elegida
    var enClinica = function (k) { return c && c.i[k] ? c.i[k].reduce(function (s, cod) { return s + BEN[cod][0]; }, 0) : -1; };
    var orden = CLAVES.slice().sort(function (a, b) { return (pts[b] - pts[a]) || (enClinica(b) - enClinica(a)); });
    Object.keys(raz).forEach(function (k) { raz[k] = raz[k].sort(function (a, b) { return b[0] - a[0]; }).map(function (x) { return x[1]; }); });
    return { orden: orden, pts: pts, raz: raz, zona: zona };
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
    '.qz-back.oculto{visibility:hidden;}' +
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
    '.qz-op.igual{grid-column:1/-1;color:var(--qz-m);}' +
    '.qz-tabs{display:inline-flex;background:var(--qz-pl);border-radius:24px;padding:4px;margin-top:.8rem;}' +
    '.qz-tab{border:none;background:none;border-radius:20px;padding:.5rem 1.2rem;font-family:inherit;font-size:14.5px;font-weight:600;color:var(--qz-pd);cursor:pointer;}' +
    '.qz-tab.on{background:#fff;box-shadow:0 2px 8px -4px rgba(38,33,92,.4);color:var(--qz-p);}' +
    '.qz-sel{width:100%;min-height:52px;margin-top:.9rem;border:1.5px solid var(--qz-b);border-radius:14px;padding:.7rem .9rem;font-family:inherit;font-size:15.5px;color:var(--qz-t);background:#fff;}' +
    '.qz-sel:focus{outline:none;border-color:var(--qz-p);}' +
    '.qz-next{margin-top:1rem;}' +
    '.qz-main{border:1.5px solid var(--qz-p);border-radius:16px;padding:1.1rem 1.2rem;background:#FCFBFF;margin-top:.2rem;}' +
    '.qz-main-h{display:flex;align-items:center;gap:.9rem;margin-bottom:.7rem;}' +
    '.qz-main-h img{flex-shrink:0;}' +
    '.qz-main-t{font-family:"Inter",sans-serif;font-size:22px;font-weight:900;color:var(--qz-pd);line-height:1.15;}' +
    '.qz-main.dos{border-color:var(--qz-b);background:#fff;margin-top:.8rem;}' +
    '.qz-rank{font-size:11.5px;font-weight:700;color:#0F6E56;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.1rem;}' +
    '.qz-main.dos .qz-rank{color:var(--qz-m);}' +
    '.qz-main.dos .qz-main-t{font-size:19px;}' +
    '.qz-why li.info::before{content:"i";background:var(--purple-mid,#7F77DD);font-style:italic;font-family:Georgia,serif;}' +
    '.qz-en{font-size:13px;font-weight:700;color:var(--qz-pd);text-transform:uppercase;letter-spacing:.04em;margin:.4rem 0 .15rem;}' +
    '.qz-why{list-style:none;margin:0 0 .7rem;padding:0;}' +
    '.qz-why li{position:relative;padding:.3rem 0 .3rem 1.6rem;font-size:14.5px;line-height:1.5;}' +
    '.qz-why li::before{content:"✓";position:absolute;left:0;top:.35rem;width:18px;height:18px;border-radius:50%;background:#1D9E75;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;}' +
    '.qz-why li.mal::before{content:"!";background:#C2565B;}' +
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
    '@media (max-width:680px){.qz-card{padding:1.2rem 1.05rem;border-radius:16px;}.qz-title{font-size:20px;}.qz-q{font-size:18.5px;}.qz-ops{grid-template-columns:1fr;}.qz-btn{width:100%;}.qz-next{width:100%;}.qz-main-t{font-size:20px;}.qz-tabs{display:flex;}.qz-tab{flex:1;}}';

  function ga(evento, params) { if (typeof window.gtag === 'function') window.gtag('event', evento, params); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function logo(k, area) {
    var d = ISAPRES[k], alto = Math.sqrt(area * d[2] / d[1]);
    return '<img src="/logos/mini/' + k + '.png" alt="" width="' + Math.round(alto * d[1] / d[2]) + '" height="' + Math.round(alto) + '">';
  }
  function lista(nombres) { return nombres.length > 1 ? nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1] : nombres[0]; }
  function minus(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  function montar(el) {
    var ubicacion = el.getAttribute('data-ubicacion') || 'sin_ubicacion';
    var modo = el.getAttribute('data-modo') || 'completo';
    var paso = -1, resp = {}, empezado = false, avanzando = false, pestana = 's';
    el.classList.add('qz', modo);
    el.setAttribute('aria-live', 'polite');

    function subir() {
      var top = el.getBoundingClientRect().top;
      if (top < 70) window.scrollTo({ top: window.pageYOffset + top - 90, behavior: 'smooth' });
    }

    function preguntaClinica() {
      var sel = resp.clinica;
      var h = '<div class="qz-tabs" role="tablist">' +
        '<button type="button" class="qz-tab' + (pestana === 's' ? ' on' : '') + '" data-tab="s" role="tab" aria-selected="' + (pestana === 's') + '">Santiago</button>' +
        '<button type="button" class="qz-tab' + (pestana === 'r' ? ' on' : '') + '" data-tab="r" role="tab" aria-selected="' + (pestana === 'r') + '">Regiones</button></div>';
      if (pestana === 's') {
        h += '<div class="qz-ops">' + CLINICAS.filter(function (c) { return c.z === 's'; }).map(function (c) {
          return '<button type="button" class="qz-op' + (sel === c.id ? ' on' : '') + '" data-v="' + c.id + '">' + c.n + '</button>';
        }).join('') + '<button type="button" class="qz-op igual' + (sel === 'igual-s' ? ' on' : '') + '" data-v="igual-s">Me da lo mismo</button></div>';
      } else {
        var ciudades = [];
        CLINICAS.forEach(function (c) { if (c.z === 'r' && ciudades.indexOf(c.c) === -1) ciudades.push(c.c); });
        h += '<select class="qz-sel" aria-label="Elige tu clínica en regiones"><option value="">Elige tu ciudad y clínica...</option>' +
          ciudades.map(function (ciudad) {
            return '<optgroup label="' + ciudad + '">' + CLINICAS.filter(function (c) { return c.c === ciudad; }).map(function (c) {
              return '<option value="' + c.id + '"' + (sel === c.id ? ' selected' : '') + '>' + c.n + '</option>';
            }).join('') + '</optgroup>';
          }).join('') + '</select>' +
          '<div class="qz-ops"><button type="button" class="qz-op igual' + (sel === 'igual-r' ? ' on' : '') + '" data-v="igual-r">No está mi clínica o me da lo mismo</button></div>';
      }
      return h;
    }

    function pintar() {
      var h;
      if (paso === -1) {
        h = '<div class="qz-card"><div class="qz-start"><div><span class="qz-kicker">Test de 1 minuto</span>' +
          '<div class="qz-title">¿Qué Isapre calza contigo?</div>' +
          '<p class="qz-text">Elige tu clínica y responde 3 preguntas más. Te mostramos las Isapres que mejor calzan contigo y sus beneficios ahí. Sin dejar tus datos.</p></div>' +
          '<button type="button" class="qz-btn qz-empezar">Empezar el test →</button></div></div>';
      } else if (paso < PREGUNTAS.length) {
        var q = PREGUNTAS[paso], sel = resp[q.id];
        h = '<div class="qz-card"><div class="qz-top"><button type="button" class="qz-back' + (paso === 0 ? ' oculto' : '') + '">← Atrás</button>' +
          '<span class="qz-prog">Pregunta ' + (paso + 1) + ' de ' + PREGUNTAS.length + '</span></div>' +
          '<div class="qz-bar"><span style="width:' + Math.round((paso / PREGUNTAS.length) * 100) + '%"></span></div>' +
          '<div class="qz-q">' + q.t + '</div>' + (q.sub ? '<p class="qz-sub">' + q.sub + '</p>' : '');
        if (q.tipo === 'clinica') h += preguntaClinica();
        else {
          h += '<div class="qz-ops" role="group" aria-label="' + esc(q.t) + '">' +
            q.op.map(function (o) {
              var on = q.multi ? (sel || []).indexOf(o.v) > -1 : sel === o.v;
              return '<button type="button" class="qz-op' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-v="' + esc(o.v) + '">' + o.l + '</button>';
            }).join('') + '</div>' +
            (q.multi ? '<button type="button" class="qz-btn qz-next"' + ((sel || []).length ? '' : ' disabled') + '>Continuar →</button>' : '');
        }
        h += '</div>';
      } else {
        h = resultado();
      }
      el.innerHTML = h;
      var s = el.querySelector('.qz-sel');
      if (s) s.addEventListener('change', function () { if (s.value) elegir('clinica', s.value); });
    }

    function resultado() {
      var c = calcular(resp), a = c.orden[0], b = c.orden[1];
      var cl = clinica(resp.clinica), nomCl = cl ? nombreClinica(cl) : '';

      function tarjeta(k, n) {
        var ben = beneficios(k, resp.clinica), otras = c.raz[k].slice(0, ben.length ? 2 : 3);
        var li = function (x) { return '<li' + (x.clase ? ' class="' + x.clase + '"' : '') + '>' + x.texto + '</li>'; };
        var h = '<div class="qz-main' + (n === 2 ? ' dos' : '') + '"><div class="qz-main-h">' + logo(k, n === 1 ? 2400 : 1900) + '<div>' +
          '<div class="qz-rank">' + (n === 1 ? 'Opción 1 · La que mejor calza' : 'Opción 2') + '</div>' +
          '<div class="qz-main-t">' + nombre(k) + '</div></div></div>';
        if (cl) {
          var items = ben.length
            ? ben.map(function (x) { return { texto: x.texto, clase: x.bueno ? '' : 'mal' }; })
            : [{ texto: 'Sin copago de urgencia, pero puede tener cobertura preferente ambulatoria según el plan', clase: 'info' }];
          h += '<div class="qz-en">En ' + esc(nomCl) + '</div><ul class="qz-why">' + items.map(li).join('') + '</ul>';
        }
        if (otras.length) h += (cl ? '<div class="qz-en">Además</div>' : '') + '<ul class="qz-why">' + otras.map(function (t) { return li({ texto: t }); }).join('') + '</ul>';
        if (!cl && !otras.length) h += '<ul class="qz-why"><li>Calza con lo que respondiste</li></ul>';
        return h + '<p class="qz-ojo"><strong>Ojo:</strong> ' + minus(ojo(k, c.zona)) + '</p>' +
          '<a class="qz-link" href="/isapre-' + k + '">Ver la ficha completa de ' + nombre(k) + ' →</a></div>';
      }

      var extra = '';
      if (cl) {
        var conUrg = CLAVES.filter(function (k) { return k !== a && k !== b && cl.i[k] && cl.i[k].indexOf('U') > -1; }).map(nombre);
        if (conUrg.length) extra += '<p class="qz-nota">En ' + esc(nomCl) + ' también ' + (conUrg.length > 1 ? 'tienen' : 'tiene') + ' copago de urgencia: ' + lista(conUrg) + '.</p>';
        var duenos = CLAVES.filter(function (k) { return cl.i[k] && cl.i[k].indexOf('D') > -1 && k !== a && k !== b; });
        if (duenos.length) extra += '<p class="qz-nota">Si ' + esc(cl.n) + ' es imprescindible para ti, mira también ' +
          duenos.map(function (k) { return '<a class="qz-link" href="/isapre-' + k + '">' + nombre(k) + '</a>'; }).join(' y ') +
          (duenos.length > 1 ? ': son' : ': es') + ' de su mismo holding.</p>';
      }

      return '<div class="qz-card"><span class="qz-kicker">Tus dos mejores opciones</span>' +
        tarjeta(a, 1) + tarjeta(b, 2) + extra +
        '<div class="qz-cta"><div class="qz-cta-t">¿Quieres que te armemos el plan?</div>' +
        '<p>Con lo que respondiste, tu ejecutivo prepara propuestas de ' + nombre(a) + ' y ' + nombre(b) + (cl ? ' para atenderte en ' + esc(cl.n) : '') + ', y te dice cuál te conviene más. Gratis y sin compromiso.</p>' +
        '<button type="button" class="qz-btn qz-go">Quiero mi asesoría gratis →</button></div>' +
        '<button type="button" class="qz-reset">Volver a hacer el test</button>' +
        '<p class="qz-aviso">Orientación referencial según la oferta vigente a septiembre de 2026. No reemplaza una cotización: coberturas, convenios y precios dependen de cada plan, de tu edad y de tu declaración de salud.</p></div>';
    }

    function irAlFormulario() {
      var c = calcular(resp), a = c.orden[0], b = c.orden[1], cl = clinica(resp.clinica);
      var cobs = (resp.prioridad || []).map(function (v) {
        return PREGUNTAS[1].op.filter(function (o) { return o.v === v; })[0].cob;
      }).filter(Boolean);
      var datos = { cob: cobs.join('|'), cargas: resp.cargas || '', sug: nombre(a) + ', ' + nombre(b) + (cl ? ' · Clínica: ' + nombreClinica(cl) : '') };
      ga('quiz_cta', { resultado: nombre(a), clinica: cl ? cl.n : 'Me da lo mismo', ubicacion: ubicacion });
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

    function avanzar() {
      paso++;
      if (paso === PREGUNTAS.length) {
        var cl = clinica(resp.clinica);
        ga('quiz_complete', { resultado: nombre(calcular(resp).orden[0]), clinica: cl ? cl.n : 'Me da lo mismo', ubicacion: ubicacion });
      }
      pintar(); subir();
    }

    function elegir(id, v) {
      if (avanzando) return;
      avanzando = true; resp[id] = v;
      setTimeout(function () { avanzando = false; avanzar(); }, 160);
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t || !el.contains(t)) return;
      if (t.classList.contains('qz-empezar')) {
        paso = 0; if (!empezado) { empezado = true; ga('quiz_start', { ubicacion: ubicacion }); }
        pintar(); subir(); return;
      }
      if (t.classList.contains('qz-tab')) { pestana = t.getAttribute('data-tab'); pintar(); return; }
      if (t.classList.contains('qz-back')) { paso = Math.max(0, paso - 1); pintar(); return; }
      if (t.classList.contains('qz-reset')) { paso = 0; resp = {}; pestana = 's'; pintar(); subir(); return; }
      if (t.classList.contains('qz-go')) { irAlFormulario(); return; }
      if (t.classList.contains('qz-next')) { avanzar(); return; }
      if (t.classList.contains('qz-op')) {
        var q = PREGUNTAS[paso], v = t.getAttribute('data-v');
        if (q.multi) {
          var l = (resp[q.id] || []).slice(), i = l.indexOf(v);
          if (i > -1) l.splice(i, 1); else { l.push(v); if (l.length > q.multi) l.shift(); }
          resp[q.id] = l; pintar();
        } else {
          t.classList.add('on'); elegir(q.id, v);
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

  window.planiappQuiz = { calcular: calcular, beneficios: beneficios, PREGUNTAS: PREGUNTAS, CLINICAS: CLINICAS };
})();
