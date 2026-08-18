# Playbook Google Ads — Planiapp

ID de Google Ads: `AW-18388610233`
Presupuesto real: **10.000 CLP/día**
Última actualización: 2026-08-14

> ⚠️ **NO publicar campañas de Máximo Rendimiento (Performance Max).**
> Si el asistente pide imágenes, logotipos, video o "grupo de recursos", es PMax:
> reparte el presupuesto en YouTube, Gmail, Display y Discover, y es una caja negra.
> Con 10.000/día no tiene ninguna posibilidad de aprender. Solo **Búsqueda**.

Documento vivo. La sección **Bitácora semanal** al final es para ir llenándola con
datos reales; el resto son las reglas de decisión.

---

## 0. Estado del tracking

| Ítem | Estado | Dónde |
|---|---|---|
| Tag global (gtag.js) | ✅ instalado | `gracias.html:6-12`, home |
| Acción de conversión creada | ✅ 18-08-2026 | `Lead formulario Planiapp` — principal, recuento "Una", ventana 30 días, valor 15.000 CLP |
| Fragmento de evento de conversión | ✅ instalado (falta deploy) | `gracias.html:392-400` — etiqueta `AW-18388610233/-zYyCKvtweMcELnZr8BE` |
| Param `?tipo=simple\|avanzado` | ❌ pendiente | redirección de ambos formularios |
| GCLID en campo oculto | ❌ pendiente | ambos formularios |
| Conversiones mejoradas | ❌ pendiente | requiere política de privacidad |
| Importación de conversiones offline (cierres) | ❌ fase 3 | Make.com → Sheets → Ads |
| Verificación de anunciante | ❓ verificar | Google Ads → Configuración |

### Fragmento de conversión

`gracias.html` ya tiene en la línea ~381 un bloque que lee `codigo` de la URL:

```js
const params = new URLSearchParams(window.location.search);
const codigo = params.get('codigo');
if(codigo) document.getElementById('codigoGracias').textContent = codigo;
```

Agregar a continuación, en el **mismo** bloque `<script>` (reutiliza `params` y `codigo`):

```js
const tipo = params.get('tipo') || 'simple';
gtag('event', 'conversion', {
  'send_to': 'AW-18388610233/TU_ETIQUETA_AQUI',
  'value': tipo === 'avanzado' ? 25000 : 15000,   // ver sección 4
  'currency': 'CLP',
  'transaction_id': codigo || ''                   // evita doble conteo al recargar
});
```

### Cómo obtener la etiqueta SIN publicar ninguna campaña

No hace falta terminar ningún asistente. La acción de conversión es independiente:

1. Google Ads → **Objetivos → Conversiones → Acciones de conversión**
2. **+ Nueva acción de conversión** → **Sitio web**
3. Ingresar `planiapp.cl` → *Analizar* → elegir **"Agregar una acción de conversión manualmente"**
4. Categoría: **Enviar formulario de cliente potencial**
5. Valor: usar valores distintos por conversión (ver sección 4)
6. **Recuento: "Una"** ← crítico en generación de leads. El default "Todas" infla el
   CPA cuando la misma persona envía dos formularios.
7. Ventana de conversión: 30 días (el ciclo de decisión de Isapre es corto)
8. Guardar → **Configurar con código** → ahí aparece el **Fragmento de evento** con
   la etiqueta `AW-18388610233/XXXXXXXX`

Recién después de esto se crea la campaña de Búsqueda.

> `transaction_id` es obligatorio en la práctica: sin él, un F5 en `/gracias.html`
> cuenta como lead nuevo y ensucia el CPA.

### GCLID (necesario para la fase 3)

En cada formulario:

```html
<input type="hidden" name="gclid" id="gclid">
```
```js
var g = new URLSearchParams(location.search).get('gclid');
if (g) localStorage.setItem('gclid', g);
document.getElementById('gclid').value = localStorage.getItem('gclid') || '';
```

Y que Make.com lo persista junto al lead en Sheets/Supabase.

---

## 1. Presupuesto

### Por qué se descarta la recomendación de Google

Google sugirió **171.866 CLP/día** (~5.224.000 CLP/mes) con CPA estimado de
**116.802 CLP**. Dado vuelta:

