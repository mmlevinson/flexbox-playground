function clearFlexContainers(landscape, portrait) {
 
    //while loops were illustrated in MDN Node.removeChild()
    //but I substituted .lastChild for .firstChild b/c it 
    //is more efficient to peal a list off from the bottom
    //so the next element does not have to be advanced upwards
    while (portrait.lastChild) {
        portrait.removeChild(portrait.lastChild);
    }

    while (landscape.lastChild) {
        landscape.removeChild(landscape.lastChild);
    }
}



export {
    clearFlexContainers,
}