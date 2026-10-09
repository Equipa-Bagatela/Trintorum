// ─────────────────────────────────────────────────────────────────────────────
// CONTEÚDO DO SITE — PT e EN
// Só o que é confirmável está como facto:
//   • Trintorum é uma marca portuguesa de vinhos (@trintorum_vinhos no Instagram);
//   • factos sobre a região do Douro são factos da REGIÃO, não da marca.
// Tudo o resto é texto editorial/poético sem afirmações factuais.
// TODO(marca): substituir pelos textos oficiais quando existirem.
// ─────────────────────────────────────────────────────────────────────────────
export const brand = {
  name: 'Trintorum',
  instagram: { handle: '@trintorum_vinhos', url: 'https://www.instagram.com/trintorum_vinhos/' },
  facebook: { url: 'https://www.facebook.com/people/Trintorum/100064894337460/' },
  // Preencher apenas com dados reais. Campos a null não são apresentados.
  email: null,
  phone: null,
  location: null,
}

const detailsGeo = [
  { id: 'label', rot: 0, y: 0, z: 5.0 },
  { id: 'capsule', rot: 0.5, y: 1.1, z: 3.6 },
  { id: 'glass', rot: Math.PI, y: -0.2, z: 5.2 },
  { id: 'origin', rot: -0.35, y: -0.5, z: 5.0 },
]
const pt = {
  meta: {
    title: 'Trintorum — Vinhos',
    description: 'Trintorum — marca portuguesa de vinhos. Uma expressão de território, identidade e vinho. Acompanhe a viagem em @trintorum_vinhos.',
  },
  nav: [
    { id: 'home', label: 'Início' },
    { id: 'story', label: 'A história' },
    { id: 'territory', label: 'Território' },
    { id: 'wines', label: 'Vinhos' },
    { id: 'contact', label: 'Contacto' },
  ],
  ui: {
    gate: {
      q: 'Tem 18 anos ou mais?',
      yes: 'Sim, entrar',
      no: 'Não',
      thanks: 'Obrigado pela visita.',
      denied: 'O acesso a este website é reservado a maiores de 18 anos.',
      back: 'Voltar',
      legal: 'Beba com moderação.',
    },
    navMain: 'Principal',
    navMobile: 'Menu móvel',
    menuOpen: 'Abrir menu',
    menuClose: 'Fechar menu',
    homeAria: 'Trintorum — início',
    langAria: 'Mudar idioma',
    themeToDark: 'Mudar para o modo escuro',
    themeToLight: 'Mudar para o modo claro',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    wineRows: { type: 'Tipo', year: 'Colheita', size: 'Formato', grapes: 'Castas', region: 'Região', abv: 'Álcool', notes: 'Notas de prova' },
    wineMore: 'Ficha técnica e notas de prova em breve.',
    wineTrack: 'Coleção de vinhos (deslize na horizontal)',
    wineTypes: { red: 'Tinto', 'red-reserve': 'Tinto, reserva' },
    craftHint: 'Deslize para o lado',
    cursorView: 'Ver',
    cursorDrag: 'Arrastar',
    bottleHint: 'Arraste para rodar',
    bottleAria: 'Garrafa',
    chainAria: 'Do Douro ao vinho',
    footerBrand: 'Vinhos portugueses.',
    footerNav: 'Navegação',
    footerSocial: 'Redes',
    footerAria: 'Rodapé',
    credits: 'Créditos das imagens temporárias',
    alsoOn: 'Também no',
  },
  hero: {
    eyebrow: 'Vinhos do Douro, Portugal',
    lines: ['Da terra,', 'para o copo.'],
    scroll: 'Deslize para explorar',
    beats: [
      { k: 'Do vinho à terra', title: 'Antes do vinho,\nexiste o chão.' },
      { k: 'Da terra ao Douro', title: 'Socalcos,\nrio e luz.' },
      { k: 'Do Douro ao tempo', title: 'O que a terra começa,\no tempo conclui.' },
    ],
    steps: ['Vinho', 'Terra', 'Douro', 'Tempo'],
  },
  story: {
    label: 'A marca',
    title: 'Uma expressão de território, identidade e vinho.',
    body: [
      'A Trintorum é uma marca portuguesa de vinhos.',
      'Acreditamos que um vinho começa antes da vinha: começa no lugar. No chão que o sustenta, na luz que o amadurece, no tempo que o espera.',
    ],
    caption: 'Trintorum 30',
  },
  territory: {
    label: 'O território',
    title: ['O território', 'molda', 'o vinho.'],
    intro: 'No Douro, a paisagem foi desenhada à mão, socalco a socalco, até se tornar vinho.',
    chain: [
      { k: 'Douro', t: 'Região vinhateira esculpida em socalcos ao longo do rio.' },
      { k: 'Solo', t: 'Terra pobre e pedregosa, onde a vinha tem de procurar.' },
      { k: 'Vinha', t: 'Em patamares, voltada à luz e ao rio.' },
      { k: 'Uva', t: 'Castas portuguesas, moldadas pelo lugar.' },
      { k: 'Vinho', t: 'A expressão final do território.' },
    ],
    // Factos da REGIÃO do Douro (não da marca).
    facts: [
      { v: '1756', t: 'Uma das mais antigas regiões vinhateiras demarcadas do mundo' },
      { v: '2001', t: 'Alto Douro Vinhateiro, Património Mundial da UNESCO' },
    ],
  },
  wineSection: { label: 'Os vinhos', title: 'A coleção', intro: 'Cada garrafa, uma leitura do mesmo lugar.', soon: 'Em breve' },
  craft: {
    label: 'O processo',
    title: 'Do chão à garrafa.',
    steps: [
      { n: '01', k: 'Vinha', t: 'Tudo começa no cuidado com a planta e com o chão.' },
      { n: '02', k: 'Colheita', t: 'O momento certo decide o ano.' },
      { n: '03', k: 'Vinificação', t: 'A uva torna-se vinho.' },
      { n: '04', k: 'Estágio', t: 'O tempo faz o seu trabalho, em silêncio.' },
      { n: '05', k: 'Garrafa', t: 'O vinho encontra a sua forma final.' },
    ],
  },
  bottle: {
    label: 'A garrafa',
    title: 'Um objeto de design.',
    intro: 'Arraste para rodar a garrafa. Escolha um detalhe para o explorar.',
    note: 'Modelo 3D ilustrativo, baseado no rótulo do Trintorum 30 Reserva.',
    details: [
      { k: 'Rótulo', t: 'Papel preto com o emblema «30» entre folhas de videira e o nome Trintorum a dourado.' },
      { k: 'Cápsula', t: 'Cápsula dourada que prolonga a silhueta da garrafa; nas outras reservas é prateada ou bordeaux.' },
      { k: 'Vidro', t: 'Vidro escuro e silhueta clássica de garrafa de vinho tinto, que protege e deixa espaço ao rótulo.' },
      { k: 'Origem', t: 'Douro, Portugal. O lugar que dá nome a tudo o resto.' },
    ].map((d, i) => ({ ...d, ...detailsGeo[i] })),
  },
  lifestyle: { label: 'A experiência', title: ['O vinho é o pretexto.', 'O momento é o resto.'], captions: ['Os três', 'A caixa', 'O fim de tarde', 'O Douro'] },
  contact: { label: 'Contacto', title: ['Siga', 'a viagem.'], intro: 'Acompanhe a Trintorum no Instagram.', rows: { email: 'Email', phone: 'Contacto', location: 'Localização' } },
  legal: 'Beba com moderação. O consumo excessivo de álcool é prejudicial para a saúde. Proibida a venda a menores de 18 anos.',
  alts: {},
}

