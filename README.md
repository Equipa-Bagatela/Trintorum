# Trintorum — Website

React + Vite + Three.js (React Three Fiber + Drei) + GSAP.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção → dist/
npm run preview
```

## Como substituir conteúdo
| O quê | Onde |
|---|---|
| Fotografias | `src/data/images.js` (+ ficheiros em `public/images/`) |
| Vinhos (nome, tipo, ano, castas, notas) | `src/data/wines.js` — campos `null` aparecem como "Em breve" |
| Textos, email, telefone, localização | `src/data/content.js` — contactos a `null` não são mostrados |
| Garrafa 3D real | `src/three/Bottle.jsx` (hoje procedural; trocar por `useGLTF('/bottle.glb')`) |

## Idioma e tema
- PT/EN: todos os textos estão em `src/data/content.js` (`pt` e `en`). O idioma inicial segue o browser e fica guardado em `localStorage`.
- Tema escuro (vinho tinto, por defeito) e claro (vinho branco): variáveis CSS em `src/index.css` (`:root` e `:root[data-theme='light']`); as cenas 3D/WebGL leem o tema em `src/three/themeState.js`.

## Notas
- Nenhum dado sobre vinhos/empresa foi inventado. Imagens atuais são temporárias (Wikimedia Commons; créditos no rodapé e em `images.js`).
- Age gate: `localStorage['trintorum-age-ok']`.
- Qualidade 3D adaptativa em `src/lib/device.js` (partículas, DPR, resolução da malha).
- Antes de publicar: definir URL absoluta do `og:image`, `canonical` e `sitemap.xml`.
