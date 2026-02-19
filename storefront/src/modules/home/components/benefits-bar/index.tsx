import { Truck, Package, Headset } from "lucide-react"
import ScrollReveal from "@modules/common/components/scroll-reveal"

interface BenefitItemProps {
  icon: React.ReactNode
  title: string
  text: string
  delay: number
}

const BenefitItem = ({ icon, title, text, delay }: BenefitItemProps) => {
  return (
    <ScrollReveal delay={delay}>
      <div className="flex flex-col items-center text-center gap-3">
        <div className="bg-black border border-black p-3 rounded-md">
          {icon}
        </div>
        <div>
          <h3 className="font-bold uppercase text-black text-sm tracking-wide">
            {title}
          </h3>
          <p className="text-black/60 text-sm mt-1">{text}</p>
        </div>
      </div>
    </ScrollReveal>
  )
}

const BenefitsBar = () => {
  return (
    <section className="bg-green-400 border-t border-black py-10 md:py-12">
      <div className="px-4 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <BenefitItem
            icon={<Truck className="w-7 h-7 text-green-400" />}
            title="Spedizione Gratuita"
            text="Su ordini idonei"
            delay={0}
          />
          <BenefitItem
            icon={<Package className="w-7 h-7 text-green-400" />}
            title="Resi Facili"
            text="Entro 14 giorni"
            delay={100}
          />
          <BenefitItem
            icon={<Headset className="w-7 h-7 text-green-400" />}
            title="Assistenza"
            text="Sempre disponibile"
            delay={200}
          />
        </div>
      </div>
    </section>
  )
}

export default BenefitsBar
