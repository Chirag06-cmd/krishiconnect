"use client";

import { useState } from "react";
import Image from "next/image";
import { generateSpectralMap, GenerateSpectralMapOutput } from "@/ai/flows/generate-spectral-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, Layers, AlertCircle, Sparkles } from "lucide-react";

export default function HealthMapPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateSpectralMapOutput | null>(null);
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

  const handleGenerateMap = async () => {
    if (!file || !preview) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const mapResult = await generateSpectralMap({ farmImageUri: preview });
      setResult(mapResult);
    } catch (err) {
      setError("An error occurred while generating the map. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Spectral Health Map Generation
        </h1>
        <p className="text-muted-foreground">
          Upload a satellite or drone image of your field to generate an AI-powered health map.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Upload Farm Image</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
            <label htmlFor="farm-image-upload" className="w-full h-64 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
              {preview ? (
                <Image src={preview} alt="Farm preview" width={300} height={300} className="max-h-full w-auto object-contain rounded-md" />
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                </div>
              )}
              <input id="farm-image-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
            <Button onClick={handleGenerateMap} disabled={!file || loading} className="w-full">
              {loading ? "Generating Map..." : "Generate Health Map"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {loading && (
            <Card>
                <CardHeader>
                    <CardTitle>Generating Analysis...</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </CardContent>
            </Card>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Layers />Generated Health Map</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2 text-sm text-center">Original Image</h3>
                            <div className="w-full aspect-square rounded-lg overflow-hidden border">
                                <Image src={preview!} alt="Original farm" width={400} height={400} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-sm text-center">Spectral Map</h3>
                            <div className="w-full aspect-square rounded-lg overflow-hidden border">
                                <Image src={result.spectralMapUri} alt="Generated spectral map" width={400} height={400} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><Sparkles size={20} />AI Analysis</h3>
                        <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">{result.analysis}</p>
                    </div>
                </CardContent>
            </Card>
          )}

          {!result && !loading && !error && (
             <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground text-center">Your generated health map and analysis will appear here.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
