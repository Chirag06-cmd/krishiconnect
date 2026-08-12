"use client";

import { useState } from "react";
import Image from "next/image";
import { identifyWeed, WeedIdentificationOutput } from "@/ai/flows/weed-identification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, Flower, AlertCircle, Hand, TestTube, ChevronsRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useTranslation } from "@/lib/i18n";

export default function WeedIdentificationPage() {
  const { locale } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<WeedIdentificationOutput | null>(null);
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

  const handleIdentify = async () => {
    if (!file || !preview) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const identificationResult = await identifyWeed({ photoDataUri: preview, locale });
      setResult(identificationResult);
    } catch (err) {
      setError("An error occurred during analysis. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ControlMethodCard = ({ method }: { method: { name: string, description: string } }) => (
    <div className="p-4 border rounded-lg bg-background">
      <h4 className="font-semibold text-md">{method.name}</h4>
      <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weed Identification</h1>
        <p className="text-muted-foreground">
          Upload an image of a weed to get an AI-powered identification and control plan.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Upload Weed Image</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
            <label htmlFor="weed-image-upload" className="w-full h-64 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
              {preview ? (
                <Image src={preview} alt="Weed preview" width={300} height={300} className="max-h-full w-auto object-contain rounded-md" />
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                </div>
              )}
              <input id="weed-image-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
            <Button onClick={handleIdentify} disabled={!file || loading} className="w-full">
              {loading ? "Identifying..." : "Identify Weed"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-56 w-full" />
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
                  <CardTitle className="flex items-center gap-2"><Flower />Identification</CardTitle>
                  <CardDescription>Confidence: {Math.round(result.identification.confidence * 100)}%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="text-xl font-semibold">{result.identification.weedName}</h3>
                  <p className="text-sm text-muted-foreground italic">{result.identification.scientificName}</p>
                  <p className="text-sm pt-2">{result.identification.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Control Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="manual">Manual</TabsTrigger>
                      <TabsTrigger value="organic">Organic</TabsTrigger>
                      <TabsTrigger value="chemical">Chemical</TabsTrigger>
                    </TabsList>
                    <TabsContent value="manual" className="mt-4 space-y-4">
                      {result.controlMethods.filter(m => m.type === 'Manual').map((m, i) => <ControlMethodCard key={`man-${i}`} method={m} />)}
                    </TabsContent>
                    <TabsContent value="organic" className="mt-4 space-y-4">
                       {result.controlMethods.filter(m => m.type === 'Organic').map((m, i) => <ControlMethodCard key={`org-${i}`} method={m} />)}
                    </TabsContent>
                     <TabsContent value="chemical" className="mt-4 space-y-4">
                       {result.controlMethods.filter(m => m.type === 'Chemical').map((m, i) => <ControlMethodCard key={`chem-${i}`} method={m} />)}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}

          {!result && !loading && !error && (
             <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">Weed analysis will appear here.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
