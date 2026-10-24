
require("dotenv").config();

const mongoose = require("mongoose");
const Book = require("./models/Book");

const books = [
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 299,
    category: "Fiction",
    description:
      "A young shepherd travels in search of treasure and discovers the importance of following his dreams.",
    image: "",
    stock: 20,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    price: 399,
    category: "Self-help",
    description:
      "A practical guide to building good habits, breaking bad ones, and making small improvements.",
    image: "",
    stock: 25,
  },
  {
    title: "Wings of Fire",
    author: "A. P. J. Abdul Kalam",
    price: 250,
    category: "Biography",
    description:
      "The inspiring autobiography of Dr. A. P. J. Abdul Kalam and his journey as a scientist.",
    image: "",
    stock: 15,
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 349,
    category: "Finance",
    description:
      "A personal finance book about financial education, assets, liabilities, and money management.",
    image: "",
    stock: 18,
  },
  {
    title: "Ikigai",
    author: "Héctor García",
    price: 280,
    category: "Self-help",
    description:
      "An exploration of Japanese ideas about purpose, happiness, and living a meaningful life.",
    image: "",
    stock: 12,
  },
  {
    title: "Harry Potter",
    author: "J. K. Rowling",
    price: 450,
    category: "Fantasy",
    description:
      "A fantasy adventure about a young wizard discovering the magical world.",
    image: "",
    stock: 10,
  },
];

async function seedBooks() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing. Check your server/.env file."
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    let inserted = 0;
    let updated = 0;

    for (const book of books) {
      const result = await Book.updateOne(
        {
          title: book.title,
          author: book.author,
        },
        {
          $set: book,
        },
        {
          upsert: true,
        }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else if (result.modifiedCount > 0) {
        updated++;
      }
    }

    console.log(`Seed completed successfully!`);
    console.log(`New books added: ${inserted}`);
    console.log(`Existing books updated: ${updated}`);
    console.log(`Total sample books processed: ${books.length}`);
  } catch (error) {
    console.error("Failed to seed books:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedBooks();
