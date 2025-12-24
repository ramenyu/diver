"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function Collapsible({ 
  open = false, 
  onOpenChange, 
  children,
  className 
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(open)
  
  React.useEffect(() => {
    setIsOpen(open)
  }, [open])
  
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <div 
      data-slot="collapsible" 
      data-state={isOpen ? "open" : "closed"}
      className={cn(className)}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ isOpen?: boolean; onToggle?: () => void }>, {
            isOpen,
            onToggle: () => handleOpenChange(!isOpen)
          })
        }
        return child
      })}
    </div>
  )
}

interface CollapsibleTriggerProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  onToggle?: () => void
}

function CollapsibleTrigger({ 
  children, 
  className,
  isOpen,
  onToggle 
}: CollapsibleTriggerProps) {
  return (
    <button
      type="button"
      data-slot="collapsible-trigger"
      data-state={isOpen ? "open" : "closed"}
      onClick={onToggle}
      className={cn(className)}
    >
      {children}
    </button>
  )
}

interface CollapsibleContentProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
}

function CollapsibleContent({ 
  children, 
  className,
  isOpen 
}: CollapsibleContentProps) {
  if (!isOpen) return null
  
  return (
    <div
      data-slot="collapsible-content"
      data-state={isOpen ? "open" : "closed"}
      className={cn(className)}
    >
      {children}
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
