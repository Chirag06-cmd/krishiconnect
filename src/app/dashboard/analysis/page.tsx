"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { getWeather, GetWeatherForecastOutput } from "@/ai/flows/get-weather-forecast";
import { getPestPrediction, GetPestPredictionOutput } from "@/ai/flows/get-pest-prediction";
import { getFarmReport, FarmReportOutput } from "@/ai/flows/get-farm-report";
import { Skeleton } from "@/components/ui/skeleton";

const yieldChartConfig = {
  yield: { label: "Yield (Quintals)", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const soilChartConfig = {
  temp_max: { label: "Max Temp (°C)", color: "hsl(var(--chart-1))" },
  temp_min: { label: "Min Temp (°C)", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const pestChartConfig = {
    risk: { label: "Risk Level" },
    pests: { color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const riskLevelToNumber = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
        case 'Low': return 1;
        case 'Medium': return 2;
        case 'High': return 3;
        default: return 0;
    }
}


export default function AnalysisPage() {
    const [soilData, setSoilData] = useState<GetWeatherForecastOutput['daily'] | null>(null);
    const [pestData, setPestData] = useState<GetPestPredictionOutput['predictions'] | null>(null);
    const [farmReport, setFarmReport] = useState<FarmReportOutput | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const weather = await getWeather({ location: 'Delhi, India' });
                setSoilData(weather.daily);
                
                const weatherSummary = weather.daily.map(day => 
                  `${day.day}: ${day.condition}, Temp ${day.temp_min}°C-${day.temp_max}°C`
                ).join('; ');
                const pests = await getPestPrediction({ location: 'Delhi, India', cropType: 'Wheat', weatherForecast: weatherSummary });
                setPestData(pests.predictions);

                const report = await getFarmReport({ cropType: 'Wheat', farmSize: 10, lastYearsYield: 50 });
                setFarmReport(report);

            } catch (error) {
                console.error("Failed to fetch analytics data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crop Health Analysis</h1>
        <p className="text-muted-foreground">
          Track trends and performance metrics for your farm.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estimated Yield Trend</CardTitle>
            <CardDescription>AI-estimated yield (in quintals) for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !farmReport ? <Skeleton className="h-[300px] w-full" /> :
            <ChartContainer config={yieldChartConfig} className="h-[300px] w-full">
              <LineChart data={farmReport.yieldTrend}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line dataKey="yield" type="monotone" stroke="var(--color-yield)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
            }
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>7-Day Temperature Forecast</CardTitle>
                    <CardDescription>Max and min temperature readings.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading || !soilData ? <Skeleton className="h-[300px] w-full" /> :
                    <ChartContainer config={soilChartConfig} className="h-[300px] w-full">
                        <BarChart data={soilData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8}  tickFormatter={(value) => value.substring(0, 3)}/>
                            <YAxis />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="temp_max" fill="var(--color-temp_max)" radius={4} />
                            <Bar dataKey="temp_min" fill="var(--color-temp_min)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                    }
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Live Pest & Disease Risk</CardTitle>
                    <CardDescription>Current risk levels for Wheat in Delhi.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading || !pestData ? <Skeleton className="h-[300px] w-full" /> :
                    <ChartContainer config={pestChartConfig} className="h-[300px] w-full">
                        <BarChart data={pestData.map(p => ({...p, risk: riskLevelToNumber(p.riskLevel)}))} layout="vertical" margin={{left: 20}}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={80} className="text-xs" />
                            <XAxis type="number" dataKey="risk" domain={[0, 3]} ticks={[1, 2, 3]} tickFormatter={(val) => { return {1:'Low', 2:'Med', 3:'High'}[val] || ''; }} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Bar dataKey="risk" layout="vertical" fill="var(--color-pests)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                    }
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
