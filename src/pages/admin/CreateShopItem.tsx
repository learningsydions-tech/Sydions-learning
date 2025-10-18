import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const CreateShopItemPage = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create New Shop Item</h1>
        <p className="text-muted-foreground mt-1">
          Add a new item to the shop or as a reward.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="e.g., Cyber Samurai Frame" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the item..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue="avatar">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avatar">Avatar</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="badge">Badge</SelectItem>
                    <SelectItem value="frame">Frame</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (Coins)</Label>
                <Input id="price" type="number" placeholder="0" defaultValue="0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image Upload</Label>
              <Input id="image" type="file" />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="reward-only" />
                <Label htmlFor="reward-only" className="font-normal">
                  Reward Only (not in shop)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="guild-store" />
                <Label htmlFor="guild-store" className="font-normal">
                  For Guild Store
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-6">
          <Button variant="outline" asChild>
            <Link to="/admin/shop">Cancel</Link>
          </Button>
          <Button>Create Item</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateShopItemPage;