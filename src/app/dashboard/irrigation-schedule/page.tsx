"use client";

import { useState, useCallback } from "react";
import { getIrrigationSchedule, IrrigationScheduleOutput } from "@/ai/flows/irrigation-schedule";
import { getWeather } from "@/ai/flows/get-weather-forecast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Droplets, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { useTranslation } from "@/lib/i18n";

export default function IrrigationPage() {
  const { locale } = useTranslation();
  const [location, setLocation] = useState("Delhi, India");
  const [cropType, setCropType] = useState("Wheat");
  
  const [schedule, setSchedule] = useState<IrrigationScheduleOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSchedule = useCallback(async () => {
    if (!location || !cropType) {
        setError("Please provide a location and crop type.");
        return;
    };
    setLoading(true);
    setSchedule(null);
    setError(null);

    try {
      const weatherData = await getWeather({ location });
      if (weatherData) {
        const weatherSummary = weatherData.daily.map(day => 
          `${day.day}: ${day.condition}, Temp ${day.temp_min}°C-${day.temp_max}°C`
        ).join('; ');
        
        const scheduleResult = await getIrrigationSchedule({ location, cropType, weatherForecast: weatherSummary, locale });
        setSchedule(scheduleResult);
      } else {
        throw new Error("Could not fetch weather data for schedule.");
      }

    } catch (err) {
      setError("An error occurred while generating the schedule. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [location, cropType, locale]);

  const RecommendationBadge = ({ recommendation }: { recommendation: string }) => {
    const isWater = recommendation.toLowerCase().includes('water');
    return <Badge variant={isWater ? 'default' : 'secondary'}>{recommendation}</Badge>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Irrigation Schedule</h1>
        <p className="text-muted-foreground">
          Get a 7-day AI-powered watering plan to save water and improve yield.
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
            <Button onClick={handleGetSchedule} disabled={loading} className="w-full sm:w-auto self-end">
              {loading ? "Generating..." : "Generate Schedule"}
            </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                {Array.from({length: 7}).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {schedule && (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Summary & Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{schedule.summary}</p>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
                    {schedule.schedule.map(day => (
                        <Card key={day.day}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>{day.day}</span>
                                </CardTitle>
                                <RecommendationBadge recommendation={day.wateringRecommendation} />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">{day.reason}</p>
                                {day.wateringRecommendation.toLowerCase().includes('water') && (
                                  <p className="text-sm font-semibold">{day.estimatedAmount}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          )}

          {!schedule && !loading && !error && (
             <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
                 <div className="text-center text-muted-foreground">
                    <Droplets className="mx-auto h-12 w-12 mb-4" />
                    <p className="font-semibold">Your smart irrigation plan will appear here.</p>
                </div>
             </div>
          )}
        </div>
    </div>
  );
}
