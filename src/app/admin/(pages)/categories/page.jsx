"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiRefreshCw } from "react-icons/fi";
import { genericFetchData } from "@/lib/genericFetchData";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");

    const [data, error] = await genericFetchData("/api/admin/categories", "GET");

    if (error) {
      setError(error.message || "Failed to fetch categories");
      console.error("Fetch error:", error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;

    const [data, error] = await genericFetchData(`/api/admin/categories/${categoryId}`, "DELETE");

    if (error) {
      setError(error.message || "Failed to delete category");
      console.error("Delete error:", error);
    } else {
      setCategories(categories.filter((category) => category._id !== categoryId));
      toast.success("Category deleted successfully");
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  if (error) {
    return (
      <div className='p-8'>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role='alert'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error}</span>
          <button onClick={fetchCategories} className='absolute top-0 right-0 px-4 py-3'>
            <FiRefreshCw className='text-red-500 hover:text-red-700' />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 md:p-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100'>Category Management</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} found
          </p>
        </div>

        <div className=' flex gap-4 w-full md:w-auto'>
          <div className='relative flex-grow md:w-64'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FiSearch className='text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search categories...'
              className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button onClick={fetchCategories} className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-2 text-gray-800'>
            <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link href='/admin/categories/new' className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2'>
            <FiPlus /> New Category
          </Link>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden mb-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Name</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Slug</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Description</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Posts</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
              {currentCategories.length === 0 ? (
                <>
                  {loading ? (
                    <tr>
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <td key={i} className='px-6 py-4 text-blue-500 dark:text-blue-400 '>
                            <Skeleton className='w-28 h-6' />
                          </td>
                        ))}
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan='4' className='px-6 py-4 text-center text-gray-500 dark:text-gray-400 '>
                        No categories found
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                currentCategories.map((category) => <CategoryRow key={category._id} category={category} onDelete={handleDelete} />)
              )}
            </tbody>
          </table>
        </div>

        {filteredCategories.length > categoriesPerPage && (
          <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
            <div className='text-sm text-gray-700'>
              Showing <span className='font-medium'>{indexOfFirstCategory + 1}</span> to{" "}
              <span className='font-medium'>{Math.min(indexOfLastCategory, filteredCategories.length)}</span> of{" "}
              <span className='font-medium'>{filteredCategories.length}</span> categories
            </div>
            <div className='flex space-x-2'>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryRow({ category, onDelete }) {
  return (
    <tr className='hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900 dark:text-gray-100'>{category.name}</div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-500 dark:text-gray-400'>{category.slug}</div>
      </td>
      <td className='px-6 py-4'>
        <div className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>{category.description || "No description"}</div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-500 dark:text-gray-400'>{category.articleCount || 0}</div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
        <div className='flex gap-3'>
          <Link href={`/admin/categories/edit/${category._id}`} className='text-amber-500 hover:text-amber-600' title='Edit'>
            <FiEdit />
          </Link>
          <button onClick={() => onDelete(category._id)} className='text-red-600 hover:text-red-700' title='Delete'>
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
}
