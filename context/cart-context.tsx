"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type CartItem = {
  id: string
  serviceName: string
  providerName: string
  price: number
  depositAmount: number
  date?: string
  time?: string
  duration: number
  image?: string
  isScheduled: boolean // Track if the item has been scheduled
}

export type PaymentOption = "deposit" | "full"

type CartContextType = {
  items: CartItem[]
  paymentOption: PaymentOption
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<CartItem>) => void
  clearCart: () => void
  setPaymentOption: (option: PaymentOption) => void
  totalItems: number
  subtotal: number
  depositTotal: number
  paymentTotal: number
  allItemsScheduled: boolean // Track if all items have been scheduled
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("deposit")

  // Load cart from localStorage on client-side
  useEffect(() => {
    const savedCart = localStorage.getItem("bookingCart")
    const savedPaymentOption = localStorage.getItem("paymentOption")

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart from localStorage")
      }
    }

    if (savedPaymentOption === "deposit" || savedPaymentOption === "full") {
      setPaymentOption(savedPaymentOption)
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("bookingCart", JSON.stringify(items))
  }, [items])

  // Save payment option to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("paymentOption", paymentOption)
  }, [paymentOption])

  const addItem = (item: CartItem) => {
    // Ensure isScheduled property is set
    const newItem = {
      ...item,
      isScheduled: !!(item.date && item.time),
    }

    // Check if item already exists
    const existingItemIndex = items.findIndex((i) => i.id === item.id)

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...items]
      updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], ...newItem }
      setItems(updatedItems)
    } else {
      // Add new item
      setItems([...items, newItem])
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates }
          // Update isScheduled status if date or time changes
          if ("date" in updates || "time" in updates) {
            updatedItem.isScheduled = !!(updatedItem.date && updatedItem.time)
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.length

  const subtotal = items.reduce((total, item) => total + item.price, 0)

  const depositTotal = items.reduce((total, item) => total + item.depositAmount, 0)

  const paymentTotal = paymentOption === "deposit" ? depositTotal : subtotal

  // Check if all items have been scheduled
  const allItemsScheduled = items.length > 0 && items.every((item) => item.isScheduled)

  return (
    <CartContext.Provider
      value={{
        items,
        paymentOption,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        setPaymentOption,
        totalItems,
        subtotal,
        depositTotal,
        paymentTotal,
        allItemsScheduled,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