| Tasa lead → venta cobrada | Costo publicitario por venta |
|---|---|
| 8% | 1.460.000 CLP |
| 10% | 1.168.000 CLP |
| 15% | 779.000 CLP |

Ese presupuesto solo cierra si cada venta deja más de un millón neto. Es un modelo
sin datos propios, con concordancia amplia y en una subasta con 10+ comparadores.
No usar ni como referencia.

### Punto de partida real: 10.000 CLP/día

**10.000 CLP/día, solo lunes a viernes** → ~220.000 CLP/mes (22 días hábiles).

> Google calcula el tope mensual como diario × 30,4 y puede gastar hasta 2× en un
> día puntual. Con programación L-V, el gasto real es diario × ~22.

Qué esperar:

| CPC medio | Clics/día | Clics/mes | Leads/mes (CVR 10%) | Leads/mes (CVR 15%) |
|---|---|---|---|---|
| 1.000 | 10 | 220 | 22 | 33 |
| 1.500 | 6,7 | 147 | 15 | 22 |
| 2.000 | 5 | 110 | 11 | 16 |

**Implicancias de este presupuesto — no negociables:**

1. **La validación toma 6–8 semanas, no 4.** El umbral mínimo para decidir algo son
   30 leads. Con este ritmo se alcanza a fines del mes 2. Paciencia, no cambios cada
   3 días.
2. **Un solo grupo de anuncios y ~7 keywords en concordancia exacta.** Repartir
   220.000 CLP entre 3 grupos deja a cada uno sin datos. Concentrar es obligatorio.
3. **El CPC hay que topearlo a mano.** Sin tope, dos clics caros se comen el día.
4. **La conversión de la landing es el 80% del resultado.** Con este presupuesto no
   se puede comprar volumen para compensar una landing mediocre.

> Si el CPC real resulta > 2.500 CLP, este presupuesto no alcanza para Búsqueda en
> este vertical. En ese caso: bajar a keywords ultra long-tail, o replantear el canal.
> Es una conclusión válida de la validación, no un fracaso.

### Regla de escalado — revisar cada 5-7 días

| Condición | Acción |
|---|---|
| CPL 7d ≤ 80% del objetivo **y** cuota de impr. perdida por presupuesto > 20% | subir 25% |
| CPL 7d entre 80% y 110% del objetivo | no tocar; optimizar keywords y landing |
| CPL 7d > 110% del objetivo, 2 semanas seguidas | bajar 20% y cortar términos caros |

Nunca subir más de 25–30% de una vez: reinicia el aprendizaje de la puja.

### Secuencia de estrategia de puja

| Fase | Cuándo | Estrategia |
|---|---|---|
| 1 | 0–30 conversiones | Maximizar clics con **límite de CPC máx.** (partir en 2.000 CLP) |
| 2 | 30+ conv. acumuladas | Maximizar conversiones, sin CPA objetivo |
| 3 | 30+ conv./mes estables | CPA objetivo = CPL objetivo real |
| 4 | Con cierres importados | CPA/ROAS sobre la conversión *cierre*, no *lead* |

No arrancar en "Maximizar conversiones": sin historial gasta el presupuesto explorando.

> **Con 10.000/día, lo realista es quedarse en la fase 1 varios meses.** El CPA
> objetivo necesita ~30 conversiones al mes para funcionar bien, y aquí se llega a
> 15–25. No forzarlo: *Maximizar clics con tope de CPC* es la estrategia correcta
> mientras el volumen sea este, y no es un parche — es lo que corresponde.

**Tope de CPC inicial: 1.300 CLP.** Si a los 3 días las impresiones son casi cero,
subir a 1.800 y luego a 2.300. Si el CPC medio se pega al tope, significa que la
subasta está por encima: ahí la respuesta es mejorar Nivel de Calidad (landing +
relevancia del anuncio), no seguir subiendo.

---

## 2. Estructura de campaña

**Una sola campaña de Búsqueda.** Fragmentar en varias divide los datos de conversión
y ninguna aprende. La distribución se controla vía keywords y pujas.

### Cómo crear la campaña correcta

Campañas → **+ Nueva campaña** → Objetivo **"Clientes potenciales"** →
**tipo de campaña: "Búsqueda"** ← *este es el paso donde se decide todo*.

