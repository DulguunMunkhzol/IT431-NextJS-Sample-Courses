import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { foodItem } from "@/types/menu";
const dataFilePath = path.join(process.cwd(), "data", "menuItems.json");

const readMenuItems = (): foodItem[] => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(jsonData) as foodItem[];
  } catch (error) {
    console.error("Error reading menu file:", error);
    return [];
  }
};

const writeMenuItems = (Menu: foodItem[]) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(Menu, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to menu items file:", error);
  }
};

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await context.params; 
    const menuId = parseInt(id, 10);

    if (isNaN(menuId)) {
      return NextResponse.json(
        { error: "Invalid menu ID." },
        { status: 400 }
      );
    }

    const menuItems = readMenuItems();
    const menu = menuItems.find((c) => c.id === menuId);

    if (!menu) {
      return NextResponse.json({ error: "menu not found." }, { status: 404 });
    }

    return NextResponse.json(menu, { status: 200 });
  } catch (error) {
    console.error("Error retrieving menu:", error);
    return NextResponse.json(
      { error: "Failed to retrieve menu." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await context.params; 
    const menuId = parseInt(id, 10);
    if (isNaN(menuId)) {
      return NextResponse.json(
        { error: "Invalid menu ID." },
        { status: 400 }
      );
    }

    const updatedMenu: Partial<foodItem> = await request.json();
    const Menu = readMenuItems();
    const index = Menu.findIndex((c) => c.id === menuId);

    if (index === -1) {
      return NextResponse.json({ error: "Menu not found." }, { status: 404 });
    }

    Menu[index] = { ...Menu[index], ...updatedMenu, id: menuId };

    writeMenuItems(Menu);

    return NextResponse.json(Menu[index], { status: 200 });
  } catch (error) {
    console.error("Error updating Menu:", error);
    return NextResponse.json(
      { error: "Failed to update Menu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await context.params;
    const MenuId = parseInt(id, 10);
    if (isNaN(MenuId)) {
      return NextResponse.json(
        { error: "Invalid Menu ID." },
        { status: 400 }
      );
    }

    let Menu = readMenuItems();
    const initialLength = Menu.length;
    Menu = Menu.filter((c) => c.id !== MenuId);

    if (Menu.length === initialLength) {
      return NextResponse.json({ error: "Menu not found." }, { status: 404 });
    }

    writeMenuItems(Menu);

    return NextResponse.json(
      { message: `Course with ID ${MenuId} deleted.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Menu:", error);
    return NextResponse.json(
      { error: "Failed to delete Menu." },
      { status: 500 }
    );
  }
}
