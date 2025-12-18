"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Informazioni Prodotto",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Spedizione & Resi",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-sm">
      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div className="border-l-4 border-black pl-3">
            <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
              Materiale
            </span>
            <p className="font-medium text-black">
              {product.material ? product.material : "-"}
            </p>
          </div>
          <div className="border-l-4 border-black pl-3">
            <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
              Paese d&apos;origine
            </span>
            <p className="font-medium text-black">
              {product.origin_country ? product.origin_country : "-"}
            </p>
          </div>
          <div className="border-l-4 border-black pl-3">
            <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
              Tipo
            </span>
            <p className="font-medium text-black">
              {product.type ? product.type.value : "-"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="border-l-4 border-black pl-3">
            <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
              Peso
            </span>
            <p className="font-medium text-black">
              {product.weight ? `${product.weight} g` : "-"}
            </p>
          </div>
          <div className="border-l-4 border-black pl-3">
            <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
              Dimensioni
            </span>
            <p className="font-medium text-black">
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}L x ${product.height}A`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-sm">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-start gap-3 p-3 bg-white border border-black rounded-md">
          <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-pink-400 border border-black rounded-md">
            <FastDelivery />
          </div>
          <div>
            <span className="font-bold text-black block mb-1">
              Consegna Veloce
            </span>
            <p className="text-gray-700 text-sm">
              Il tuo pacco arriverà in 3-5 giorni lavorativi al tuo punto di
              ritiro o comodamente a casa tua.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-white border border-black rounded-md">
          <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-pink-400 border border-black rounded-md">
            <Refresh />
          </div>
          <div>
            <span className="font-bold text-black block mb-1">
              Cambi Semplici
            </span>
            <p className="text-gray-700 text-sm">
              La taglia non è quella giusta? Nessun problema - cambieremo il tuo
              prodotto con uno nuovo.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-white border border-black rounded-md">
          <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-pink-400 border border-black rounded-md">
            <Back />
          </div>
          <div>
            <span className="font-bold text-black block mb-1">Resi Facili</span>
            <p className="text-gray-700 text-sm">
              Restituisci il tuo prodotto e ti rimborseremo. Nessuna domanda -
              faremo del nostro meglio per rendere il reso senza problemi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
