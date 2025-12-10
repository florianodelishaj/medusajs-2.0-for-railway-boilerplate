import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="content-container" data-testid="cart-container">
      {cart?.items?.length ? (
        <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-24">
          <div className="flex flex-col gap-y-6 mb-6 lg:mb-0">
            {!customer && (
              <div className="flex flex-col p-4 border rounded-md bg-white">
                <>
                  <SignInPrompt />
                </>
              </div>
            )}
            <ItemsTemplate
              items={cart?.items}
              currencyCode={cart?.currency_code}
            />
          </div>
          <div className="relative">
            <div className="flex flex-col p-4 border rounded-md gap-y-8 sticky top-12 bg-white">
              {cart && cart.region && <Summary cart={cart as any} />}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <EmptyCartMessage />
        </div>
      )}
    </div>
  )
}

export default CartTemplate
