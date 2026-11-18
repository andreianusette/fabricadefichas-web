/* Estadísticas de visitas y descargas de fabricadefichas.es (Umami, sin cookies).
   Panel: cloud.umami.is. Cada página lo carga con una sola línea:
     <script defer src="/estadisticas.js"></script>

   18/11/2026: filtro de visitas que no son de personas.
   - La VISITA a una página solo se cuenta cuando el visitante lleva 3 segundos con
     la página a la vista o hace algo (mueve la página, toca, hace clic, pulsa una
     tecla). Así no cuentan los bots que entran y salen al instante (0 segundos).
   - Los CLICS que se miden (descargas, fichas, ciclo del agua…) se cuentan siempre.
   - Los navegadores automáticos (navigator.webdriver) no se cuentan nunca.
   - Solo cuenta en fabricadefichas.es: si alguien copia la web, no se mezcla.
   Para cambiar algo de las estadísticas, se cambia SOLO este archivo. */
(function () {
  var ID_WEB = 'a131a7c4-b5da-4e31-bdc8-4f0a8e2e3d87';
  var SEGUNDOS = 3;

  var esPersona = false, visitaPendiente = false;

  function confirmar() {
    if (esPersona) return;
    esPersona = true;
    if (visitaPendiente && window.umami) {
      visitaPendiente = false;
      window.umami.track(); // envía ahora la visita que se había retenido
    }
  }

  // Umami llama a esta función antes de enviar cada dato. Devolver false = no se envía.
  window.ffAntesDeEnviar = function (tipo, datos) {
    if (navigator.webdriver) return false;
    if (datos && datos.name) return datos;   // clic medido (descarga, ficha…): siempre
    if (esPersona) return datos;             // visita de alguien que ya está mirando
    visitaPendiente = true;                  // visita retenida hasta confirmar
    return false;
  };

  // Señales de que hay una persona delante
  ['pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'].forEach(function (ev) {
    window.addEventListener(ev, confirmar, { passive: true, once: true, capture: true });
  });
  // 3 segundos con la página a la vista (si está en una pestaña oculta, espera)
  var reloj = null;
  function contarSiVisible() {
    if (document.visibilityState === 'visible') {
      if (!reloj) reloj = setTimeout(confirmar, SEGUNDOS * 1000);
    } else if (reloj) {
      clearTimeout(reloj); reloj = null;
    }
  }
  document.addEventListener('visibilitychange', contarSiVisible);
  contarSiVisible();

  // Cargar Umami con el filtro
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://cloud.umami.is/script.js';
  s.setAttribute('data-website-id', ID_WEB);
  s.setAttribute('data-domains', 'fabricadefichas.es,www.fabricadefichas.es');
  s.setAttribute('data-before-send', 'ffAntesDeEnviar');
  document.head.appendChild(s);
})();
