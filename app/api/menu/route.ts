import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { foodItem } from "@/types/menu";
//courses


const dataFilePath = path.join(process.cwd(), "data", "menuItems.json");

const readMenuItems = (): foodItem[] => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(jsonData) as foodItem[];
  } catch (error) {
    console.error("Error reading foodItems file:", error);
    return [];
  }
};

const writeMenuItems = (foodItems: foodItem[]) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(foodItems, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to foodItems file:", error);
  }
};

export async function GET() {
  try {
    const foodItems = readMenuItems();
    return NextResponse.json(foodItems, { status: 200 });
  } catch (error) {
    console.error("Error retrieving foodItems:", error);
    return NextResponse.json(
      { error: "Failed to retrieve foodItems." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newFoodItem: foodItem = await request.json();
    const foodItems = readMenuItems();

    newFoodItem.id = foodItems.length ? foodItems[foodItems.length - 1].id + 1 : 1;
    foodItems.push(newFoodItem);
    writeMenuItems(foodItems);

    return NextResponse.json(newFoodItem, { status: 201 });
  } catch (error) {
    console.error("Error adding foodItem:", error);
    return NextResponse.json(
      { error: "Failed to add foodItem." },
      { status: 500 }
    );
  }
}
