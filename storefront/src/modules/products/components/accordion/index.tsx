import { Text, clx } from "@medusajs/ui"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import React from "react"

type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
  title: string
  subtitle?: string
  description?: string
  required?: boolean
  tooltip?: string
  forceMountContent?: true
  headingSize?: "small" | "medium" | "large"
  customTrigger?: React.ReactNode
  complete?: boolean
  active?: boolean
  triggerable?: boolean
  children: React.ReactNode
}

type AccordionProps =
  | (AccordionPrimitive.AccordionSingleProps &
      React.RefAttributes<HTMLDivElement>)
  | (AccordionPrimitive.AccordionMultipleProps &
      React.RefAttributes<HTMLDivElement>)

const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>
} = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Root {...props}>{children}</AccordionPrimitive.Root>
  )
}

const Item: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  description,
  children,
  className,
  headingSize = "large",
  customTrigger = undefined,
  forceMountContent = undefined,
  triggerable,
  ...props
}) => {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={clx(
        "group bg-white border border-black rounded-md overflow-hidden",
        "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
    >
      <AccordionPrimitive.Header>
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-between">
            <AccordionPrimitive.Trigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-pink-400 transition-colors">
              <Text className="text-black font-bold text-sm uppercase">
                {title}
              </Text>
              {customTrigger || <MorphingTrigger />}
            </AccordionPrimitive.Trigger>
          </div>
          {subtitle && (
            <Text as="span" size="small" className="mt-1 px-4">
              {subtitle}
            </Text>
          )}
        </div>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        forceMount={forceMountContent}
        className={clx(
          "radix-state-closed:animate-accordion-close radix-state-open:animate-accordion-open radix-state-closed:pointer-events-none"
        )}
      >
        <div className="border-t-2 border-black px-4 py-4">
          {description && <Text>{description}</Text>}
          <div className="w-full">{children}</div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

Accordion.Item = Item

const MorphingTrigger = () => {
  return (
    <div className="relative p-1">
      <div className="h-5 w-5">
        <span className="bg-black group-radix-state-open:rotate-90 absolute inset-y-[31.75%] left-[48%] right-1/2 w-[2px] duration-300" />
        <span className="bg-black group-radix-state-open:rotate-90 group-radix-state-open:opacity-0 absolute inset-x-[31.75%] top-[48%] bottom-1/2 h-[2px] duration-300" />
      </div>
    </div>
  )
}

export default Accordion
