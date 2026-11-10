/* ------------------------------------------------------------------
   MATTANO'S · datos del negocio
   Todo lo que cambia seguido (horarios, sucursales) vive acá.
   Se edita este archivo y la página se actualiza sola: no hace falta
   tocar el HTML.
------------------------------------------------------------------- */

window.MATTANOS = {
  instagram: "https://www.instagram.com/heladeriamattanos_/",
  pedidosYa:
    "https://www.pedidosya.com.ar/restaurantes/lujan/mattanos-heladeria-f80ac3d6-a62f-411b-bfe9-23514351e67c-menu",

  /* WhatsApp: los números salen del Linktree oficial de la heladería. */
  sucursales: [
    {
      id: "pueblo-nuevo",
      nombre: "Pueblo Nuevo",
      direccion: "Tropero Moreira 918",
      whatsapp: "542323206656",
      mapa: "Tropero Moreira 918, Luján, Buenos Aires",
    },
    {
      id: "lorenzo-casey",
      nombre: "Lorenzo Casey",
      direccion: "Sobre calle Lorenzo Casey", // TODO: confirmar altura con el local
      whatsapp: "542323273031",
      mapa: "Heladería Mattano's Lorenzo Casey Luján Buenos Aires",
    },
    {
      id: "san-martin",
      nombre: "San Martín",
      direccion: "", // TODO: confirmar dirección con el local
      whatsapp: "542323555030",
      mapa: "Heladería Mattano's San Martín Luján Buenos Aires",
    },
    {
      id: "open-door",
      nombre: "Open Door",
      direccion: "Open Door, partido de Luján", // TODO: confirmar calle y altura con el local
      whatsapp: "542323611525",
      mapa: "Heladería Mattano's Open Door Buenos Aires",
    },
  ],

  /* Horarios publicados para Pueblo Nuevo. 0 = domingo … 6 = sábado.
     "cierra" mayor a 24 significa que pasa la medianoche (25 = 1 AM). */
  horarios: {
    0: { abre: 12, cierra: 24 },
    1: { abre: 14, cierra: 24 },
    2: { abre: 14, cierra: 24 },
    3: { abre: 14, cierra: 24 },
    4: { abre: 14, cierra: 24 },
    5: { abre: 14, cierra: 25 },
    6: { abre: 13, cierra: 25 },
  },

};
