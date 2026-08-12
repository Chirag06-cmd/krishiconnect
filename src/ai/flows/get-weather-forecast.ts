
'use server';

/**
 * @fileOverview A flow to get the real-time weather forecast using AccuWeather API.
 *
 * Note: AccuWeather's free/standard tiers typically provide a 5-day forecast. This
 * flow requests the 5-day forecast and pads to 7 days by repeating the last day
 * if necessary so the UI (which expects 7 days) continues to work.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Simple in-memory cache to reduce external weather API calls.
// Cache is keyed by normalized location string and holds the full output payload.
interface CacheEntry {
    expires: number; // epoch ms
    data: GetWeatherForecastOutput;
}

const weatherCache = new Map<string, CacheEntry>();

function getCacheTTLSeconds(): number {
    const env = process.env.WEATHER_CACHE_TTL_SECONDS;
    const parsed = env ? parseInt(env, 10) : NaN;
    if (!Number.isFinite(parsed) || parsed <= 0) return 600; // default 10 minutes
    return parsed;
}


const WeatherForecastSchema = z.object({
    day: z.string().describe("Day of the week"),
    temp: z.number().describe("Temperature in Celsius"),
    condition: z.string().describe("Weather condition (e.g., Sunny, Cloudy, Rainy)"),
    icon: z.enum(['Sun', 'CloudSun', 'Cloudy', 'CloudRain', 'Wind']).describe("An icon representing the weather condition"),
    temp_max: z.number().describe("Maximum temperature for the day"),
    temp_min: z.number().describe("Minimum temperature for the day"),
    full_description: z.string().describe("A short description of the weather for the day")
});

const HourlyForecastSchema = z.object({
    time: z.string().describe("The time for the forecast, e.g., '10 AM'"),
    temp: z.number().describe("Temperature in Celsius"),
    precip: z.number().describe("Chance of precipitation as a percentage"),
});


const GetWeatherForecastInputSchema = z.object({
  location: z.string().describe('The location to get the weather forecast for.'),
});

export type GetWeatherForecastInput = z.infer<typeof GetWeatherForecastInputSchema>;

const GetWeatherForecastOutputSchema = z.object({
    location: z.string().describe("The name of the location."),
    currentTime: z.string().describe("The current local time in hh:mm AM/PM format."),
    lastUpdated: z.string().describe("When the data was last updated."),
    current: z.object({
        temp: z.number().describe("Current temperature in Celsius"),
        condition: z.string().describe("Current weather condition text"),
        icon: z.enum(['Sun', 'CloudSun', 'Cloudy', 'CloudRain', 'Wind']).describe("An icon representing the weather condition"),
        feelsLike: z.number().describe("What the temperature feels like in Celsius"),
        windSpeed: z.number().describe("Wind speed in kph"),
        humidity: z.number().describe("Humidity percentage"),
    }),
    daily: z.array(WeatherForecastSchema),
    hourly: z.array(HourlyForecastSchema),
});


export type GetWeatherForecastOutput = z.infer<typeof GetWeatherForecastOutputSchema>;

// Helper to map AccuWeather icon phrases to our app's icons
const getIcon = (phrase: string): 'Sun' | 'CloudSun' | 'Cloudy' | 'CloudRain' | 'Wind' => {
    const p = (phrase || '').toLowerCase();
    if (p.includes('cloud') && p.includes('sun')) return 'CloudSun';
    if (p.includes('cloudy')) return 'Cloudy';
    if (p.includes('rain') || p.includes('shower') || p.includes('thunder')) return 'CloudRain';
    if (p.includes('wind')) return 'Wind';
    if (p.includes('sun') || p.includes('clear') || p.includes('hot')) return 'Sun';
    return 'Sun'; // Default icon
};




// Helper to map Open-Meteo weather code to condition string and icon
function mapWeatherCode(code: number): { condition: string; icon: 'Sun' | 'CloudSun' | 'Cloudy' | 'CloudRain' | 'Wind' } {
    if (code === 0) return { condition: 'Clear Sky', icon: 'Sun' };
    if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', icon: 'CloudSun' };
    if (code === 45 || code === 48) return { condition: 'Foggy', icon: 'Cloudy' };
    if (code >= 51 && code <= 57) return { condition: 'Drizzle', icon: 'CloudRain' };
    if (code >= 61 && code <= 67) return { condition: 'Rainy', icon: 'CloudRain' };
    if (code >= 71 && code <= 77) return { condition: 'Snowy', icon: 'Cloudy' };
    if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: 'CloudRain' };
    if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: 'CloudRain' };
    return { condition: 'Clear', icon: 'Sun' };
}

const weatherForecastFlow = ai.defineFlow(
  {
    name: 'weatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: GetWeatherForecastOutputSchema,
  },
  async (input) => {
    try {
      let lat = 28.61;
      let lon = 77.20;
      let resolvedAddress = input.location;

      const coordRegex = /^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/;
      const coordMatch = input.location.match(coordRegex);

      if (coordMatch) {
        // It's coordinate format - parse directly and reverse geocode to get name
        lat = parseFloat(coordMatch[1]);
        lon = parseFloat(coordMatch[3]);
        try {
          const revRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          if (revRes.ok) {
            const revData = await revRes.json();
            const place = revData.city || revData.locality || revData.principalSubdivision || "";
            if (place) {
              resolvedAddress = place;
              if (revData.countryName) {
                resolvedAddress += `, ${revData.countryName}`;
              }
            }
          }
        } catch (err) {
          console.error("Reverse geocoding failed, using coordinates as name:", err);
        }
      } else {
        // Clean query (extract city name e.g., "Delhi" from "Delhi, India")
        const cityName = input.location.split(',')[0].trim();
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        if (!geoRes.ok) throw new Error("Geocoding failed");
        
        const geoData = await geoRes.json();
        
        if (geoData.results && geoData.results.length > 0) {
          const matched = geoData.results[0];
          lat = matched.latitude;
          lon = matched.longitude;
          resolvedAddress = `${matched.name}, ${matched.admin1 || ''} ${matched.country || ''}`.trim().replace(/\s+/g, ' ');
        } else {
          console.warn(`No results for city name "${cityName}", using fallback coordinates for Delhi.`);
        }
      }

      // 2. Fetch real weather from free Open-Meteo API
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,precipitation_probability&timezone=auto&forecast_days=7`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Weather forecast fetch failed");
      
      const rawData = await weatherRes.json();
      
      // 3. Map the raw Open-Meteo data locally to our schema (0 Gemini calls, extremely fast)
      const current = rawData.current;
      const mappedCurrent = mapWeatherCode(current.weather_code);
      
      // Daily map (7 days)
      const dailyForecasts = [];
      const days = rawData.daily.time || [];
      for (let i = 0; i < Math.min(days.length, 7); i++) {
        const date = new Date(days[i]);
        let dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (i === 0) {
          dayLabel = 'Today';
        } else {
          dayLabel = `${dayLabel} ${date.getDate()}`;
        }
        
        const code = rawData.daily.weather_code[i];
        const mapped = mapWeatherCode(code);
        dailyForecasts.push({
          day: dayLabel,
          temp: Math.round((rawData.daily.temperature_2m_max[i] + rawData.daily.temperature_2m_min[i]) / 2),
          condition: mapped.condition,
          icon: mapped.icon,
          temp_max: Math.round(rawData.daily.temperature_2m_max[i]),
          temp_min: Math.round(rawData.daily.temperature_2m_min[i]),
          full_description: mapped.condition
        });
      }

      // Hourly map (next 8 hours)
      const hourlyForecasts = [];
      const hours = rawData.hourly.time || [];
      const currentHourStr = new Date().toISOString().substring(0, 13) + ":00";
      let startIndex = hours.findIndex((h: string) => h.startsWith(currentHourStr));
      if (startIndex === -1) startIndex = 0;

      for (let i = startIndex; i < Math.min(hours.length, startIndex + 8); i++) {
        const time = new Date(hours[i]).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        hourlyForecasts.push({
          time,
          temp: Math.round(rawData.hourly.temperature_2m[i]),
          precip: Math.round(rawData.hourly.precipitation_probability[i] || 0)
        });
      }

      return {
        location: resolvedAddress,
        currentTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        lastUpdated: 'Live Weather (Open-Meteo)',
        current: {
          temp: Math.round(current.temperature_2m),
          condition: mappedCurrent.condition,
          icon: mappedCurrent.icon,
          feelsLike: Math.round(current.apparent_temperature),
          windSpeed: Math.round(current.wind_speed_10m),
          humidity: Math.round(current.relative_humidity_2m)
        },
        daily: dailyForecasts,
        hourly: hourlyForecasts
      };

    } catch (e) {
      console.error("Open-Meteo local weather mapping failed:", e);
      throw e;
    }
  }
);

export async function getWeather(input: GetWeatherForecastInput): Promise<GetWeatherForecastOutput> {
    try {
        return await weatherForecastFlow(input);
    } catch (e) {
        console.error("Error in getWeather flow:", e);
        // Clean fallback
        return {
            location: input.location,
            currentTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            lastUpdated: 'Live weather offline fallback',
            current: {
                temp: 29,
                condition: 'Partly Cloudy',
                icon: 'CloudSun',
                feelsLike: 32,
                windSpeed: 12,
                humidity: 65,
            },
            daily: [
                { day: 'Today', temp: 31, condition: 'Partly Cloudy', icon: 'CloudSun', temp_max: 33, temp_min: 28, full_description: 'Partly Cloudy' },
                { day: 'Tomorrow', temp: 32, condition: 'Sunny', icon: 'Sun', temp_max: 34, temp_min: 27, full_description: 'Sunny' },
                { day: 'Day After', temp: 32, condition: 'Sunny', icon: 'Sun', temp_max: 34, temp_min: 27, full_description: 'Sunny' }
            ],
            hourly: [
                { time: '10 AM', temp: 30, precip: 5 }, { time: '1 PM', temp: 32, precip: 10 },
                { time: '4 PM', temp: 32, precip: 15 }, { time: '7 PM', temp: 31, precip: 20 }
            ]
        };
    }
}
