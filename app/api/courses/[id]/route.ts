import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Course } from "@/types/course";


// GET: Retrieve a course by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

        const client = await clientPromise;
    const db = client.db("courseDb");
    const courses = await db.collection("courses").find({}).toArray();

    const course = courses.find((c) => c.id === courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error retrieving course:", error);
    return NextResponse.json(
      { error: "Failed to retrieve course." },
      { status: 500 }
    );
  }
}

// PUT: Update a course by ID
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const updatedCourse: Partial<Course> = await request.json();
    const client = await clientPromise;
    const db = client.db("courseDb");
    const courses = await db.collection("courses").find({}).toArray();

    const index = courses.findIndex((c) => c.id === courseId);

    if (index === -1) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    courses[index] = { ...courses[index], ...updatedCourse, id: courseId };

    const newCourse: Omit<Course, "id"> = await request.json();
    
    const lastCourse = await db
    .collection ("courses")
    .findOne({}, { sort: { id: -1 } }) ;
    const nextId = lastCourse ? lastCourse.id  : 1;
    
    const courseToInsert = { ... newCourse, id: nextId };
    const result = await db.collection ("courses").insertOne (courseToInsert);
    if (!result.acknowledged) {
    throw new Error ("Failed to insert course");
    }
    
    return NextResponse.json(courses[index], { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a course by ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("courseDb");
    const courses = await db.collection("courses").find({}).toArray();
    const initialLength = courses.length;

    if (courses.length === initialLength) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const newCourse: Omit<Course, "id"> = await request.json();
    const lastCourse = await db
    db.collection('courses').drop();

    return NextResponse.json(
      { message: `Course with ID ${courseId} deleted.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course." },
      { status: 500 }
    );
  }
}
