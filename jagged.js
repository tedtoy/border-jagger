
/* ---
 Create seamless borders around overlapping html elements 
 to make them appear as if they shared one common border.

 For example:

 |````````|
 |  div1  |                      |```````````````````````|
 |        `````````````|         |    A                  |
 |                     ``````|   |              B        |
 `````|     div2             |   `````````|              | 
      |                      |            |              |
      |              div3    |            ```````````````` 
      ``````````|            |   |`````|
                |            |   |  C  |
                ``````````````   |     |
                                 ```````

 For now the implementation will be based on css classes.
 eg: 
    new Jagged('my-class').border('1px solid #999');
 
    var ducks = new Jagged('ducks');
    ducks.border('1px solid red');
     .. do stuff
    ducks.border('1px solid blue'); 

  With options:
    var ducks = new Jagged('ducks', 'bottom', 'left')
    ducks.border('1px solid red', '4px')  4px rounded corners
    


 ToDo's:
     - Ability to round corners.
     - Shadows.
     - Only border specific sides.
     - Have text and inline elements
       within bordered areas wrap around 
       overlapping elements.

--- */

var Jagged = (function($){
    
    'use strict';

    // Creates an object literal for each element
    // and finds all overlapping and exposed borders.
    // maybe: findOverlaps()
    function getOverlappingElements(elems){
        var positionEls = [];
        // Save each els position in positionEls
        for(var i=0; i< elems.length; i++){
            var el = $(elems[i]);
            var elPos = el.offset();
            positionEls.push({
                'el': el,
                'left':   elPos.left,
                'right':  elPos.left + el.width(),
                'top':    elPos.top,
                'bottom': elPos.top + el.height(),
                'overlapsWith': [],

                'leftOverlaps': [],
                'rightOverlaps': [],
                'topOverlaps': [],
                'bottomOverlaps': [],

                'leftNonOverlaps': [],
                'rightNonOverlaps': [],
                'topNonOverlaps': [],
                'bottomNonOverlaps': []
            });
        }
        // Determine overlaps. n^2 is the best I can do.
        console.log(positionEls);
        for(var a=0; a<positionEls.length; a++){
            var positionA = positionEls[a];
            for(var b=0; b< positionEls.length; b++){
                // don't count overlaps against itself!
                if(b !== a){
                    var positionB = positionEls[b];
                    if( comparePos(positionA, positionB) ){
                        positionA.overlapsWith.push(positionB);
                    }
                }
            }
            // Store the positions of the exposed sides for 
            // each element in the 'NonOverlaps' arrays.
            positionA = identifyOverlappingBorders(positionA);
            positionA = identifyNonOverlappingBorders(positionA);
            positionEls[a] = positionA;
            console.log(positionA);
        }
        return positionEls;
    }
    function identifyOverlappingBorders(p){
        for(var a=0; a< p.overlapsWith.length; a++){
            var p2 = p.overlapsWith[a];
            // horizontal overlapping range:
            var overlapH = [
                (p2.left <= p.left) ? 0 : p2.left - p.left ,
                (p2.right >= p.right) ? p.right - p.left : p2.right - p.left
            ];
            console.log('overlaph p2left: '+String(p2.left)+' p.left: ' + String(p.left))
            console.log(overlapH)
            //console.log('p'); console.log(p);
            //console.log('p2'); console.log(p2);

            // vertical overlapping range:
            var overlapV = [
                (p2.top <= p.top) ? 0 : p2.top - p.top,
                (p2.bottom >= p.bottom) ? p.bottom - p.top : p2.bottom - p.top
            ];
            // overlaps top?
            if( isBetween(p.top, p2.top, p2.bottom) ){
                p.topOverlaps.push(overlapH);
            }
            // overlaps bottom?
            if( isBetween(p.bottom, p2.top, p2.bottom) ){
                p.bottomOverlaps.push(overlapH);
            }
            // overlaps left side?
            if( isBetween(p.left, p2.left, p2.right) ){
                p.leftOverlaps.push(overlapV);
            }
            // overlaps right side?
            if( isBetween(p.right, p2.left, p2.right) ){
                p.rightOverlaps.push(overlapV);
            }
        }
        // sort overlaps
        $.each([p.topOverlaps,p.bottomOverlaps,p.leftOverlaps,p.rightOverlaps], function(z,o){
            o.sort(function(a,b){ return a[0]-b[0]; });
        });
        return p;
    }
    function identifyNonOverlappingBorders(p){
        p.topNonOverlaps = getNonOverlapping(p, 'top');
        p.bottomNonOverlaps = getNonOverlapping(p, 'bottom');
        p.leftNonOverlaps = getNonOverlapping(p, 'left');
        p.rightNonOverlaps = getNonOverlapping(p, 'right');
        return p;
    }
    // Finds the inverse of the overlapping portions for an element
    // overlaps are sorted.
    function getNonOverlapping(p, overlapType){
        var overlaps, nonOverlaps = [], lastEnd=0, currEnd=0;
        var endOfOverlapSection = 0, endOfBorder;
        if (overlapType === 'top'){
            overlaps = p.topOverlaps;
            endOfBorder = p.right - p.left;
        } else if ( overlapType === 'bottom' ) {
            overlaps = p.bottomOverlaps;
            endOfBorder = p.right - p.left;
        } else if ( overlapType === 'left' ) {
            overlaps = p.leftOverlaps;
            endOfBorder = p.bottom - p.top;
        } else if ( overlapType === 'right' ) {
            overlaps = p.rightOverlaps;
            endOfBorder = p.bottom - p.top;
        }
        $.each( overlaps , function(idx, overlap){
            var overlapStart = overlap[0];
            var overlapEnd = overlap[1];
            
            // add non overlap:
            if( overlapStart > endOfOverlapSection ){
                nonOverlaps.push([endOfOverlapSection, overlapStart]);
            }
            // extend overlap section if we need to:
            if( overlapEnd > endOfOverlapSection ){
                endOfOverlapSection = overlapEnd;
            }
        });
        // See if there is one more non-overlap after overlaps:
        if (endOfOverlapSection < endOfBorder){
            nonOverlaps.push([ endOfOverlapSection, endOfBorder]);
        }
        return nonOverlaps;
    }

    function findCorners(){
        // ...todo 
    }


    // overlappingElements needs a better name //
    
    function drawAllBorders(that){
        $.each(that.overlappingElements, function(idx,p){
            drawBorder(p);
        });
    }

    // For each element, draw its non overlapping borders
    // relative to itself:
    // todo: Use one DRY collection for non over-laps
    function drawBorder(p){
        console.log('draw border');
        $.each(p.topNonOverlaps, function(idx,nonoverlap){
            _addBorder(p, nonoverlap, 'top');
        });
        $.each(p.bottomNonOverlaps, function(idx,nonoverlap){
            _addBorder(p, nonoverlap, 'bottom');
        });
        $.each(p.leftNonOverlaps, function(idx,nonoverlap){
            _addBorder(p, nonoverlap, 'left');
        });
        $.each(p.rightNonOverlaps, function(idx,nonoverlap){
            _addBorder(p, nonoverlap, 'right');
        });
    }
    // Adds a div that creates a border at the given position 
    function _addBorder(p, nonoverlap, borderType){
        var ptop, pbottom, pleft, pright, pwidth, pheight, styleStr;
        if(borderType === 'top'){
            ptop = 0;
            pheight = 1; // ?
            pleft = nonoverlap[0];
            pwidth = nonoverlap[1]-nonoverlap[0];
        } else if ( borderType ==='bottom' ){
            pbottom = 0;  
            pheight = 1; // ?
            pleft = nonoverlap[0];
            pwidth = nonoverlap[1]-nonoverlap[0];
        } else if ( borderType ==='left' ){
            pleft = 0;
            pwidth = 1;
            ptop = nonoverlap[0];
            pheight = nonoverlap[1]-nonoverlap[0];
        } else if ( borderType ==='right' ){
            pright = 0;
            pwidth = 1;
            ptop = nonoverlap[0];
            pheight = nonoverlap[1]-nonoverlap[0];
        }
        styleStr = "position: absolute; background-color: blue;";
        if (typeof pheight !== 'undefined'){
            styleStr += "height: " + pheight + "px;";
        }
        if (typeof pwidth !== 'undefined'){
            styleStr += "width: " + pwidth + "px;";
        }
        if (typeof ptop !== 'undefined'){
            styleStr += "top: " + ptop + "px;";
        }
        if (typeof pbottom !== 'undefined'){
            styleStr += "bottom: " + pbottom + "px;";
        }
        if (typeof pleft !== 'undefined'){
            styleStr += "left: " + pleft + "px;";
        }
        if (typeof pright !== 'undefined'){
            styleStr += "right: " + pright + "px;";

        }
        $('<div/>', {
            class: "brdr",
            style: styleStr,
        }).appendTo($(p.el));
    }


    function createBorderElements(){
        // todo
        
    }

    // -- Helpers --

    // Checks if integer x is between a and b
    function isBetween(x,a,b){
        if( (x >= a) && (x <= b) ){
            return true;
        } else {
            return false;
        }
    }
    // Determine if p1 overlaps p2
    function comparePos(p1, p2){
        // overlap horizontally?
        if( isBetween(p1.left, p2.left, p2.right)  ||
            isBetween(p1.right, p2.left, p2.right) ){
            // vertically?
            if( isBetween(p1.top, p2.top, p2.bottom)  ||
                isBetween(p1.bottom, p2.top, p2.bottom) ){
                return true;
            }
        }
        return false;
    }

    // return Jagged function:
    return function(className){
       
        this.elements=[]; 
        this.options=[];
        var that = this;
        var __construct__ = function(args){
            // get elements:
            that.elements = document.getElementsByClassName(className);
            // find overlaps:
            that.overlappingElements = getOverlappingElements(that.elements);
            // populate options:
            if(typeof args !== 'undefined'){
                for(var i = 1; i< args.length; i++){
                    that.options.push(args[i]);
                }
            }
        }(arguments);

        this.styleBorders = function(style, cornerRadius){
            drawAllBorders(that);
            //console.log("comparepos: " + comparePos(10,1));
            
        };

    }

}(jQuery));