const en = {
  meta: {
    title: 'Trintorum — Wines',
    description: 'Trintorum — a Portuguese wine brand. An expression of territory, identity and wine. Follow the journey at @trintorum_vinhos.',
  },
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'story', label: 'The Story' },
    { id: 'territory', label: 'Territory' },
    { id: 'wines', label: 'Wines' },
    { id: 'contact', label: 'Contact' },
  ],
  ui: {
    gate: {
      q: 'Are you 18 or older?',
      yes: 'Yes, enter',
      no: 'No',
      thanks: 'Thank you for visiting.',
      denied: 'This website is for visitors aged 18 or over.',
      back: 'Back',
      legal: 'Please drink responsibly.',
    },
    navMain: 'Main',
    navMobile: 'Mobile menu',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    homeAria: 'Trintorum — home',
    langAria: 'Change language',
    themeToDark: 'Switch to dark mode',
    themeToLight: 'Switch to light mode',
    themeLight: 'Light',
    themeDark: 'Dark',
    wineRows: { type: 'Type', year: 'Vintage', size: 'Size', grapes: 'Grapes', region: 'Region', abv: 'Alcohol', notes: 'Tasting notes' },
    wineMore: 'Technical sheet and tasting notes coming soon.',
    wineTrack: 'Wine collection (swipe sideways)',
    wineTypes: { red: 'Red', 'red-reserve': 'Red, reserva' },
    craftHint: 'Swipe sideways',
    cursorView: 'View',
    cursorDrag: 'Drag',
    bottleHint: 'Drag to rotate',
    bottleAria: 'Bottle',
    chainAria: 'From the Douro to the wine',
    footerBrand: 'Portuguese wines.',
    footerNav: 'Navigation',
    footerSocial: 'Social',
    footerAria: 'Footer',
    credits: 'Temporary image credits',
    alsoOn: 'Also on',
  },
  hero: {
    eyebrow: 'Wines from the Douro, Portugal',
    lines: ['From the land,', 'into the glass.'],
    scroll: 'Scroll to explore',
    beats: [
      { k: 'From wine to land', title: 'Before the wine,\nthere is the ground.' },
      { k: 'From land to Douro', title: 'Terraces,\nriver and light.' },
      { k: 'From Douro to time', title: 'What the land begins,\ntime completes.' },
    ],
    steps: ['Wine', 'Land', 'Douro', 'Time'],
  },
  story: {
    label: 'The brand',
    title: 'An expression of territory, identity and wine.',
    body: [
      'Trintorum is a Portuguese wine brand.',
      'We believe a wine begins before the vineyard: it begins in the place. In the ground that holds it, the light that ripens it, the time that waits for it.',
    ],
    caption: 'Trintorum 30',
  },
  territory: {
    label: 'The territory',
    title: ['Territory', 'shapes', 'the wine.'],
    intro: 'In the Douro, the landscape was drawn by hand, terrace by terrace, until it became wine.',
    chain: [
      { k: 'Douro', t: 'A wine region carved into terraces along the river.' },
      { k: 'Soil', t: 'Poor, stony earth, where the vine has to search.' },
      { k: 'Vineyard', t: 'On terraces, facing the light and the river.' },
      { k: 'Grape', t: 'Portuguese grape varieties, shaped by the place.' },
      { k: 'Wine', t: 'The final expression of the territory.' },
    ],
    facts: [
      { v: '1756', t: 'One of the oldest demarcated wine regions in the world' },
      { v: '2001', t: 'Alto Douro Wine Region, UNESCO World Heritage Site' },
    ],
  },
  wineSection: { label: 'The wines', title: 'The collection', intro: 'Each bottle, a reading of the same place.', soon: 'Coming soon' },
  craft: {
    label: 'The process',
    title: 'From the ground to the bottle.',
    steps: [
      { n: '01', k: 'Vineyard', t: 'It all begins with care for the plant and the ground.' },
      { n: '02', k: 'Harvest', t: 'The right moment decides the year.' },
      { n: '03', k: 'Winemaking', t: 'The grape becomes wine.' },
      { n: '04', k: 'Ageing', t: 'Time does its work, in silence.' },
      { n: '05', k: 'Bottle', t: 'The wine finds its final form.' },
    ],
  },
  bottle: {
    label: 'The bottle',
    title: 'A design object.',
    intro: 'Drag to rotate the bottle. Pick a detail to explore it.',
    note: 'Illustrative 3D model, based on the Trintorum 30 Reserva label.',
    details: [
      { k: 'Label', t: 'Black paper with the “30” emblem among vine leaves and the Trintorum name in gold.' },
      { k: 'Capsule', t: 'A gold capsule that extends the bottle’s silhouette; on the other reservas it is silver or bordeaux.' },
      { k: 'Glass', t: 'Dark glass and the classic red-wine bottle silhouette, which protects the wine and leaves room for the label.' },
      { k: 'Origin', t: 'Douro, Portugal. The place that gives its name to everything else.' },
    ].map((d, i) => ({ ...d, ...detailsGeo[i] })),
  },
  lifestyle: { label: 'The experience', title: ['Wine is the pretext.', 'The moment is the rest.'], captions: ['The three', 'The box', 'Sunset', 'The Douro'] },
  contact: { label: 'Contact', title: ['Follow', 'the journey.'], intro: 'Follow Trintorum on Instagram.', rows: { email: 'Email', phone: 'Phone', location: 'Location' } },
  legal: 'Please drink responsibly. Excessive alcohol consumption is harmful to health. Sale to persons under 18 is prohibited.',
  // alt de imagens: chave = alt em PT
  alts: {
    'Caixa de madeira Trintorum 30 com garrafas, sobre folhas de outono': 'Trintorum 30 wooden box with bottles, on autumn leaves',
    'Vinhas em socalcos ao longo do rio Douro': 'Terraced vineyards along the Douro river',
    'Vinha nova no Pinhão, Douro': 'Young vineyard in Pinhão, Douro',
    'Vinhas do Douro junto ao Peso da Régua': 'Douro vineyards near Peso da Régua',
    'Copo de vinho tinto': 'Glass of red wine',
    'Adega com barricas de madeira': 'Cellar with wooden barrels',
    'Garrafa Trintorum 17 Reserva na caixa de madeira Domus Trintorum, sobre folhas de outono': 'Trintorum 17 Reserva bottle in the Domus Trintorum wooden box, on autumn leaves',
    'Três garrafas Trintorum 30 (tinto e duas reservas) numa caixa de madeira': 'Three Trintorum 30 bottles (a red and two reservas) in a wooden box',
    'Caixa de madeira Trintorum 30 com três garrafas, vista de frente': 'Trintorum 30 wooden box with three bottles, front view',
    'Pôr do sol sobre o rio Douro': 'Sunset over the Douro river',
    'Socalcos do Douro': 'Douro terraces',
    'Garrafa Trintorum 30 tinto na caixa de madeira sobre folhas de outono': 'Trintorum 30 red bottle in the wooden box on autumn leaves',
    'Garrafa Trintorum Reserva na caixa de madeira sobre folhas de outono': 'Trintorum Reserva bottle in the wooden box on autumn leaves',
    'Garrafa Trintorum 17 Reserva na caixa de madeira sobre folhas de outono': 'Trintorum 17 Reserva bottle in the wooden box on autumn leaves',
    'Garrafa Trintorum 17 Reserva na caixa de madeira Domus Trintorum, sobre folhas de outono.': 'Trintorum 17 Reserva bottle in the Domus Trintorum wooden box, on autumn leaves',
  },
}

export const content = { pt, en }
