import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import Accordion from "@modules/products/components/accordion"

const ShippingInfoCards = () => {
  return (
    <Accordion type="single" collapsible>
      <Accordion.Item title="Spedizioni & Resi" value="shipping">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2 p-3 bg-white border border-black rounded-md">
            <div className="shrink-0 w-6 h-6 flex items-center justify-center bg-green-400 border border-black rounded-md">
              <FastDelivery className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-black block mb-0.5 text-xs">
                Consegna Veloce
              </span>
              <p className="text-gray-700 text-xs">3-5 giorni lavorativi</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-white border border-black rounded-md">
            <div className="shrink-0 w-6 h-6 flex items-center justify-center bg-green-400 border border-black rounded-md">
              <Refresh className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-black block mb-0.5 text-xs">
                Cambi Semplici
              </span>
              <p className="text-gray-700 text-xs">Cambio taglia gratuito</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-white border border-black rounded-md">
            <div className="shrink-0 w-6 h-6 flex items-center justify-center bg-green-400 border border-black rounded-md">
              <Back className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-black block mb-0.5 text-xs">
                Resi Facili
              </span>
              <p className="text-gray-700 text-xs">Rimborso garantito</p>
            </div>
          </div>
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export default ShippingInfoCards
