##Issues

### Disappearing <span> in div.flex-item

Problem:  updating the textContent of a flex-item element caused the nested <span> showing the index value to disappear
Solution:   update the div.flex-item.firstChild.textContent.   This is the textNode associated with a div element.    This does not disrupt the div's children