"use client";

import { useState } from "react";
import Image from "next/image";
import { getSoilAnalysis, GetSoilAnalysisOutput } from "@/ai/flows/get-soil-analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, AlertCircle, FlaskConical, TestTube, Trees, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { useTranslation } from "@/lib/i18n";

export default function SoilAnalysisPage() {
  const { locale } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState("Delhi, India");
  const [season, setSeason] = useState("Rabi");
  const [result, setResult] = useState<GetSoilAnalysisOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !preview || !location || !season) {
        setError("Please provide a soil image, location, and season.");
        return;
    };
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const analysisResult = await getSoilAnalysis({ photoDataUri: preview, location, season, locale });
      setResult(analysisResult);
    } catch (err) {
      setError("An error occurred during analysis. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const NutrientBadge = ({ level }: { level: string }) => {
    const variant = level.toLowerCase() === 'high' ? 'default' : level.toLowerCase() === 'medium' ? 'secondary' : 'destructive';
    return <Badge variant={variant}>{level}</Badge>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Soil Analysis & Recommendations</h1>
        <p className="text-muted-foreground">
          Upload a soil image to get AI-powered analysis and crop recommendations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Provide Soil Details</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col gap-4">
            <label htmlFor="soil-image-upload" className="w-full h-48 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
              {preview ? (
                <Image src={preview} alt="Soil preview" width={200} height={200} className="max-h-full w-auto object-contain rounded-md" />
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Upload soil image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                </div>
              )}
              <input id="soil-image-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Delhi, India"/>
                </div>
                 <div>
                    <Label htmlFor="season">Season</Label>
                    <Select value={season} onValueChange={setSeason}>
                        <SelectTrigger id="season">
                            <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Kharif">Kharif</SelectItem>
                            <SelectItem value="Rabi">Rabi</SelectItem>
                            <SelectItem value="Zaid">Zaid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button onClick={handleAnalyze} disabled={!file || loading} className="w-full">
              {loading ? "Analyzing..." : "Analyze Soil"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FlaskConical/>Soil Report</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Soil Type</p>
                        <p className="text-lg font-semibold">{result.soilType}</p>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">pH Level</p>
                        <p className="text-lg font-semibold">{result.phLevel.toFixed(1)}</p>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Organic Matter</p>
                        <p className="text-lg font-semibold">{result.organicMatterPercentage.toFixed(1)}%</p>
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TestTube/>Nutrient Levels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {result.nutrientLevels.map(nutrient => (
                        <div key={nutrient.name} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                            <span className="font-medium">{nutrient.name}</span>
                            <NutrientBadge level={nutrient.value} />
                        </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Trees/>Recommended Crops</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.recommendedCrops.map(crop => (
                    <div key={crop.name} className="p-3 border rounded-lg">
                      <h4 className="font-semibold">{crop.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{crop.reason}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Lightbulb/>Improvement Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {result.soilImprovementTips.map((tip, index) => <li key={index}>{tip}</li>)}
                  </ul>
                </CardContent>
              </Card>

            </>
          )}

          {!result && !loading && !error && (
             <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">Analysis results will appear here.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
