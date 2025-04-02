import { FC } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { foodItem } from "@/types/menu";
import DeleteItemButton from "@/components/DeleteCourseButton";
interface FoodItemPageProps {
  params: {
    id: string;
  };
}
const FoodItemPage: FC<FoodItemPageProps> = async ({ params }) => {
  const id = (await params).id;
  const foodItemId = parseInt(id, 10);
  
  if (isNaN(foodItemId)) {
    notFound();
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  
  try {
    const response = await fetch(`${baseUrl}/api/menu/${foodItemId}`, { next: { revalidate: 0 } });
    
    if (!response.ok) {
      notFound();
    }
    
    const Item: foodItem = await response.json();
    
    return (
      <div>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Button asChild variant="outline" className="mb-4">
                <Link href="/">← Back to Menu</Link>
              </Button>
              
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{Item.title}</h1>
                <div className="space-x-2">
                  <Button asChild variant="outline">
                    <Link href={`/menu/${Item.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteItemButton MenuItemId={Item.id} />
                </div>
              </div>
            </div>
            
            <div className="bg-blue-100 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-2">Item Description</h2>
              <p className="mb-4">{Item.description}</p>
              
              <h2 className="text-xl font-semibold mb-2">Estimated price</h2>
              <p>{Item.Cost}</p>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error fetching course:', error);
    notFound();
  }
};

export default FoodItemPage; 