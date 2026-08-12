
"use client";
import {
  Activity,
  AlertTriangle,
  ArrowUp,
  Bot,
  Cloudy,
  IndianRupee,
  Droplets,
  Sprout,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  Lightbulb,
  Flower,
  Sun,
  CloudSun,
  CloudRain,
  ChevronRight,
  LocateFixed,
  Search,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { GetWeatherForecastOutput, getWeather } from '@/ai/flows/get-weather-forecast';
import { getMarketPrices, GetMarketPriceOutput } from "@/ai/flows/get-market-price";
import { getPestPrediction, GetPestPredictionOutput } from '@/ai/flows/get-pest-prediction';
import { getFarmReport, FarmReportOutput } from '@/ai/flows/get-farm-report';
import { useCallback, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

const chartConfig = {
  yield: {
    label: "Yield",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const weatherIconMap = {
  Sun: <Sun className="h-full w-full" />,
  CloudSun: <CloudSun className="h-full w-full" />,
  Cloudy: <Cloudy className="h-full w-full" />,
  CloudRain: <CloudRain className="h-full w-full" />,
  Wind: <Wind className="h-full w-full" />,
}

const hourlyChartConfig = {
  temperature: {
    label: "Temp",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


function WeatherCard() {
  const [weather, setWeather] = useState<GetWeatherForecastOutput | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [locationInput, setLocationInput] = useState('Delhi, India');
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());


  const fetchWeather = useCallback(async (location: string) => {
    if (!location) return;
    setLoadingWeather(true);
    setError(null);
    try {
      const weatherData = await getWeather({ location });
      setWeather(weatherData);
      if(weatherData?.location) {
        setLocationInput(weatherData.location);
        window.dispatchEvent(new CustomEvent('krishiconnect-location-change', { detail: weatherData.location }));
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      setError("Could not fetch weather data. Please try another location.");
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  const handleGetCurrentLocation = useCallback(() => {
    setLoadingWeather(true);
    setError(null);
     if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (err) => {
          console.error("Error getting location: ", err);
          setError(`Error: ${err.message}. Please enter a location manually.`);
          fetchWeather('Delhi, India'); // Fallback to default
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      fetchWeather('Delhi, India'); // Fallback to default
    }
  }, [fetchWeather])
  
  useEffect(() => {
    fetchWeather(locationInput);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000); // Update time every second

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const handleLocationSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      fetchWeather(locationInput);
  }

  if (loadingWeather || !weather) {
    return <Card className="lg:col-span-2"><CardContent className="p-4"><Skeleton className="h-96 w-full" /></CardContent></Card>
  }
  
  const { location, lastUpdated, current, daily, hourly } = weather;
  const todayForecast = daily[0];

  const convertTemp = (celsius: number) => {
    if (tempUnit === 'F') {
      return Math.round(celsius * 9/5 + 32);
    }
    return celsius;
  }
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
      <Card className="lg:col-span-2">
         <CardHeader>
            <CardTitle>Weather</CardTitle>
          </CardHeader>
        <CardContent className="p-4 pt-0">
          {error && (
             <Alert variant="destructive" className="mb-2 text-xs">
                <LocateFixed className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
          )}
          <div className="flex justify-between items-start gap-4">
            <form onSubmit={handleLocationSubmit} className="relative w-full flex gap-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter location..."
                    className="pl-8"
                />
                 <Button type='button' variant="outline" size="icon" onClick={handleGetCurrentLocation} className="shrink-0">
                    <LocateFixed className="h-4 w-4" />
                </Button>
            </form>
            <div className="flex items-center gap-1 rounded-full bg-muted p-1">
              <Button onClick={() => setTempUnit('F')} size="sm" className={cn('h-6 w-10 rounded-full', tempUnit === 'F' ? 'bg-background shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-muted/50')}>°F</Button>
              <Button onClick={() => setTempUnit('C')} size="sm" className={cn('h-6 w-10 rounded-full', tempUnit === 'C' ? 'bg-background shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-muted/50')}>°C</Button>
            </div>
          </div>
           <div className="mt-4">
              <h3 className="text-lg font-semibold">{location} {formattedTime}</h3>
              <p className="text-xs text-muted-foreground">{lastUpdated}</p>
            </div>
          
          <div className="flex items-center gap-6 my-4">
            <div className="w-24 h-24 text-yellow-400">
              {weatherIconMap[current.icon]}
            </div>
            <div>
              <span className="text-7xl font-bold">{convertTemp(current.temp)}</span><span className="text-5xl align-top text-muted-foreground">°{tempUnit}</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-medium">{current.condition}</p>
              <p className="text-muted-foreground">H {convertTemp(todayForecast.temp_max)}° L {convertTemp(todayForecast.temp_min)}°</p>
            </div>
          </div>
          
          <div className="mt-6">
            <ScrollArea>
              <div className="flex w-max space-x-2 pb-4">
                {daily.map((day, index) => (
                  <div key={index} className={cn("flex flex-col items-center gap-1 p-3 rounded-lg w-20", index === 0 ? "bg-muted border" : "")}>
                    <p className="text-sm font-medium">{day.day}</p>
                    <div className="w-8 h-8 text-yellow-400">{weatherIconMap[day.icon]}</div>
                    <p className="text-sm">{convertTemp(day.temp_max)}° {convertTemp(day.temp_min)}°</p>
                  </div>
                ))}
                <div className="flex items-center justify-center">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <ChevronRight />
                  </Button>
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          
          <div className="h-40 w-full mt-4">
            <ChartContainer config={hourlyChartConfig} className="h-full w-full">
              <AreaChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-temperature)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-temperature)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                 <XAxis 
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.split(' ')[0] + value.split(' ')[1].substring(0,1)}
                  className="text-xs"
                />
                 <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => (
                          <>
                            <div className="font-bold text-center">{props.payload.time}</div>
                            <div>{convertTemp(props.payload.temp)}°{tempUnit}</div>
                            {props.payload.precip > 0 && <div className="text-blue-400">💧 {props.payload.precip}%</div>}
                          </>
                        )}
                        hideLabel
                        hideIndicator
                      />
                    }
                  />
                <Area type="monotone" dataKey="temp" stroke="var(--color-temperature)" fill="url(#colorUv)" />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
  )
}


export default function DashboardPage() {
  const [marketPrices, setMarketPrices] = useState<GetMarketPriceOutput | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [liveStats, setLiveStats] = useState<{humidity: number, alerts: number, farmReport: FarmReportOutput | null}>({ humidity: 0, alerts: 0, farmReport: null });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
        const cacheKey = 'krishiconnect_dashboard_cache';
        
        // Load from cache instantly if available
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.marketPrices && parsed.liveStats) {
                    setMarketPrices(parsed.marketPrices);
                    setLiveStats(parsed.liveStats);
                    setLoadingPrices(false);
                    setLoadingStats(false);
                }
            }
        } catch (e) {
            console.error('Failed to load dashboard cache:', e);
        }

        try {
            // Fetch independent data in parallel (3x faster)
            const [pricesData, weather, report] = await Promise.all([
                getMarketPrices({ crop: 'Wheat' }),
                getWeather({ location: 'Delhi, India' }),
                getFarmReport({ cropType: 'Wheat', farmSize: 10, lastYearsYield: 50 })
            ]);

            setMarketPrices(pricesData);

            // Fetch pest prediction (depends on weather forecast data)
            const weatherSummary = weather.daily.map(day => 
              `${day.day}: ${day.condition}, Temp ${day.temp_min}°C-${day.temp_max}°C`
            ).join('; ');
            
            const pests = await getPestPrediction({ location: 'Delhi, India', cropType: 'Wheat', weatherForecast: weatherSummary });
            const highMediumAlerts = pests.predictions.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Medium').length;
            
            const freshStats = {
                humidity: weather.current.humidity,
                alerts: highMediumAlerts,
                farmReport: report
            };

            setLiveStats(freshStats);

            // Cache data for future instant loads
            try {
                localStorage.setItem(cacheKey, JSON.stringify({
                    marketPrices: pricesData,
                    liveStats: freshStats
                }));
            } catch (e) {
                console.error('Failed to save dashboard cache:', e);
            }

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoadingPrices(false);
            setLoadingStats(false);
        }
    };
    fetchDashboardData();
  }, []);
  
  useEffect(() => {
    const handleLocationChange = async (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const newLoc = customEvent.detail;
      setLoadingPrices(true);
      try {
        const pricesData = await getMarketPrices({ crop: 'Wheat', location: newLoc });
        setMarketPrices(pricesData);
      } catch (err) {
        console.error("Failed to load localized market prices:", err);
      } finally {
        setLoadingPrices(false);
      }
    };

    window.addEventListener('krishiconnect-location-change', handleLocationChange);
    return () => {
      window.removeEventListener('krishiconnect-location-change', handleLocationChange);
    };
  }, []);
  

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats || !liveStats.farmReport ? <Skeleton className="h-7 w-3/4" /> : <div className="text-2xl font-bold">₹{liveStats.farmReport.totalRevenue.toLocaleString('en-IN')}</div>}
            <div className="text-xs text-muted-foreground">
              {loadingStats || !liveStats.farmReport ? <Skeleton className="h-4 w-full mt-1" /> : liveStats.farmReport.revenueSummary}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Crop Health
            </CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loadingStats || !liveStats.farmReport ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{liveStats.farmReport.cropHealth}%</div>}
            <div className="text-xs text-muted-foreground">
               {loadingStats || !liveStats.farmReport ? <Skeleton className="h-4 w-full mt-1" /> : liveStats.farmReport.healthSummary}
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Live Humidity
            </CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loadingStats ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{liveStats.humidity}%</div>}
            <p className="text-xs text-muted-foreground">
              From weather station
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? <Skeleton className="h-7 w-1/4" /> : <div className="text-2xl font-bold">{liveStats.alerts}</div>}
            <p className="text-xs text-muted-foreground">
              High & Medium risk
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 lg:grid-cols-3">
         <WeatherCard />
         <Card>
           <CardHeader>
            <CardTitle>Yield Analytics</CardTitle>
            <CardDescription>Estimated yield for last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
             {loadingStats || !liveStats.farmReport ? <Skeleton className="h-[250px] w-full" /> :
                <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={liveStats.farmReport.yieldTrend}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="yield" fill="var(--color-yield)" radius={8} />
                </BarChart>
                </ChartContainer>
             }
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
         <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/diagnostics">
                    <Sprout className="h-6 w-6" />
                    <span>Diagnostics</span>
                </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/soil-analysis">
                    <Activity className="h-6 w-6" />
                    <span>Soil Analysis</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/pest-prediction">
                    <AlertTriangle className="h-6 w-6" />
                    <span>Pest Prediction</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/market">
                    <IndianRupee className="h-6 w-6" />
                    <span>Market</span>
                </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/crop-advisor">
                    <Lightbulb className="h-6 w-6" />
                    <span>Crop Advisor</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/irrigation-schedule">
                    <Droplets className="h-6 w-6" />
                    <span>Irrigation</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/weed-identification">
                    <Flower className="h-6 w-6" />
                    <span>Weed ID</span>
                </Link>
            </Button>
             <Button asChild variant="outline" className="h-20 flex-col gap-1">
                <Link href="/dashboard/voice-assistant">
                    <Bot className="h-6 w-6" />
                    <span>Assistant</span>
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Market Prices (Wheat)</CardTitle>
            <CardDescription>Latest prices from major markets.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPrices ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : marketPrices && marketPrices.length > 0 ? (
              <ul className="space-y-3">
                {marketPrices.slice(0, 3).map((price, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="font-medium">{price.location}</div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-primary font-bold text-base">₹{price.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs">/ quintal</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No market price data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    

    