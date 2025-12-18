# Cache Invalidation System

Sistema di invalidazione automatica della cache del frontend quando cambiano prodotti e prezzi nel backend Medusa.

**Nota:** L'inventario non viene cachato e viene sempre letto fresh dal database, quindi non richiede invalidazione.

## Come Funziona

Il sistema utilizza un approccio **ibrido** che combina:

1. **Time-based revalidation (ISR)**: Cache che si rigenera automaticamente ogni 5 minuti (300 secondi)
2. **On-demand revalidation (Eventi automatici)**: Cache invalidata immediatamente per product/variant/price list updates
3. **Manual revalidation**: Cache invalidata manualmente quando serve per debug o bulk operations

### Architettura

```
Backend Medusa                Frontend Next.js
     │                              │
     │  product.updated event       │
     ├─────────────────────────────►│
     │                              │
     │  POST /api/revalidate        │
     │  ?tag=products               │
     │                              │
     │                         Invalida cache
     │                         + Rigenera pagine
     │                              │
     │  ◄────────────────────────────┤
     │  { revalidated: true }       │
```

## Configurazione

### 1. Environment Variables

**Backend** (`backend/.env`):
```env
FRONTEND_URL=http://localhost:8000
REVALIDATE_SECRET=your-secret-key-here
```

**Frontend** (`storefront/.env.local`):
```env
REVALIDATE_SECRET=your-secret-key-here
```

> **Importante**: Usa lo stesso `REVALIDATE_SECRET` in entrambi i file. In produzione genera un secret sicuro (es. usando `openssl rand -base64 32`).

### 2. Subscriber (Backend)

Il subscriber `backend/src/subscribers/product-cache-invalidation.ts` ascolta automaticamente questi eventi:

**Eventi automatici (invalidazione immediata)**:

- `product.created` - Nuovo prodotto creato
- `product.updated` - Prodotto modificato (titolo, descrizione, ecc.)
- `product.deleted` - Prodotto eliminato
- `product-variant.created` - Nuova variante creata
- `product-variant.updated` - Variante modificata (prezzo, ecc.)
- `product-variant.deleted` - Variante eliminata
- `price-list.updated` - Price list modificata (sconti)
- `price-list.deleted` - Price list eliminata

Quando uno di questi eventi viene emesso, il subscriber chiama automaticamente l'endpoint del frontend per invalidare la cache.

### 3. API Endpoint (Frontend)

L'endpoint `storefront/src/app/api/revalidate/route.ts` gestisce l'invalidazione.

**Chiamato automaticamente dal subscriber quando avvengono eventi.**

Può anche essere chiamato manualmente per forzare invalidazione:

```bash
# Invalida tutte le pagine prodotto
POST /api/revalidate?tag=products

# Invalida una pagina specifica
POST /api/revalidate?path=/products/[handle]
```

Richiede header `x-revalidate-secret` con il valore configurato in `.env.local`


## Come Testare

### 1. Avvia Backend e Frontend
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd storefront
npm run dev
```

### 2. Testa l'Invalidazione Automatica

1. Apri una pagina prodotto nel browser: `http://localhost:8000/it/products/[handle]`
2. Nel backend, modifica il prodotto tramite Admin Panel (es. cambia il titolo o il prezzo)
3. **Risultato atteso**: Il subscriber intercetta l'evento `product.updated` e chiama `/api/revalidate`
4. Ricarica la pagina prodotto → dovresti vedere le modifiche immediatamente

### 3. Testa l'Invalidazione Manuale

Puoi forzare l'invalidazione chiamando direttamente l'endpoint del frontend:

```bash
curl -X POST 'http://localhost:8000/api/revalidate?tag=products' \
  -H 'x-revalidate-secret: your-secret-key-here' \
  -H 'Content-Type: application/json'

# Risposta attesa:
# { "revalidated": true, "type": "tag", "value": "products", "now": 1734567890123 }
```

### 4. Verifica Log Backend

Quando avviene un'invalidazione, dovresti vedere questo log nel backend:

```
Frontend cache invalidated successfully: {
  revalidated: true,
  type: 'tag',
  value: 'products',
  now: 1734567890123
}
```

## Comportamento della Cache

### Development (`npm run dev`)
- Cache sempre fresca ad ogni richiesta
- `revalidate: 300` viene ignorato
- Utile per sviluppo ma non rappresenta produzione

### Production (`npm run build && npm start`)
- Cache con ISR: rigenera ogni 5 minuti (300 secondi)
- Cache invalida immediatamente quando il backend emette eventi
- **Best of both worlds**: performance + freshness

## Troubleshooting

### Cache non si invalida automaticamente

1. **Verifica environment variables**:
   ```bash
   # Backend
   echo $FRONTEND_URL  # Deve essere http://localhost:8000
   echo $REVALIDATE_SECRET  # Deve avere un valore

   # Frontend
   echo $REVALIDATE_SECRET  # Deve essere uguale al backend
   ```

2. **Verifica che il subscriber sia caricato**:
   - Il file deve essere in `backend/src/subscribers/product-cache-invalidation.ts`
   - Restart del backend dopo aver creato il subscriber

3. **Verifica chiamata HTTP**:
   - Aggiungi più log nel subscriber per vedere se viene chiamato
   - Verifica che non ci siano errori di rete tra backend e frontend

### Subscriber non viene eseguito

Verifica che:
- Il file subscriber esista in `backend/src/subscribers/`
- Il file esporti una funzione default e un oggetto `config`
- Hai riavviato il backend dopo aver creato il subscriber

### Secret non corrisponde

Se ottieni errore `401 Invalid secret`:
- Verifica che `REVALIDATE_SECRET` sia identico in backend e frontend
- Riavvia entrambi i server dopo aver modificato i file `.env`

## Note di Produzione

1. **Secret sicuro**: In produzione usa un secret robusto
   ```bash
   openssl rand -base64 32
   ```

2. **FRONTEND_URL corretto**: Configura l'URL pubblico del frontend
   ```env
   FRONTEND_URL=https://tuodominio.com
   ```

3. **CORS**: Assicurati che il backend possa chiamare il frontend

4. **Monitoring**: Monitora i log per verificare che le invalidazioni avvengano correttamente

5. **Rate limiting**: Se hai migliaia di prodotti, considera di aggiungere rate limiting o debouncing

## Riferimenti

- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data)
- [Medusa Events & Subscribers](https://docs.medusajs.com/learn/customization/extend-features/emit-event)
