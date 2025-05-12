import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    avatar: {
      type: String,
      default: "/default-avatar.jpg"
    },
    bio: {
      type: String,
      maxlength: 200
    },
    role: {
      type: String,
      enum: ['user', 'author', 'admin'],
      default: 'user'
    },
    socialLinks: {
      twitter: String,
      github: String,
      website: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    isLocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Prevent returning password in any query
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);