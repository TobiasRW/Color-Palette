import mongoose, {
  Schema,
  model,
  models,
  type InferSchemaType,
} from "mongoose";

const paletteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    colors: {
      type: [String],
      validate: {
        validator: (colors: string[]) => colors.length === 5,
        message: "Palette must have exactly 5 colors",
      },
      required: true,
    },
  },
  { timestamps: true }
);

export type PaletteType = InferSchemaType<typeof paletteSchema> & {
  _id: mongoose.Types.ObjectId | string;
};

const Palette = models.Palette || model<PaletteType>("Palette", paletteSchema);
export default Palette;
