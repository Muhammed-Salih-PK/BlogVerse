
import Link from "next/link";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { IconTrendingUp } from "@tabler/icons-react";


export function CourseCards({CourseId, Coursetitle, CourseDescription, CourseDuration, CourseFees, CourseSubjects, onDelete }) {


  return (
    <Card
      className='relative p-5 bg-white dark:bg-black shadow-md rounded-xl border  dark:border-gray-800 transition-all duration-300 hover:shadow-lg group '
      // onMouseEnter={() => setHovered(true)}
      // onMouseLeave={() => setHovered(false)}
    >
      <CardHeader>
        <CardTitle className='text-2xl font-semibold text-gray-900 dark:text-white'>{Coursetitle}</CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>Course Details</CardDescription>
      

      {/* Course Subjects */}
      <div className='flex flex-wrap gap-2'>
        {CourseSubjects.map((subject, index) => (
          <span key={index} className='bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-3 py-1 rounded-full'>
            {subject}
          </span>
        ))}
      </div>

      {/* Course Info */}
      <div className='mt-3 flex items-center gap-2 text-gray-700 dark:text-gray-300'>
        <p>
          <strong>Duration:</strong> {CourseDuration}
        </p>
        <span className='text-gray-500 dark:text-gray-400'>|</span>
        <p>
          <strong>Fees:</strong> ${CourseFees}
        </p>
      </div>
      </CardHeader>
      {/* Action Buttons (Hidden by Default) */}
      <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100`}>
        {/* Edit Button */}
        <Link href={`/admin/blogs/edit/${CourseId}`}>
          <button className='flex items-center justify-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-amber-600 transition-all hover:scale-105'>
            <FaEdit className='text-sm' />
          </button>
        </Link>

        {/* Delete Confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className='flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all hover:scale-105'>
              <FaTrashAlt className='text-sm' />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-white dark:bg-gray-900 rounded-xl shadow-lg'>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-lg font-bold text-gray-900 dark:text-white'>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className='text-gray-600 dark:text-gray-400'>This action cannot be undone.</AlertDialogDescription>
              <AlertDialogDescription className='font-semibold text-gray-900 dark:text-white'>{Coursetitle}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition hover:bg-gray-400 dark:hover:bg-gray-600'>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className='bg-red-700 text-white px-4 py-2 rounded-lg transition hover:bg-red-800'>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Footer */}
      <CardFooter className='flex-col items-start gap-2'>
        <div className='flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200'>
          {Coursetitle} <IconTrendingUp className='size-4' />
        </div>
        <p className='text-gray-600 dark:text-gray-400 text-sm'>{CourseDescription}</p>
      </CardFooter>
    </Card>
  );
}
