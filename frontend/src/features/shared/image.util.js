/**
 * Utility to optimize ImageKit URLs by appending real-time transformation parameters.
 * Automatically handles quality compression (q-80), auto-formatting (f-auto), and optional resizing.
 *
 * @param {string} url - Original image URL
 * @param {number} [width] - Desired width of the image
 * @param {number} [height] - Desired height of the image
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (url, width, height) => {
    if (!url || typeof url !== "string") return url;

    // Check if the URL belongs to ImageKit
    if (url.includes("ik.imagekit.io")) {
        const transformations = [];
        if (width) transformations.push(`w-${width}`);
        if (height) transformations.push(`h-${height}`);
        transformations.push("f-auto"); // Serve modern format (WebP/AVIF) if browser supports it
        transformations.push("q-80");   // Reduce quality to 80% for high compression with minimal visible loss

        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}tr=${transformations.join(",")}`;
    }

    return url;
};
