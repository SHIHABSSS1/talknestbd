"use client";

import { useMemo, useState } from "react";
import { BookOpen, Pencil, Plus, Search, SlidersHorizontal, Trash2, UploadCloud } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { BookForm } from "./BookForm";
import { categoryLabel } from "@/data/categories";
import type { Book } from "@/lib/types";

type Tab = "all" | "published" | "low-stock" | "drafts";

const tabs: { value: Tab; label: string }[] = [
  { value: "all", label: "All books" },
  { value: "published", label: "Published" },
  { value: "low-stock", label: "Low stock" },
  { value: "drafts", label: "Drafts" },
];

export function BooksManager({ books }: { books: Book[] }) {
  const { books: allBooks, saveBook, removeBook } = useBookContent();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Book | undefined>(undefined);

  const categoryName = (slug: string) => categoryLabel(slug);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return allBooks.filter((book) => {
      const matchesTerm =
        !term ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term);
      const matchesTab =
        tab === "all" ||
        (tab === "published" && book.stock > 0) ||
        (tab === "low-stock" && book.stock <= 18) ||
        (tab === "drafts" && false);
      return matchesTerm && matchesTab;
    });
  }, [allBooks, query, tab]);

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditing(book);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(undefined);
  };

  const toggleSelected = (slug: string) => {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb + heading */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-semibold text-ink">Books</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Books</h1>
          <p className="mt-1 text-[12px] text-muted">
            Upload new titles and manage the catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Plus size={14} /> Upload new book
        </button>
      </div>

      {/* Mini stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Catalog books", value: books.length, icon: BookOpen },
          { label: "Low stock", value: books.filter((b) => b.stock <= 18).length, icon: SlidersHorizontal },
          { label: "Selected", value: selected.length, icon: Plus },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-[10px] border border-line bg-white p-4"
          >
            <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-brand-50 text-brand-700">
              <stat.icon size={15} />
            </span>
            <div>
              <p className="text-[10px] text-muted">{stat.label}</p>
              <p className="font-display text-lg font-bold text-ink">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form (create / edit) */}
      {formOpen && <BookForm book={editing} onCancel={closeForm} onSave={saveBook} />}

      {/* List */}
      <section className="overflow-hidden rounded-[10px] border border-line bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  tab === item.value
                    ? "bg-brand-600 text-white"
                    : "bg-canvas text-muted hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="relative ml-auto block min-w-[180px] flex-1 sm:max-w-xs">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or author…"
              aria-label="Search books"
              className="h-9 w-full rounded-[4px] border border-line bg-canvas pl-9 pr-3 text-[11px] text-ink placeholder:text-muted/70 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-line bg-canvas/70 text-[9px] uppercase tracking-[0.1em] text-muted">
                <th className="w-10 px-4 py-2.5 sm:px-5">
                  <input
                    type="checkbox"
                    aria-label="Select all books"
                    checked={selected.length === visible.length && visible.length > 0}
                    onChange={(event) =>
                      setSelected(event.target.checked ? visible.map((b) => b.slug) : [])
                    }
                    className="h-3.5 w-3.5 accent-brand-600"
                  />
                </th>
                <th className="px-2 py-2.5 font-semibold">Book</th>
                <th className="px-2 py-2.5 font-semibold">Author</th>
                <th className="px-2 py-2.5 font-semibold">Category</th>
                <th className="px-2 py-2.5 font-semibold">Price</th>
                <th className="px-2 py-2.5 font-semibold">Stock</th>
                <th className="px-2 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold sm:px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((book) => (
                <tr key={book.slug} className="transition-colors hover:bg-brand-50/30">
                  <td className="px-4 py-3 sm:px-5">
                    <input
                      type="checkbox"
                      aria-label={`Select ${book.title}`}
                      checked={selected.includes(book.slug)}
                      onChange={() => toggleSelected(book.slug)}
                      className="h-3.5 w-3.5 accent-brand-600"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-10 shrink-0">
                        <BookCover size="sm" book={book} />
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[200px] truncate text-[11px] font-semibold text-ink">
                          {book.title}
                        </p>
                        <p className="text-[9px] text-muted">{book.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-[11px] text-body">{book.author}</td>
                  <td className="px-2 py-3 text-[11px] text-body">{categoryName(book.category)}</td>
                  <td className="px-2 py-3 text-[11px] font-medium text-ink">
                    ৳{book.price}
                    {book.oldPrice && (
                      <span className="ml-1 text-[9px] text-muted line-through">
                        ৳{book.oldPrice}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-[11px] text-body">{book.stock}</td>
                  <td className="px-2 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-medium ${
                        book.stock === 0
                          ? "bg-clay-500/10 text-clay-600"
                          : book.stock <= 18
                            ? "bg-gold-500/10 text-gold-600"
                            : "bg-mint/25 text-forest-700"
                      }`}
                    >
                      {book.stock === 0 ? "Out of stock" : book.stock <= 18 ? "Low stock" : "In stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right sm:px-5">
                    <button
                      type="button"
                      onClick={() => openEdit(book)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-line px-3 text-[10px] font-medium text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBook(book.slug)}
                      title="Remove uploaded book"
                      className="ml-1.5 inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-line text-muted transition-colors hover:border-brand-300 hover:text-brand-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <UploadCloud size={22} className="text-muted" />
              <p className="text-[12px] font-medium text-ink">No books found</p>
              <p className="text-[10px] text-muted">Try another search or tab.</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[10px] text-muted sm:px-5">
          <span>
            Showing {visible.length} of {books.length} books
          </span>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700">
            Uploads saved in this browser only — no server
          </span>
        </div>
      </section>
    </div>
  );
}
