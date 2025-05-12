import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      maxlength: 300
    },
    featuredImage: {
      type: String,
      default: "/default-post.jpg"
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }],
    tags: [{
      type: String,
      trim: true
    }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    publishedAt: Date,
    meta: {
      views: {
        type: Number,
        default: 0
      },
      likes: {
        type: Number,
        default: 0
      },
      comments: {
        type: Number,
        default: 0
      }
    },
    seo: {
      title: String,
      description: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

// Generate slug before saving
PostSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  next();
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);