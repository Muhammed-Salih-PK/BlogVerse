"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiClock, FiBookmark, FiShare2 } from "react-icons/fi";
import { FaTags, FaUser } from "react-icons/fa";
import Link from "next/link";
import LikeButton from "@/app/components/LikeButton";
import ArticleSkeleton from "@/app/components/skeletons/ArticleSkeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { genericFetchData } from "@/lib/genericFetchData";
import Error from "@/app/components/error/Error";

export default function ArticlePage() {
  const router = useRouter()
  const { articleid } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      const [data, error] = await genericFetchData(`/api/posts/${articleid}`, "GET");

      if (error) {
        console.error("Error fetching article:", error);
        setError("Error fetching article");
      } else {
        setArticle(data);
      }
      setLoading(false);
    };
    if (articleid) {
      fetchArticle();
    }
  }, [articleid]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // You might want to implement actual bookmark functionality with your backend
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return <ArticleSkeleton />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!article) {
    return null;
  }

  return (
    <>
      <article className='max-w-4xl mx-auto px-4 py-12 '>
        {/* Navigation */}
        <div className='my-5 flex justify-between'>
          <Button variant='outline' onClick={() => router.back()} className='gap-2'>
            <ArrowLeft className='w-5 h-5' />
            Back to Articles
          </Button>
        </div>
        {/* Article Header */}
        <header className='mb-8'>
          <div className='flex items-center mb-4'>
            <span className='bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium'>
              {article.categories?.[0]?.name || "Uncategorized"}
            </span>
            <span className='mx-2 text-gray-400'>•</span>
            <span className='text-gray-500 dark:text-gray-400 text-sm flex items-center'>
              <FiClock className='mr-1' /> {article.readTime}
            </span>
          </div>

          <h1 className='text-3xl md:text-4xl font-bold mb-4 dark:text-white'>{article.title}</h1>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              {article.authorId?.avatar ? (
                <img src={article.authorId.avatar} alt={article.authorId.username} className='w-10 h-10 rounded-full mr-3' />
              ) : (
                <div className='w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center'>
                  <FaUser className='text-gray-500 dark:text-gray-300' />
                </div>
              )}
              <div>
                <p className='font-medium dark:text-white'>{article.authorId?.username || "Unknown Author"}</p>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className='flex space-x-3'>
              <LikeButton
                postId={article._id}
                initialLiked={Array.isArray(article.meta?.likes?.includes(article.authorId))} // Assuming userId is available in Home
                initialCount={article.meta?.likes?.length || 0}
              />
              <button onClick={handleBookmark} className={`${isBookmarked ? "text-yellow-500" : "text-gray-500 dark:text-gray-400"}`}>
                <FiBookmark />
              </button>
              <button onClick={handleShare} className='text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'>
                <FiShare2 />
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className='mb-8 rounded-xl overflow-hidden'>
            <img src={article.featuredImage} alt={article.title} className='w-full h-auto object-cover' loading='eager' />
          </div>
        )}

        {/* Article Content */}
        <div className='prose dark:prose-invert max-w-none'>
          {article.content ? (
            article.content.split("\n").map((line, i) => (line.trim() ? <p key={i}>{line}</p> : <br key={i} />))
          ) : (
            <p>No content available for this article.</p>
          )}
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-semibold mb-3 dark:text-white flex items-center'>
              <FaTags className='mr-2' /> Tags
            </h3>
            <div className='flex flex-wrap gap-2'>
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag.toLowerCase()}`}
                  className='bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm'
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
