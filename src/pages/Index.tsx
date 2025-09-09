import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Shield, Clock } from "lucide-react";

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Sätt/ta bort scroll-lyssnare korrekt
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b shadow-soft" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Repurpose Lite</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Features</Button>
            <Button variant="ghost" size="sm">Pricing</Button>
            <Link to="/dashboard">
              <Button variant="hero" size="sm">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-brand-primary/10 text-brand-primary border-brand-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Content Repurposing
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Transform Your Content Into
            <span className="hero-gradient block mt-2">Multiple Formats Instantly</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Turn one piece of content into engaging posts for Twitter, LinkedIn, and Instagram.
            Save hours of writing with AI-powered repurposing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="group">
                Start Repurposing Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="xl">Watch Demo</Button>
          </div>

          {/* Waitlist / Email capture */}
          <form
            action="https://formspree.io/f/mkgvyjdn"
            method="POST"
            className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email to join the waitlist"
              className="w-full sm:w-auto flex-1 px-3 py-2 rounded-md border bg-background"
            />
            <Button type="submit" variant="gradient" className="whitespace-nowrap">
              Join Waitlist
            </Button>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mt-10">
            <div>
              <div className="text-3xl font-bold text-brand-primary">10k+</div>
              <div className="text-sm text-muted-foreground">Content pieces generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-primary">5min</div>
              <div className="text-sm text-muted-foreground">Average time saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-primary">99%</div>
              <div className="text-sm text-muted-foreground">User satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Repurpose Lite?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI understands your content and adapts it perfectly for each platform's unique style and audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="result-card border-0">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Generate content for all platforms in seconds, not hours.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="result-card border-0">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Advanced AI that understands context and platform nuances.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="result-card border-0">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Brand Safe</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Maintains your brand voice and tone across all platforms.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="result-card border-0">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Time Saver</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Save 90% of your content creation time with smart automation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of creators who are already saving time and growing their audience with Repurpose Lite.
          </p>
          <Link to="/dashboard">
            <Button variant="hero" size="xl" className="group">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/20 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-gradient">Repurpose Lite</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Repurpose Lite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
