import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ShopItem {
  id: string;
  name: string;
  type: string;
  price: number;
  rarity: string;
  is_reward_only: boolean;
  is_for_guild_store: boolean;
}

const fetchAllShopItems = async (): Promise<ShopItem[]> => {
  const { data, error } = await supabase
    .from("shop_items")
    .select("id, name, type, price, rarity, is_reward_only, is_for_guild_store")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    showError("Failed to load shop items for admin panel.");
    throw error;
  }

  return data as ShopItem[];
};

const ManageShopPage = () => {
  const queryClient = useQueryClient();
  
  const { data: items, isLoading, error } = useQuery<ShopItem[]>({
    queryKey: ["adminShopItems"],
    queryFn: fetchAllShopItems,
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("shop_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Shop item deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["adminShopItems"] });
      queryClient.invalidateQueries({ queryKey: ["allShopItems"] }); // Also invalidate rewards list
    },
    onError: (error) => {
      console.error("Shop item deletion failed:", error);
      showError(`Failed to delete item: ${error.message}`);
    },
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading shop items...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Error loading shop items: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Shop Items</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage cosmetic items for users and guilds.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/shop/new">+ New Item</Link>
        </Button>
      </div>

      {/* Item List */}
      <Card>
        <CardHeader>
          <CardTitle>All Shop Items</CardTitle>
          <CardDescription>
            {items?.length} items found.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {items && items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rarity</TableHead>
                  <TableHead>Flags</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.price.toLocaleString()} Coins</TableCell>
                    <TableCell>{item.rarity}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {item.is_reward_only && <Badge variant="secondary">Reward Only</Badge>}
                        {item.is_for_guild_store && <Badge variant="secondary">Guild Store</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/shop/edit/${item.id}`}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()} // Prevent dropdown closing immediately
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will permanently delete the shop item "{item.name}". This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={deleteItemMutation.isPending}>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteItemMutation.mutate(item.id)}
                                  disabled={deleteItemMutation.isPending}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  {deleteItemMutation.isPending ? "Deleting..." : "Confirm Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center text-center py-20 bg-card rounded-lg">
              <p className="text-muted-foreground">No shop items created yet.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{items?.length || 0}</strong> of <strong>{items?.length || 0}</strong> items
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ManageShopPage;