Si el asistente muestra en cualquier momento: **imágenes sugeridas, "sube de 1 a 5
logotipos", video, "grupo de recursos" o "señales de audiencia"** → es Máximo
Rendimiento. Volver atrás. Una campaña no se puede convertir de tipo después de
creada; hay que salir del asistente sin publicar y empezar de nuevo.

### Qué APAGAR para no quemar presupuesto

Todo lo siguiente viene activado por defecto y con 10.000/día cada uno es una fuga:

| Ajuste | Dónde | Acción |
|---|---|---|
| **Red de Display** | Redes | ☐ desmarcar |
| **Socios de búsqueda** | Redes | ☐ desmarcar |
| **Recursos creados automáticamente** | Config. de la campaña → Recursos | ☐ desactivar — genera titulares solo, riesgoso en rubro regulado |
| **Recursos de imagen** | Recursos | ☐ no agregar ninguno |
| **Expansión de la URL final** | Config. avanzada | ☐ desactivar |
| **Segmentación optimizada / expansión de audiencia** | Audiencias | ☐ desactivar |
| **Aplicar recomendaciones automáticamente** | Recomendaciones → ⚙ | ☐ desactivar TODO |
| **Aumento automático de presupuesto** | Recomendaciones | ☐ desactivar |
| Ubicación: "presencia **o interés**" | Ubicaciones → Opciones | ☐ cambiar a **"Presencia"** solamente |

> El de "aplicar recomendaciones automáticamente" es el más peligroso: Google puede
> agregar keywords amplias o subir el presupuesto sin avisar.

### Qué SÍ activar (es gratis y baja el CPC)

- **Enlaces de sitio** (4): Cómo funciona · Asesoría avanzada · Preguntas frecuentes · Quiénes somos
- **Textos destacados**: `Sin costo para ti` · `Asesor registrado` · `Respuesta el mismo día` · `Acompañamiento post venta`
- **Fragmentos estructurados** → tipo *Servicios*: `Cambio de Isapre`, `Paso de Fonasa a Isapre`, `Revisión de plan`, `Asesoría post venta`

Mejoran el CTR, y mejor CTR = mejor Nivel de Calidad = **menor CPC**. Con este
presupuesto es de las pocas palancas gratis que quedan.

### Otros ajustes

- [ ] **Zona horaria de la cuenta = `America/Santiago`** — si quedó mal, toda la
      programación horaria está corrida y no se nota
- [ ] Idioma: español
- [ ] Rotación de anuncios: optimizar
- [ ] Método de entrega: estándar (no acelerada)

### Fase 1 — UN solo grupo de anuncios

Con 10.000/día no alcanza para tres grupos. Uno solo, `Cambio de Isapre`.

**Keywords — copiar y pegar tal cual (concordancia exacta, con corchetes):**

```
[cambiarme de isapre]
[cambiar de isapre]
[cambio de isapre]
[como cambiarse de isapre]
[quiero cambiarme de isapre]
[asesor de isapre]
[asesoria isapre]
```

Siete. Nada más. Los corchetes son lo que hace la diferencia entre pagar por gente
que quiere cambiarse y pagar por gente que busca "qué es una isapre".

**A las 2 semanas**, según lo que muestre el informe:

- Si hay **muy pocas impresiones** (< 200/semana) → agregar en concordancia de frase:
  ```
  "cambiarse de isapre"
  "cambio de isapre"
  ```
- Si el volumen alcanza y el CPL se sostiene → agregar exactas:
  ```
  [cambiarse de fonasa a isapre]
  [pasarse de fonasa a isapre]
  [me subieron el plan de isapre]
  ```
  La última es la de mejor intención de todas: alza de plan = urgencia real.

**Nunca en fase 1:** concordancia amplia (sin comillas ni corchetes). Con este
presupuesto, una sola keyword amplia consume el mes entero.

### Grupos — Fase 2 (mes 3+, y solo si el CPL del grupo único se sostiene)

> Con 10.000/día, abrir un segundo grupo antes de tener 30 leads en el primero es
> garantizar que ninguno de los dos genere datos concluyentes.


