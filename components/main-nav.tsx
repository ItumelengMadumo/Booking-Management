"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { CartIcon } from "@/components/cart-icon"
import { useAuth } from "@/context/auth-context"

export function MainNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Determine if the user is a provider
  const isProvider = isAuthenticated && user?.role === "provider"
  const isClient = isAuthenticated && user?.role === "client"

  // Determine if we should show the cart icon
  // Show only if user is a client OR on the services page (for non-logged in users)
  const showCartIcon =
    isClient ||
    (!isAuthenticated &&
      !isProvider &&
      (pathname.includes("/services") ||
        pathname.includes("/cart") ||
        pathname.includes("/checkout") ||
        pathname.includes("/payment")))

  // Use useEffect to handle client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update the navigation items to use generic terminology
  const commonNavItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  // Navigation items specific to user roles
  const navItems = [
    ...commonNavItems,
    // Add role-specific nav items here if needed
  ]

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          BookMe
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-primary transition-colors ${pathname === item.href ? "text-primary font-medium" : "text-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* Only show cart icon if appropriate */}
          {mounted && showCartIcon && <CartIcon />}

          {isAuthenticated ? (
            <>
              {isProvider ? (
                <Link href="/provider/dashboard">
                  <Button variant="outline">Provider Dashboard</Button>
                </Link>
              ) : (
                <Link href="/dashboard/appointments">
                  <Button variant="outline">My Appointments</Button>
                </Link>
              )}
              <Link href="/logout">
                <Button>Logout</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Only show cart icon if appropriate */}
          {mounted && showCartIcon && <CartIcon />}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-background border-b">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-primary transition-colors ${pathname === item.href ? "text-primary font-medium" : "text-foreground"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {isProvider ? (
                    <Link href="/provider/dashboard">
                      <Button variant="outline" className="w-full">
                        Provider Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/dashboard/appointments">
                      <Button variant="outline" className="w-full">
                        My Appointments
                      </Button>
                    </Link>
                  )}
                  <Link href="/logout">
                    <Button className="w-full">Logout</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

