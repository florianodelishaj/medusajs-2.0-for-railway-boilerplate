import { Truck, Package, Headset } from "lucide-react"

interface BenefitItemProps {
  icon: React.ReactNode
  title: string
  text: string
}

const BenefitItem = ({ icon, title, text }: BenefitItemProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 text-black">{icon}</div>
      <h3 className="font-bold uppercase text-black mb-1">{title}</h3>
      <p className="text-black/80 text-sm">{text}</p>
    </div>
  )
}

const BenefitsBar = () => {
  return (
    <section className="bg-green-400 border-t-2 border-b-2 border-black py-4">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitItem
            icon={<Truck className="w-10 h-10" />}
            title="Spedizione Gratuita"
            text="Ordini sopra €50"
          />
          <BenefitItem
            icon={<Package className="w-10 h-10" />}
            title="Resi Facili"
            text="Entro 14 giorni"
          />
          <BenefitItem
            icon={<Headset className="w-10 h-10" />}
            title="Assistenza"
            text="Sempre disponibile"
          />
        </div>
      </div>
    </section>
  )
}

export default BenefitsBar
