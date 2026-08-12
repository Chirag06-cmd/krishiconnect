"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Mail, Phone, User, GraduationCap, Building } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About KrishiConnect</h1>
        <p className="text-muted-foreground">
          AI-powered agricultural diagnostics and crop health monitoring.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
           <CardDescription className="flex items-center gap-2 pt-2">
            <Building className="h-4 w-4" />
            Focus: Precision Agriculture & AI Insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <h3 className="font-semibold text-lg">AI-powered monitoring of crop health, soil condition, and pest risks using multispectral/hyperspectral imaging and sensor data.</h3>
            <p className="text-muted-foreground">
            Agriculture faces growing threats from soil degradation, unpredictable weather, and pest outbreaks, leading to reduced yields and economic losses. Traditional monitoring methods are often delayed, labor-intensive, and lack precision. There is a need for a unified software platform that integrates remote sensing and sensor data to provide timely, field-level insights on crop health, soil conditions, and pest risks using AI-driven analysis.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
