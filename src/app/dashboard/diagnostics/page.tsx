"use client";

import { useState } from "react";
import Image from "next/image";
import {
  identifyCropProblem,
  CropDiseasePestIdentificationOutput,
} from "@/ai/flows/crop-disease-pest-identification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, Leaf, Shield, TestTube2, AlertCircle, SprayCan, IndianRupee } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n";

export default function DiagnosticsPage() {
  const { locale } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<CropDiseasePestIdentificationOutput | null>(null);
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
      const diagnosisResult = await identifyCropProblem({ photoDataUri: preview, locale });
      setResult(diagnosisResult);
    } catch (err) {
      setError("An error occurred during analysis. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const TreatmentCard = ({ treatment }: { treatment: { name: string, description: string, estimatedCost: string } }) => (
    <div className="p-4 border rounded-lg bg-background">
      <h4 className="font-semibold text-md">{treatment.name}</h4>
      <p className="text-sm text-muted-foreground mt-1">{treatment.description}</p>
      <div className="flex items-center text-sm text-muted-foreground mt-2 gap-2">
        <IndianRupee className="h-4 w-4" />
        <span>{treatment.estimatedCost}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Disease & Pest Identification</h1>
        <p className="text-muted-foreground">
          Upload an image of an affected plant to get an AI-powered diagnosis and treatment plan.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Upload Crop Image</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
            <label htmlFor="crop-image-upload" className="w-full h-64 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
              {preview ? (
                <Image src={preview} alt="Crop preview" width={300} height={300} className="max-h-full w-auto object-contain rounded-md" />
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                </div>
              )}
              <input id="crop-image-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
            <Button onClick={handleIdentify} disabled={!file || loading} className="w-full">
              {loading ? "Analyzing..." : "Identify Problem"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
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
                  <CardTitle className="flex items-center gap-2"><Leaf/>Identification</CardTitle>
                  <CardDescription>Confidence: {Math.round(result.identification.confidence * 100)}%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-sm text-muted-foreground">Plant/Crop</p>
                  <p className="text-lg font-semibold">{result.identification.plantName}</p>
                  <p className="text-sm text-muted-foreground pt-2">Identified Problem</p>
                  <p className="text-lg font-semibold">{result.identification.diseaseOrPest}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><SprayCan />Treatment Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="organic">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="organic">Organic</TabsTrigger>
                      <TabsTrigger value="chemical">Chemical</TabsTrigger>
                    </TabsList>
                    <TabsContent value="organic" className="mt-4 space-y-4">
                      {result.treatmentGuidance.organic.length > 0 ? (
                        result.treatmentGuidance.organic.map((t, i) => <TreatmentCard key={`org-${i}`} treatment={t} />)
                      ) : <p className="text-sm text-muted-foreground text-center py-4">No organic treatments suggested.</p>}
                    </TabsContent>
                    <TabsContent value="chemical" className="mt-4 space-y-4">
                       {result.treatmentGuidance.chemical.length > 0 ? (
                        result.treatmentGuidance.chemical.map((t, i) => <TreatmentCard key={`chem-${i}`} treatment={t} />)
                      ) : <p className="text-sm text-muted-foreground text-center py-4">No chemical treatments suggested.</p>}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield/>
                    Preventative Measures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {result.preventativeMeasures.map((item, index) => <li key={index}>{item}</li>)}
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
