// ─────────────────────────────────────────────────────────────────────────────
// GESTÃO CENTRAL DE IMAGENS
// Todas as imagens do site vêm daqui. Para usar as fotografias oficiais da
// Trintorum, basta substituir `src` (ficheiro em /public/images ou URL).
//
// As imagens abaixo são TEMPORÁRIAS: fotografias reais do Douro e ambientes de
// vinho do Wikimedia Commons (licenças livres, ver `credit`). Nenhuma delas
// mostra a propriedade, os produtores ou as instalações da Trintorum.
// ─────────────────────────────────────────────────────────────────────────────
const base = import.meta.env.BASE_URL + 'images/'

// Variantes WebP geradas por `npm run images` (640/1280/1920).
const img = (file, alt, w, h, credit) => {
  const n = base + file.replace(/\.jpe?g$/i, '')
  return { src: `${n}-1280.webp`, srcSet: [640, 1280, 1920].map((x) => `${n}-${x}.webp ${x}w`).join(', '), alt, w, h, credit }
}

export const images = {
  // Emblema "30" com folhas de videira (avatar oficial da Trintorum no Facebook), em PNG com transparência.
  emblem: base + 'emblem.webp',

  // O hero é 3D (garrafa procedural). Defina uma imagem aqui para usar como fallback/poster.
  hero: null,

  story: img('box.jpg', 'Caixa de madeira Trintorum 30 com garrafas, sobre folhas de outono', 1536, 2048, 'Fotografia Trintorum (Facebook)'),
  territory: img('territory.jpg', 'Vinhas em socalcos ao longo do rio Douro', 1920, 1080, 'Terraced vineyards along the Douro river — Wikimedia Commons (CC0)'),
  vineyard: img('vineyard.jpg', 'Vinha nova no Pinhão, Douro', 1920, 1280, 'Pinhão — Nova vinha — Wikimedia Commons (CC BY-SA 4.0)'),

  // Coleção: caixa Domus Trintorum sobre folhas de outono (fotografia oficial). As garrafas 1 e 2 foram
  // trocadas digitalmente (recorte por IA + composição) na fotografia da terceira. Substituir por fotografias reais.
  collection: [
    { src: base + 'collection/scene-1.webp', w: 1000, h: 1338, alt: 'Garrafa Trintorum 30 tinto na caixa de madeira sobre folhas de outono' },
    { src: base + 'collection/scene-2.webp', w: 1000, h: 1338, alt: 'Garrafa Trintorum Reserva na caixa de madeira sobre folhas de outono' },
    { src: base + 'collection/scene-3.webp', w: 1000, h: 1338, alt: 'Garrafa Trintorum 17 Reserva na caixa de madeira sobre folhas de outono' },
  ],

  // Uma entrada por vinho (mesma ordem de data/wines.js). `null` = ilustração da garrafa.
  wines: [null, null, null],

  // Etapas do processo (VINHA → GARRAFA). `null` = ilustração da garrafa.
  craft: [
    img('regua.jpg', 'Vinhas do Douro junto ao Peso da Régua', 1920, 1280, 'Douro vineyards in Peso da Régua — Wikimedia Commons (CC BY 3.0)'),
    img('vineyard.jpg', 'Vinha nova no Pinhão, Douro', 1920, 1280, 'Pinhão — Nova vinha — Wikimedia Commons (CC BY-SA 4.0)'),
    img('pour.jpg', 'Copo de vinho tinto', 1280, 1920, 'Glass of red wine — Wikimedia Commons (Domínio público)'),
    img('cellar.jpg', 'Adega com barricas de madeira', 1920, 1440, 'Wine Cellar Showing Barrels — Wikimedia Commons (CC0)'),
    { src: base + 'collection/scene-3.webp', w: 1000, h: 1338, alt: 'Garrafa Trintorum 17 Reserva na caixa de madeira Domus Trintorum, sobre folhas de outono', credit: 'Fotografia Trintorum' },
  ],

  lifestyle: [
    img('trio.jpg', 'Três garrafas Trintorum 30 (tinto e duas reservas) numa caixa de madeira', 518, 742, 'Fotografia Trintorum (Facebook)'),
    img('box-front.jpg', 'Caixa de madeira Trintorum 30 com três garrafas, vista de frente', 414, 414, 'Fotografia Trintorum (Facebook)'),
    img('sunset.jpg', 'Pôr do sol sobre o rio Douro', 1920, 1115, 'Sunset over the Douro — Wikimedia Commons (CC BY-SA 2.0)'),
    img('terraces2.jpg', 'Socalcos do Douro', 1920, 1280, 'Terraced vineyards of the Douro — Wikimedia Commons (CC BY-SA 2.0)'),
  ],
}

export const allImages = () => {
  const list = [images.story, images.territory, images.vineyard, ...images.craft, ...images.lifestyle, ...images.wines]
  return [...new Map(list.filter(Boolean).map((i) => [i.src, i])).values()]
}
