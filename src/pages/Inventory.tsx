import React from "react";
import { Button } from "@/components/ui/button";
import InventoryItemCard from "@/components/InventoryItemCard";

const mockInventory = [
  {
    name: "XP Boost (30 min)",
    rarity: "Common",
    imageUrl: "/placeholder.svg",
    quantity: 5,
  },
  {
    name: "SQL Injection Badge",
    rarity: "Rare",
    imageUrl: "/placeholder.svg",
    quantity: 1,
  },
  {
    name: "Cyber Samurai Skin",
    rarity: "Epic",
    imageUrl: "/placeholder.svg",
    quantity: 1,
  },
  {
    name: "Hint Token",
    rarity: "Common",
    imageUrl: "/placeholder.svg",
    quantity: 12,
  },
  {
    name: "Early Submission Pass",
    rarity: "Rare",
    imageUrl: "/placeholder.svg",
    quantity: 2,
  },
  {
    name: "Design Guru Badge",
    rarity: "Legendary",
    imageUrl: "/placeholder.svg",
    quantity: 1,
  },
  {
    name: "Firewall Fortification",
    rarity: "Epic",
    imageUrl: "/placeholder.svg",
    quantity: 1,
  },
  {
    name: "100 XP Grant",
    rarity: "Common",
    imageUrl: "/placeholder.svg",
    quantity: 3,
  },
];

const filterCategories = ["All", "Badges", "Power-ups", "Cosmetics", "Consumables"];

const InventoryPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground mt-1">
          Browse your collection of rewards, badges, and items.
        </p>
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

      {/* Inventory Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {mockInventory.map((item) => (
          <InventoryItemCard
            key={item.name}
            name={item.name}
            rarity={item.rarity}
            imageUrl={item.imageUrl}
            quantity={item.quantity}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;