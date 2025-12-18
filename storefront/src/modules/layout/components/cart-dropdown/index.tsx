"use client"

import { Popover, Transition } from "@headlessui/react"
import { usePathname } from "next/navigation"
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { Button } from "@components/ui/button"
import { ShoppingBasket } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@components/ui/sheet"
import useBreakpoints from "@lib/hooks/useBreakpoints"

// Cart link component to avoid duplication
const CartLink = ({ totalItems }: { totalItems: number }) => (
  <LocalizedClientLink
    className="flex items-center h-full px-12 py-2 border-l border-black bg-black text-white hover:bg-pink-400 hover:border-pink-400 hover:text-black transition-colors duration-200 font-semibold gap-2"
    href="/cart"
    data-testid="nav-cart-link"
  >{`Carrello (${totalItems})`}</LocalizedClientLink>
)

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const pathname = usePathname()
  const { isLarge } = useBreakpoints()
  const [activeTimer, setActiveTimer] = useState<
    ReturnType<typeof setTimeout> | undefined
  >(undefined)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // Memoize total items calculation
  const totalItems = useMemo(
    () => cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    [cartState?.items]
  )

  // Memoize sorted items
  const sortedItems = useMemo(
    () =>
      cartState?.items?.slice().sort((a, b) => {
        return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
      }) || [],
    [cartState?.items]
  )

  const subtotal = cartState?.subtotal ?? 0
  const discountTotal = cartState?.discount_total ?? 0
  const total = cartState?.total ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const open = useCallback(() => setCartDropdownOpen(true), [])

  const close = useCallback(() => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    setCartDropdownOpen(false)
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
    }, 300)
  }, [activeTimer])

  const timedOpen = useCallback(() => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }, [open, close])

  const openAndCancel = useCallback(() => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    open()
  }, [activeTimer, open])

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      // Desktop: auto-close after 5 seconds, Mobile: manual close only
      if (isLarge) {
        timedOpen()
      } else {
        open()
      }
    }
    itemRef.current = totalItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, pathname, isLarge])

  // Componente riutilizzabile per il contenuto del carrello
  const CartContent = useMemo(
    () => (
      <>
        {cartState && cartState.items?.length ? (
          <>
            <div className="overflow-y-auto flex-1 p-4 grid grid-cols-1 gap-y-4 no-scrollbar">
              {sortedItems.map((item) => (
                <div
                  className="border border-black rounded-md p-3 bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  key={item.id}
                  data-testid="cart-item"
                >
                  <div className="flex gap-3">
                    <LocalizedClientLink
                      href={`/products/${item.variant?.product?.handle}`}
                      className="flex-shrink-0"
                    >
                      <div className="w-20 h-20 border border-black rounded-md overflow-hidden">
                        <Thumbnail
                          thumbnail={item.variant?.product?.thumbnail}
                          images={item.variant?.product?.images}
                          size="square"
                        />
                      </div>
                    </LocalizedClientLink>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <h3 className="font-bold text-sm truncate">
                        <LocalizedClientLink
                          href={`/products/${item.variant?.product?.handle}`}
                          data-testid="product-link"
                        >
                          {item.title}
                        </LocalizedClientLink>
                      </h3>
                      {item.variant &&
                        (item.variant.title !== "Default variant" ||
                          item.product_title !== item.variant.title) && (
                          <LineItemOptions
                            variant={item.variant}
                            data-testid="cart-item-variant"
                            data-value={item.variant}
                          />
                        )}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-xs font-medium"
                          data-testid="cart-item-quantity"
                          data-value={item.quantity}
                        >
                          Quantità: {item.quantity}
                        </span>
                        <div className="font-bold text-sm shrink-0">
                          <LineItemPrice
                            item={item}
                            currencyCode={cartState.currency_code}
                            style="tight"
                          />
                        </div>
                      </div>
                      <DeleteButton
                        id={item.id}
                        className="mt-1 text-xs"
                        data-testid="cart-item-remove-button"
                      >
                        Rimuovi
                      </DeleteButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 flex flex-col gap-y-3 border-t border-black bg-gray-50">
              <div className="flex flex-col gap-y-2 p-3 border border-black rounded-md bg-white">
                {discountTotal > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Subtotale
                      </span>
                      <span
                        className="text-sm font-bold"
                        data-testid="cart-subtotal"
                        data-value={subtotal}
                      >
                        {convertToLocale({
                          amount: subtotal,
                          currency_code: cartState.currency_code,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">
                        Sconto
                      </span>
                      <span
                        className="text-sm font-bold text-green-600"
                        data-testid="cart-discount"
                        data-value={discountTotal}
                      >
                        -
                        {convertToLocale({
                          amount: discountTotal,
                          currency_code: cartState.currency_code,
                        })}
                      </span>
                    </div>
                  </>
                )}
                <div
                  className={`flex items-center justify-between ${
                    discountTotal > 0 ? "pt-2 border-t border-black" : ""
                  }`}
                >
                  <span className="uppercase font-medium text-gray-900">
                    Totale
                  </span>
                  <span
                    className="text-xl font-bold"
                    data-testid="cart-total"
                    data-value={total}
                  >
                    {convertToLocale({
                      amount: total,
                      currency_code: cartState.currency_code,
                    })}
                  </span>
                </div>
              </div>
              <LocalizedClientLink href="/cart" passHref onClick={close}>
                <Button
                  variant="elevated"
                  className="w-full bg-black text-white hover:bg-pink-400 hover:text-black font-bold uppercase tracking-wide"
                  data-testid="go-to-cart-button"
                >
                  Vai al carrello
                </Button>
              </LocalizedClientLink>
            </div>
          </>
        ) : (
          <div>
            <div className="flex py-16 px-8 flex-col gap-y-4 items-center justify-center">
              <ShoppingBasket className="size-12" />
              <span className="font-bold text-center">
                Nessun oggetto nel carrello
              </span>
              <div>
                <LocalizedClientLink href="/store" onClick={close}>
                  <Button
                    className="bg-black text-white hover:bg-pink-400 hover:text-black font-bold tracking-wide"
                    variant="elevated"
                  >
                    Esplora i prodotti
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        )}
      </>
    ),
    [sortedItems, cartState, subtotal, discountTotal, total, close]
  )

  return (
    <>
      {!isLarge ? (
        // Mobile Sheet
        <div className="h-full z-50">
          <CartLink totalItems={totalItems} />
          <Sheet
            key={cartDropdownOpen || isClosing ? "open" : "closed"}
            open={cartDropdownOpen}
            onOpenChange={(open) => {
              if (!open) {
                close()
              } else {
                setCartDropdownOpen(true)
              }
            }}
          >
            <SheetContent
              side="right"
              className="w-full sm:max-w-lg p-0 bg-white border-l-2 border-black flex flex-col"
            >
              <SheetHeader className="p-4 pr-16 border-b-2 border-black bg-pink-400">
                <SheetTitle className="text-2xl font-black uppercase">
                  Carrello
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Visualizza e gestisci gli articoli nel tuo carrello
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-hidden flex flex-col">
                {CartContent}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        // Desktop Popover
        <div
          className="h-full z-50"
          onMouseEnter={openAndCancel}
          onMouseLeave={close}
        >
          <Popover className="relative h-full">
            <div className="relative h-full">
              <Popover.Button className="h-full">
                <CartLink totalItems={totalItems} />
              </Popover.Button>
              {/* Triangle indicator */}
              <div
                className={`opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2 transition-none ${
                  cartDropdownOpen ? "opacity-100" : ""
                }`}
              />
            </div>
            <Transition
              show={cartDropdownOpen}
              as={Fragment}
              enter="transition-none"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-none"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Panel
                static
                className="absolute top-full right-4 w-[440px] text-black z-50"
                data-testid="nav-cart-dropdown"
              >
                {/* Hover bridge covering the gap */}
                <div className="h-2" />

                <div className="bg-white border rounded-md border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
                  {CartContent}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
      )}
    </>
  )
}

export default CartDropdown
