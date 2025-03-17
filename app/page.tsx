import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

// Generic services that can be customized for any business
const businessServices = [
  {
    id: "1",
    name: "Service Package 1",
    description: "Our most popular service package, perfect for new customers.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "Service Package 2",
    description: "Premium service with additional features and benefits.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "Service Package 3",
    description: "Specialized service for specific customer needs and requirements.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Business Name</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Providing exceptional services for over [X] years. Our team of professionals is dedicated to delivering the
            best experience for all our customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/services">
              <Button size="lg" className="px-8">
                View Services
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="Business Image"
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {businessServices.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <img src={service.image || "/placeholder.svg"} alt={service.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/services`} className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/services">
            <Button variant="outline">View All Services</Button>
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">About Our Business</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Business Founder"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Our Story</h3>
            <p className="text-muted-foreground">
              Founded in [Year], our business has grown from a small operation to a trusted provider in our industry.
              What began as a passion project has evolved into a full-service business with a team of dedicated
              professionals.
            </p>
            <p className="text-muted-foreground">
              Our founder's vision was to create a business that combined technical excellence with personalized
              service—a place where clients would feel valued and understood. This philosophy remains at the heart of
              everything we do today.
            </p>
            <h3 className="text-2xl font-semibold pt-2">Our Approach</h3>
            <p className="text-muted-foreground">
              We believe that great service starts with understanding each client's unique needs and preferences. Our
              consultation process ensures that every service is tailored specifically to you.
            </p>
            <p className="text-muted-foreground">
              Our team regularly participates in professional development to stay current with the latest techniques and
              trends. We're committed to continuous education and growth, ensuring that our clients always receive the
              highest quality service.
            </p>
            <div className="pt-4">
              <Link href="/about">
                <Button variant="outline">Learn More About Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-muted rounded-lg p-8 mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Us</h2>
          <p className="text-lg mb-8 text-center">
            We pride ourselves on providing exceptional service and results that exceed your expectations.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
                <p className="text-muted-foreground">
                  Our team consists of certified professionals with years of experience in the industry.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
                <p className="text-muted-foreground">
                  We use only high-quality products and methods for all our services.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Personalized Approach</h3>
                <p className="text-muted-foreground">
                  Every client receives a consultation to ensure we meet your specific needs and preferences.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Comfortable Environment</h3>
                <p className="text-muted-foreground">
                  Our facility is designed to provide a relaxing and enjoyable experience during your visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-medium">JD</span>
                </div>
                <h3 className="font-semibold">J. Doe</h3>
                <p className="text-sm text-muted-foreground">Regular Client</p>
              </div>
              <p className="text-center italic">
                "I've been a client for over 3 years now. The team is amazing and always knows exactly what I need.
                Highly recommend!"
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-medium">MS</span>
                </div>
                <h3 className="font-semibold">M. Smith</h3>
                <p className="text-sm text-muted-foreground">New Client</p>
              </div>
              <p className="text-center italic">
                "First time using their services and I'm extremely impressed. The attention to detail and level of
                service was outstanding. Will definitely be back!"
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-medium">AJ</span>
                </div>
                <h3 className="font-semibold">A. Johnson</h3>
                <p className="text-sm text-muted-foreground">Regular Client</p>
              </div>
              <p className="text-center italic">
                "The services here are exceptional. The results always exceed my expectations and the value for money is
                excellent compared to other providers."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Location & Hours Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Our Location</CardTitle>
            <CardDescription>Visit us at our convenient location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative rounded-md overflow-hidden border mb-4">
              {/* In a real app, you would use a proper map component like Google Maps or Mapbox */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425872426903!3d40.74076987138443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1710337342813!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
                className="absolute inset-0"
              ></iframe>
            </div>
            <p className="font-medium">Your Business Name</p>
            <p className="text-muted-foreground">
              123 Main Street
              <br />
              City, State 12345
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>We're here to serve you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-medium">Contact Information</p>
              <p className="text-muted-foreground">
                Phone: (555) 123-4567
                <br />
                Email: info@yourbusiness.com
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/contact" className="w-full">
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16 rounded-lg mb-16">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your appointment today and experience the difference our service makes.
          </p>
          <Link href="/services">
            <Button size="lg" variant="secondary" className="px-8">
              Book an Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Business Name</h3>
            <p className="text-muted-foreground">Providing exceptional services since [Year].</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Your Business Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

