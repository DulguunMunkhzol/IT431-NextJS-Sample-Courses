import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";

interface Menu {
  id: number;
  title: string;
  description: string;
  Cost: string;
}


async function getMenuItem(): Promise<Menu[]> {
  try {
 
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const res = await fetch(`${baseUrl}/api/menu`, {
      cache: "no-store", 
    });
    
    if (!res.ok) {
      console.error('API response error:', await res.text());
      throw new Error(`Failed to fetch menu: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching menu:', error);
    return []; 
  }
}

const Home: FC = async () => {
  const menu = await getMenuItem();
  
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 ">
          <h1 className="text-3xl font-bold text-center">Available Menu Items</h1>
          <Link href="/menu/add">
            <Button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-purple-200 hover:to-purple-800">
              Add New meal
            </Button>
          </Link>
        </div>
        
        {menu.length === 0 ? (
          <p className="text-center text-gray-500">No menu item available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((menu) => (
              <CourseCard key={menu.id} course={menu} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
