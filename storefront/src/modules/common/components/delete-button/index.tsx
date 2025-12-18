"use client"

import { useDeleteLineItem } from "@lib/hooks/use-cart-actions"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const { deleteLineItem, isDeleting } = useDeleteLineItem()

  const handleDelete = async (id: string) => {
    try {
      await deleteLineItem(id)
    } catch (err) {
      // Error toast is already handled by useDeleteLineItem hook
    }
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
