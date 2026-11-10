/* MATTANO'S · interacciones de la landing (sin dependencias) */
(function () {
  "use strict";

  var D = window.MATTANOS;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  }

  function linkWhatsApp(numero, texto) {
    return "https://wa.me/" + numero + "?text=" + encodeURIComponent(texto);
  }

  function linkMapa(consulta) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(consulta);
  }

  function listar(arr) {
    if (arr.length < 2) return arr.join("");
    return arr.slice(0, -1).join(", ") + " y " + arr[arr.length - 1];
  }

  /* ================= Sucursales ================= */
  function montarSucursales() {
    var grilla = $("#suc-grilla"), pie = $("#pie-suc");
    D.sucursales.forEach(function (s, i) {
      var saludo = "¡Hola Mattano's " + s.nombre + "! Quiero hacer un pedido.";
      var card = el("article", { class: "suc aparece" },
        '<span class="suc__num">SUCURSAL 0' + (i + 1) + "</span>" +
        "<h3>" + s.nombre + "</h3>" +
        '<p class="suc__dir">' + (s.direccion || "Luján, Buenos Aires") + "</p>" +
        '<div class="suc__links">' +
          '<a class="suc__wa" target="_blank" rel="noopener" href="' + linkWhatsApp(s.whatsapp, saludo) + '"><svg class="ico"><use href="#ico-wa"/></svg>Escribir por WhatsApp</a>' +
          '<a class="suc__mapa" target="_blank" rel="noopener" href="' + linkMapa(s.mapa) + '">Cómo llegar</a>' +
        "</div>");
      card.style.setProperty("--demora", i * 90 + "ms");
      grilla.appendChild(card);

      var li = el("li");
      var a = el("a", { href: linkWhatsApp(s.whatsapp, saludo), target: "_blank", rel: "noopener" });
      a.textContent = "WhatsApp " + s.nombre;
      li.appendChild(a);
      pie.appendChild(li);
    });

    /* Inclinación suave de las tarjetas siguiendo el mouse */
    if (!sinMovimiento && window.matchMedia("(hover: hover)").matches) {
      $$(".suc").forEach(function (c) {
        c.addEventListener("pointermove", function (e) {
          var r = c.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          c.style.transform = "perspective(700px) rotateX(" + (-y * 7).toFixed(2) + "deg) rotateY(" + (x * 7).toFixed(2) + "deg) translateY(-4px)";
        });
        c.addEventListener("pointerleave", function () { c.style.transform = ""; });
      });
    }
  }

  /* ================= Horarios y "abierto ahora" ================= */
  var DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  function hora(h) {
    var hh = h % 24;
    return (hh < 10 ? "0" : "") + hh + ":00";
  }

  function ahoraEnLujan() {
    /* La hora del local, sin importar dónde esté quien mira la página */
    var partes = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Argentina/Buenos_Aires", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23",
    }).formatToParts(new Date());
    var o = {};
    partes.forEach(function (p) { o[p.type] = p.value; });
    var dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday);
    return { dia: dia, horas: parseInt(o.hour, 10) + parseInt(o.minute, 10) / 60 };
  }

  function montarHorarios() {
    var t = ahoraEnLujan();
    var tabla = $("#tabla-horarios");
    [1, 2, 3, 4, 5, 6, 0].forEach(function (d) {
      var h = D.horarios[d];
      var tr = el("tr", d === t.dia ? { class: "es-hoy" } : null,
        '<th scope="row">' + DIAS[d] + "</th><td>" + hora(h.abre) + " a " + hora(h.cierra) + "</td>");
      tabla.appendChild(tr);
    });

    var estado = $("#estado"), txt = $("#estado-txt");
    var hoy = D.horarios[t.dia], ayer = D.horarios[(t.dia + 6) % 7];
    var abierto = false, cierra = null;

    if (ayer.cierra > 24 && t.horas < ayer.cierra - 24) { abierto = true; cierra = ayer.cierra; }
    else if (t.horas >= hoy.abre && t.horas < hoy.cierra) { abierto = true; cierra = hoy.cierra; }

    if (abierto) {
      estado.classList.add("is-abierto");
      txt.textContent = "Abierto ahora · hasta " + (cierra % 24 === 0 ? "la medianoche" : "la " + (cierra % 24));
    } else {
      estado.classList.add("is-cerrado");
      var abreHoy = t.horas < hoy.abre;
      var prox = abreHoy ? hoy : D.horarios[(t.dia + 1) % 7];
      txt.textContent = "Cerrado ahora · abrimos " + (abreHoy ? "hoy" : "mañana") + " a las " + prox.abre;
    }
  }

  /* ================= Scroll: barra, apariciones, moto ================= */
  function montarScroll() {
    var barra = $("#barra"), flotante = $("#flotante"), moto = $("#moto"), ruta = $(".ruta");
    var armador = $("#sucursales");

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-visto"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      $$(".aparece").forEach(function (n) { io.observe(n); });
    } else {
      $$(".aparece").forEach(function (n) { n.classList.add("is-visto"); });
    }

    var pendiente = false;
    function alScroll() {
      pendiente = false;
      var y = window.scrollY, vh = window.innerHeight;
      barra.classList.toggle("is-scroll", y > 30);

      var ra = armador.getBoundingClientRect();
      var enArmador = ra.top < vh * 0.7 && ra.bottom > vh * 0.3;
      flotante.classList.toggle("is-visible", y > vh * 0.7 && !enArmador);

      if (!sinMovimiento) {
        var r = ruta.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        moto.style.setProperty("--x", (-200 + p * (window.innerWidth + 260)).toFixed(1) + "px");
      }
    }
    window.addEventListener("scroll", function () {
      if (!pendiente) { pendiente = true; requestAnimationFrame(alScroll); }
    }, { passive: true });
    window.addEventListener("resize", alScroll);
    alScroll();

    /* El sello del hero se inclina hacia el puntero */
    var sello = $("#sello");
    if (!sinMovimiento && window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("pointermove", function (e) {
        if (window.scrollY > window.innerHeight) return;
        var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
        sello.style.transform = "translate(" + (x * 14).toFixed(1) + "px," + (y * 10).toFixed(1) + "px) rotate(" + (x * 5).toFixed(2) + "deg)";
      }, { passive: true });
    }
  }

  /* ================= Arranque ================= */
  $("#link-pya").setAttribute("href", D.pedidosYa);
  $("#link-ig").setAttribute("href", D.instagram);
  $("#anio").textContent = new Date().getFullYear();

  montarSucursales();
  montarHorarios();
  montarScroll();
})();
