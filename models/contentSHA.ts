import mongoose from "mongoose";

export interface IContentSHA extends mongoose.Document {
  contentSHA: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContentSHAModel extends mongoose.Model<IContentSHA> {
  setContentSHA(contentSHA: string): Promise<IContentSHA>;
  getContentSHA(): Promise<string | null>;
}

const contentSHASchema = new mongoose.Schema(
  {
    contentSHA: { type: String },
  },
  { timestamps: true, versionKey: false }
);

contentSHASchema.statics = {
  async setContentSHA(contentSHA: string): Promise<IContentSHA> {
    let model = await this.findOne({});
    if (!model) {
      model = new this();
    }
    model.contentSHA = contentSHA;
    return model.save();
  },

  async getContentSHA(): Promise<string | null> {
    const model = await this.findOne({});
    if (!model) {
      return null;
    }
    return model.contentSHA;
  },
};

contentSHASchema.methods = {};

export default mongoose.model<IContentSHA, IContentSHAModel>(
  "ContentSHA",
  contentSHASchema
);
