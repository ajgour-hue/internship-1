import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useClothing } from "../hook/useClothing";
import { Link } from "react-router-dom";
import "../../shared/Nav.jsx"

const Explore = () => {

    const {
        handleGetClothes
    } = useClothing();


    const clothes = useSelector(
        (state) => state.clothing.clothes
    );


    const loading = useSelector(
        (state) => state.clothing.loading
    );


    const error = useSelector(
        (state) => state.clothing.error
    );


    const [filters, setFilters] = useState({
        search: "",
        category: "",
        brand: "",
        size: "",
        condition: "",
        city: ""
    });


    const [page, setPage] = useState(1);


    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    });


    const fetchClothes = async () => {

        try {

            const data = await handleGetClothes({

                ...filters,

                page,

                limit: 20

            });


            if (data?.pagination) {

                setPagination(
                    data.pagination
                );

            }

        } catch (error) {

            console.error(
                "Explore clothes error:",
                error
            );

        }

    };


    useEffect(() => {

        fetchClothes();

    }, [page]);


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFilters((prev) => ({

            ...prev,

            [name]: value

        }));

    };


    const handleSearch = (e) => {

        e.preventDefault();

        setPage(1);

        fetchClothes();

    };


    const handleClearFilters = () => {

        const emptyFilters = {

            search: "",
            category: "",
            brand: "",
            size: "",
            condition: "",
            city: ""

        };


        setFilters(
            emptyFilters
        );


        setPage(1);


        handleGetClothes({

            ...emptyFilters,

            page: 1,

            limit: 20

        });

    };


    return (

        <main className="min-h-screen bg-white">


            {/* Header */}

            <section className="px-6 md:px-10 lg:px-20 pt-12 pb-8">

                <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-3">
                    FashionKart
                </p>


                <h1 className="text-4xl md:text-5xl font-semibold text-black">
                    Explore Clothes
                </h1>


                <p className="mt-3 text-neutral-500 max-w-xl">
                    Discover clothes available for swapping
                    with people in your community.
                </p>

            </section>



            {/* Filters */}

            <section className="px-6 md:px-10 lg:px-20 pb-10">

                <form
                    onSubmit={handleSearch}
                    className="border border-neutral-200 rounded-2xl p-5"
                >

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


                        {/* Search */}

                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleChange}
                            placeholder="Search clothes..."
                            className="px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                        />


                        {/* Category */}

                        <input
                            type="text"
                            name="category"
                            value={filters.category}
                            onChange={handleChange}
                            placeholder="Category"
                            className="px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                        />


                        {/* Brand */}

                        <input
                            type="text"
                            name="brand"
                            value={filters.brand}
                            onChange={handleChange}
                            placeholder="Brand"
                            className="px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                        />


                        {/* Size */}

                        <input
                            type="text"
                            name="size"
                            value={filters.size}
                            onChange={handleChange}
                            placeholder="Size"
                            className="px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                        />


                        {/* Condition */}

                        <input
                            type="text"
                            name="condition"
                            value={filters.condition}
                            onChange={handleChange}
                            placeholder="Condition"
                            className="px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                        />


                        {/* City */}

                        <input
                            type="text"
                            name="city"
                            value={filters.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                        />

                    </div>



                    <div className="flex flex-wrap gap-3 mt-5">

                        <button
                            type="submit"
                            className="px-6 py-3 rounded-full bg-black text-white text-sm hover:bg-neutral-800 transition"
                        >
                            Search
                        </button>


                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="px-6 py-3 rounded-full border border-neutral-200 text-sm hover:bg-neutral-50 transition"
                        >
                            Clear
                        </button>

                    </div>

                </form>

            </section>



            {/* Content */}

            <section className="px-6 md:px-10 lg:px-20 pb-16">


                {/* Loading */}

                {loading && (

                    <div className="py-20 text-center text-neutral-500">

                        Loading clothes...

                    </div>

                )}



                {/* Error */}

                {!loading &&
                    error && (

                    <div className="py-20 text-center text-red-500">

                        {error}

                    </div>

                )}



                {/* Empty */}

                {!loading &&
                    !error &&
                    clothes.length === 0 && (

                    <div className="py-20 text-center">

                        <h2 className="text-xl font-medium text-black">
                            No clothes found
                        </h2>


                        <p className="mt-2 text-neutral-500">
                            Try changing your search or filters.
                        </p>

                    </div>

                )}



                {/* Clothes */}

                {!loading &&
                    !error &&
                    clothes.length > 0 && (

                    <>

                        {/* Result Header */}

                        <div className="flex items-center justify-between mb-6">

                            <p className="text-sm text-neutral-500">
                                {pagination.total} items found
                            </p>


                            <p className="text-sm text-neutral-400">

                                Page {pagination.page} of{" "}

                                {pagination.totalPages}

                            </p>

                        </div>



                        {/* Cards */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                            {clothes.map(
                                (clothing) => (

                                <Link
                                    key={clothing._id}
                                    to={`/clothes/${clothing._id}`}
                                    className="block border border-neutral-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition"
                                >


                                    {/* Image */}

                                    <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">

                                        {clothing.images?.[0] ? (

                                            <img
                                                src={
                                                    clothing.images[0]
                                                }
                                                alt={
                                                    clothing.title
                                                }
                                                className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                            />

                                        ) : (

                                            <div className="w-full h-full flex items-center justify-center text-neutral-400">

                                                No Image

                                            </div>

                                        )}

                                    </div>



                                    {/* Details */}

                                    <div className="p-4">

                                        <h3 className="font-medium text-black truncate">

                                            {clothing.title}

                                        </h3>



                                        {clothing.brand && (

                                            <p className="text-sm text-neutral-500 mt-1">

                                                {clothing.brand}

                                            </p>

                                        )}



                                        <div className="flex items-center justify-between mt-4 text-xs text-neutral-500">

                                            {clothing.category && (

                                                <span>

                                                    {clothing.category}

                                                </span>

                                            )}


                                            {clothing.size && (

                                                <span>

                                                    Size{" "}

                                                    {clothing.size}

                                                </span>

                                            )}

                                        </div>

                                    </div>


                                </Link>

                            ))}

                        </div>



                        {/* Pagination */}

                        {pagination.totalPages > 1 && (

                            <div className="flex items-center justify-center gap-4 mt-10">


                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() =>
                                        setPage(
                                            (prev) =>
                                                prev - 1
                                        )
                                    }
                                    className="px-5 py-2.5 rounded-full border border-neutral-200 disabled:opacity-40"
                                >
                                    Previous
                                </button>


                                <span className="text-sm text-neutral-500">

                                    {page}

                                </span>


                                <button
                                    type="button"
                                    disabled={
                                        page >=
                                        pagination.totalPages
                                    }
                                    onClick={() =>
                                        setPage(
                                            (prev) =>
                                                prev + 1
                                        )
                                    }
                                    className="px-5 py-2.5 rounded-full border border-neutral-200 disabled:opacity-40"
                                >
                                    Next
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