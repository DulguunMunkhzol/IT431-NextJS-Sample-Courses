import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/models/courseModel";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="h-full flex flex-col bg-blue-100">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-gray-600">{course.description}</p>
        <p className="mt-4 text-2xl font-bold">{course.Cost}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/menu/${course.id}`} className="w-full">
          <Button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-purple-200 hover:to-purple-800 w-full" >
            View Menu Item
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 