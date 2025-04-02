"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { foodItem } from "@/types/menu";


interface EditFoodItemPageProps {
  params: {
    id: string;
  };
}

export default function EditFoodItemPage({ params }: EditFoodItemPageProps) {
  const router = useRouter();
  const foodItemId = parseInt(params.id, 10);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<foodItem>>({
    title: "",
    description: "",
    Cost: ""
  });

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/menu/${foodItemId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch FoodItems");
        }
        
        const FoodItem: foodItem = await response.json();
        
        let Cost = FoodItem.Cost;
        if (Cost && Cost.includes(" $")) {
          Cost = Cost.replace(" $", "");
        }
        
        setFormData({
          ...FoodItem,
          Cost: Cost
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching FoodItem:", err);
        setError("Failed to load FoodItem. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (foodItemId) {
      fetchFoodItem();
    }
  }, [foodItemId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSubmit = {
        ...formData,
        id: foodItemId,
        Cost: formData.Cost ? `${formData.Cost} $` : ""
      };

      const response = await fetch(`/api/menu/${foodItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to update FoodItem");
      }

      router.push(`/menu/${foodItemId}`);
      router.refresh(); 
    } catch (error) {
      console.error("Error updating FoodItem:", error);
      setError("Failed to update FoodItem. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <p>Loading course information...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8  ">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6 ">
            <h1 className="text-2xl font-bold">Edit Course</h1>
            <Link href={`/menu/${foodItemId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6  p-6 rounded-lg shadow bg-blue-100">
            <div className="space-y-2">
              <label htmlFor="title" className="block font-medium">
              FoodItem Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course description"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="Cost" className="block font-medium">
                Price ($)
              </label>
              <input
                id="Cost"
                name="Cost"
                type="number"
                value={formData.Cost || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the price for food item"
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-purple-200 hover:to-purple-800"
                disabled={saving}
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 