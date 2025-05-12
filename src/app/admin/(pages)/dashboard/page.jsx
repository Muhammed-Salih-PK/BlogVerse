import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaEye, FaGraduationCap, FaBriefcase, FaFileAlt } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className='min-h-[90vh] p-6 text-gray-800 dark:text-gray-200 flex flex-col items-center '>
      <div className='w-full max-w-6xl'>
        <header className='mb-12 text-center'>
          <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r text-black/80 dark:text-white/80 bg-clip-text'>Admin Dashboard</h1>
          <p className='text-gray-600 dark:text-gray-400'>Manage all platform content and applications</p>
        </header>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* blog Section */}
          <section className='p-6 border rounded-xl shadow-sm bg-white dark:bg-black dark:border-gray-800 duration-300 transition-all hover:shadow-md'>
            <div className='flex items-center mb-4'>
              <div className='p-3 mr-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'>
                <FaGraduationCap size={20} />
              </div>
              <h2 className='text-xl font-semibold'>Blogs</h2>
            </div>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>Manage educational blogs and curriculum</p>
            <div className='flex flex-col space-y-2'>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/blogs/add' className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                  <FaPlus /> Add New Course
                </Link>
              </Button>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/blogs' className='flex items-center gap-2 text-blue-600 dark:text-blue-400'>
                  <FaEdit /> Manage blogs
                </Link>
              </Button>
            </div>
          </section>

          {/* Jobs Section */}
          <section className='p-6 border rounded-xl shadow-sm bg-white dark:bg-black dark:border-gray-800 duration-300 transition-all hover:shadow-md'>
            <div className='flex items-center mb-4'>
              <div className='p-3 mr-4 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'>
                <FaBriefcase size={20} />
              </div>
              <h2 className='text-xl font-semibold'>users</h2>
            </div>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>Manage job postings and opportunities</p>
            <div className='flex flex-col space-y-2'>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/jobs/add' className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                  <FaPlus /> Add New Job
                </Link>
              </Button>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/jobs' className='flex items-center gap-2 text-blue-600 dark:text-blue-400'>
                  <FaEdit /> Manage Jobs
                </Link>
              </Button>
            </div>
          </section>

          {/* Applications Section */}
          <section className='p-6 border rounded-xl shadow-sm bg-white dark:bg-black dark:border-gray-800 duration-300 transition-all hover:shadow-md'>
            <div className='flex items-center mb-4'>
              <div className='p-3 mr-4 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'>
                <FaFileAlt size={20} />
              </div>
              <h2 className='text-xl font-semibold'>Applications</h2>
            </div>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>View and manage user applications</p>
            <div className='flex flex-col space-y-2'>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/applications' className='flex items-center gap-2 text-blue-600 dark:text-blue-400'>
                  <FaEye /> View Applications
                </Link>
              </Button>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/applications' className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                  <FaTrash /> Manage Applications
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
