import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ColorfulTest = () => {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Colorful UI Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Primary Card */}
        <Card className="card-colorful">
          <CardHeader>
            <CardTitle className="text-primary">Primary Card</CardTitle>
            <CardDescription>Using the new vibrant purple theme</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="btn-primary-colorful">Primary Button</Button>
          </CardContent>
        </Card>
        
        {/* Secondary Card */}
        <Card className="card-colorful">
          <CardHeader>
            <CardTitle className="text-secondary">Secondary Card</CardTitle>
            <CardDescription>Using the bright blue theme</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary">Secondary Button</Button>
          </CardContent>
        </Card>
        
        {/* Accent Card */}
        <Card className="card-colorful">
          <CardHeader>
            <CardTitle className="text-accent">Accent Card</CardTitle>
            <CardDescription>Using the vibrant orange theme</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="btn-secondary-colorful">Accent Button</Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Gradient Section */}
      <div className="bg-gradient-primary p-6 rounded-lg text-white">
        <h2 className="text-2xl font-bold">Gradient Background</h2>
        <p>This section uses a gradient from primary to accent colors</p>
      </div>
    </div>
  );
};

export default ColorfulTest;