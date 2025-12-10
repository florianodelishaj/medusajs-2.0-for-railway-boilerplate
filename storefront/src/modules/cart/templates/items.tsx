import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
  currencyCode: string
}

const ItemsTemplate = ({ items, currencyCode }: ItemsTemplateProps) => {
  return (
    <div className="border border-black rounded-md bg-white">
      <div className="p-4 border-b border-black">
        <Heading level="h2" className="txt-xlarge">
          Carrello
        </Heading>
      </div>
      <div>
        <Table>
          <Table.Header className="border-t-0 hidden small:table-header-group">
            <Table.Row className="text-ui-fg-subtle txt-medium-plus border-b border-black">
              <Table.HeaderCell className="!pl-6 font-medium">
                Oggetto
              </Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell className="font-medium">
                Quantità
              </Table.HeaderCell>
              <Table.HeaderCell className="!pr-6 text-right font-medium">
                Totale
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    return (
                      <Item
                        key={item.id}
                        item={item}
                        currencyCode={currencyCode}
                      />
                    )
                  })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default ItemsTemplate
