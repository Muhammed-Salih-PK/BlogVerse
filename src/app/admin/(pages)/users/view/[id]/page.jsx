"use client";
import { useEffect, useState } from "react";
import { FiEdit, FiMail, FiGlobe, FiTwitter, FiGithub, FiClock, FiEye, FiHeart, FiFileText, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import LikeButton from "@/app/components/LikeButton";
import ProfileSkeleton from "@/app/components/skeletons/ProfileSkeleton";
import { genericFetchData } from "@/lib/genericFetchData";

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("published");

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      const [data, error] = await genericFetchData(`/api/admin/users/${id}`, "GET");

      if (error) {
        console.error("Error fetching profile data: ", error);
        setError("Error fetching profile data");
      } else {
        setProfile(data);
      }
      setIsLoading(false);
    }

    fetchProfile();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    const [data, error] = await genericFetchData(`/api/admin/posts/${id}`, "DELETE");

    if (error) {
      console.error("Delete error:", error.message);
      alert("Failed to delete post: " + error.message);
    } else {
      setProfile((prev) => ({
        ...prev,
        posts: {
          ...prev.posts,
          [activeTab]: prev.posts[activeTab].filter((post) => post.id !== id),
        },
      }));
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  if (error)
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
            <div className='ml-3 '>
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

  if (!profile) return null;

  // Show profile completion progress if not complete
  const showProgress = !profile.user.profileComplete;

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-black  '>
      {/* Profile Header */}

      <div className='bg-gradient-to-br from-indigo-700 to-purple-600 py-12 px-4 text-white shadow-lg'>
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
                <img src={profile.user.avatar || "/default-avatar.jpg"} alt={profile.user.username} className='w-full h-full object-cover' />
                <Link
                  href={`/admin/users/${profile.user.id}`}
                  className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'
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
                    href={`/admin/users/${profile.user.id}`}
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  >
                    <FiEdit className='mr-2' size={16} />
                    Edit Profile
                  </Link>
                </div>
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
        <div className='bg-white dark:bg-slate-950 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700'>
          {/* Stats Bar */}
          <div className='grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700 bg-slate-50 dark:bg-slate-800'>
            <div className='py-4 text-center'>
              <div className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>
                {profile.posts.published.length + profile.posts.drafts.length}
              </div>
              <div className='text-slate-500 dark:text-slate-400 text-sm'>Total Posts</div>
            </div>
            <div className='py-4 text-center'>
              <div className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>{profile.posts.published.length}</div>
              <div className='text-slate-500 dark:text-slate-400 text-sm'>Published</div>
            </div>
            <div className='py-4 text-center'>
              <div className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>{profile.posts.drafts.length}</div>
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
                onClick={() => setActiveTab("published")}
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
                onClick={() => setActiveTab("drafts")}
              >
                <FiEdit />
                Drafts
              </button>
            </div>

            {profile.posts[activeTab].length > 0 ? (
              <div className='space-y-6'>
                {profile.posts[activeTab].map((post) => (
                  <div key={post.id} className='border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0 group transition-colors'>
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
                            <Link href={`/admin/articles/edit/${post.id}`}>Edit</Link>
                          </Button>
                          <Button size='sm' variant='destructive' onClick={() => handleDelete(post.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
