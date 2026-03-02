# Il Covo di Xur — Storefront

## Tech Stack
- **Framework**: Next.js 14.2.35 (App Router, SSR on-demand per le categorie)
- **Styling**: Tailwind CSS + `@medusajs/ui-preset`
- **Commerce**: Medusa v2
- **Search**: Meilisearch (`react-instantsearch-hooks-web`)
- **Deploy**: Railway

## Design Context

### Users
Collezionisti appassionati — sia giovani (under 25, nativi digitali, mobile-first) che adulti nostalgici (25–40, cercano quel pezzo speciale che ricorda l'infanzia). Sanno già cosa vogliono: cercano prodotti specifici, confrontano, vogliono trovare rapidamente. Gli acquirenti di regalo sono secondari. Il contesto d'uso è principalmente mobile, spesso in movimento.

### Brand Personality
**Energico · Giovane · Divertente**

Il Covo di Xur è il negozio di quel amico appassionato che conosce tutto del settore. Non freddo né corporate — caldo, diretto, un po' irriverente. Il nome è un Easter egg per i fan di Destiny (Xur è il venditore di esotici), il che dice già tutto: questo brand parla ai nerd con affetto.

Voce e tono: entusiasta ma concreto, mai pomposo. Usa termini del settore senza spiegarli — il pubblico li conosce.

### Aesthetic Direction
**Neobrutalist + Pop Culture**

Il sistema di design attuale è il punto di partenza, non il punto di arrivo. Va mantenuto e amplificato verso il pop:
- Bordi netti (`border border-black`), ombre piatte (`shadow-[4px_4px_0px_rgba(0,0,0,1)]`), tipografia aggressiva (`font-black uppercase`) — **da tenere**
- Accent `green-400` (#4ade80) come colore interattivo primario — **da tenere**
- Background neutro `#F4F4F0` come "tela" su cui i colori di categoria risaltano
- I colori per categoria (`metadata.color`) sono il punto di differenziazione visiva — vanno sfruttati di più
- Aggiungere più vivacità cromatica nelle sezioni home (gradient, colori di categoria), non appiattire su grigio
- Evitare: minimal scandinavo, palette desaturate, card uniformi infinite, l'estetica "generic SaaS"

Riferimento mentale: l'energia visiva di un fumetteria o di uno stand a una fiera del gioco — colorato, denso, entusiasmante — ma con la struttura e la leggibilità di un e-commerce serio.

### Design Principles

1. **Scoperta prima di tutto** — ogni pagina deve invogliare a esplorare. Prodotti in evidenza, categorie con personalità visiva propria, nessuna pagina "vuota".

2. **Energia controllata** — il neobrutalism dà struttura e credibilità, il pop culture dà colore e personalità. Non scegliere: usarli insieme. Bordi netti + colori vivaci = identità unica.

3. **Mobile-first reale** — il pubblico giovane naviga principalmente da smartphone. Ogni interazione (menu, filtri, product card, checkout) deve essere pensata con il pollice in mente.

4. **Fiducia visiva** — l'affidabilità si comunica con coerenza: stessa tipografia, stessa griglia, stesse spaziature. Il caos è pop culture, non caos nell'UI.

5. **I colori di categoria sono identità** — Funko Pop, Pokémon, Magic: ogni categoria ha un colore. Usarlo come filo conduttore (header, card highlight, badge, gradient) crea senso di appartenenza e orientamento.

## Design System (Pattern stabiliti)

```
Bordi:          border border-black
Shadow hover:   shadow-[4px_4px_0px_rgba(0,0,0,1)]
Accent:         green-400 (#4ade80)
Background:     #F4F4F0
Font heading:   font-black uppercase tracking-tight
Font logo:      Poppins 700
Border radius:  rounded-md (6px) standard
Animazioni:     ScrollReveal fade-in + hero animate-fade-up
Layout padding: content-container (px-4 lg:px-12 py-8)
```

## Note Architetturali
- Categorie: SSR on-demand (no `generateStaticParams` — incompatibile con `cookies()` nel layout)
- `DynamicBackground`: gradient colore categoria su pagine prodotto e categoria
- Colori categoria: `metadata.color` su ogni top-level category
- CartButton: server component (non convertire a client — vedi nota DYNAMIC_SERVER_USAGE)
