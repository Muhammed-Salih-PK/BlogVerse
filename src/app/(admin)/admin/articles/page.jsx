"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { genericFetchData } from "@/lib/genericFetchData";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiEye, FiEyeOff, FiRefreshCw, FiSearch, FiPlus } from "react-icons/fi";

export default function AdminPostsPage() {
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("published");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const [data, error] = await genericFetchData("/api/admin/posts", "GET");

    if (error) {
      setError(error.message);
      console.error("Fetch error:", error);
    } else {
      setPublishedPosts(data.posts.published || []);
      setDraftPosts(data.posts.drafts || []);
    }
    setLoading(false);
  };

  const filteredPublished = publishedPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrafts = draftPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const POSTS_PER_PAGE = 8;
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPublished = filteredPublished.slice(indexOfFirstPost, indexOfLastPost);
  const currentDrafts = filteredDrafts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(activeTab === "published" ? filteredPublished.length / POSTS_PER_PAGE : filteredDrafts.length / POSTS_PER_PAGE);

  const handleDelete = async (postId, isPublished) => {
    if (!confirm(`Are you sure you want to delete this ${isPublished ? "published" : "draft"} post?`)) return;

    const [data, error] = await genericFetchData(`/api/admin/posts/${postId}`, "DELETE", isPublished);

    if (error) {
      setError(error.message);
    } else {
      isPublished
        ? setPublishedPosts(publishedPosts.filter((post) => post.id !== postId))
        : setDraftPosts(draftPosts.filter((post) => post.id !== postId));
    }
  };

  if (error)
    return (
      <div className='p-8'>
        <div
          className='bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded relative'
          role='alert'
        >
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error}</span>
          <button onClick={fetchPosts} className='absolute top-0 right-0 px-4 py-3'>
            <FiRefreshCw className='text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-100' />
          </button>
        </div>
      </div>
    );

  return (
    <div className='p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-4 mb-6'>
        <div>
          <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100'>Post Management</h1>
          <p className='text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1'>
            {activeTab === "published" ? `${filteredPublished.length} published posts` : `${filteredDrafts.length} draft posts`}
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 w-full'>
          <div className='relative flex-grow'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FiSearch className='text-gray-400 dark:text-gray-500' />
            </div>
            <input
              type='text'
              placeholder='Search posts...'
              className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm md:text-base'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className='flex gap-3'>
            <button
              onClick={fetchPosts}
              className='px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center gap-2 text-gray-800 dark:text-gray-200 text-sm md:text-base'
            >
              <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
              <span className='hidden sm:inline'>Refresh</span>
            </button>
            <Link
              href={"/admin/articles/newpost/"}
              className='bg-black hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md flex items-center gap-2 text-sm md:text-base'
            >
              <FiPlus /> <span className='hidden sm:inline'>New Post</span>
            </Link>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6'>
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab("published")}
              className={`py-3 px-4 sm:py-4 sm:px-6 text-center border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === "published"
                  ? "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              Published ({filteredPublished.length})
            </button>
            <button
              onClick={() => setActiveTab("drafts")}
              className={`py-3 px-4 sm:py-4 sm:px-6 text-center border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === "drafts"
                  ? "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              Drafts ({filteredDrafts.length})
            </button>
          </nav>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Title</th>
                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                  Author
                </th>
                <th className='hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                  Date
                </th>
                <th className='hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                  Excerpt
                </th>
                <th className='px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
              {activeTab === "published" ? (
                currentPublished.length === 0 ? (
                  <>
                    {loading ? (
                      <tr>
                        {Array(5)
                          .fill()
                          .map((_, i) => (
                            <td key={i} className='px-4 sm:px-6 py-4'>
                              <Skeleton className='w-28 h-6' />
                            </td>
                          ))}
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan='5' className='px-4 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400'>
                          No published posts found
                        </td>
                      </tr>
                    )}
                  </>
                ) : (
                  currentPublished.map((post) => <PostRow key={post.id} post={post} isPublished={true} onDelete={handleDelete} />)
                )
              ) : currentDrafts.length === 0 ? (
                <tr>
                  <td colSpan='5' className='px-4 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400'>
                    No draft posts found
                  </td>
                </tr>
              ) : (
                currentDrafts.map((post) => <PostRow key={post.id} post={post} isPublished={false} onDelete={handleDelete} />)
              )}
            </tbody>
          </table>
        </div>

        {(activeTab === "published" ? filteredPublished.length : filteredDrafts.length) > POSTS_PER_PAGE && (
          <div className='px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='text-xs sm:text-sm text-gray-700 dark:text-gray-300'>
              Showing <span className='font-medium'>{indexOfFirstPost + 1}</span> to{" "}
              <span className='font-medium'>
                {Math.min(indexOfLastPost, activeTab === "published" ? filteredPublished.length : filteredDrafts.length)}
              </span>{" "}
              of <span className='font-medium'>{activeTab === "published" ? filteredPublished.length : filteredDrafts.length}</span> posts
            </div>
            <div className='flex flex-wrap justify-center gap-2'>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm ${
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
                  className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm ${
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
                className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm ${
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

function PostRow({ post, isPublished, onDelete }) {
  return (
    <tr className='hover:bg-gray-50 dark:hover:bg-gray-700/50'>
      <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900 dark:text-gray-100'>{post.title}</div>
        <div className='text-xs text-gray-500 dark:text-gray-400 sm:hidden'>ID: {post.id.substring(0, 8)}...</div>
        <div className='text-xs sm:hidden text-gray-500 dark:text-gray-400'>
          {post.author?.name || "Unknown"} •{" "}
          {isPublished ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.updatedAt).toLocaleDateString()}
        </div>
      </td>
      <td className='hidden sm:table-cell px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 dark:text-gray-100'>{post.author?.name || "Unknown"}</div>
        <div className='text-sm text-gray-500 dark:text-gray-400'>{post.author?.email || ""}</div>
      </td>
      <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
        {isPublished ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.updatedAt).toLocaleDateString()}
      </td>
      <td className='hidden lg:table-cell px-6 py-4'>
        <div className='text-sm text-gray-900 dark:text-gray-300 line-clamp-2'>{post.excerpt}</div>
      </td>
      <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium'>
        <div className='flex gap-3'>
          <Link href={`/admin/articles/edit/${post.id}`} className='text-amber-500 hover:text-amber-600 dark:hover:text-amber-400' title='Edit'>
            <FiEdit />
          </Link>
          <Link
            href={`/admin/articles/${post.id}`}
            className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            title='View'
          >
            <FiEye />
          </Link>
          <button
            onClick={() => onDelete(post.id, isPublished)}
            className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
            title='Delete'
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
}
