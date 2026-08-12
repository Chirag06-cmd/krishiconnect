"use client";

import { useState, useCallback } from "react";
import { getCropAdvice, CropAdvisorOutput } from "@/ai/flows/crop-advisor";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, AlertCircle, Sparkles, IndianRupee, Calendar, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { useTranslation } from "@/lib/i18n";

export default function CropAdvisorPage() {
  const { locale } = useTranslation();
  const [location, setLocation] = useState("Pune, Maharashtra");
  const [soilType, setSoilType] = useState("Loamy");
  const [farmSize, setFarmSize] = useState(10);
  const [budget, setBudget] = useState([20000]);
  
  const [recommendations, setRecommendations] = useState<CropAdvisorOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = useCallback(async () => {
    if (!location || !soilType || !farmSize || !budget) {
        setError("Please fill in all the details.");
        return;
    };
    setLoading(true);
    setRecommendations(null);
    setError(null);

    try {
      const result = await getCropAdvice({ 
          location, 
          soilType, 
          farmSize, 
          budget: budget[0],
          locale
      });
      setRecommendations(result);
    } catch (err) {
      setError("An error occurred while fetching advice. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [location, soilType, farmSize, budget]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Fasal Salahkaar (Crop Advisor)</h1>
        <p className="text-muted-foreground">
          Get personalized crop recommendations for maximum profitability.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Enter Your Farm Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="w-full">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Pune, Maharashtra"/>
                </div>
                 <div className="w-full">
                    <Label htmlFor="farm-size">Farm Size (in acres)</Label>
                    <Input id="farm-size" type="number" value={farmSize} onChange={(e) => setFarmSize(Number(e.target.value))} placeholder="e.g., 10"/>
                </div>
                 <div className="w-full">
                    <Label htmlFor="soil">Soil Type</Label>
                    <Select value={soilType} onValueChange={setSoilType}>
                        <SelectTrigger id="soil">
                            <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Sandy">Sandy</SelectItem>
                            <SelectItem value="Clay">Clay</SelectItem>
                            <SelectItem value="Loamy">Loamy</SelectItem>
                            <SelectItem value="Black">Black Soil</SelectItem>
                            <SelectItem value="Red">Red Soil</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="w-full">
                <Label htmlFor="budget">Budget per Acre (in ₹)</Label>
                <div className="flex items-center gap-4">
                    <Slider id="budget" min={5000} max={50000} step={1000} value={budget} onValueChange={setBudget} />
                    <div className="w-24 text-center border rounded-md px-2 py-1.5 font-mono">₹{budget[0].toLocaleString()}</div>
                </div>
            </div>
            <Button onClick={handleGetAdvice} disabled={loading} className="w-full">
              {loading ? "Getting Advice..." : "Get Crop Recommendations"}
            </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {recommendations && (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles />Recommendation Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{recommendations.summary}</p>
                    </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.recommendations.map(crop => (
                        <Card key={crop.name}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span><Leaf className="inline-block mr-2 h-5 w-5"/>{crop.name}</span>
                                </CardTitle>
                                <CardDescription>{crop.reason}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center text-sm gap-2">
                                    <IndianRupee className="h-4 w-4 text-muted-foreground"/>
                                    <span className="font-semibold">Profit:</span>
                                    <span>{crop.estimatedProfit} per acre</span>
                                </div>
                                <div className="flex items-center text-sm gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground"/>
                                    <span className="font-semibold">Sowing:</span>
                                    <span>{crop.sowingTime}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          )}

          {!recommendations && !loading && !error && (
             <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                    <Lightbulb className="mx-auto h-12 w-12 mb-4" />
                    <p className="font-semibold">Crop recommendations will appear here.</p>
                    <p className="text-sm">Fill in your farm details and get expert advice.</p>
                </div>
             </div>
          )}
        </div>
    </div>
  );
}
