# Playbook Meta Ads — Planiapp

Complemento de `GOOGLE-ADS.md`. Última actualización: 2026-08-26.
Supuesto de presupuesto: **5.000 CLP/día adicionales** (no sacarlos de Google;
son canales con lógica distinta y ninguno de los dos aprende con la mitad).

> **Diferencia de fondo con Google:** en Búsqueda la persona ya decidió cambiarse.
> En Meta nadie está pensando en su isapre. El anuncio tiene que *crear* el problema
> antes de ofrecer la solución. Por eso el formato "publicación de plan con detalle"
> funciona: el detalle es lo que hace que alguien se compare mentalmente y reaccione.

---

## 0. Reglas de redacción — leer antes de escribir cualquier creativo

### Política de atributos personales de Meta

Meta rechaza anuncios que **impliquen** que conoces algo del usuario: su edad, su
salud, su situación financiera. No importa que la segmentación sí permita filtrar por
edad — el *texto* no puede delatarlo.

| ❌ Rechazo probable | ✅ Equivalente que pasa |
|---|---|
| "Si tienes entre 25 y 34 años…" | "Un plan pensado para los 25 a 34" |
| "¿Tienes una preexistencia?" | "Las preexistencias cambian el resultado. Te explicamos cómo" |
| "Tu isapre te subió el plan" | "Este año las alzas llegaron otra vez" |
| "Sabemos que estás pagando de más" | "Muchos están pagando por coberturas que no usan" |
| "Tú, que eres mamá…" | "Para quienes están planificando un embarazo" |

Regla mecánica: **si el copy usa "tú / tienes / estás" para afirmar una condición del
lector, reescribir en tercera persona o como pregunta general.**

### Posición regulatoria (misma que en Google, sección 5 de `GOOGLE-ADS.md`)

Planiapp **no es agente de ventas ni corredor**. El copy no puede sonar a que Planiapp
vende el plan.

| ❌ No decir | ✅ Decir |
|---|---|
| "Cotiza este plan con nosotros" | "Te mostramos si este tipo de plan te conviene" |
| "Contrata en Consalud" | "La contratación la haces con un ejecutivo inscrito" |
| "Certificados por la Superintendencia" | "Ejecutivos inscritos en la Superintendencia" |

### Marcas de isapres en los creativos

- **Nombre de la isapre en texto: permitido**, siempre que el plan sea real, vigente y
  tengas el documento. Meta es más laxa que Google acá, pero la que puede reclamar es
  la isapre.
- **Logo de la isapre en la imagen: no**, salvo autorización escrita. Un logo implica
  asociación comercial. (Pendiente igual: verificar la autorización del
  `consalud-logo.png` que ya está en la home.)
- **Precios: siempre "desde X UF · precio referencial"** y el disclaimer de la
  sección 3. El precio real depende de edad, sexo, cargas y de la tabla de factores.

### Prohibido, igual que en Google

Cifras de ahorro sin respaldo · superlativos de precio ("el plan más barato") ·
comparaciones entre isapres que no se puedan documentar · cualquier cosa que
insinúe aval del regulador.

---

## 1. Estructura de campaña

**Una sola campaña.** Con 5.000/día, fragmentar es garantizar que ninguna salga de la
fase de aprendizaje (Meta pide del orden de 50 eventos de optimización por conjunto
por semana; acá no se llega, así que hay que concentrar todo lo posible).

```
Campaña: Planiapp · Leads
├─ Objetivo: Clientes potenciales (Leads)
├─ Presupuesto: CBO, 5.000 CLP/día
├─ Categoría especial de anuncios: NINGUNA
│  (crédito / empleo / vivienda / política son las únicas; salud no lo es)
└─ Conjunto único: CL 25-55 · Amplio
```

### Destino de la conversión — decisión

| Opción | A favor | En contra |
|---|---|---|
| **Formulario instantáneo (Lead Ads)** ← fase 1 | CPL más bajo, no saca a nadie de Facebook, autocompleta nombre/mail/teléfono. **Ya funcionó antes (dato de Gonzalo, 26-08-2026)** | Leads menos comprometidos si se deja en modo "más volumen" |
| Landing `/cambio-isapre` | Mantiene el pipeline tal cual: código, Make.com, Sheets, CallMeBot, gtag | CPL más alto; el clic saca a la persona de la app |
| Click-to-WhatsApp (CTWA) | CPL bajo y responder rápido es tu ventaja | Rompe el pipeline de códigos y el tracking |

