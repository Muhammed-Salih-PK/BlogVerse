"use client";
import { useEffect, useState } from "react";
import { FiEdit, FiMail, FiGlobe, FiTwitter, FiGithub, FiClock, FiEye, FiHeart, FiFileText, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LikeButton from "../components/LikeButton";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";
import { genericFetchData } from "@/lib/genericFetchData";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("published");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const postsPerPage = 5;

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const [data, error] = await genericFetchData(`/api/profile`);

        if (error) {
          throw new Error(error.message || "Failed to fetch profile data");
        }

        setProfile(data);
      } catch (err) {
        setError(err.message || "Error fetching profile data");
        console.error("Profile fetch error:", err);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleDelete = async (id) => {
    try {
      const [data, error] = await genericFetchData(`/api/posts/${id}`, "DELETE");

      if (error) {
        throw new Error(error.message || "Failed to delete post");
      }

      setProfile((prev) => ({
        ...prev,
        posts: {
          ...prev.posts,
          [activeTab]: prev.posts[activeTab].filter((post) => post.id !== id),
        },
      }));
      toast.success("Post deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete post");
    }
  };

  const getCurrentPosts = () => {
    if (!profile) return [];
    const posts = profile.posts[activeTab];
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return posts.slice(indexOfFirstPost, indexOfLastPost);
  };

  const totalPages = profile ? Math.ceil(profile.posts[activeTab].length / postsPerPage) : 0;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLogout = async () => {
    try {
      const [data, error] = await genericFetchData("/api/auth/logout", "POST");

      if (error) {
        throw new Error(error.message || "Logout failed");
      }

      toast.success("Logged out successfully");
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error(err.message || "Logout failed");
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className='max-w-2xl mx-auto p-6 mt-10'>
        <div className='bg-rose-50 border-l-4 border-rose-500 p-4 rounded-lg shadow-sm'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <svg className='h-5 w-5 text-rose-500' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-rose-800'>{error}</p>
            </div>
          </div>
          <div className='mt-4'>
            <button
              onClick={() => window.location.reload()}
              className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500'
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const showProgress = !profile.user.profileComplete;
  const currentPosts = getCurrentPosts();

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900 mt-8'>
      {/* Profile Header */}
      <div className='bg-gradient-to-br from-indigo-900 to-purple-900 py-12 px-4 text-white shadow-lg'>
        <div className='max-w-6xl mx-auto'>
          {showProgress && (
            <div className='mb-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20'>
              <div className='flex justify-between items-center mb-2'>
                <h3 className='font-medium text-white/90'>Complete your profile</h3>
                <span className='font-bold text-white'>{profile.completionPercentage}%</span>
              </div>
              <div className='w-full bg-white/20 rounded-full h-2'>
                <div
                  className='bg-amber-300 h-2 rounded-full transition-all duration-500'
                  style={{ width: `${profile.completionPercentage}%` }}
                ></div>
              </div>
              <p className='text-sm mt-2 text-white/80'>Add missing information to unlock full profile features</p>
            </div>
          )}

          <div className='flex flex-col md:flex-row items-center gap-8'>
            <div className='relative'>
              <div className='relative w-32 h-32 rounded-full border-4 border-white/80 shadow-xl overflow-hidden group'>
                <img
                  src={profile.user.avatar || "/default-avatar.jpg"}
                  alt={profile.user.username}
                  className='w-full h-full object-cover'
                  loading='lazy'
                />
                <Link
                  href='/profile/edit'
                  className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                  aria-label='Edit profile picture'
                >
                  <FiEdit className='text-white text-2xl' />
                </Link>
              </div>
            </div>

            <div className='flex-1 space-y-4'>
              <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4'>
                <div>
                  <h1 className='text-3xl font-bold tracking-tight'>{profile.user.username}</h1>
                  <p className='text-indigo-100/90 mt-2 max-w-lg'>{profile.user.bio || "No bio yet"}</p>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <Link
                    href='/profile/edit'
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  >
                    <FiEdit className='mr-2' size={16} />
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500'
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div className='flex flex-wrap gap-4'>
                <Link
                  href='/profile/newpost'
                  className='inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  <FiFileText className='mr-2' size={16} />
                  Create Post
                </Link>
              </div>

              <div className='flex flex-wrap gap-4'>
                <div className='flex items-center text-indigo-100/90'>
                  <FiMail className='mr-2' />
                  <span>{profile.user.email}</span>
                </div>

                {profile.user.socialLinks?.website && (
                  <a
                    href={profile.user.socialLinks.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center text-indigo-100/90 hover:text-white transition-colors'
                  >
                    <FiGlobe className='mr-2' />
                    <span>Website</span>
                  </a>
                )}

                {profile.user.socialLinks?.twitter && (
                  <a
                    href={`https://twitter.com/${profile.user.socialLinks.twitter}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center text-indigo-100/90 hover:text-white transition-colors'
                  >
                    <FiTwitter className='mr-2' />
                    <span>Twitter</span>
                  </a>
                )}

                {profile.user.socialLinks?.github && (
                  <a
                    href={`https://github.com/${profile.user.socialLinks.github}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center text-indigo-100/90 hover:text-white transition-colors'
                  >
                    <FiGithub className='mr-2' />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto py-8 px-4'>
        <div className='bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700'>
          {/* Stats Bar */}
          <div className='grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700 bg-slate-50 dark:bg-slate-700/50'>
            <div className='py-4 text-center'>
              <div className='text-3xl font-bold text-indigo-600 dark:text-indigo-400'>
                {profile.posts.published.length + profile.posts.drafts.length}
              </div>
              <div className='text-slate-500 dark:text-slate-400 text-sm'>Total Posts</div>
            </div>
            <div className='py-4 text-center'>
              <div className='text-3xl font-bold text-indigo-600 dark:text-indigo-400'>{profile.posts.published.length}</div>
              <div className='text-slate-500 dark:text-slate-400 text-sm'>Published</div>
            </div>
            <div className='py-4 text-center'>
              <div className='text-3xl font-bold text-indigo-600 dark:text-indigo-400'>{profile.posts.drafts.length}</div>
              <div className='text-slate-500 dark:text-slate-400 text-sm'>Drafts</div>
            </div>
          </div>

          {/* Posts Section */}
          <div className='p-6'>
            <div className='flex border-b border-slate-200 dark:border-slate-700 mb-6'>
              <button
                className={`pb-4 px-4 font-medium flex items-center gap-2 transition-colors ${
                  activeTab === "published"
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
                onClick={() => {
                  setActiveTab("published");
                  setCurrentPage(1);
                }}
                aria-current={activeTab === "published" ? "page" : undefined}
              >
                <FiFileText />
                Published Posts
              </button>
              <button
                className={`pb-4 px-4 font-medium flex items-center gap-2 transition-colors ${
                  activeTab === "drafts"
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
                onClick={() => {
                  setActiveTab("drafts");
                  setCurrentPage(1);
                }}
                aria-current={activeTab === "drafts" ? "page" : undefined}
              >
                <FiEdit />
                Drafts
              </button>
            </div>

            {currentPosts.length > 0 ? (
              <div className='space-y-6'>
                {currentPosts.map((post) => (
                  <ProfilePosts post={post} key={post.id} onDelete={handleDelete} />
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className='flex justify-center mt-6 gap-1'>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md flex items-center ${
                        currentPage === 1
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
                      }`}
                      aria-label='Previous page'
                    >
                      <FiChevronLeft className='mr-1' />
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
                          }`}
                          aria-label={`Page ${pageNum}`}
                          aria-current={currentPage === pageNum ? "page" : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md flex items-center ${
                        currentPage === totalPages
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
                      }`}
                      aria-label='Next page'
                    >
                      Next
                      <FiChevronRight className='ml-1' />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-center py-12'>
                <div className='text-slate-300 dark:text-slate-600 mb-4 mx-auto w-24 h-24'>
                  <svg className='w-full h-full' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                      d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    ></path>
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-slate-700 dark:text-slate-300'>
                  No {activeTab === "published" ? "published posts" : "drafts"} yet
                </h3>
                <p className='text-slate-500 dark:text-slate-400 mt-1'>
                  {activeTab === "published" ? "Publish your first post!" : "Start drafting your next post!"}
                </p>
                <Link
                  href='/profile/newpost'
                  className='inline-flex items-center mt-4 px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Create Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function ProfilePosts({ post, onDelete }) {
  return (
    <article className='border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0 group transition-colors'>
      <div className='group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 p-4 rounded-lg transition-colors'>
        <Link href={`/articles/${post.id}`} className='block'>
          <h3 className='text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
            {post.title}
          </h3>
          <p className='text-slate-600 dark:text-slate-300 mb-3'>{post.excerpt}</p>
        </Link>

        <div className='flex flex-wrap justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400'>
          <div className='flex items-center gap-4'>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                post.status === "published"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
              }`}
            >
              {post.status}
            </span>

            <div className='flex items-center'>
              <FiClock className='mr-1.5' />
              <span>
                {new Date(post.publishedAt || post.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {post.status === "published" && (
              <div className='flex items-center'>
                <FiEye className='mr-1.5' />
                <span>{post.meta?.views || 0} views</span>
              </div>
            )}
          </div>

          <div className='flex items-center gap-2'>
            {post.status === "published" && (
              <div className='flex items-center'>
                <LikeButton
                  postId={post.id}
                  initialLiked={Array.isArray(post.meta?.likes) && post.meta?.likes?.includes(post.authorId)}
                  initialCount={post.meta?.likes?.length || 0}
                />
              </div>
            )}
            <Button
              asChild
              size='sm'
              variant='outline'
              className='border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-slate-700'
            >
              <Link href={`/profile/post/edit/${post.id}`}>Edit</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='outline' className='text-red-600 border-red-600 hover:bg-red-600 hover:text-red-50'>
                  Delete Post
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle> Are you sure you want to delete this post?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(post.id)} className='bg-red-600 text-white hover:bg-red-800'>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </article>
  );
}
