import mongoose from "mongoose";

import {
  PRIORITIES,
  REQUEST_STATUS,
  REQUEST_STATUS_VALUES,
  REQUEST_TYPES,
} from "../constants/requestConfig.js";

const historySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: REQUEST_STATUS_VALUES,
      default: REQUEST_STATUS.SUBMITTED,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changedByName: {
      type: String,
      trim: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const requestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    requestType: {
      type: String,
      enum: REQUEST_TYPES,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    justification: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    suggestedAction: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    originalPrompt: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: "normal",
    },
    status: {
      type: String,
      enum: REQUEST_STATUS_VALUES,
      default: REQUEST_STATUS.SUBMITTED,
      index: true,
    },
    targetResolutionDate: {
      type: Date,
      required: true,
    },
    history: [historySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Request", requestSchema);

