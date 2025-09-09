import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Loader2, Twitter, Linkedin, Instagram, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GenerationResult {
  tweets: string[];
  linkedin: string;
  instagram: string;
}

// ---- Anropa vår serverless-funktion på Vercel ----
async function generatePosts(text: string): Promise<GenerationResult> {
  const resp = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(msg || `Request failed: ${resp.status}`);
  }
  return resp.json(); // { tweets, linkedin, instagram }
}

const Dashboard = () => {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generationsLeft, setGenerationsLeft] = useState(5); // mock/placeholder
  const [isPro] = useState(false); // mock/placeholder
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some content to repurpose.",
        variant: "destructive",
      });
      return;
    }
    if (!isPro && generationsLeft <= 0) {
      toast({
        title: "Limit reached",
        description: "You've used all free generations. Upgrade to Pro for unlimited.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const data = await generatePosts(inputText);
      setResults(data);
      if (!isPro) setGenerationsLeft((prev) => Math.max(0, prev - 1));
      toast({ title: "Content generated!", description: "Your posts are ready." });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Generation failed",
        description: e?.message || "Something went wrong. Check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${platform} content copied to clipboard.` });
  };

  const handleUpgrade = () => {
    toast({ title: "Upgrade to Pro", description: "Redirecting to pricing page..." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient cursor-pointer" onClick={() => (window.location.href = "/")}>
              Repurpose Lite
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isPro ? (
              <Badge className="usage-badge unlimited">
                <Zap className="w-3 h-3 mr-1" />
                Unlimited
              </Badge>
            ) : (
              <Badge className="usage-badge">Generations left: {generationsLeft}</Badge>
            )}

            {!isPro && (
              <Button variant="pro" size="sm" onClick={handleUpgrade}>
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Input Section */}
        <Card className="card-gradient border-0 shadow-medium mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              Transform Your Content
            </CardTitle>
            <CardDescription>Enter your original content and get platform-specific posts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your content here…"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-32 resize-none border-muted"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">{inputText.length} / 2000 characters</div>
              <Button
                variant="gradient"
                onClick={handleGenerate}
                disabled={isLoading || (!isPro && generationsLeft === 0)}
                className="min-w-32"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>

            {!isPro && generationsLeft === 0 && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-warning font-medium">
                  You've reached your free limit. Upgrade to Pro for unlimited generations!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-brand-primary" />
              Your Repurposed Content
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Twitter */}
              <Card className="result-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-[#1DA1F2] rounded-lg flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-white" />
                    </div>
                    Twitter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-3">
                    {results.tweets.map((t, i) => (
                      <div key={i} className="p-2 rounded border border-muted">
                        {t}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(results.tweets.join("\n\n"), "Twitter")}
                    className="w-full"
                  >
                    <Copy className="w-4 h-4" />
                    Copy All Tweets
                  </Button>
                </CardContent>
              </Card>

              {/* LinkedIn */}
              <Card className="result-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-[#0077B5] rounded-lg flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    LinkedIn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg text-sm max-h-40 overflow-y-auto">{results.linkedin}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(results.linkedin, "LinkedIn")}
                    className="w-full"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Post
                  </Button>
                </CardContent>
              </Card>

              {/* Instagram */}
              <Card className="result-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#405DE6] via-[#5851DB] via-[#833AB4] via-[#C13584] via-[#E1306C] to-[#FD1D1D] rounded-lg flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                    Instagram
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg text-sm max-h-40 overflow-y-auto">{results.instagram}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(results.instagram, "Instagram")}
                    className="w-full"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Caption
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to Create Magic?</h3>
            <p className="text-muted-foreground">
              Enter your content above and watch as AI transforms it into platform-specific posts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
