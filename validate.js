/* Outsource the dirty details of validating input values, taking these away from the main script file */

/* In Landscape mode, width should be greater than height */
function validateDimensions(width, height, landsacape = true) {
    if (landscape) {
        return width > height;
    } else {
        return height > width;
    }
}

const MAX_ITEMS = 12;
const MIN_ITEMS = 1;
function validateHowManyItems(numItems) {
    if (!numItems) {
        return false;  //when delete button or empty field
    }
    //input from WWW is always text (see console.log)
    const flexItemCount = +numItems;  //coerce to Number
    // console.log(`flexItemCount`, flexItemCount);
    if (flexItemCount < MIN_ITEMS) {
        alert(`You must have at least ${MIN_ITEMS} item(s)`);
        return false;
    }
    if (flexItemCount > MAX_ITEMS) {
        alert(`Plase enter a value less than ${MAX_ITEMS}`);
        return false;
    }
    return true;
}

function isValidIndex(value) {
    if (isNaN(value)) {
        return false;
    }
    let index = Number(value);
    if (index >= MIN_ITEMS && index <= MAX_ITEMS) {
        return true;
    }
    return false;
}


export {
    isValidIndex,
    validateDimensions,
    validateHowManyItems
}