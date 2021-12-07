/* Perform setup in advance of any User activated events */
initialize();

/* Hoisted... */
function initialize() {
    getFlexTextElements();
    getFlexItemElements();
}


/* Get a reference to the parent Flex Container, so that its style property can be set in code */
const flexContainer = document.getElementById('flex-container');



/* Get a reference to each choice in the Flex Controls section, so we can use the user selections to update the style property of the FlexContainer */
const displayTypeMenu = document.getElementById('displayType');


/* Set an EventListener for input/change events for every control in the section.flex-controls */
displayTypeMenu.addEventListener('change', updateFlexContainer);

/* Save a reference to each <textarea> (in an array) so we can programmatically update the contents of each flex-item when changed by user input.  Since there is only one <ol> in the layout, its a simple querySelector()  */
const flexTextAreas = [];
function getFlexTextElements() {

    const orderedList = document.querySelector('ol');
    //loop through the children
    orderedList.forEach((listItemElement) => {
        let textAreaElement = listItemElement.firstChild();
        textAreaElement.addEventListener('input', updateFlexItemText());
        flexTextAreas.push(textAreaElement);
    })
}

/* Save a reference to the <span> within each div.flex-item  so we can update its textContent with new user input  */
const flexItems_wide = [];
function getFlexItemElements() {
    const wideFlexContainer = document.querySelector('div.flex-container#wide');
    wideFlexContainer.forEach((element) => {
        let spanElement = element.firstChild();
        flexItems_wide.push(spanElement);
    })
}


function updateFlexContainer() {
    //set the style properties of the Flex Container
    flexContainer.style.display = displayTypeMenu.value;
}

function updateFlexItemText() {
    //stub for now
}