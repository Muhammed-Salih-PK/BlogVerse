"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { genericFetchData } from "@/lib/genericFetchData";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiRefreshCw, FiSearch, FiPlus, FiCheck, FiX } from "react-icons/fi";

export default function AdminTagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 10;
  const [editingTag, setEditingTag] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    const [data, error] = await genericFetchData("/api/admin/tags", "GET");

    if (error) {
      setError(error.message);
    } else {
      setTags(data);
    }
    setLoading(false);
  };

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Pagination logic
  const indexOfLastTag = currentPage * tagsPerPage;
  const indexOfFirstTag = indexOfLastTag - tagsPerPage;
  const currentTags = filteredTags.slice(indexOfFirstTag, indexOfLastTag);
  const totalPages = Math.ceil(filteredTags.length / tagsPerPage);

  const handleDelete = async (tagName) => {
    if (!confirm(`Are you sure you want to delete the tag "${tagName}"? This will remove it from all articles.`)) return;

    const [data, error] = await genericFetchData(`/api/admin/tags/${encodeURIComponent(tagName)}`, "DELETE");

    if (error) {
      setError(error.message);
    } else {
      setTags(tags.filter((tag) => tag.name !== tagName));

      alert(`Tag "${tagName}" deleted from ${data.affectedPosts} articles`);
    }
  };

  const startEditing = (tag) => {
    setEditingTag(tag.name);
    setEditValue(tag.name);
  };

  const cancelEditing = () => {
    setEditingTag(null);
    setEditValue("");
  };

  const saveEdit = async (originalName) => {
    if (!editValue.trim()) {
      alert("Tag name cannot be empty");
      return;
    }

    if (editValue === originalName) {
      cancelEditing();
      return;
    }

    const [data, error] = await genericFetchData(`/api/admin/tags/${encodeURIComponent(originalName)}`, "PATCH", {
      newName: editValue,
    });

    if (error) {
      setError(error.message);
    } else {
      setTags(tags.map((tag) => (tag.name === originalName ? { ...tag, name: editValue, slug: editValue } : tag)));
      cancelEditing();
      alert(`Tag renamed from "${originalName}" to "${editValue}" in ${data.updatedPosts} articles`);
    }
  };

  if (error) {
    return (
      <div className='p-8'>
        <div className='bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded relative'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error}</span>
          <button onClick={fetchTags} className='absolute top-0 right-0 px-4 py-3'>
            <FiRefreshCw className='text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-100' />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 md:p-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100'>Tag Management</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>{filteredTags.length} tags found</p>
        </div>

        <div className='flex gap-4 w-full md:w-auto'>
          <div className='relative flex-grow md:w-64'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FiSearch className='text-gray-400 dark:text-gray-500' />
            </div>
            <input
              type='text'
              placeholder='Search tags...'
              className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={fetchTags}
            className='px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center gap-2 text-gray-800 dark:text-gray-200'
          >
            <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Tag Name</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Slug</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Articles</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
              {currentTags.length === 0 ? (
                <>
                  {loading ? (
                    <tr>
                      {Array(4)
                        .fill()
                        .map((_, i) => (
                          <td key={i} className='px-6 py-4 text-blue-500 dark:text-blue-400 '>
                            <Skeleton className='w-32 h-6' />
                          </td>
                        ))}
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan='4' className='px-6 py-4 text-center text-gray-500 dark:text-gray-400 '>
                        No tags found
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                currentTags.map((tag) => (
                  <tr key={tag.name} className='hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {editingTag === tag.name ? (
                        <div className='flex items-center gap-2'>
                          <input
                            type='text'
                            className='flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(tag.name)}
                            className='text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                            title='Save'
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                            title='Cancel'
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <div className='text-sm font-medium text-gray-900 dark:text-gray-100'>{tag.name}</div>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                      {editingTag === tag.name ? editValue.toLowerCase().replace(/\s+/g, "-") : tag.slug}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>{tag.articleCount}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex gap-3'>
                        {editingTag === tag.name ? null : (
                          <>
                            <button
                              onClick={() => startEditing(tag)}
                              className='text-amber-500 hover:text-amber-600 dark:hover:text-amber-400'
                              title='Edit'
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(tag.name)}
                              className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                              title='Delete'
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredTags.length > tagsPerPage && (
          <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between'>
            <div className='text-sm text-gray-700 dark:text-gray-300'>
              Showing <span className='font-medium'>{indexOfFirstTag + 1}</span> to{" "}
              <span className='font-medium'>{Math.min(indexOfLastTag, filteredTags.length)}</span> of{" "}
              <span className='font-medium'>{filteredTags.length}</span> tags
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
                    currentPage === page
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
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
