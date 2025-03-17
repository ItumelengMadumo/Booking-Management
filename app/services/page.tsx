"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

// Mock data - in a real app, this would come from a database
const services = [
  {
    id: "1",
    name: "Standard Service",
    description: "Our most popular service option, perfect for regular customers.",
    price: 60,
    depositAmount: 15,
    duration: 60,
    image: "/placeholder.svg?height=200&width=300",
    provider: "Your Business Name",
  },
  {
    id: "2",
    name: "Premium Service",
    description: "Enhanced service with additional features and premium options.",
    price: 90,
    depositAmount: 25,
    duration: 90,
    image: "/placeholder.svg?height=200&width=300",
    provider: "Your Business Name",
  },
  {
    id: "3",
    name: "Deluxe Package",
    description: "Our comprehensive deluxe package with all available options included.",
    price: 120,
    depositAmount: 30,
    duration: 120,
    image: "/placeholder.svg?height=200&width=300",
    provider: "Your Business Name",
  },
  {
    id: "4",
    name: "Express Service",
    description: "Quick service for customers with limited time availability.",
    price: 45,
    depositAmount: 10,
    duration: 30,
    image: "/placeholder.svg?height=200&width=300",
    provider: "Your Business Name",
  },
  {
    id: "5",
    name: "Consultation",
    description: "Initial consultation to assess needs and recommend appropriate services.",
    price: 30,
    depositAmount: 10,
    duration: 45,
    image: "/placeholder.svg?height=200&width=300",
    provider: "Your Business Name",
  },
  {
    id: "6",
    name: "Maintenance Service",
    description: "Regular maintenance service for existing customers.",
    price: 50,
    depositAmount: 15,
    duration: 45,
    image: "/placeholder.svg?height=200&width=300",
    provider: "Your Business Name",
  },
]

export default function ServicesPage() {
  const { addItem } = useCart()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  // Check if user is a provider
  const isProvider = isAuthenticated && user?.role === "provider"

  const handleAddToCart = (service: (typeof services)[0]) => {
    // Prevent providers from adding services to cart
    if (isProvider) {
      toast({
        title: "Action not allowed",
        description: "Service providers cannot book services. Please use a client account.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    addItem({
      id: service.id,
      serviceName: service.name,
      providerName: service.provider,
      price: service.price,
      depositAmount: service.depositAmount,
      duration: service.duration,
      image: service.image,
      isScheduled: false,
    })

    toast({
      title: "Added to cart",
      description: `${service.name} has been added to your cart. Don't forget to schedule it!`,
      duration: 3000,
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Our Services</h1>
      <p className="text-muted-foreground mb-8">Book your preferred service with our expert team</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <img src={service.image || "/placeholder.svg"} alt={service.name} className="w-full h-48 object-cover" />
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <div className="flex justify-between items-center">
                <span className="font-medium text-primary">${service.price}</span>
                <span className="text-sm text-muted-foreground">{service.duration} min</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.description}</p>
              <p className="mt-2 text-sm">Provider: {service.provider}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              {isProvider ? (
                // For providers, show a disabled button or information
                <Button variant="outline" className="flex-1" disabled>
                  Providers cannot book
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" onClick={() => handleAddToCart(service)}>
                    Add to Cart
                  </Button>
                  <Link href={`/booking/${service.id}`} className="flex-1">
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

