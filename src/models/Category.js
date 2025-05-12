import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: 200
    },
    featuredImage: {
      type: String,
      default: "/default-category.jpg"
    }
  },
  { timestamps: true }
);

// Generate slug before saving
CategorySchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
  next();
});

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);