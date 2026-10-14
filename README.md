# Séptima Pacha

Sitio web de Séptima Pacha, estudio de diseño y desarrollo web de Natalia
Jimena Almagro (Nali), nacido en Salta, para pymes, emprendedores y
profesionales de Salta capital y de toda Argentina. HTML, CSS y JavaScript
puro, sin frameworks, publicado con GitHub Pages.

## Estructura

```
/
├── index.html                          Home
├── servicios.html                      Precios, planes, ¿Qué es SEO y GEO?, FAQ
├── diseno-web-salta.html               Página local: diseño web en Salta
├── cuanto-cuesta-una-pagina-web.html   Guía de precios (contenido para SEO/GEO)
├── codigo-fluido.html                  Proyectos (portfolio)
├── plantillas.html                     Catálogo de plantillas
├── sobre-mi.html                       Natalia Jimena Almagro (autoría / E-E-A-T)
├── terminos.html                       Términos, datos del prestador, licencias
├── privacidad.html                     Política de privacidad (Ley 25.326)
├── arrepentimiento.html                Botón de arrepentimiento y baja
├── css/style.css                       Estilos compartidos
├── js/main.js                          Navegación, formularios, conversión USD
├── fonts/                              Tipografías alojadas localmente
├── img/                                Imágenes en WebP + og-septima-pacha.jpg
├── favicon.ico, apple-touch-icon.png
├── sitemap.xml
└── robots.txt
```

## Formularios

Los formularios (index, servicios y arrepentimiento) envían por Web3Forms
usando la access key del atributo `data-web3forms-key`. Los mensajes llegan
al email registrado en la cuenta de Web3Forms.

## Pendientes para la dueña del sitio

- Agregar la condición fiscal (ARCA) y, si se quiere, el domicilio fiscal
  completo en `terminos.html` (hay un comentario que marca el lugar).
- Pegar el código de **Data Fiscal (ARCA)** en `terminos.html` (hay un
  comentario que marca el lugar).
- Sumar una foto en `img/natalia-almagro.webp` (ver comentario en sobre-mi.html).
- Sumar 2-3 testimonios reales en `codigo-fluido.html`.
- Crear el Perfil de Empresa en Google y agregar su enlace al footer y a
  `sameAs` en los datos estructurados de index.html.
