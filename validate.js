/* Outsource the dirty details of validating input values, taking these away from the main script file */

/* In Landscape mode, width should be greater than height */
function validateDimensions(width, height, landsacape = true) {
    if (landscape) {
        return width > height;
    } else {
        return height > width;
    }
}


module.export = {
    validateDimensions
}