**G4 · Cotizar / Comparar** — `"cotizar isapre"`, `"comparar planes isapre"`, `[mejor isapre]`
> ⚠️ Grupo de riesgo. Esta gente espera un simulador con precios en vivo y no lo
> tenemos. El anuncio debe reencuadrar hacia asesoría personalizada desde el título
> o se pagan clics que rebotan. Presupuesto acotado y vigilancia.

**G5 · Marcas de Isapre** — `"planes colmena"`, `"cotizar cruz blanca"`, `"planes banmedica"`,
`"consalud planes"`, `"nueva masvida planes"`
> ⚠️ Se puede **pujar** por estas marcas, pero **no usarlas en el texto del anuncio**
> (política de marcas registradas de Google). Verificar aparte la autorización para
> los logos de Isapres que ya están en la home.

**G6 · Coberturas y preexistencias** — alimenta el formulario avanzado.
> ⚠️ Leer sección 5 antes de activar: implicancias de datos sensibles.

### Concordancias

Fase 1: **exacta y de frase solamente.** Amplia recién en fase 3, con CPA objetivo
funcionando y lista de negativos madura.

### Negativos — cargar antes de encender

```
# No son clientes
gratis  trabajo  empleo  sueldo  "cuanto gana"  curso  certificacion
"que es"  significado  wikipedia  pdf  ley  tesis  apunte  ejemplo

# Buscan servicio al cliente, no cambiarse
sucursal  telefono  "numero de contacto"  horario  "iniciar sesion"
"mi cuenta"  clave  app  descargar  bono  reembolso  licencia medica
"estado de licencia"  certificado  "carta de desafiliacion"

# Conflicto, no venta
reclamo  denuncia  demanda  abogado  juicio  "recurso de proteccion"
superintendencia

# Producto equivocado
afp  "cotizacion previsional"  "seguro complementario"  "seguro de vida"
"seguro automotriz"  mutual  achs  dipreca  capredena  "seguro escolar"

# Competencia (fase 1)
queplan  tuplan7  "tu plan 7"  todoplanes  isapres360  infoisapres
```

> Ojo: `reclamo` y `superintendencia` van como negativos, pero `"alza de plan isapre"`
> va como keyword. Suenan parecido, la intención es opuesta.

**Revisar el informe de términos de búsqueda 2× por semana durante el primer mes.**
Es la tarea de mayor retorno por minuto que existe en Google Ads.

### Anuncios — texto exacto

**Un solo RSA** en fase 1 (dos anuncios se reparten las impresiones y ninguno acumula
datos con este volumen).

**Títulos** — máx. 30 caracteres. Copiar tal cual:

```
Cambiarte de Isapre, Guiado      ← FIJAR en posición 1
Asesoría Isapre Sin Costo
Te Responde un Asesor Real
Si No Te Conviene, Te Avisamos
Asesoría por WhatsApp
Sin Compromiso ni Costo
Asesoría Independiente
Ejecutivos Habilitados
Acompañamiento Post Venta
Respuesta el Mismo Día
Un Ejecutivo, No un Robot
Cambio de Isapre Bien Hecho
Asesoría Isapre en Chile
```

> **Fijar (pin) solo el primero, en posición 1.** Garantiza que el mensaje principal
> siempre aparezca y evita combinaciones raras. Fijar más títulos reduce demasiado
> las combinaciones y baja el Nivel de Calidad.

**Descripciones** — máx. 90 caracteres:

```
Un asesor registrado revisa tu caso y te dice con honestidad si te conviene cambiarte.
Sin costo para ti. Te contactamos por WhatsApp y te acompañamos también después.
Cuéntanos tu situación en 1 minuto y un ejecutivo te responde con opciones reales.
Atención de lunes a viernes, 9 a 21 h. Respuesta el mismo día hábil.
```

**URL visible:** `planiapp.cl` · Ruta 1: `asesoria` · Ruta 2: `isapre`
**URL final:** la landing dedicada (ver más abajo), no la home.

**Prohibido en el copy:**
- cifras de ahorro ("ahorra hasta 40%") — no las podemos respaldar
- superlativos de precio ("el plan más barato")
- "compara precios en línea" — trae gente esperando un simulador
- nombres de Isapres en el texto del anuncio

