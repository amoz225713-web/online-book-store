
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://booknest-api-xr87.onrender.com/api/books";

function getBookEmoji(book) {
  const text = `${book.title || ""} ${book.category || ""}`.toLowerCase();

  if (text.includes("harry") || text.includes("fantasy")) return "🪄";
  if (text.includes("habit") || text.includes("self-help")) return "🌱";
  if (text.includes("biography") || text.includes("fire")) return "🚀";
  if (text.includes("finance") || text.includes("money")) return "💰";
  if (text.includes("alchemist")) return "🌟";
  if (text.includes("ikigai")) return "🌸";

  return "📚";
}

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load books from the Express backend
  async function fetchBooks(searchTerm = "") {
    try {
      setLoading(true);
      setError("");

      const url = new URL(API_URL);
      if (searchTerm.trim()) {
        url.searchParams.set("search", searchTerm.trim());
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to fetch books from the server.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned an unexpected response.");
      }

      setBooks(data);
    } catch (err) {
      setError(
        "Could not load books. Make sure the backend and MongoDB are running."
      );
      console.error("Book loading error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search books using the backend API
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBooks(search);
    }, 300);

    return () => clearTimeout(timeoutId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function addToCart(book) {
    setCart((current) => [...current, book]);
  }

  function removeFromCart(indexToRemove) {
    setCart((current) =>
      current.filter((_, index) => index !== indexToRemove)
    );
  }

  const cartTotal = cart.reduce(
    (total, book) => total + Number(book.price || 0),
    0
  );

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#home">
          📚 BookNest
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#books">Books</a>
          <a href="#about">About</a>
        </nav>

        <a className="cart-count" href="#cart">
          🛒 Cart: {cart.length}
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div>
            <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>

            <h1>
              Find your next
              <br />
              favorite book.
            </h1>

            <p className="hero-text">
              Explore stories, discover new ideas, and find books you'll love.
            </p>

            <a className="shop-button" href="#books">
              Explore Books →
            </a>
          </div>

          <div className="hero-art" aria-label="Stack of books">
            <span>📚</span>
          </div>
        </section>

        <section className="catalogue" id="books">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR COLLECTION</p>
              <h2>Popular Books</h2>
            </div>

            <input
              type="search"
              placeholder="Search books or authors..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search books or authors"
            />
          </div>

          {loading && <p className="empty">Loading books...</p>}

          {!loading && error && (
            <div className="empty">
              <p>{error}</p>
              <button onClick={() => fetchBooks(search)}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && books.length === 0 && (
            <div className="empty">
              <p>
                {search
                  ? "No books found. Try another search."
                  : "No books available yet. Add books to your database to see them here."}
              </p>
            </div>
          )}

          {!loading && !error && books.length > 0 && (
            <div className="book-grid">
              {books.map((book) => (
                <article
                  className="book-card"
                  key={book._id || book.id}
                >
                  <div className="book-cover">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{getBookEmoji(book)}</span>
                    )}

                    <small>{book.category || "General"}</small>
                  </div>

                  <div className="book-info">
                    <p className="category">
                      {book.category || "General"}
                    </p>

                    <h3>{book.title}</h3>

                    <p className="author">
                      {book.author || "Unknown author"}
                    </p>

                    <div className="book-bottom">
                      <strong>
                        ₹{Number(book.price || 0).toLocaleString("en-IN")}
                      </strong>

                      <button
                        onClick={() => addToCart(book)}
                        disabled={Number(book.stock ?? 10) <= 0}
                      >
                        {Number(book.stock ?? 10) <= 0
                          ? "Out of stock"
                          : "+ Add"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="cart-section" id="cart">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR SELECTION</p>
              <h2>Shopping Cart</h2>
            </div>
          </div>

          {cart.length === 0 ? (
            <p className="empty">
              Your cart is empty. Add a book to get started!
            </p>
          ) : (
            <div className="cart-summary">
              <div>
                <strong>{cart.length} book(s) in your cart</strong>
                <p>Total: ₹{cartTotal.toLocaleString("en-IN")}</p>
              </div>

              <div className="cart-items">
                {cart.map((book, index) => (
                  <div
                    className="cart-item"
                    key={`${book._id || book.id}-${index}`}
                  >
                    <span>
                      {book.title} — ₹
                      {Number(book.price || 0).toLocaleString("en-IN")}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(index)}
                      aria-label={`Remove ${book.title} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Checkout and order placement will be implemented next."
                  )
                }
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </section>

        <section className="about" id="about">
          <h2>Stories worth discovering.</h2>
          <p>
            BookNest brings books from different genres together in one simple
            online bookstore.
          </p>
        </section>
      </main>

      <footer>
        © 2026 BookNest | Online Book Store Project
      </footer>
    </div>
  );
}

export default App;
