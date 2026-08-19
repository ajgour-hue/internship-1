import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useClothing } from "../hook/useClothing";
import { Link } from "react-router-dom";
import "../../shared/Nav.jsx";
import { getOptimizedImageUrl } from "../../shared/image.util.js";

/* ── Dropdown option lists ─────────────────────── */
const CATEGORIES = [
    "T-Shirt", "Shirt", "Jeans", "Trousers", "Jacket",
    "Hoodie", "Sweater", "Shorts", "Dress", "Skirt",
    "Kurta", "Saree", "Other"
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CONDITIONS = ["New", "Like New", "Excellent", "Good", "Fair"];

/* ── Skeleton card shimmer ─────────────────────── */
const SkeletonCard = () => (
    <div className="rounded-2xl overflow-hidden border border-neutral-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="aspect-[3/4] bg-neutral-100 animate-pulse" />
        <div className="p-4 space-y-2.5">
            <div>
                <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-neutral-50 rounded animate-pulse mt-1.5" />
            </div>
            <div className="flex gap-1.5">
                <div className="h-4 w-14 bg-neutral-100 rounded animate-pulse" />
                <div className="h-4 w-8 bg-neutral-200 rounded animate-pulse" />
            </div>
        </div>
    </div>
);

/* ── Active filter count ───────────────────────── */
const countActiveFilters = (f) =>
    [f.category, f.size, f.condition, f.brand, f.city].filter(Boolean).length;

/* ═══════════════════════════════════════════════════
   Explore Page
   ═══════════════════════════════════════════════════ */
const Explore = () => {
    const { handleGetClothes } = useClothing();

    const clothes  = useSelector((s) => s.clothing.clothes);
    const loading  = useSelector((s) => s.clothing.loading);
    const error    = useSelector((s) => s.clothing.error);

    const [filters, setFilters] = useState({
        search: "", category: "", brand: "",
        size: "", condition: "", city: ""
    });

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1, limit: 20, total: 0, totalPages: 0
    });

    const [filtersOpen, setFiltersOpen] = useState(false);

    /* ── Fetch ──────────────────────────────────── */
    const fetchClothes = async () => {
        try {
            const data = await handleGetClothes({ ...filters, page, limit: 20 });
            if (data?.pagination) setPagination(data.pagination);
        } catch (err) {
            console.error("Explore clothes error:", err);
        }
    };

    useEffect(() => { fetchClothes(); }, [page]);

    /* ── Handlers ───────────────────────────────── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((p) => ({ ...p, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchClothes();
    };

    const handleClearFilters = () => {
        const empty = { search: "", category: "", brand: "", size: "", condition: "", city: "" };
        setFilters(empty);
        setPage(1);
        handleGetClothes({ ...empty, page: 1, limit: 20 });
    };

    const activeCount = countActiveFilters(filters);

    /* ── Select helper ──────────────────────────── */
    const selectCls =
        "w-full appearance-none bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 pr-10 text-sm text-neutral-800 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/5 transition cursor-pointer";

    /* ═══════════════════════════════════════════════
       Render
       ═══════════════════════════════════════════════ */
    return (
        <main className="min-h-screen bg-[#fafafa]">

            {/* ── Hero Header ────────────────────── */}
            <section className="px-6 md:px-10 lg:px-20 pt-14 pb-6">
                <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 font-medium mb-4">
                    FashionKart · Marketplace
                </p>

                <div className="flex items-end gap-4 flex-wrap">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                        Explore
                    </h1>

                    {!loading && pagination.total > 0 && (
                        <span className="mb-1.5 inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                            {pagination.total} items
                        </span>
                    )}
                </div>

                <p className="mt-3 text-neutral-500 text-[15px] max-w-lg">
                    Discover clothes available for swapping with people in your community.
                </p>
            </section>

            {/* ── Search + Filter Bar ────────────── */}
            <section className="px-6 md:px-10 lg:px-20 pb-8">
                <form onSubmit={handleSearch}>

                    {/* Top row: search + toggle */}
                    <div className="flex gap-3 items-center">
                        {/* Search input */}
                        <div className="relative flex-1">
                            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleChange}
                                placeholder="Search clothes, brands, categories…"
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/5 transition shadow-sm"
                            />
                        </div>

                        {/* Filter toggle */}
                        <button
                            type="button"
                            onClick={() => setFiltersOpen((p) => !p)}
                            className={`
                                flex items-center gap-2 px-5 py-3.5 rounded-xl border text-sm font-medium transition-all shadow-sm whitespace-nowrap cursor-pointer
                                ${filtersOpen
                                    ? "bg-neutral-900 text-white border-neutral-900"
                                    : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                                }
                            `}
                        >
                            <i className={`ri-equalizer-line text-base ${filtersOpen ? "text-white" : "text-neutral-500"}`} />
                            Filters
                            {activeCount > 0 && (
                                <span className={`ml-1 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ${filtersOpen ? "bg-white text-neutral-900" : "bg-neutral-900 text-white"}`}>
                                    {activeCount}
                                </span>
                            )}
                        </button>

                        {/* Search button */}
                        <button
                            type="submit"
                            className="px-6 py-3.5 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition shadow-sm cursor-pointer"
                        >
                            Search
                        </button>
                    </div>

                    {/* ── Collapsible filter panel ── */}
                    <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                            maxHeight: filtersOpen ? "400px" : "0px",
                            opacity: filtersOpen ? 1 : 0,
                            marginTop: filtersOpen ? "16px" : "0px"
                        }}
                    >
                        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                                {/* Category */}
                                <div className="relative">
                                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                                        Category
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={filters.category}
                                            onChange={handleChange}
                                            className={selectCls}
                                        >
                                            <option value="">All</option>
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Size */}
                                <div className="relative">
                                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                                        Size
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="size"
                                            value={filters.size}
                                            onChange={handleChange}
                                            className={selectCls}
                                        >
                                            <option value="">All</option>
                                            {SIZES.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Condition */}
                                <div className="relative">
                                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                                        Condition
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="condition"
                                            value={filters.condition}
                                            onChange={handleChange}
                                            className={selectCls}
                                        >
                                            <option value="">All</option>
                                            {CONDITIONS.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Brand */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                                        Brand
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={filters.brand}
                                        onChange={handleChange}
                                        placeholder="e.g. Nike"
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/5 transition"
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                                        City
                                    </label>
                                    <div className="relative">
                                        <i className="ri-map-pin-2-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
                                        <input
                                            type="text"
                                            name="city"
                                            value={filters.city}
                                            onChange={handleChange}
                                            placeholder="e.g. Mumbai"
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/5 transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Filter actions */}
                            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-neutral-100">
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition cursor-pointer"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="px-5 py-2.5 rounded-full border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                                >
                                    Reset All
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            {/* ── Content ────────────────────────── */}
            <section className="px-6 md:px-10 lg:px-20 pb-20">

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="py-24 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-5">
                            <i className="ri-error-warning-line text-2xl text-red-500" />
                        </div>
                        <p className="text-red-500 font-medium">{error}</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && clothes.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 mb-6">
                            <i className="ri-hanger-line text-3xl text-neutral-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-neutral-800">
                            No clothes found
                        </h2>
                        <p className="mt-2 text-neutral-500 text-sm max-w-xs mx-auto">
                            We couldn't find anything matching your filters. Try broadening your search.
                        </p>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition cursor-pointer"
                        >
                            <i className="ri-refresh-line" />
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Clothes grid */}
                {!loading && !error && clothes.length > 0 && (
                    <>
                        {/* Result header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-neutral-500">
                                Showing <span className="font-semibold text-neutral-800">{clothes.length}</span> of {pagination.total} items
                            </p>
                            <p className="text-xs text-neutral-400">
                                Page {pagination.page} / {pagination.totalPages}
                            </p>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {clothes.map((clothing) => (
                                <Link
                                    key={clothing._id}
                                    to={`/clothes/${clothing._id}`}
                                    className="group block rounded-2xl overflow-hidden bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 ease-out"
                                >
                                    {/* Image container — 3:4 ratio for cleaner fashion look */}
                                    <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden">
                                        {clothing.images?.[0] ? (
                                            <img
                                                src={getOptimizedImageUrl(clothing.images[0], 480, 640)}
                                                alt={clothing.title}
                                                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-50 to-neutral-100">
                                                <i className="ri-t-shirt-line text-4xl text-neutral-300" />
                                                <span className="text-[10px] uppercase tracking-widest text-neutral-300 font-medium">No Photo</span>
                                            </div>
                                        )}

                                        {/* Bottom gradient overlay for badge readability */}
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Condition badge — top left */}
                                        {clothing.condition && (
                                            <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md text-[9px] font-bold text-neutral-700 uppercase tracking-wider px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                                                {clothing.condition}
                                            </span>
                                        )}

                                        {/* Swap value badge — bottom right */}
                                        {clothing.swapValue && (
                                            <span className="absolute bottom-2.5 right-2.5 bg-neutral-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg">
                                                ₹{clothing.swapValue}
                                            </span>
                                        )}
                                    </div>

                                    {/* Card content */}
                                    <div className="p-4 space-y-2">
                                        <div>
                                            <h3 className="font-semibold text-neutral-900 truncate text-sm leading-snug">
                                                {clothing.title}
                                            </h3>
                                            {clothing.brand && (
                                                <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                                                    {clothing.brand}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {clothing.category && (
                                                <span className="bg-neutral-100 text-neutral-600 text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded">
                                                    {clothing.category}
                                                </span>
                                            )}
                                            {clothing.size && (
                                                <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                    {clothing.size}
                                                </span>
                                            )}
                                        </div>

                                        {/* Location */}
                                        {clothing.city && (
                                            <div className="flex items-center gap-1 text-[11px] text-neutral-400 pt-1 border-t border-neutral-50">
                                                <i className="ri-map-pin-2-fill text-[11px] text-neutral-300" />
                                                <span>{clothing.city}</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* ── Pagination ──────────── */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-14">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:bg-neutral-100 transition cursor-pointer"
                                    aria-label="Previous page"
                                >
                                    <i className="ri-arrow-left-s-line text-lg" />
                                </button>

                                {/* Page numbers */}
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                    .filter((p) => {
                                        if (pagination.totalPages <= 7) return true;
                                        if (p === 1 || p === pagination.totalPages) return true;
                                        return Math.abs(p - page) <= 1;
                                    })
                                    .reduce((acc, p, idx, arr) => {
                                        if (idx > 0 && p - arr[idx - 1] > 1) {
                                            acc.push("…");
                                        }
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((item, idx) =>
                                        item === "…" ? (
                                            <span key={`dots-${idx}`} className="text-neutral-400 text-sm px-1">…</span>
                                        ) : (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => setPage(item)}
                                                className={`w-10 h-10 rounded-full text-sm font-medium transition cursor-pointer ${
                                                    item === page
                                                        ? "bg-neutral-900 text-white"
                                                        : "text-neutral-600 hover:bg-neutral-100"
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        )
                                    )}

                                <button
                                    type="button"
                                    disabled={page >= pagination.totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:bg-neutral-100 transition cursor-pointer"
                                    aria-label="Next page"
                                >
                                    <i className="ri-arrow-right-s-line text-lg" />
                                </button>
                            </div>
                        )}
                    </>
                )}

            </section>
        </main>
    );
};

export default Explore;