import { crmPath, faqSection, marketingPath, phantomPath, shopLinks, shopTypesEs, verticalLinks, verticalLinksEs } from './shop-pages.mjs';

import { valueComparison } from './value-comparison.mjs';

export const spanishHome = '/es';
export const spanishMarketing = '/es/servicios/marketing-para-talleres';
export const spanishCrm = '/es/servicios/crm-para-talleres';
export const spanishPhantom = '/es/proyectos/phantom-wraps';
export const spanishContact = email => `<a class="cta" href="mailto:${email}">Cuéntale a Camilo sobre tu taller</a>`;

export function spanishPages(email) {
 const contact = spanishContact(email);
 const faq = entries => faqSection('Preguntas frecuentes', entries);
 return [
  {
   path: spanishHome,
   englishPath: '/',
   title: 'Marketing y CRM para talleres de rotulación, PPF, polarizado, recubrimiento cerámico y detallado | MerkadAgency',
   description: `Sitios web, SEO local y CRM para ${shopTypesEs}. Muestra tu trabajo y da seguimiento a tus cotizaciones.`,
   heading: 'Haz que te encuentren. Da seguimiento a tus cotizaciones.',
   accent: 'Da seguimiento a tus cotizaciones.',
   body: `<p class="intro">Muestra tu trabajo a clientes de tu zona con un portafolio web. Lleva un registro de cada solicitud de cotización en tu CRM.</p>
${contact}
<div class="grid">
<section class="panel"><h2>Marketing para talleres</h2><p>Muestra tus mejores trabajos, responde las preguntas de tus clientes y explica qué datos necesitas para cotizar. Los sitios web parten de $500.</p><a href="${spanishMarketing}">Conoce el servicio de marketing</a></section>
<section class="panel"><h2>CRM para talleres</h2><p>Organiza las solicitudes de tu sitio web, los contactos y las cotizaciones en un mismo lugar. La licencia tiene un costo inicial de $1,500 más $800 al mes.</p><a href="${spanishCrm}">Conoce el CRM</a></section>
<section class="panel"><h2>Phantom Wraps &amp; Coatings</h2><p>Conoce el sitio web y el proceso de cotización del taller de Camilo Reyna en Austin.</p><a href="${spanishPhantom}">Ver el proyecto de Phantom Wraps</a></section>
</div>
${valueComparison('es')}
<h2>Marketing y CRM por especialidad</h2><ul>${shopLinks(verticalLinksEs).map(link => `<li>${link}</li>`).join('')}</ul>
<h2>¿Solo necesitas un sitio web?</h2><p>Consulta el <a href="/services/website-development" hreflang="en">servicio de desarrollo web (en inglés)</a> para crear o renovar tu sitio.</p>`,
  },
  {
   path: spanishMarketing,
   englishPath: marketingPath,
   title: 'Marketing para talleres de rotulación, PPF, polarizado, recubrimiento cerámico y detallado | MerkadAgency',
   description: `Portafolios web, SEO local y seguimiento de cotizaciones para ${shopTypesEs}. Sitios web desde $500.`,
   heading: 'Marketing para talleres de rotulación, PPF, polarizado, recubrimiento cerámico y detallado.',
   body: `<p class="intro">Ayuda a que los clientes de tu zona encuentren tu taller y entiendan qué trabajos haces. Los sitios web parten de $500. El alcance y los plazos se acuerdan por escrito.</p>
${contact}
<h2>¿Cómo organizo el portafolio de mi taller?</h2><p>Agrupa las fotos que tienes permiso de publicar por servicio. Indica el vehículo, las áreas que trabajaste y el acabado. Así cada cliente puede encontrar un ejemplo parecido a lo que busca.</p>
<h2>¿Qué datos necesito para cotizar?</h2><p>Pide el año, la marca y el modelo del vehículo, el servicio solicitado y las zonas que se van a trabajar. Una rotulación completa, un PPF frontal y un detallado interior requieren datos distintos.</p>
<h2>¿Cómo ayudo a que me encuentren en Google?</h2><p>Publica tus servicios, horarios y zona de atención. Mantén esos datos al día en tu sitio y en el Perfil de Empresa de Google. Responde directamente las preguntas que tus clientes hacen antes de pedir una cotización.</p>
<h2>¿Quién da seguimiento a las cotizaciones?</h2><p>Define quién revisa las solicitudes, pide información faltante y vuelve a contactar al cliente. El <a href="${spanishCrm}">CRM para talleres</a> reúne las solicitudes y las cotizaciones en un solo lugar.</p>
${faq([
 ['¿Puedo empezar solo con un sitio web?', 'Sí. El acuerdo por escrito define las páginas, los contenidos y las funciones incluidas.'],
 ['¿Puedo conservar mi sitio actual?', 'Comparte la dirección de tu sitio, ejemplos de trabajos y cómo recibes las solicitudes. Camilo puede revisar qué páginas conviene conservar o actualizar.'],
])}
<p>Conoce el <a href="${spanishPhantom}">proyecto de Phantom Wraps</a> para ver cómo Camilo presenta los trabajos de su taller.</p>`,
  },
  {
   path: spanishCrm,
   englishPath: crmPath,
   title: 'CRM para talleres de rotulación, PPF, polarizado, recubrimiento cerámico y detallado | MerkadAgency',
   description: `Gestiona solicitudes web, etapas de venta, cotizaciones, facturas y seguimiento en el CRM para ${shopTypesEs}.`,
   heading: 'CRM para gestionar las cotizaciones de tu taller.',
   body: `<p class="intro">Reúne las solicitudes de tu sitio web, cotizaciones, facturas y seguimiento de clientes en un solo CRM. La licencia tiene un costo inicial de <strong>$1,500 más $800 al mes</strong>.</p>
${contact}
<h2>¿Qué incluye el CRM de MerkadAgency?</h2>
<ul>
<li><strong>Solicitudes web y contactos.</strong> Conecta el sitio de tu taller para recibir solicitudes y guardarlas en el CRM.</li>
<li><strong>Etapas de venta.</strong> Consulta qué solicitudes son nuevas, cuáles ya tienen cotización y a cuáles debes dar seguimiento.</li>
<li><strong>Cotizaciones y facturas.</strong> Prepara la cotización y factura los trabajos aceptados.</li>
<li><strong>Solicitudes de reseñas.</strong> Pide una reseña al cliente cuando termines el trabajo.</li>
<li><strong>Campañas de correo.</strong> Envía novedades y mensajes de seguimiento desde tu dominio verificado con la cuenta de Resend de tu taller.</li>
<li><strong>Llamadas con un clic.</strong> Inicia una llamada desde la ficha del cliente con la aplicación de llamadas de tu dispositivo.</li>
<li><strong>Acceso del equipo.</strong> Invita al personal, asigna permisos y configura el perfil y la marca del taller.</li>
</ul>
${valueComparison('es')}
<h2>Por dentro del CRM</h2>
<div class="grid">
<figure class="panel screenshot-placeholder"><figcaption><strong>Etapas de venta</strong><p class="small">Captura de pantalla próximamente.</p></figcaption></figure>
<figure class="panel screenshot-placeholder"><figcaption><strong>Cotizaciones y facturas</strong><p class="small">Captura de pantalla próximamente.</p></figcaption></figure>
</div>
${faq([
 ['¿Puedo usar el sitio web que ya tengo?', 'Envíale a Camilo la dirección del sitio y explica cómo recibes cotizaciones. Así podrán revisar qué hace falta para conectarlo al CRM.'],
 ['¿Desde qué cuenta se envían los correos?', 'Conecta la cuenta de Resend de tu taller y envía los mensajes desde tu dominio verificado.'],
])}
<p>Conoce los <a href="${spanishMarketing}">servicios de marketing</a> o ve cómo Camilo usa el CRM en <a href="${spanishPhantom}">Phantom Wraps &amp; Coatings</a>.</p>`,
  },
  {
   path: spanishPhantom,
   englishPath: phantomPath,
   title: 'Sitio web y CRM de Phantom Wraps & Coatings | MerkadAgency',
   description: 'Conoce el sitio web y el CRM del taller de Camilo Reyna en Austin y el cambio de color de una GMC Sierra de plata a rosa.',
   heading: 'Phantom Wraps and Coatings',
   body: `<p class="intro">Phantom Wraps &amp; Coatings es el taller de Camilo Reyna en Austin. MerkadAgency creó su sitio web y Camilo usa el <a href="${spanishCrm}">CRM de MerkadAgency</a> para gestionar solicitudes, cotizaciones y correos.</p>
${contact}
<h2>Cambio de color de una GMC Sierra con vinilo</h2>
<div class="grid">
<figure class="project-photo"><img src="/visuals/gmc-sierra-before-1600-640-14149a01646e.avif" alt="GMC Sierra plateada antes de la rotulación" width="640" height="360" loading="lazy" decoding="async"><figcaption>Antes de la rotulación en Phantom Wraps &amp; Coatings</figcaption></figure>
<figure class="project-photo"><img src="/visuals/gmc-sierra-after-1600-640-3244fe6d9f95.avif" alt="GMC Sierra con vinilo rosa" width="640" height="360" loading="lazy" decoding="async"><figcaption>Después de la instalación del vinilo rosa</figcaption></figure>
</div>
<p><a href="https://phantomwrapsco.com/#journey">Ver las fotos originales en el sitio de Phantom</a>.</p>
<h2>El taller en Austin</h2><p>Phantom atiende Austin y otras comunidades del centro de Texas. Ofrece rotulación con vinilo, rotulación comercial y de flotillas, recubrimiento de molduras cromadas, recubrimiento cerámico, PPF, polarizado y detallado interior.</p>
<p><a href="https://phantomwrapsco.com/">Consulta los servicios y horarios de Phantom Wraps &amp; Coatings</a>.</p>
<p>Si quieres mejorar el portafolio y el proceso de cotización de tu taller, conoce el <a href="${spanishMarketing}">servicio de marketing</a>.</p>`,
  },
  {
   path: verticalLinksEs[0][0],
   englishPath: verticalLinks[0][0],
   title: 'Marketing y CRM para talleres de PPF | MerkadAgency',
   description: 'Explica qué zonas cubre la película de protección de pintura, mejora tu presencia en búsquedas locales y da seguimiento a cotizaciones de PPF en el CRM.',
   heading: 'Marketing y CRM para talleres de PPF',
   body: `<p class="intro">Explica qué zonas cubre la película de protección de pintura y da seguimiento a cada solicitud de cotización de PPF.</p>
${contact}
<h2>¿Cómo puede un taller de PPF aparecer en búsquedas locales?</h2><p>Dedica una página al PPF. Muestra qué piezas incluye cada opción: frente parcial, frente completo o carrocería completa. Usa fotos autorizadas y mantén tus horarios y zona de atención al día en el Perfil de Empresa de Google.</p>
<p><a href="${spanishMarketing}">Conoce el servicio de marketing y SEO local</a></p>
<h2>¿Qué datos de PPF conviene guardar en el CRM?</h2><p>Registra el año, la marca y el modelo del vehículo, las piezas que el cliente quiere proteger y si ya hay película instalada. Guarda las notas de inspección y las opciones de cobertura junto con la cotización.</p>
<p><a href="${spanishCrm}">Conoce el CRM de MerkadAgency</a></p>
${faq([
 ['¿Qué fotos debería mostrar un taller de PPF?', 'Publica primeros planos autorizados de los bordes y de las piezas más expuestas a impactos. Indica qué piezas cubre cada trabajo.'],
 ['¿Puedo dar seguimiento a varias opciones de cobertura en una sola solicitud?', 'Registra las piezas solicitadas y las opciones que le diste al cliente. Anota en la cotización cuál eligió.'],
])}`,
  },
 ].map(page => ({ ...page, lang: 'es' }));
}
