import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Loader2, Image, XCircle } from "lucide-react";

interface ShopItemDetail {
  id: string;
  name: string;
  description: string | null;
  type: string;
  price: number;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  is_reward_only: boolean;
  is_for_guild_store: boolean;
  image_url: string | null;
}

const fetchShopItemDetail = async (itemId: string): Promise<ShopItemDetail> => {
  const { data, error } = await supabase
    .from("shop_items")
    .select("id, name, description, type, price, rarity, is_reward_only, is_for_guild_store, image_url")
    .eq("id", itemId)
    .single();

  if (error) {
    throw error;
  }

  return data as ShopItemDetail;
};

const EditShopItemPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: initialItem, isLoading: isFetching, error: fetchError } = useQuery<ShopItemDetail>({
    queryKey: ["shopItemDetail", itemId],
    queryFn: () => fetchShopItemDetail(itemId!),
    enabled: !!itemId,
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("badge");
  const [price, setPrice] = useState(0);
  const [rarity, setRarity] = useState<ShopItemDetail['rarity']>("Common");
  const [isRewardOnly, setIsRewardOnly] = useState(false);
  const [isForGuildStore, setIsForGuildStore] = useState(false);
  
  // New state for file upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // Effect to populate state when data is fetched
  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setDescription(initialItem.description || "");
      setType(initialItem.type);
      setPrice(initialItem.price);
      setRarity(initialItem.rarity);
      setIsRewardOnly(initialItem.is_reward_only);
      setIsForGuildStore(initialItem.is_for_guild_store);
      setCurrentImageUrl(initialItem.image_url);
    }
  }, [initialItem]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('shop_items')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('shop_items')
      .getPublicUrl(filePath);
      
    return publicUrl;
  };

  const updateItemMutation = useMutation({
    mutationFn: async () => {
      if (!itemId) throw new Error("Item ID missing.");
      if (!name.trim()) throw new Error("Item name is required.");
      if (price < 0) throw new Error("Price cannot be negative.");
      
      let newImageUrl = currentImageUrl;

      if (imageFile) {
        newImageUrl = await uploadImage(imageFile);
      } else if (!currentImageUrl) {
        throw new Error("Image is required.");
      }

      const { error } = await supabase
        .from("shop_items")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          type: type,
          price: price,
          rarity: rarity,
          is_reward_only: isRewardOnly,
          is_for_guild_store: isForGuildStore,
          image_url: newImageUrl,
        })
        .eq("id", itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Shop item updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminShopItems"] });
      queryClient.invalidateQueries({ queryKey: ["allShopItems"] });
      queryClient.invalidateQueries({ queryKey: ["shopItemDetail", itemId] });
      navigate("/admin/shop");
    },
    onError: (error) => {
      console.error("Shop item update failed:", error);
      showError(`Failed to update item: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateItemMutation.mutate();
  };

  const isPending = updateItemMutation.isPending;

  if (isFetching) {
    return (
      <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        Loading item data...
      </div>
    );
  }

  if (fetchError) {
    return <div className="text-center py-12 text-destructive">Error loading item: {fetchError.message}</div>;
  }
  
  if (!initialItem) {
    return <div className="text-center py-12 text-muted-foreground">Item not found.</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Edit Shop Item: {initialItem.name}</h1>
        <p className="text-muted-foreground mt-1">
          Modify the details of this existing shop item.
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
                    value={type} 
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
                    value={rarity} 
                    onValueChange={(value) => setRarity(value as ShopItemDetail['rarity'])}
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
                  <Label htmlFor="image-file">Item Image</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="image-file" 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isPending}
                      className="flex-1"
                    />
                    {imageFile && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setImageFile(null)}
                        title="Remove new image"
                      >
                        <XCircle className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  {(imageFile || currentImageUrl) && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      {imageFile ? `New file: ${imageFile.name}` : `Current URL: ${currentImageUrl}`}
                    </p>
                  )}
                  {!imageFile && currentImageUrl && (
                    <p className="text-xs text-muted-foreground">Upload a new file above to replace the current image.</p>
                  )}
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditShopItemPage;