import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

const CreateShopItemPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("badge");
  const [price, setPrice] = useState(0);
  const [rarity, setRarity] = useState("Common");
  const [isRewardOnly, setIsRewardOnly] = useState(false);
  const [isForGuildStore, setIsForGuildStore] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // Using text input for simplicity

  const createItemMutation = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Item name is required.");
      if (price < 0) throw new Error("Price cannot be negative.");

      const { data, error } = await supabase
        .from("shop_items")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          type: type,
          price: price,
          rarity: rarity,
          is_reward_only: isRewardOnly,
          is_for_guild_store: isForGuildStore,
          image_url: imageUrl.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      showSuccess("Shop item created successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminShopItems"] });
      navigate("/admin/shop");
    },
    onError: (error) => {
      console.error("Shop item creation failed:", error);
      showError(`Failed to create item: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createItemMutation.mutate();
  };

  const isPending = createItemMutation.isPending;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create New Shop Item</h1>
        <p className="text-muted-foreground mt-1">
          Add a new item to the shop or as a reward.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Cyber Samurai Frame" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item..."
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    defaultValue={type} 
                    onValueChange={setType}
                    disabled={isPending}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="avatar">Avatar</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="badge">Badge</SelectItem>
                      <SelectItem value="frame">Frame</SelectItem>
                      <SelectItem value="consumable">Consumable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rarity">Rarity</Label>
                  <Select 
                    defaultValue={rarity} 
                    onValueChange={setRarity}
                    disabled={isPending}
                  >
                    <SelectTrigger id="rarity">
                      <SelectValue placeholder="Select rarity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Common">Common</SelectItem>
                      <SelectItem value="Rare">Rare</SelectItem>
                      <SelectItem value="Epic">Epic</SelectItem>
                      <SelectItem value="Legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Coins)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0" 
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    required
                    min={0}
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL (Placeholder)</Label>
                  <Input 
                    id="image-url" 
                    type="text" 
                    placeholder="/placeholder.svg" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="reward-only" 
                    checked={isRewardOnly}
                    onCheckedChange={(checked) => setIsRewardOnly(!!checked)}
                    disabled={isPending}
                  />
                  <Label htmlFor="reward-only" className="font-normal">
                    Reward Only (not available in public shop)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="guild-store" 
                    checked={isForGuildStore}
                    onCheckedChange={(checked) => setIsForGuildStore(!!checked)}
                    disabled={isPending}
                  />
                  <Label htmlFor="guild-store" className="font-normal">
                    For Guild Store (available in guild shop tab)
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-6">
            <Button variant="outline" asChild disabled={isPending}>
              <Link to="/admin/shop">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Item"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateShopItemPage;