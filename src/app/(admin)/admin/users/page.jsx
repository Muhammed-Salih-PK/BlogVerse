"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { genericFetchData } from "@/lib/genericFetchData";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiRefreshCw, FiSearch, FiUserPlus, FiEye } from "react-icons/fi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const [data, error] = await genericFetchData("/api/admin/users", "GET");
    const { users } = data;

    if (error) {
      setError(error.message);
    } else {
      setUsers(users);
    }
    setLoading(false);
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const [data, error] = await genericFetchData(`/api/admin/users/${userId}`, "DELETE");
    if (error) {
      setError(error.message);
    } else {
      setUsers(users.filter((user) => user._id !== userId));
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
          <button onClick={fetchUsers} className='absolute top-0 right-0 px-4 py-3'>
            <FiRefreshCw className='text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-100' />
          </button>
        </div>
      </div>
    );

  return (
    <div className='p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-4 mb-6'>
        <div>
          <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100'>User Management</h1>
          <p className='text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1'>
            {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 w-full'>
          <div className='relative flex-grow'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FiSearch className='text-gray-400 dark:text-gray-500' />
            </div>
            <input
              type='text'
              placeholder='Search users...'
              className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm md:text-base'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className='flex gap-3'>
            <select
              className='border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm md:text-base flex-grow min-w-[120px]'
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value='all'>All Roles</option>
              <option value='admin'>Admin</option>
              <option value='user'>User</option>
              <option value='author'>Author</option>
            </select>

            <button
              onClick={fetchUsers}
              className='px-3 py-2 bg-gray-100  hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center gap-2 text-gray-800 dark:text-gray-200 text-sm md:text-base'
            >
              <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
              <span className='hidden sm:inline'>Refresh</span>
            </button>

            <Link
              href={"/signup"}
              className='bg-black hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm md:text-base'
            >
              <FiUserPlus />
              <span className='hidden sm:inline'>Add User</span>
            </Link>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>User</th>
                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Role</th>
                <th className='hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
              {currentUsers.length === 0 ? (
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
                        No users found matching your criteria
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                    <td className='px-4 sm:px-6 py-4'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-800 dark:text-gray-200'>
                          {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className='ml-3'>
                          <Link href={`/admin/users/view/${user._id}`} className='text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1'>
                            {user.username || "No username"}
                          </Link>
                          <div className='text-xs text-gray-500 dark:text-gray-400 sm:hidden'>{user.email}</div>
                          <div className='text-xs text-gray-500 dark:text-gray-400 sm:hidden'>ID: {user._id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className='hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>{user.email}</td>
                    <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.role === "admin"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                            : user.role === "moderator"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                            : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                        }`}
                      >
                        {user.role}
                      </span>
                      <div className='mt-1 sm:hidden'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            user.isLocked
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                              : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                          }`}
                        >
                          {user.isLocked ? "Locked" : "Active"}
                        </span>
                      </div>
                    </td>
                    <td className='hidden md:table-cell px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.isLocked
                            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                            : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                        }`}
                      >
                        {user.isLocked ? "Locked" : "Active"}
                      </span>
                    </td>
                    <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex gap-3'>
                        <Link
                          href={`/admin/users/${user._id}`}
                          className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                          title='Edit'
                        >
                          <FiEdit />
                        </Link>
                        <Link
                          href={`/admin/users/view/${user._id}`}
                          className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                          title='View'
                        >
                          <FiEye />
                        </Link>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={user.role === "admin"}
                          title={user.role === "admin" ? "Admins cannot be deleted" : "Delete user"}
                          className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className='px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='text-xs sm:text-sm text-gray-700 dark:text-gray-300'>
              Showing <span className='font-medium'>{indexOfFirstUser + 1}</span> to{" "}
              <span className='font-medium'>{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{" "}
              <span className='font-medium'>{filteredUsers.length}</span> users
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
