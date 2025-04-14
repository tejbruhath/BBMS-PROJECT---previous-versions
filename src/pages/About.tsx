
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Code,
  Database,
  Shield,
  Link,
  Users,
  Cpu,
  Layers,
} from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">About BloodLink Supply Chain Nexus</CardTitle>
          <CardDescription>
            A modern blood donation management system with advanced matching algorithms and blockchain verification
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-500" />
              <CardTitle>Intelligent Matching Algorithm</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We utilize a K-Nearest Neighbors (KNN) algorithm to match blood donors with recipients. 
              The matching considers multiple factors including:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
              <li>Blood type compatibility matrix</li>
              <li>Geographic proximity</li>
              <li>Blood freshness</li>
              <li>Urgency level</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link className="h-5 w-5 text-green-500" />
              <CardTitle>Blockchain Integration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our blockchain implementation ensures transparency and traceability:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
              <li>Immutable record of all donations and transfusions</li>
              <li>Verification of blood unit authenticity</li>
              <li>Complete chain of custody tracking</li>
              <li>Prevent duplicate or fraudulent entries</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Donor privacy is our top priority. We implement:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
              <li>Anonymized donor IDs</li>
              <li>Secure data storage</li>
              <li>Role-based access control</li>
              <li>Encrypted sensitive information</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-500" />
              <CardTitle>Tech Stack</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-muted-foreground">
              <li>Frontend: React with TypeScript</li>
              <li>UI: Tailwind CSS & Shadcn/ui</li>
              <li>State Management: React Context</li>
              <li>Authentication: Custom Auth System</li>
              <li>Database: Supabase (PostgreSQL)</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Developed by B Tejbruhat and Vivek Vanga
          </p>
          <p className="text-center text-sm text-muted-foreground">
            3rd Year BTech Students
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
