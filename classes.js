/* Factory Class for creating new FlexItems for populating the FlexContainer */
class FlexItem extends HTMLDivElement {
 
    constructor(initialValue = 1){
        super();
        this.classList.add('flex-item');
        const span = document.createElement('span');
        span.classList.add('flex-item-content');
        span.textContent = initialValue.toString();
        this.appendChild(span);
    }
}


export {
    FlexItem,
}
