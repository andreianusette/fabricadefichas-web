/* Correo de contacto de fabricadefichas.es, «disfrazado» para que no lo recojan
   los programas que buscan direcciones en las webs para mandar correo basura.
   27/11/2026. La dirección NO aparece escrita en el HTML: se monta aquí al cargar
   la página. Sin JavaScript se ve «hola (arroba) fabricadefichas.es», sin enlace.

   Cada página lo carga con una sola línea en el <head>:
     <script defer src="/contacto.js"></script>
   y lleva en el pie un enlace así (el texto de dentro es lo que se ve sin JavaScript):
     <a class="correo-contacto" data-umami-event="Escribe al correo">hola (arroba) fabricadefichas.es</a>
   El evento de Umami «Escribe al correo» cuenta los clics.
   Para cambiar la dirección o el asunto, se cambia SOLO este archivo. */
(function () {
  var USUARIO = 'hola';
  var DOMINIO = ['fabricadefichas', 'es'].join('.');
  var ASUNTO = 'Información sobre Fábrica de fichas';

  function poner() {
    var correo = USUARIO + String.fromCharCode(64) + DOMINIO;
    var enlaces = document.querySelectorAll('a.correo-contacto');
    for (var i = 0; i < enlaces.length; i++) {
      enlaces[i].href = 'mailto:' + correo + '?subject=' + encodeURIComponent(ASUNTO);
      enlaces[i].textContent = correo;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poner);
  else poner();
})();
