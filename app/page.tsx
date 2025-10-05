import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wind, Activity, TrendingUp, Bell, MapPin, Car } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <Wind className="h-8 w-8 text-primary transition-transform group-hover:scale-110 duration-300" />
            <div>
              <h1 className="text-2xl font-bold font-sans">CFTM</h1>
              <p className="text-xs text-muted-foreground">Chennai Traffic Monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="transition-all duration-200 hover:scale-105">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="transition-all duration-200 hover:scale-105">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center justify-center gap-2 text-primary mb-4 animate-in zoom-in duration-700 delay-200">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium">Chennai, Tamil Nadu</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold font-sans text-balance">
            Monitor Air Quality in Chennai&apos;s <span className="text-primary">Traffic Zones</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Track real-time air pollution levels across Anna Salai, Mount Road, T. Nagar, and other high-traffic areas.
            Get AI-powered predictions and instant alerts for vehicle emission spikes.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="text-lg transition-all duration-200 hover:scale-105">
                Start Monitoring
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg bg-transparent transition-all duration-200 hover:scale-105"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform hover:scale-110 duration-300">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-sans">Real-Time Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              Monitor PM2.5, CO2, temperature, and humidity levels across Chennai&apos;s busiest traffic corridors with
              live updates every 5 seconds.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform hover:scale-110 duration-300">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-sans">Historical Trends</h3>
            <p className="text-muted-foreground leading-relaxed">
              Analyze pollution patterns during peak traffic hours and identify the most affected zones in Chennai over
              time.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform hover:scale-110 duration-300">
              <Wind className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-sans">AI Predictions</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get AI-powered forecasts for PM2.5 levels based on Chennai traffic patterns, vehicle density, and weather
              conditions.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform hover:scale-110 duration-300">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-sans">Smart Alerts</h3>
            <p className="text-muted-foreground leading-relaxed">
              Receive instant notifications when pollution spikes during rush hour with recommendations for safer
              routes.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg p-8 space-y-6 animate-in fade-in duration-700">
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-bold font-sans">Monitoring Chennai&apos;s High-Traffic Areas</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Our sensors are strategically placed across Chennai&apos;s most congested zones including Anna Salai, Mount
            Road, T. Nagar, Adyar, and Velachery. Track air quality in real-time as vehicle emissions fluctuate
            throughout the day, especially during morning and evening rush hours.
          </p>
          <div className="grid md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg transition-all duration-300 hover:bg-muted">
              <div className="text-3xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground mt-1">Traffic Zones</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg transition-all duration-300 hover:bg-muted">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">Monitoring</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg transition-all duration-300 hover:bg-muted">
              <div className="text-3xl font-bold text-primary">AI</div>
              <div className="text-sm text-muted-foreground mt-1">Predictions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 CFTM - Chennai Traffic Monitor. Built with Next.js and AI.</p>
        </div>
      </footer>
    </div>
  )
}