**Fase 1: formulario instantáneo.** Hay evidencia propia de que trae leads, y resuelve
el requisito de no sacar a nadie de la plataforma.

### Cómo configurarlo para que NO traiga leads basura

1. **Tipo de formulario: "Intención más alta"** (agrega una pantalla de revisión antes
   de enviar). Es la diferencia entre un lead y un dedo que se resbaló.
2. **Dos preguntas personalizadas de calificación**, después de los campos
   autocompletados:
   - `¿Estás actualmente en Fonasa o en una Isapre?` → Fonasa / Isapre / No sé
   - `Renta imponible aproximada` → tramos
   Filtran a quien no califica y suben la tasa de contacto.
3. **Nunca preguntar por preexistencias, diagnósticos ni tratamientos** en el
   formulario de Meta. Dato sensible: prohibido por Meta y complicado por la
   Ley 21.719. Eso se conversa después, en la asesoría.
4. **Conectar Make.com** con el módulo *Facebook Lead Ads → Watch Leads*, para que
   caiga en Sheets y dispare el WhatsApp de CallMeBot igual que los demás. Sin esto
   los leads quedan atrapados en el Administrador de anuncios y hay que bajar un CSV
   a mano — que es como se pierden.
5. Aceptar los **Términos de Lead Ads** en Configuración de la página (una sola vez).
6. Agregar el `origen = meta` para poder medir la tasa de cierre por canal.

> **El formulario instantáneo solo existe dentro de un anuncio pagado.** Una
> publicación orgánica no lo puede tener: ahí el CTA es comentar, o el link.

**Semana 4: probar CTWA** en un conjunto aparte con 2.000/día, solo si estás
disponible para responder en minutos.

### Configuración del conjunto

- **Ubicación:** Chile. Presencia (residentes), no "personas que estuvieron aquí".
- **Edad: 25 – 55.** Fuera de ahí el cambio de isapre rara vez conviene (ver C5).
- **Sexo:** todos.
- **Intereses: NINGUNO.** Meta eliminó las categorías de segmentación detallada
  relacionadas con salud. Lo que quede disponible con esa etiqueta, no usarlo: invita
  a un rechazo por segmentación sensible. **Público amplio** y que el algoritmo
  encuentre — con creativos tan específicos como estos, el creativo *es* la
  segmentación.
- **Ubicaciones (placements): automáticas.** Con este presupuesto, restringir a Feed
  encarece el CPM sin ganar nada.
- **Optimización:** Conversiones → evento `Lead`. Si en 7 días no junta ~15 eventos,
  bajar a **Clics en enlace** hasta tener volumen.
- **Excluir:** público personalizado de quienes ya enviaron formulario.
  **No** armar remarketing con visitantes de páginas de preexistencias o coberturas
  (dato de salud → prohibido por Meta y por la Ley 21.719).

### Prerrequisito técnico

Píxel de Meta + evento `Lead` en `gracias.html`, con `eventID` = el mismo `codigo`
que ya se usa para deduplicar en Google. Sin píxel, la campaña es a ciegas.

---

## 2. Los creativos

Formato de cada uno: **texto principal** (lo que se lee arriba; los primeros ~125
caracteres son los que importan) · **titular** · **descripción** · **imagen**.

Todos los `[corchetes]` son datos que hay que llenar con un plan **real y vigente**
(ver sección 3). No publicar con placeholders.

---

### C1 · Edad 25–34 — "el primer plan propio"

**Ángulo:** recién salió de la carga de sus padres o entró a su primer trabajo formal.
Paga el 7% y no tiene idea qué cubre. No siente el problema todavía → hay que mostrarle
el número.

> **Texto principal**
>
> A los 25–34 casi nadie eligió su plan de isapre. Te lo asignaron cuando entraste a
> trabajar, y ahí quedó.
>
> Así se ve un plan bien elegido para esa etapa:
>
> 🏥 Hospitalización [XX]% en prestadores en convenio
> 🩺 Ambulatorio [XX]%
> 🚑 Urgencia [tipo de cobertura]
> 💊 [beneficio 3]
> 💰 Desde [X,XX] UF · precio referencial
>
> Es un plan real, vigente en [isapre]. Si el 7% de tu sueldo alcanza para esto y
> estás en algo peor, vale la pena mirarlo.
>
> Te decimos con honestidad si te conviene cambiarte. También si no.
>
> 👉 Revisión sin costo, responde un asesor real.

**Titular:** `Un plan pensado para los 25 a 34`
**Descripción:** `Asesoría independiente · Sin costo para ti`
**CTA:** Más información

