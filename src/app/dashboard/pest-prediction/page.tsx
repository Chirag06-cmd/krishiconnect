"use client";

import { useState, useEffect, useCallback } from "react";
import { getWeather } from "@/ai/flows/get-weather-forecast";
import { getPestPrediction, GetPestPredictionOutput } from "@/ai/flows/get-pest-prediction";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bug, AlertCircle, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function PestPredictionPage() {
  const [location, setLocation] = useState("Delhi, India");
  const [cropType, setCropType] = useState("Wheat");
  const [prediction, setPrediction] = useState<GetPestPredictionOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherAndPredict = useCallback(async () => {
    if (!location || !cropType) {
        setError("Please provide a location and crop type.");
        return;
    };
    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
      // 1. Fetch weather
      const weatherForecast = await getWeather({ location });

      if (weatherForecast) {
        // 2. Format weather for prediction flow
        const weatherSummary = weatherForecast.daily.map(day => 
          `${day.day}: ${day.condition}, Temp ${day.temp_min}°C-${day.temp_max}°C`
        ).join('; ');
        
        // 3. Get pest prediction
        const predictionResult = await getPestPrediction({ location, cropType, weatherForecast: weatherSummary });
        setPrediction(predictionResult);
      } else {
        throw new Error("Could not fetch weather data.");
      }

    } catch (err) {
      setError("An error occurred while fetching predictions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [location, cropType]);

  const RiskBadge = ({ level }: { level: string }) => {
    const variant = level.toLowerCase() === 'high' ? 'destructive' : level.toLowerCase() === 'medium' ? 'secondary' : 'default';
    const color = level.toLowerCase() === 'high' ? 'text-red-500' : level.toLowerCase() === 'medium' ? 'text-yellow-600' : 'text-green-600';
    return <Badge variant={variant} className={`capitalize ${color}`}>{level}</Badge>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pest & Disease Risk Prediction</h1>
        <p className="text-muted-foreground">
          Get AI-powered risk forecasts based on local weather.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Set Parameters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
             <div className="w-full">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Delhi, India"/>
            </div>
             <div className="w-full">
                <Label htmlFor="crop">Crop Type</Label>
                <Select value={cropType} onValueChange={setCropType}>
                    <SelectTrigger id="crop">
                        <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Maize">Maize</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={fetchWeatherAndPredict} disabled={loading} className="w-full sm:w-auto self-end">
              {loading ? "Forecasting..." : "Get Forecast"}
            </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {prediction && (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Overall Risk Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{prediction.summary}</p>
                    </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prediction.predictions.map(p => (
                        <Card key={p.name}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>{p.name}</span>
                                    <RiskBadge level={p.riskLevel} />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">{p.reason}</p>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <h4 className="font-semibold text-sm flex items-center gap-2"><ShieldAlert className="h-4 w-4"/>Preventative Action</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{p.preventativeAction}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          )}

          {!prediction && !loading && !error && (
             <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
                <div className="text-center">
                    <Bug className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Risk predictions will appear here.</p>
                </div>
             </div>
          )}
        </div>
    </div>
  );
}
