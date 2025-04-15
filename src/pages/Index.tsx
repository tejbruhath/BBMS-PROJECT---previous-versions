
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Heart, Database, Users, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      title: "Donate Blood",
      description: "Register as a donor and help save lives",
      icon: Heart,
      color: "text-blood-600",
      link: "/donor",
      bgColor: "bg-blood-50"
    },
    {
      title: "Blood Inventory",
      description: "View and manage available blood units",
      icon: Droplet,
      color: "text-blue-600",
      link: "/inventory",
      bgColor: "bg-blue-50"
    },
    {
      title: "Request Blood",
      description: "Find matching donors for patients in need",
      icon: Users,
      color: "text-indigo-600",
      link: "/recipient",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Transfusion Events",
      description: "Track and manage blood transfusion events",
      icon: Activity,
      color: "text-green-600",
      link: "/transfusions",
      bgColor: "bg-green-50"
    },
    {
      title: "Blockchain Verification",
      description: "Verify blood units using blockchain technology",
      icon: Database,
      color: "text-purple-600",
      link: "/blockchain",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Droplet className="h-16 w-16 text-blood-600" />
            <div className="absolute -bottom-1 -right-1">
              <Database className="h-8 w-8 text-gray-700" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">BloodLink Supply Chain Nexus</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A secure and transparent blood donation management system powered by KNN matching and blockchain technology
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => (
          <Card key={feature.title} className="overflow-hidden border-t-4 transition-all hover:shadow-md" style={{ borderTopColor: feature.color }}>
            <CardHeader className={`${feature.bgColor} bg-opacity-50`}>
              <div className="flex items-center gap-3">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
                <CardTitle>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className={feature.title === "Donate Blood" ? "bg-blood-600 hover:bg-blood-700" : ""}> 
                <Link to={feature.link}>Access {feature.title}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blood-100 p-4 rounded-full inline-flex justify-center items-center w-16 h-16 mb-4">
              <Heart className="h-8 w-8 text-blood-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Step 1: Donate</h3>
            <p className="text-gray-600">Register as a donor and contribute to saving lives through blood donation.</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full inline-flex justify-center items-center w-16 h-16 mb-4">
              <Droplet className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Step 2: Match</h3>
            <p className="text-gray-600">Our KNN algorithm finds the optimal match between donors and recipients.</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full inline-flex justify-center items-center w-16 h-16 mb-4">
              <Database className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Step 3: Verify</h3>
            <p className="text-gray-600">Blockchain technology ensures secure, transparent blood supply tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
