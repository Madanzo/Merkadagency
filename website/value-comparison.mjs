const comparisons = {
 en: {
  heading: 'Why we charge more',
  intro: 'The CRM license is $1,500 setup plus $800/month. Shops that want hands-on marketing can work with the same partner for ads, their Google Business Profile, reviews and follow-up. We agree on the scope of managed marketing in writing.',
  caption: 'Compare software and managed marketing',
  columns: ['What you get', 'Shop software', 'Typical agency', 'MerkadAgency'],
  statuses: { yes: 'Yes', partial: 'Partial', varies: 'Varies', soon: 'Coming soon' },
  rows: [
   'Done-for-you ads',
   'Google Business Profile managed for you',
   'Reviews managed for you',
   'Customer follow-ups run for you',
   'CRM included',
   'Proven in our own Austin shop, Phantom Wraps',
   'English and Spanish',
   'Built only for wrap, PPF, tint, ceramic coating and detailing shops',
   'AI receptionist and promotional calls with customer consent',
   'One partner instead of several tools and an agency',
  ],
 },
 es: {
  heading: 'Por qué cobramos más',
  intro: 'La licencia del CRM tiene un costo inicial de $1,500 más $800 al mes. Si también quieres delegar el marketing, puedes trabajar con el mismo equipo para gestionar anuncios, tu Perfil de Empresa de Google, reseñas y seguimiento. Acordamos por escrito el alcance del servicio de marketing.',
  caption: 'Compara el software con los servicios de marketing',
  columns: ['Qué incluye', 'Software para talleres', 'Agencia típica', 'MerkadAgency'],
  statuses: { yes: 'Sí', partial: 'Parcial', varies: 'Depende', soon: 'Próximamente' },
  rows: [
   'Gestión de anuncios',
   'Gestión del Perfil de Empresa de Google',
   'Gestión de reseñas',
   'Seguimiento de clientes a cargo del equipo',
   'CRM incluido',
   'Probado en Phantom Wraps, nuestro propio taller en Austin',
   'Inglés y español',
   'Diseñado solo para talleres de rotulación, PPF, polarizado, recubrimiento cerámico y detallado',
   'Recepcionista con IA y llamadas promocionales con el consentimiento del cliente',
   'Un solo equipo en lugar de varias herramientas y una agencia',
  ],
 },
};

const coverage = [
 ['varies', 'varies', 'yes'], // Ads
 ['varies', 'varies', 'yes'], // Google Business Profile
 ['partial', 'varies', 'yes'], // Reviews
 ['partial', 'varies', 'yes'], // Follow-ups
 ['varies', 'varies', 'yes'], // CRM
 ['varies', 'varies', 'yes'], // Phantom
 ['varies', 'varies', 'yes'], // Languages
 ['varies', 'varies', 'yes'], // Specialties
 ['varies', 'varies', 'soon'], // Planned features
 ['partial', 'varies', 'yes'], // Single partner
];

export function valueComparison(lang) {
 const { heading, intro, caption, columns, statuses, rows } = comparisons[lang];
 return `<section class="value-comparison" aria-labelledby="value-heading">
<h2 id="value-heading">${heading}</h2>
<p>${intro}</p>
<div class="comparison-scroll" role="region" aria-labelledby="comparison-caption" tabindex="0">
<table><caption id="comparison-caption">${caption}</caption>
<thead><tr>${columns.map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead>
<tbody>${rows.map((label, index) => `<tr><th scope="row">${label}</th>${coverage[index].map(status =>
 `<td>${status === 'yes' ? '<span aria-hidden="true">✓</span> ' : ''}${statuses[status]}</td>`,
).join('')}</tr>`).join('')}</tbody>
</table>
</div>
</section>`;
}
