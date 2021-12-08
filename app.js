/* Perform setup in advance of any User activated events */
initialize();

/* Hoisted... */
function initialize() {
    getFlexTextElements();
    getFlexItemElements();
}


/* Get a reference to the parent Flex Container, so that its style property can be set in code */
const flexContainerWideLayout = document.querySelector('.flex-container#wide');



/* Get a reference to each choice first panel (for setting Flex properties on the Container), so we can use the user selections to update the style property of the FlexContainer */
const displayTypeMenu = document.getElementById('displayType');


/* Set an EventListener for input/change events for every control in the section.flex-controls */
displayTypeMenu.addEventListener('change', updateFlexContainer);

function setWideLayoutDimensions() {
    //get the w/h inputs
    const inputs = document.querySelectorAll('section#flex-container-settings .dimensions.wide-layout input[type=number]');    //should be two of them:  w/h
    const width = inputs[0].value;
    const height = inputs[1].value;
    console.log(`width, height`, width, height);
    flexContainerWideLayout.style.width = width + 'px';
    flexContainerWideLayout.style.height = height + 'px';
}

/* Lets get the W/H checkboxes */
const fcs_landscape_checkbox = document.querySelector('section#flex-container-settings .dimensions.wide-layout input[type=checkbox]')

/* Decode checkboxes with event.target.checked */
fcs_landscape_checkbox.addEventListener('input', (event) => {
    if (event.target.checked) {
        setWideLayoutDimensions();
    } else {
        flexContainerWideLayout.style.width = 'auto';
        flexContainerWideLayout.style.height = 'auto';
    }
})


/* Save a reference to each <textarea> (in an array) so we can programmatically update the contents of each flex-item when changed by user input.  Since there is only one <ol> in the layout, its a simple querySelector()  */
const flexTextAreas = [];
function getFlexTextElements() {

    const orderedList = document.querySelector('ol');
    //loop through the children
    // orderedList.forEach((listItemElement) => {
    //     let textAreaElement = listItemElement.firstChild();
    //     textAreaElement.addEventListener('input', updateFlexItemText());
    //     flexTextAreas.push(textAreaElement);
    // })
}

/* Save a reference to the <span> within each div.flex-item  so we can update its textContent with new user input  */
const flexItems_wide = [];
function getFlexItemElements() {
    // const wideFlexContainer = document.querySelector('div.flex-container#wide');
    // wideFlexContainer.forEach((element) => {
    //     let spanElement = element.firstChild();
    //     flexItems_wide.push(spanElement);
    // })
}


function updateFlexContainer() {
    //set the style properties of the Flex Container
    flexContainer.style.display = displayTypeMenu.value;
}

function updateFlexItemText() {
    //stub for now
}