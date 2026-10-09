// ─────────────────────────────────────────────────────────────────────────────
// VINHOS — só entra o que é visível nos rótulos/fotografias oficiais da marca
// (colheita 2024; 750 ml). Campos a `null` aparecem como "Em breve".
// `variant` escolhe a ilustração da garrafa (src/components/BottleArt.jsx).
// TODO(marca): confirmar nomes, castas, fichas técnicas e notas de prova.
// ─────────────────────────────────────────────────────────────────────────────
export const wines = [
  { id: 'trintorum-30-tinto', variant: 'tinto', accent: '#b565a8', name: 'Trintorum 30', type: 'red', year: '2024', size: '750 ml', grapes: null, region: 'Douro', abv: null, notes: null },
  { id: 'trintorum-30-reserva-azul', variant: 'reserva-azul', accent: '#7f9fcf', name: 'Trintorum Reserva', type: 'red-reserve', year: '2024', size: '750 ml', grapes: null, region: 'Douro', abv: '14,5% vol', notes: null },
  { id: 'trintorum-17-reserva', variant: 'reserva-ouro', accent: '#d9b24c', name: 'Trintorum 17 Reserva', type: 'red-reserve', year: '2022', size: '1,5 L', grapes: null, region: 'Douro', abv: null, notes: null },
]
