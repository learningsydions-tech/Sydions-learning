import React from "react";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import ShopItemCard from "@/components/ShopItemCard";

const mockShopItems = [
  {
    name: "XP Boost (1 hour)",
    description: "Double your experience points from challenges for one hour.",
    price: 500,
    imageUrl: "/placeholder.svg",
    rarity: "Rare",
  },
  {
    name: "Cyber Samurai Avatar Frame",
    description: "A futuristic, neon-lit frame for your profile avatar.",
    price: 1200,
    imageUrl: "/placeholder.svg",
    rarity: "Epic",
  },
  {
    name: "Challenge Hint Token",
    description: "Redeem this token for a helpful hint on any active challenge.",
    price: 150,
    imageUrl: "/placeholder.svg",
    rarity: "Common",
  },
  {
    name: "Legendary Loot Box",
    description: "A mysterious box containing a guaranteed legendary item.",
    price: 5000,
    imageUrl: "/placeholder.svg",
    rarity: "Legendary",
  },
  {
    name: "Profile Banner: 'The Matrix'",
    description: "A cool, animated profile banner with cascading green code.",
    price: 800,
    imageUrl: "/placeholder.svg",
    rarity: "Rare",
  },
  {
    name: "Guild XP Contribution",
    description: "Contribute 1000 XP directly to your guild's total.",
    price: 2500,
    imageUrl: "/placeholder.svg",
    rarity: "Epic",
  },
];

const filterCategories = ["All", "Power-ups", "Cosmetics", "Consumables"];

const ShopPage = () => {
  const userBalance = 750; // Mock data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-muted-foreground mt-1">
            Spend your hard-earned points on exclusive items and power-ups.
          </p>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
          <Coins className="w-6 h-6 text-amber-500" />
          <span className="text-xl font-bold">{userBalance.toLocaleString()}</span>
          <p className="text-muted-foreground">Your Balance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filterCategories.map((category) => (
          <Button
            key={category}
            variant={category === "All" ? "default" : "outline"}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Shop Items Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockShopItems.map((item) => (
          <ShopItemCard
            key={item.name}
            name={item.name}
            description={item.description}
            price={item.price}
            imageUrl={item.imageUrl}
            rarity={item.rarity}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopPage;