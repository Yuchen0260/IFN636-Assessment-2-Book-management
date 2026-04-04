const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
    title: {type: String, required: true},
    author: {type: String, required: true},
    isbn: {type: String, required: true, unique: true},
    category: {type: String, required: true},
    description: {type: String, default: ""},
    publishedYear: {type: Number, required:true},
    status: {type: String, enum: ["available", "borrowed"], default: "available"},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
    },
    // Mongoose auto set time
    {
    timestamps: true,
    }
);

module.exports = mongoose.model("Book", bookSchema);