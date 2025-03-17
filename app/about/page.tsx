import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">About Our Business</h1>
      <p className="text-muted-foreground mb-8">Our story, our team, and our commitment to excellence</p>

      {/* Founder's Story */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
              <CardDescription>How our business began</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Founded in [Year], our business started with a simple mission: to provide exceptional service to our
                customers. Our founder began with a small operation and a big vision for creating a business that would
                stand out in the industry.
              </p>
              <p>
                After years of working in the industry, our founder recognized an opportunity to create a business that
                combined technical excellence with a personalized approach. The vision was to create a space where
                customers would receive exceptional service in a welcoming environment—where they would be treated as
                individuals with unique needs.
              </p>
              <p>
                With this vision in mind, our business was established in a small location with minimal staff. Our
                reputation for quality and customer satisfaction quickly spread, and within a few years, we had expanded
                to a larger location and increased our team.
              </p>
              <p>
                Today, our business occupies a modern, well-equipped facility and employs a team of talented
                professionals, each bringing their unique skills and specialties to our services. Despite the growth,
                our original vision remains at the core of the business: providing exceptional, personalized services
                that help our customers achieve their goals.
              </p>
              <blockquote>
                "We believe that exceptional service can transform not just the customer experience, but also how people
                feel about themselves. Our goal is to give every client that confidence that comes from knowing they've
                received the best."
                <footer>— Founder & CEO</footer>
              </blockquote>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Our Founder</CardTitle>
              <CardDescription>Founder & CEO</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="/placeholder.svg?height=300&width=300" alt="Founder" className="rounded-lg w-full mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Specialties:</strong> [Industry-specific skills]
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Education:</strong> [Relevant education/certifications]
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Experience:</strong> [X]+ years in the industry
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Philosophy:</strong> "Our services should be exceptional, but also accessible and valuable for
                  everyday life."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Mission & Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Mission & Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide exceptional services that meet our customers' needs and exceed their expectations, while
                creating a positive and supportive environment for both clients and team members.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To be recognized as the premier service provider in our region, known for our technical excellence,
                personalized approach, and commitment to continuous improvement and innovation.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Excellence in everything we do</li>
                <li>• Personalized attention to each customer</li>
                <li>• Continuous education and growth</li>
                <li>• Honesty and integrity in our recommendations</li>
                <li>• Creating a positive, supportive environment</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meet Our Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Team Member 1 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Team Member 1"
                  className="rounded-full w-32 h-32 object-cover mb-4"
                />
                <h3 className="font-semibold text-lg">Team Member</h3>
                <p className="text-sm text-muted-foreground mb-2">Founder & CEO</p>
                <p className="text-sm text-muted-foreground">Specializing in [area of expertise]</p>
              </div>
            </CardContent>
          </Card>

          {/* Team Member 2 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Team Member 2"
                  className="rounded-full w-32 h-32 object-cover mb-4"
                />
                <h3 className="font-semibold text-lg">Team Member</h3>
                <p className="text-sm text-muted-foreground mb-2">Senior Professional</p>
                <p className="text-sm text-muted-foreground">Specializing in [area of expertise]</p>
              </div>
            </CardContent>
          </Card>

          {/* Team Member 3 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Team Member 3"
                  className="rounded-full w-32 h-32 object-cover mb-4"
                />
                <h3 className="font-semibold text-lg">Team Member</h3>
                <p className="text-sm text-muted-foreground mb-2">Specialist</p>
                <p className="text-sm text-muted-foreground">Specializing in [area of expertise]</p>
              </div>
            </CardContent>
          </Card>

          {/* Team Member 4 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Team Member 4"
                  className="rounded-full w-32 h-32 object-cover mb-4"
                />
                <h3 className="font-semibold text-lg">Team Member</h3>
                <p className="text-sm text-muted-foreground mb-2">Professional</p>
                <p className="text-sm text-muted-foreground">Specializing in [area of expertise]</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Our team also includes additional talented professionals and our wonderful support staff who ensure your
            experience is seamless from start to finish.
          </p>
        </div>
      </div>

      {/* Our Facility */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Facility</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Business Facility"
              className="rounded-lg w-full mb-4"
            />
            <p className="text-sm text-muted-foreground text-center">Our modern, welcoming facility</p>
          </div>
          <div className="space-y-4">
            <p>
              Located in a convenient and accessible area, our facility combines modern amenities with a comfortable
              atmosphere. We've created a space that's both professional and welcoming, where you can feel at ease
              during your visit.
            </p>
            <p>
              Our facility features state-of-the-art equipment and technology to ensure we deliver the best possible
              service. We've invested in high-quality tools and comfortable furnishings to ensure both our clients and
              team members have the best experience possible.
            </p>
            <p>
              We're proud to be an environmentally conscious business. We use energy-efficient appliances, LED lighting,
              and eco-friendly products whenever possible. We're committed to sustainable practices that benefit both
              our customers and the planet.
            </p>
            <div className="pt-4">
              <Link href="/contact">
                <Button>Visit Our Location</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-12 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Experience the Difference</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Book your appointment today and discover why our clients keep coming back.
        </p>
        <Link href="/services">
          <Button variant="secondary" size="lg">
            Book an Appointment
          </Button>
        </Link>
      </div>
    </div>
  )
}