**Imagen:** ficha del plan estilo tarjeta, fondo azul Planiapp, los 4 beneficios en
íconos grandes y legibles en móvil. Arriba: `PLAN 25–34`. Abajo, chico:
`Precio referencial. Varía según edad, sexo y cargas.` Sin logo de isapre.

---

### C2 · Edad 30–42 — "cobertura de parto y niños chicos"

**Ángulo:** el más rentable del rubro. La decisión se gatilla sola cuando aparece un
embarazo o un hijo de 2 años que va a urgencias tres veces al año.
⚠️ Cuidado al redactar: nada que implique que la persona está embarazada.

> **Texto principal**
>
> La diferencia entre un parto que sale [monto] y uno que sale casi cubierto es el
> plan que se contrató **antes**, no después.
>
> Un plan orientado a esta etapa suele verse así:
>
> 🏥 Hospitalización [XX]% · incluye parto en [prestadores]
> 👶 Urgencia infantil [XX]%
> 🩺 Ambulatorio [XX]% con tope de [X] UF
> 💰 Desde [X,XX] UF · precio referencial
>
> Importante y poco dicho: **un embarazo en curso se considera preexistencia.**
> Por eso esto se revisa antes de planificar, no durante.
>
> 👉 Un asesor revisa tu caso y te dice qué te cubre hoy tu plan actual.

**Titular:** `Cobertura de parto: se decide antes`
**Descripción:** `Revisión sin costo · Ejecutivos inscritos en la Superintendencia`
**CTA:** Más información

**Imagen:** comparación de dos columnas — "Plan sin cobertura de parto" vs "Plan con
cobertura" — con los porcentajes. Sin fotos de guagua tipo banco de imágenes: se ve a
publicidad genérica y baja el CTR.

---

### C3 · Edad 40–55 — "te llegó el alza" (el de mayor intención)

**Ángulo:** el mejor momento del año para este creativo es cuando salen las cartas de
adecuación. Redactado en general, nunca afirmando que a *esa persona* le subieron.

> **Texto principal**
>
> Cuando llega la carta de adecuación, la reacción natural es aguantar. Es la peor de
> las tres opciones.
>
> Las otras dos:
> ① Cambiar de plan dentro de la misma isapre
> ② Cambiar de isapre
>
> Cuál conviene depende de la edad, las cargas, las preexistencias y de qué prestador
> se usa de verdad. No hay una respuesta general, y desconfía de quien te la dé.
>
> Un plan que suele funcionar bien a esta edad:
> 🏥 Hospitalización [XX]% · 🩺 Ambulatorio [XX]%
> 🚑 [beneficio de urgencia] · 💰 Desde [X,XX] UF referencial
>
> 👉 Te decimos cuál de las tres te conviene. Aunque sea quedarte donde estás.

**Titular:** `Subió el plan: hay tres salidas, no una`
**Descripción:** `Asesoría independiente sin costo`
**CTA:** Más información

**Imagen:** las 3 opciones numeradas, ① tachada en rojo. Formato simple, alto
contraste. Este creativo funciona mejor en texto que en foto.

---

### C4 · Fonasa → Isapre, 28–45

**Ángulo:** la renta subió y el 7% ya da para isapre, pero nadie hizo el cálculo.

> **Texto principal**
>
> El 7% de un sueldo de $1.200.000 son $84.000 mensuales. En Fonasa eso financia el
> tramo que corresponda; en isapre compra un plan concreto.
>
> Con ese monto, un plan disponible hoy se ve así:
> 🏥 Hospitalización [XX]% · 🩺 Ambulatorio [XX]%
> 🚑 [urgencia] · 💰 [X,XX] UF
>
> No siempre conviene: si hay preexistencias, si el prestador que usas es público, o
> si la renta es variable, quedarse en Fonasa puede ser la decisión correcta.
> Eso también te lo decimos.
>
> 👉 Cálculo con tus números reales, sin costo.

**Titular:** `¿El 7% ya alcanza para isapre?`
**Descripción:** `Te decimos también cuándo NO conviene`
**CTA:** Más información

**Imagen:** una calculadora simple: `Sueldo → 7% → esto compra`. Tres pasos.

---

### C5 · Creativo de credibilidad (público amplio, sin filtro de edad)

**Ángulo:** no vende, construye confianza y es el que mejor comentarios genera. En Meta
el engagement baja el CPM, así que este creativo abarata a los otros cuatro.

