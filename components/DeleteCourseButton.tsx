"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
interface DeleteItemButtonProps {
  MenuItemId: number;
}

export default function DeleteItemButton({ MenuItemId }: DeleteItemButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/menu/${MenuItemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete course: ${response.status}`);
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error deleting Item:", err);
      setError("Failed to delete Item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Item"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This Item will permanently delete the course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
} 