### Landing page

Con un solo grupo, basta **una** landing dedicada: `/cambio-isapre`.

No mandar el tráfico a la home. Con 10.000/día esto no es un "nice to have": una
landing con el mismo mensaje que la keyword sube el Nivel de Calidad (→ baja el CPC)
y sube la conversión. Es la palanca más barata que queda.

Requisitos mínimos de esa página:
- El H1 repite la keyword: "Cámbiate de Isapre con asesoría real"
- El formulario **arriba, visible sin scroll**, en móvil también
- La menor cantidad de campos posible (cada campo extra cuesta conversión)
- Sin menú de navegación que distraiga
- Número de registro del agente ante la Superintendencia de Salud, visible

---

## 3. Programación horaria

Atención: L-V 09:00–21:00.

El factor dominante no es el CPC sino la **velocidad de respuesta**. En leads de
WhatsApp, contactar en <5 min vs. 2 horas cambia radicalmente la tasa de contacto.

**Fase 1 — estricto:**
```
Lunes a Viernes, 09:00 – 20:30
```
Media hora de colchón antes del cierre para no dejar leads sin contactar el mismo
día. Fuera de eso, campaña apagada.

> **Con 10.000/día son ~870 CLP por hora de campaña** — menos de un clic por hora.
> Google reparte con entrega estándar y la presencia queda muy diluida.
>
> **Arrancar igual con la franja completa** las primeras 3 semanas: hace falta el
> informe por hora para saber dónde está el volumen. Recién ahí concentrar en los
> 5–6 mejores bloques (típicamente media mañana y después de almuerzo). Concentrar
> antes de tener el dato es adivinar.

**Fase 2 — un experimento a la vez:**
- Sábado 10:00–14:00 (se investiga salud el fin de semana, CPC suele ser más bajo).
  Solo si hay alguien respondiendo.
- L-V 20:30–22:00, si el informe por hora muestra volumen barato ahí.

> **Detalle técnico:** con *Maximizar clics* los ajustes de puja por horario funcionan
> normal. Con *CPA objetivo* Google los ignora salvo el −100%; ahí la programación
> pasa a ser encendido/apagado, no modulación.

A los 30 días: revisar informe de horario y día de la semana.

**Fuera de Google:** autorespuesta en WhatsApp Business confirmando recepción y
horario de contacto.

---

## 4. Economía unitaria — ¿se sostiene el CPL?

Embudo real:

```
Lead → Contactado → Cotización presentada → Firma → Cambio efectivo y comisión COBRADA
```

Trabajar siempre con **comisión efectivamente cobrada**, no con firmas: en Isapre hay
desistimientos, plazos de retracto y casos que no se materializan.

```
Ingreso por lead   =  Comisión neta por cierre  ×  Tasa lead → cierre cobrado
CPL de equilibrio  =  Ingreso por lead
CPL objetivo       =  CPL de equilibrio ÷ 2    (costo operativo = tiempo propio)
                   =  CPL de equilibrio ÷ 3    (si se paga comisión a ejecutivos)
```

### Escenarios (asumiendo 10% lead → cierre cobrado)

> **Reemplazar con la comisión real.** Estos valores son placeholders.

| Comisión neta/cierre | Ingreso por lead | CPL equilibrio | CPL objetivo (÷2,5) |
|---|---|---|---|
| 80.000 | 8.000 | 8.000 | 3.200 |
| 150.000 | 15.000 | 15.000 | 6.000 |
| 250.000 | 25.000 | 25.000 | 10.000 |
| 400.000 | 40.000 | 40.000 | 16.000 |

### Sensibilidad al cierre (comisión = 250.000)

| Lead → cierre | CPL objetivo |
|---|---|
| 5% | 5.000 |
| 10% | 10.000 |
| 15% | 15.000 |

### Del CPL al CPC

```
CPC máximo = CPL objetivo × Tasa de conversión de la landing
```

| CPL objetivo | Landing 10% | Landing 15% | Landing 20% |
|---|---|---|---|
| 6.000 | 600 | 900 | 1.200 |
| 10.000 | 1.000 | 1.500 | 2.000 |
| 15.000 | 1.500 | 2.250 | 3.000 |

