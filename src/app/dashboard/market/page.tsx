"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { getMarketPrices, GetMarketPriceOutput } from "@/ai/flows/get-market-price";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const crops = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane", "Soybean", "Potato"];

export default function MarketPage() {
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [prices, setPrices] = useState<GetMarketPriceOutput>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async (crop: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMarketPrices({ crop: crop });
      setPrices(result);
    } catch (err) {
      console.error(err);
      setError("Could not fetch market prices. Please try again later.");
      setPrices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCrop) {
      fetchPrices(selectedCrop);
    }
  }, [selectedCrop, fetchPrices]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Real-Time Market Prices</h1>
        <p className="text-muted-foreground">
          Live agricultural commodity prices from markets across India.
        </p>
      </div>

      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Commodity Prices (per quintal)</CardTitle>
                 <Select onValueChange={setSelectedCrop} defaultValue={selectedCrop}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                        {crops.map((crop) => (
                            <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
            {error && (
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
           {!error && <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Market Location</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead className="text-right">Price (INR)</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                             <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        </TableRow>
                    ))
                ) : (
                    prices.map((price, index) => (
                        <TableRow key={index}>
                        <TableCell>{price.location}</TableCell>
                        <TableCell>{price.crop}</TableCell>
                        <TableCell className="text-right font-medium">₹{price.price.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{new Date(price.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</TableCell>
                        </TableRow>
                    ))
                )}
                </TableBody>
          </Table>}
           {!loading && !error && prices.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                    No price data available for the selected crop.
                </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
