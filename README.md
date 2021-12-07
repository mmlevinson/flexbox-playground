## FlexBox Playground

### Practice FlexBox patterns in real time

Written in HTML/CSS/JavaScript using VSCode

---

Web Page where students of FlexBox can explicitly set different properties of the FlexBox rule system, and view the results in real time.

### Introduction

Flexbox is powerful, but not immediately intuitive.   Practice makes perfect, but practicing on an in-progress web site/application can break existing layouts causing delays and frustrations.   There are many tools for utilizing Flexbox, but this one is simply offered for a student level instructional tool.   The code is Open Source, so you can dig into the details of implementation, seeing how Flexbox works behind the scenes.   

A primitive layout of 4 boxes, with customizable content, is provided where you can, risk free, test how to distribute and align these items using Flexbox with simple on-screen user controls

### Features include...

1. Both Horizontal and Vertically oriented Flexbox Containers with 4 
children (ie flex-items) which can individually be customized with different text.

2. Layout of the Playground elements is done without Flexbox so the student can see some comparisons.

3. For complex layouts that take a lot of work to configure, you can export the FlexBox settings for both the parent (FlexContainer) and children (Flex Items) elements, which are then 'importable' into another project if you want to paste the values into CSS rules for the respective Container/Items.   

### Downsides...

1.  No attempt was made to create a Mobile-First layout.   Indeed, this is not the intent.   The layout is more suited for a wide screen/desktop/laptop where all the controls can be visible at once.   However, the Horizontal and Vertical views of your Flex Items will simulate the respective Portrait and Landscape orientations of smaller viewport mobile devices, just for prototyping purposes only.

2.  The HTML file is very large, with a lot of repeating code blockes. (Yes, I did a lot of copy/paste !) It would be best to outsource most of the repeating code to separate web components.   That is something for a later version, if there is interest and need.

3.  As a consequence, there is a lot of DOM traversal, which is expensive.   However, the tradeoff is keeping all the controls and layouts on the same Web page.   The User sees and integrate display with cause/effect.

4.  There are (many) BETTER ways of doing this same task, but this is the way I could get going in a reasonable time frame.   My apologies in advance if I missed obvious optimizations.