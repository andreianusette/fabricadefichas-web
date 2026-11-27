/* Correo de contacto de fabricadefichas.es, «disfrazado» para que no lo recojan
   los programas que buscan direcciones en las webs para mandar correo basura.
   27/11/2026. La dirección NO aparece escrita en el HTML: se monta aquí al cargar
   la página. Sin JavaScript se ve «hola (arroba) fabricadefichas.es», sin enlace.

   Cada página lo carga con una sola línea en el <head>:
     <script defer src="/contacto.js"></script>
   y lleva en el pie un enlace así (el texto de dentro es lo que se ve sin JavaScript):
     <a class="correo-contacto" data-umami-event="Escribe al correo">hola (arroba) fabricadefichas.es</a>
   Este archivo añade al lado un botón «Copiar» (icono de dos hojas; al pulsarlo pasa a
   ✓ «Copiado» unos segundos), para quien usa el correo en el navegador (Gmail…) y al
   pulsar el enlace le salta otro programa. Lleva sus propios estilos.
   Umami cuenta los clics: «Escribe al correo» y «Copia el correo».
   Para cambiar la dirección o el asunto, se cambia SOLO este archivo. */
(function () {
  var USUARIO = 'hola';
  var DOMINIO = ['fabricadefichas', 'es'].join('.');
  var ASUNTO = 'Información sobre Fábrica de fichas';

  var ICONO_COPIAR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var ICONO_HECHO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  var ESTILOS =
    '.copiar-correo{display:inline-flex;align-items:center;gap:4px;margin-left:6px;padding:3px 6px;' +
    'border:1px solid transparent;border-radius:6px;background:none;color:inherit;font:inherit;font-size:13px;' +
    'line-height:1;cursor:pointer;vertical-align:middle}' +
    '.copiar-correo:hover,.copiar-correo:focus-visible{border-color:currentColor}' +
    '.copiar-correo .copiar-texto{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '.copiar-correo.hecho .copiar-texto{position:static;width:auto;height:auto;clip:auto}';

  function copiarTexto(texto) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(texto);
    return new Promise(function (ok, mal) {
      var t = document.createElement('textarea');
      t.value = texto; t.setAttribute('readonly', '');
      t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy') ? ok() : mal(); } catch (e) { mal(e); }
      document.body.removeChild(t);
    });
  }

  function poner() {
    var correo = USUARIO + String.fromCharCode(64) + DOMINIO;
    var enlaces = document.querySelectorAll('a.correo-contacto');
    if (!enlaces.length) return;
    var css = document.createElement('style');
    css.textContent = ESTILOS;
    document.head.appendChild(css);

    for (var i = 0; i < enlaces.length; i++) {
      var a = enlaces[i];
      a.href = 'mailto:' + correo + '?subject=' + encodeURIComponent(ASUNTO);
      a.textContent = correo;

      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'copiar-correo';
      b.title = 'Copiar la dirección';
      b.setAttribute('aria-label', 'Copiar la dirección de correo');
      b.setAttribute('data-umami-event', 'Copia el correo');
      b.innerHTML = ICONO_COPIAR + '<span class="copiar-texto">Copiar</span>';
      b.addEventListener('click', function (ev) {
        var boton = ev.currentTarget;
        copiarTexto(correo).then(function () {
          boton.classList.add('hecho');
          boton.innerHTML = ICONO_HECHO + '<span class="copiar-texto" role="status">Copiado</span>';
          clearTimeout(boton._reloj);
          boton._reloj = setTimeout(function () {
            boton.classList.remove('hecho');
            boton.innerHTML = ICONO_COPIAR + '<span class="copiar-texto">Copiar</span>';
          }, 2000);
        }, function () {
          // Si el navegador no deja copiar, se selecciona la dirección para copiarla a mano.
          var r = document.createRange(); r.selectNodeContents(a);
          var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        });
      });
      a.parentNode.insertBefore(b, a.nextSibling);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poner);
  else poner();
})();
