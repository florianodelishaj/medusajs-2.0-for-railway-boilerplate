import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Spedizioni",
  description:
    "Informazioni su spedizioni, consegne e tempistiche - Il Covo di Xur",
}

export default function SpedizioniPage() {
  return (
    <div className="content-container py-12">
      <div className="max-w-3xl mx-auto prose prose-sm">
        <h1 className="text-3xl font-bold mb-8">Spedizioni</h1>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Tempistiche di spedizione</h2>
          <p>
            Non appena ricevuta la conferma dell&apos;ordine e il relativo
            saldo, ci impegniamo a dar seguito alla spedizione entro e non oltre{" "}
            <strong>7 (sette) giorni lavorativi</strong>.
          </p>
          <p>
            Durante la preparazione della spedizione, ci riserviamo il diritto
            di produrre file multimediali (immagini e/o video)
            dell&apos;approntamento del collo, al fine di tutelare gli interessi
            di entrambe le parti.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Corrieri</h2>
          <p>Ci avvaliamo dei seguenti corrieri/vettori:</p>
          <ul>
            <li>
              <strong>GLS</strong> - consegna all&apos;indirizzo fornito dal
              Cliente
            </li>
            <li>
              <strong>FedEx-TNT</strong> - consegna all&apos;indirizzo fornito
              dal Cliente
            </li>
          </ul>
          <p>
            La scelta del corriere è riservata al cliente. È possibile
            solamente la <strong>spedizione tracciata ed assicurata</strong>, per
            una tutela di entrambe le parti.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Costi di spedizione</h2>
          <p>
            Le spese di spedizione e di consegna sono a carico del Cliente.
          </p>
          <p>
            I costi di spedizione saranno sempre dichiarati anticipatamente e
            potrai verificarli all&apos;interno del carrello in fase di
            checkout, prima di effettuare il pagamento.
          </p>
          <p className="bg-gray-50 p-4 rounded-lg border">
            Per gli ordini superiori ad{" "}
            <strong>&euro; 150,00</strong> la spedizione tracciata ed
            assicurata è <strong>gratuita</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Alla consegna</h2>
          <p>
            È onere del Cliente verificare l&apos;integrità e completezza del
            collo consegnato.{" "}
            <strong>
              Ogni accettazione avvenuta senza riserva libera il Corriere da
              ogni responsabilità circa la corretta tenuta della merce
              consegnata.
            </strong>
          </p>
          <p>
            In caso di danni visibili al pacco, ti consigliamo di accettare la
            consegna con <strong>riserva di controllo</strong> e di contattarci
            immediatamente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Ritardi e imprevisti</h2>
          <p>
            Non possiamo essere ritenuti responsabili per ritardi dovuti a
            eventi imprevisti o straordinari, quali:
          </p>
          <ul>
            <li>Condizioni meteorologiche avverse</li>
            <li>Scioperi</li>
            <li>Blocchi stradali</li>
            <li>
              Errori o incompletezze nelle indicazioni di consegna fornite dal
              Cliente
            </li>
          </ul>
          <p>
            In caso di ritardi significativi a noi noti, ci impegniamo ad
            informare tempestivamente il Cliente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Hai bisogno di aiuto?</h2>
          <p>
            Per qualsiasi domanda relativa alla tua spedizione, contattaci:
          </p>
          <ul>
            <li>
              Email: <strong>info@ilcovodixur.com</strong>
            </li>
            <li>
              WhatsApp: <strong>331.3988919</strong>
            </li>
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            Orari assistenza: 7 giorni su 7, dalle 10:00 alle 12:30 e dalle
            15:00 alle 18:00.
          </p>
        </section>
      </div>
    </div>
  )
}
