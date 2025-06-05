"use client";
import { useState } from "react";
import axios from "axios";
import { FiHeart } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function LikeButton({ postId, initialLiked, initialCount }) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);

  const toggleLike = async () => {
    try {
      const res = await axios.patch(`/api/posts/${postId}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Failed to toggle like", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("You need to be logged in to like posts.");
        router.push("/login");
      }
    }
  };

  return (
    <button
      onClick={toggleLike}
      className='group flex items-center gap-1 cursor-pointer'
    >
      <FiHeart
        className={`text-xl transition-colors duration-200 ${
          liked
            ? "text-red-600 fill-red-600"
            : "text-gray-500 group-hover:text-red-600"
        }`}
        fill={liked ? "red" : "none"}
      />
      <span className='text-sm'>{likesCount}</span>
    </button>
  );
}