> **Texto principal**
>
> Tres casos en que **no** conviene cambiarse de isapre, y se los decimos igual a
> quien nos escribe:
>
> ① Después de los 60. La tabla de factores encarece el plan lo suficiente como para
> que el cambio casi nunca compense.
> ② Con una preexistencia declarada y en tratamiento activo. La nueva isapre puede
> excluirla por 18 meses.
> ③ Cuando el plan actual tiene un prestador que se usa de verdad y el nuevo no.
>
> Planiapp no vende planes: te derivamos a ejecutivos inscritos en la Superintendencia
> de Salud y la contratación la haces tú, directamente con ellos. Por eso podemos
> decirte que te quedes donde estás.
>
> 👉 Si igual quieres que revisemos tu caso, es sin costo.

**Titular:** `Cuándo NO cambiarse de isapre`
**Descripción:** `Asesoría independiente`
**CTA:** Más información

**Imagen:** texto sobre fondo plano, los tres puntos numerados. Sin stock photos.

---

### Cómo lanzarlos

**Los 5 dentro del mismo conjunto de anuncios.** Meta reparte solo y le da presupuesto
al que rinde. Cinco conjuntos separados con 1.000/día cada uno = ninguno sale de
aprendizaje.

**Apagar "Mejoras del creativo" / optimizaciones Advantage+** en la sección de
creativos: reescriben el texto con IA, y en rubro regulado eso es exactamente lo que
no puede pasar. Misma lógica que "recursos creados automáticamente" en Google.

**No tocar nada 14 días.** Meta necesita esa ventana. Después: apagar el peor,
duplicar el ángulo del mejor con otra imagen.

---

## 3. Disclaimer obligatorio en todo creativo con cifras

En la imagen (letra chica pero legible) y repetido en la landing:

> Precio referencial. El valor final depende de la edad, sexo y cargas del cotizante
> según la tabla de factores vigente, y de la renta imponible. Plan vigente a
> [mes/año]. Beneficios sujetos a las condiciones del contrato y a las exclusiones
> por preexistencias declaradas.

**Regla dura: cada cifra publicada tiene que ser verificable en un documento del plan
que puedas mostrar.** Si un creativo dice 80% ambulatorio y el plan cambió, hay que
bajarlo el mismo día. La publicidad de planes de salud que induce a error es
justamente el terreno donde la Superintendencia sí tiene competencia, y el reclamo lo
puede iniciar cualquiera que haga clic.

**Antes de publicar cada creativo:**
- [ ] Plan real, vigente, con documento de respaldo guardado
- [ ] Fecha de vigencia anotada en el disclaimer
- [ ] Cifras verificadas contra el documento, no de memoria
- [ ] Copy sin "tú tienes / tú estás" afirmando una condición
- [ ] Sin logo de isapre en la imagen
- [ ] La landing muestra la misma información que el anuncio

---

## 4. Qué esperar con 5.000 CLP/día

~150.000 CLP/mes. Referencias del rubro en Chile (CPM salud/seguros, tráfico frío):

| CPM | Impresiones/mes | Clics (CTR 1,2%) | Leads (CVR landing 8%) |
|---|---|---|---|
| 3.500 | 43.000 | 515 | 41 |
| 6.000 | 25.000 | 300 | 24 |
| 9.000 | 16.700 | 200 | 16 |

Ojo con la comparación: **el lead de Meta cierra bastante peor que el de Google**,
porque nadie lo estaba buscando. Un CPL de Meta 40% más bajo puede ser peor negocio.
La única forma de saberlo es marcar el origen del lead y medir la tasa de cierre por
canal, no el CPL.

→ Agregar campo `origen` (`google` / `meta` / `organico`) en el formulario y que
Make.com lo escriba en Sheets. Sin eso, esta campaña no se puede evaluar.

---

## 5. Datos que faltan para publicar

- [ ] **Plan real 25–34** — isapre, nombre del plan, % hosp., % amb., urgencia, UF
- [ ] **Plan real parto/familia** — ídem + prestadores en convenio
- [ ] **Plan real 40–55** — ídem
- [ ] Documento de respaldo de cada plan, con fecha de vigencia
- [ ] Autorización de uso de marca/logo de las isapres que aparecen en el sitio
- [ ] Píxel de Meta instalado y evento `Lead` verificado en `gracias.html`
- [ ] Campo `origen` en ambos formularios

## 6. Bitácora

| Semana | Gasto | CPM | Clics | CTR | Leads | CPL | Mejor creativo | Cierres |
|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | |
| 2 | | | | | | | | |
| 3 | | | | | | | | |
| 4 | | | | | | | | |