> **La conclusión más importante del documento:** en un vertical con 10 competidores,
> la tasa de conversión de la landing da más margen que cualquier ajuste de puja.
> Duplicar la conversión duplica lo que se puede pagar por clic. Bajar la puja solo
> saca de la subasta.

### Qué esperar realmente con 220.000 CLP/mes

| CPL real | Leads/mes | Ventas/mes (cierre 10%) | Ventas/mes (cierre 15%) |
|---|---|---|---|
| 8.000 | 27 | 2,7 | 4,1 |
| 12.000 | 18 | 1,8 | 2,7 |
| 18.000 | 12 | 1,2 | 1,8 |

Esto es **un presupuesto de validación, no de crecimiento**. El objetivo del mes 1–2
no es facturar: es averiguar el CPC real, la conversión de la landing y la tasa de
cierre. Con esos tres números se decide si vale la pena escalar. Escalar sin ellos es
apostar.

### Fase 3 — importar cierres (la palanca grande)

Hoy Google optimiza para "formulario enviado", que no es el negocio.

1. Formulario guarda `gclid` + `codigo` en Supabase/Sheets
2. Ejecutivo marca el caso como cerrado y cobrado → Make.com escribe fecha y comisión
3. Subir a Google Ads como **importación de conversiones offline** (Sheets programado o API)
4. Cambiar la puja a optimizar sobre esa conversión

A partir de ahí Google deja de buscar formularios y busca gente que se cambia.
Diferencia entre bajar el CPL 20% y bajar el costo por venta 50%.

Métrica clave: **CPL por grupo × tasa de cierre por grupo.** Hipótesis a validar:
G3 (asesor) tendrá CPL más alto y tasa de cierre bastante mejor que G4 (cotizar).
Sin importar cierres eso nunca se ve.

---

## 5. Certificación y regulación

### Lo verificado

| Requisito | ¿Aplica? | Detalle |
|---|---|---|
| Verificación de **servicios financieros** | ❌ **No** | Chile no está en la lista oficial de países (29 países; único de LatAm es Brasil). Revisar 1-2 veces al año: el programa se está expandiendo (11 países europeos sumados en jul-2026). |
| Certificación de **salud** (LegitScript) | ❌ No | Cubre farmacias online, telemedicina y tratamiento de adicciones. La intermediación de seguros de salud no está en el alcance. |
| **Verificación de anunciante** | ✅ **Sí, obligatoria y global** | Plazo de 30 días desde la notificación o se suspende la cuenta. Tener listos e-RUT del SII y cédula del representante legal. **Hacerlo ahora, no cuando llegue el aviso.** |

> Si un anuncio se rechaza automáticamente por "servicios de salud": es falso positivo
> del clasificador. Apelar explicando que es intermediación de seguros, no prestación
> de salud.

### Tres riesgos reales

**a) Publicidad personalizada y categorías sensibles.**
La salud es categoría sensible. En Búsqueda, pujar por `"isapre con preexistencia"`
**está permitido** (las keywords no son segmentación personalizada). Lo que **no** se
puede: armar listas de remarketing con esa gente, ni escribir anuncios que infieran
estado de salud ("¿Tienes una preexistencia? Te ayudamos" mostrado a quien ya visitó
el sitio). Pega directo en G6 y en el formulario avanzado.
→ **Regla: G6 solo en Búsqueda, sin remarketing, texto genérico de asesoría.**

**b) Posición regulatoria de Planiapp — leer antes de escribir cualquier anuncio.**

Según el aviso regulatorio del propio sitio:

> *"Planiapp es una plataforma de información y asesoría independiente. **No operamos
> como agentes de ventas de isapres** ni corredores de seguros. Toda contratación se
> realiza directamente entre el usuario y un agente habilitado inscrito en la
> Superintendencia de Salud."*

Consecuencias para el copy:

| ❌ No decir | ✅ Decir |
|---|---|
| "Agente de ventas registrado" | "Te derivamos a ejecutivos inscritos" |
| "Ejecutivos certificados por la Superintendencia" | "Ejecutivos inscritos en la Superintendencia" |
| Cualquier cosa que presente a Planiapp como la parte que vende | "Asesoría independiente" |

