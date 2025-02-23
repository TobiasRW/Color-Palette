import mongoose, {
  Schema,
  model,
  models,
  type InferSchemaType,
} from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Exclude password from query results by default
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [64, "Password cannot be more than 64 characters"],
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Infer TypeScript type for User model
export type UserType = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId | string;
};

// Export the model (avoid redefining model in development if it already exists)
const User = models.User || model<UserType>("User", userSchema);
export default User;
