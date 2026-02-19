import { Button } from "@components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ShoppingBasket } from "lucide-react"

const EmptyCartMessage = () => {
  return (
    <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-md">
      <ShoppingBasket className="size-12" />
      <p className="text-base font-medium">Nessun oggetto nel carrello</p>
      <LocalizedClientLink href="/store" data-testid="store-link">
        <Button
          className="bg-black text-white hover:bg-green-400 hover:text-black font-bold tracking-wide"
          variant="elevated"
        >
          Esplora i prodotti
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
