import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaEye, FaGraduationCap, FaBriefcase, FaFileAlt, FaTags } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className='min-h-[90vh] p-6 text-gray-800 dark:text-gray-200 flex flex-col items-center '>
      <div className='w-full max-w-6xl'>
        <header className='mb-12 text-center'>
          <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r text-black/80 dark:text-white/80 bg-clip-text'>Admin Dashboard</h1>
          <p className='text-gray-600 dark:text-gray-400'>Manage all platform content and users</p>
        </header>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {/* Articles Section */}
          <section className='p-6 border rounded-xl shadow-sm bg-white dark:bg-black dark:border-gray-800 duration-300 transition-all hover:shadow-md'>
            <div className='flex items-center mb-4'>
              <div className='p-3 mr-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'>
                <FaGraduationCap size={20} />
              </div>
              <h2 className='text-xl font-semibold'>Articles</h2>
            </div>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>Manage educational blogs and curriculum</p>
            <div className='flex flex-col space-y-2'>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/articles' className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                  <FaPlus /> Add New Articles
                </Link>
              </Button>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/articles' className='flex items-center gap-2 text-blue-600 dark:text-blue-400'>
                  <FaEdit /> Manage Articles
                </Link>
              </Button>
            </div>
          </section>

          {/* Categories Section */}
          <section className='p-6 border rounded-xl shadow-sm bg-white dark:bg-black dark:border-gray-800 duration-300 transition-all hover:shadow-md'>
            <div className='flex items-center mb-4'>
              <div className='p-3 mr-4 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'>
                <FaFileAlt size={20} />
              </div>
              <h2 className='text-xl font-semibold'>Categories</h2>
            </div>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>View and manage Categories</p>
            <div className='flex flex-col space-y-2'>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/categories' className='flex items-center gap-2 text-blue-600 dark:text-blue-400'>
                  <FaEye /> View Categories
                </Link>
              </Button>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/categories' className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                  <FaTrash /> Manage Categories
                </Link>
              </Button>
            </div>
          </section>

          {/* users Section */}
          <section className='p-6 border rounded-xl shadow-sm bg-white dark:bg-black dark:border-gray-800 duration-300 transition-all hover:shadow-md'>
            <div className='flex items-center mb-4'>
              <div className='p-3 mr-4 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'>
                <FaBriefcase size={20} />
              </div>
              <h2 className='text-xl font-semibold'>users</h2>
            </div>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>Manage users and edit users</p>
            <div className='flex flex-col space-y-2'>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/users' className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                  <FaPlus /> Add New users
                </Link>
              </Button>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/users' className='flex items-center gap-2 text-blue-600 dark:text-blue-400'>
                  <FaEdit /> Manage users
                </Link>
              </Button>
            </div>
          </section>

          {/* Tag Section */}
          <section className='p-6 border rounded-xl shadow-sm bg-white dark:bg-black dark:border-gray-800 duration-300 transition-all hover:shadow-md'>
            <div className='flex items-center mb-4'>
              <div className='p-3 mr-4 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'>
                <FaTags size={20} />
              </div>
              <h2 className='text-xl font-semibold'>Tag Section</h2>
            </div>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>View and manage Tags</p>
            <div className='flex flex-col space-y-2'>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/categories' className='flex items-center gap-2 text-blue-600 dark:text-blue-400'>
                  <FaEye /> View Tags
                </Link>
              </Button>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/admin/categories' className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                  <FaTrash /> Manage Tags
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
