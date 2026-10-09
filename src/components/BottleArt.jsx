import { useId } from 'react'
import { images } from '../data/images'
import { useI18n } from '../i18n/I18nProvider'

// Réplicas ilustradas das três garrafas Trintorum 30 (colheita 2024), a partir da fotografia oficial:
//  tinto         — cápsula bordeaux, rótulo preto, "30" e nome em malva
//  reserva-azul  — cápsula prateada, rótulo azul-marinho com selo de cera azul
//  reserva-ouro  — cápsula dourada, rótulo preto, "30" e nome em dourado
const GLASS = ['#030202', '#2a1a1c', '#0a0607']
const V = {
  tinto: { cap: ['#3d0f22', '#9a3a5e', '#2e0a19'], ink: '#b565a8', label: 'black', sub: 'VINHO TINTO', year: '2024' },
  'reserva-azul': { cap: ['#8d9192', '#e4e6e6', '#7b7f80'], ink: '#dfe4f2', label: 'navy', sub: 'RESERVA', year: '2024' },
  'reserva-ouro': { cap: ['#8a6d1f', '#f0d56b', '#6f5716'], ink: '#d9b24c', label: 'black', sub: 'VINHO TINTO', year: '2024', reserva: true },
}
const NAMES = { tinto: 'Trintorum 30 tinto', 'reserva-azul': 'Trintorum reserva, rótulo azul', 'reserva-ouro': 'Trintorum 30 reserva, rótulo dourado' }

export default function BottleArt({ variant = 'reserva-ouro', className = '' }) {
  const { c } = useI18n()
  const id = useId().replace(/:/g, '')
  const v = V[variant] || V['reserva-ouro']
  const navy = v.label === 'navy'
  return (
    <svg className={className} viewBox="0 0 120 400" role="img" aria-label={`${c.ui.bottleAria} ${NAMES[variant] || 'Trintorum'}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={GLASS[0]} />
          <stop offset=".2" stopColor={GLASS[1]} />
          <stop offset=".34" stopColor={GLASS[2]} />
          <stop offset=".78" stopColor={GLASS[2]} />
          <stop offset="1" stopColor={GLASS[0]} />
        </linearGradient>
        <linearGradient id={`c${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={v.cap[0]} />
          <stop offset=".35" stopColor={v.cap[1]} />
          <stop offset="1" stopColor={v.cap[2]} />
        </linearGradient>
        <linearGradient id={`l${id}`} x1="0" x2="1">
          {navy ? (
            <>
              <stop offset="0" stopColor="#141a48" />
              <stop offset=".3" stopColor="#222a6b" />
              <stop offset="1" stopColor="#141a48" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#060506" />
              <stop offset=".3" stopColor="#141113" />
              <stop offset="1" stopColor="#060506" />
            </>
          )}
        </linearGradient>
        <mask id={`m${id}`} style={{ maskType: 'alpha' }}>
          <image href={images.emblem} x={navy ? 44 : 31} y={navy ? 236 : 234} width={navy ? 32 : 58} height={navy ? 33 : 60} preserveAspectRatio="xMidYMid meet" />
        </mask>
      </defs>

      {/* vidro */}
      <path
        d="M50 14h20v8h2v58c0 22 24 42 24 78v226c0 8-6 14-14 14H38c-8 0-14-6-14-14V158c0-36 24-56 24-78V22h2z"
        fill={`url(#g${id})`}
        stroke="rgba(236,228,212,.16)"
      />
      {/* cápsula */}
      <path d="M49 6h22v60H49z" fill={`url(#c${id})`} />
      <path d="M49 62h22" stroke="rgba(0,0,0,.4)" />
      <path d="M33 160c-2 30-2 60-2 90" stroke="rgba(255,255,255,.14)" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* rótulo */}
      <rect x="24" y="212" width="72" height="126" fill={`url(#l${id})`} />
      <text x="60" y="226" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="5.4" letterSpacing=".6" fill={navy ? '#cfd6ee' : '#a79f90'}>
        {navy ? 'VINHO TINTO' : v.year}
      </text>
      {navy && (
        <text x="60" y="233" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="5.4" fill="#cfd6ee">
          {v.year}
        </text>
      )}
      {navy ? (
        <>
          <circle cx="60" cy="262" r="21" fill="#7f9fcf" />
          <circle cx="60" cy="262" r="17.5" fill="none" stroke="#b9cdea" strokeWidth=".8" opacity=".8" />
          <rect x="44" y="246" width="32" height="33" fill="#1d2a5e" mask={`url(#m${id})`} />
        </>
      ) : (
        <rect x="31" y="234" width="58" height="60" fill={v.ink} mask={`url(#m${id})`} />
      )}
      <text x="60" y={navy ? 300 : 308} textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="9.4" letterSpacing="1.3" fill={navy ? '#e8ebf5' : v.ink}>
        TRINTORUM
      </text>
      <text x="60" y={navy ? 311 : 317} textAnchor="middle" fontFamily="Inter Variable, sans-serif" fontSize="3.4" letterSpacing="1.6" fill={navy ? '#dfe4f2' : '#9d9588'}>
        {navy ? 'RESERVA' : v.sub}
      </text>
      {v.reserva && (
        <text x="60" y="324" textAnchor="middle" fontFamily="Inter Variable, sans-serif" fontSize="3.4" letterSpacing="1.6" fill={v.ink}>
          RESERVA
        </text>
      )}
      <rect x="29" y="328" width="62" height="1.2" fill={navy ? '#7f9fcf' : '#4a4547'} opacity=".7" />
    </svg>
  )
}
