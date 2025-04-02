"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

export default function AddMenuPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    Cost: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        Cost: formData.Cost ? `${formData.Cost} $` : undefined
      };

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
      const response = await fetch(`${baseUrl}/api/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to add Menu Item");
      }

      router.push("/");
      router.refresh(); 
    } catch (error) {
      console.error("Error adding Menu Item:", error);
      alert("Failed to add Menu Item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Add New Menu item</h1>
            <Link href="/">
              <Button variant="outline">Back to Menu</Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg shadow bg-blue-100">
            <div className="space-y-2">
              <label htmlFor="title" className="block font-medium">
                Menu Item Name<span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
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
                value={formData.description}
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
                value={formData.Cost}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the Price of the Item"
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-purple-200 hover:to-purple-800"
                disabled={loading}
              >
                {loading ? "Adding Course..." : "Add Course"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 