La Superintendencia **no certifica**: mantiene un registro donde los agentes se
inscriben. Decir "certificado por" insinúa aval del regulador, que es justamente lo
que no se puede insinuar.

Toda credencial afirmada en un anuncio tiene que ser verificable en la landing.

**c) Ley 21.719 de protección de datos personales.**
Vigencia plena a fines de 2026. **Los datos de salud son sensibles, con estándar de
consentimiento expreso.** El formulario avanzado pide preexistencias y coberturas →
dato sensible. Se necesita:
- política de privacidad publicada
- checkbox de consentimiento explícito y separado (no preseleccionado)
- finalidad declarada

También es requisito de Google (política de recopilación de datos) y prerrequisito
para habilitar conversiones mejoradas. Conviene que un abogado revise el texto del
consentimiento antes de diciembre — sirve para las tres cosas de una vez.

### En el copy, siempre

No presentarse como Isapre ni como la Superintendencia. No hacer comparaciones de
precio que no se puedan respaldar con documentación. El ángulo de "asesoría honesta"
es, convenientemente, el más seguro desde el punto de vista regulatorio.

---

## 6. Orden de ejecución

| Semana | Qué | ✔ |
|---|---|---|
| 0 | **Salir del asistente de Máximo Rendimiento sin publicar** | ☐ |
| 0 | Crear la acción de conversión standalone (sección 0), recuento **"Una"** | ☐ |
| 0 | Fragmento de conversión en `gracias.html` (línea ~383) | ☐ |
| 0 | `?tipo=` en la redirección de ambos formularios | ☐ |
| 0 | GCLID en campo oculto | ☐ |
| 0 | Política de privacidad + consentimiento explícito | ☐ |
| 0 | Verificación de anunciante en Google Ads | ☐ |
| 0 | Landing `/cambio-isapre` | ☐ |
| 1 | Crear campaña **Búsqueda** (no PMax): 10.000/día, L-V 09:00–20:30, **1 grupo, 7 keywords exactas**, negativos, tope CPC 1.300 | ☐ |
| 1 | Recorrer la tabla "Qué APAGAR" completa | ☐ |
| 1 | Agregar enlaces de sitio, textos destacados y fragmentos estructurados | ☐ |
| 1–3 | Términos de búsqueda 2×/semana. **No tocar pujas ni presupuesto.** | ☐ |
| 3 | Ajustar tope de CPC si no hay impresiones. Revisar informe por hora. | ☐ |
| 4 | Primer corte: CPC real, CVR de landing. Aún no alcanza para juzgar CPL. | ☐ |
| 6–8 | Con ~30 leads: calcular CPL real contra la sección 4 y **decidir** si escalar, ajustar o parar | ☐ |
| 9+ | Si el CPL se sostiene: escalar 25% cada 5–7 días, abrir 2º grupo, conversiones mejoradas | ☐ |
| Mes 4+ | Importación de cierres offline → optimizar sobre venta, no sobre lead | ☐ |

---

## 7. Datos pendientes de completar

Sin estos dos números la sección 4 queda en placeholders:

- [ ] **Comisión neta promedio por cierre efectivamente cobrado:** ______ CLP
- [ ] **Tasa de contacto** (de cada 10 leads, cuántos se logran contactar): ______
- [ ] **Tasa de cierre sobre contactados:** ______
- [ ] → Tasa lead → cierre cobrado: ______ %
- [ ] → **CPL objetivo resultante:** ______ CLP
- [ ] → **CPC máximo** (con la CVR real de la landing): ______ CLP

---

## 8. Bitácora semanal

| Semana | Gasto | Clics | CPC medio | Leads | CPL | CVR landing | Cierres | Notas / cambios |
|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | |
| 2 | | | | | | | | |
| 3 | | | | | | | | |
| 4 | | | | | | | | |

---

## Fuentes

- [Verificación de servicios financieros: organismos y fechas](https://support.google.com/adspolicy/answer/12390454?hl=es-419)
- [Nuevos requisitos de verificación de servicios financieros (junio 2026)](https://support.google.com/adspolicy/answer/17127726?hl=es)
- [Certificación LegitScript reconocida por Google](https://www.legitscript.com/healthcare/google-legitscript-certification/)
