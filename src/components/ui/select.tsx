"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
}

export interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export interface SelectValueProps {
  placeholder?: string
  className?: string
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: false,
  setOpen: () => {}
})

const Select = ({ value, onValueChange, children, className }: SelectProps) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className={cn("relative", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext)
    
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, className }: SelectValueProps) => {
  const { value } = React.useContext(SelectContext)
  
  return (
    <span className={cn("", className)}>
      {value || placeholder}
    </span>
  )
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className, ...props }, ref) => {
    const { open } = React.useContext(SelectContext)
    
    if (!open) return null
    
    return (
      <div
        ref={ref}
        className={cn(
          "absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, className, ...props }, ref) => {
    const { onValueChange, setOpen } = React.useContext(SelectContext)
    
    return (
      <div
        ref={ref}
        className={cn(
          "cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100",
          className
        )}
        onClick={() => {
          onValueChange?.(value)
          setOpen(false)
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
