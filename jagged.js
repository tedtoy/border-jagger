
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
     - Currently, the border gets drawn inside an element,
       but there should be options to draw on the outside of
       the element or offset the border to be in the middle
       of the outside and inside, if that makes sense.
     - Shadows.
     - Only border specific sides.
     - Have text and inline elements
       within bordered areas wrap around 
       overlapping elements.


       getOverlappingElements
        --> identifyOverlappingBorders
        --> identifyNonOverlappingBorders

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
                'right':  elPos.left + el.outerWidth(),
                'top':    elPos.top,
                'bottom': elPos.top + el.outerHeight(),
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
        // Determine overlaps. O(n^2) is the best I can do.
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
    // Finds the inverse of the overlapping portions for an element.
    // todo: needs to be more DRY
    function getNonOverlapping(p, overlapType){
        var overlaps, 
            nonOverlaps = [], 
            lastEnd=0, 
            currEnd=0,
            endOfOverlapSection = 0, 
            endOfBorder;
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
            var overlapStart = overlap[0],
                overlapEnd = overlap[1],
                borderStart = endOfOverlapSection,
                borderEnd = overlapStart,
                adjustStart = false,
                adjustEnd = false;
            // add non overlap:
            if( overlapStart > endOfOverlapSection ){
                console.log(borderStart)
                if(borderStart !== 0){
                    adjustStart = true;
                }
                if(borderEnd !== endOfBorder){
                    adjustEnd = true;
                }
                nonOverlaps.push([borderStart, borderEnd, adjustStart, adjustEnd]);
            }
            // extend overlap section if we need to:
            if( overlapEnd > endOfOverlapSection ){
                endOfOverlapSection = overlapEnd;
            }
        });
        // See if there is one more non-overlap after overlaps:
        if (endOfOverlapSection < endOfBorder){
            var borderStart = endOfOverlapSection,
                borderEnd = endOfBorder,
                adjustStart = false,
                adjustEnd = false;
            if(borderStart !== 0){
                adjustStart = true;
            }
            if(borderEnd !== endOfBorder){
                adjustEnd = true;
            }
            nonOverlaps.push([ borderStart, borderEnd, adjustStart, adjustEnd]);
        }
        return nonOverlaps;
    }

    function findCorners(){
        // ...todo 
    }


    // overlappingElements needs a better name //
    function drawAllBorders(that){
        $.each(that.overlappingElements, function(idx,p){
            drawBorder(that, p);
        });
    }
    // For each element, draw its non overlapping borders
    // relative to itself:
    // todo: Use one DRY collection for non over-laps
    function drawBorder(that, p){
        $.each(p.topNonOverlaps, function(idx,nonoverlap){
            _addBorder(that, p, nonoverlap, 'top');
        });
        $.each(p.bottomNonOverlaps, function(idx,nonoverlap){
            _addBorder(that, p, nonoverlap, 'bottom');
        });
        $.each(p.leftNonOverlaps, function(idx,nonoverlap){
            _addBorder(that, p, nonoverlap, 'left');
        });
        $.each(p.rightNonOverlaps, function(idx,nonoverlap){
            _addBorder(that, p, nonoverlap, 'right');
        });
    }
    // Adds a div that creates a border at the given position 
    // todo: that's a lot of ugly if statements!
    function _addBorder(that, p, nonoverlap, borderType){
        var ptop, pbottom, pleft, pright, pwidth, pheight, styleStr;
        var borderWidth = that.styleOptions['width'];
        var borderColor = that.styleOptions['color'];
        
        // todo: i am in the process of adding the border adjustments
        // and somewhat DRYing out the codebase. but its still a little ugly.
        if(borderType === 'top' || borderType === 'bottom'){
            if(borderType === 'top') ptop = 0;
            if(borderType === 'bottom') pbottom = 0;
            pheight = borderWidth; 
            pleft = nonoverlap[0];
            pwidth = nonoverlap[1]-nonoverlap[0];
            // add adjustment for non-end borders:
            if(nonoverlap[2]){
                pleft = pleft - borderWidth;
            }   
            if(nonoverlap[3]){
                pwidth = parseInt(pwidth) + parseInt(borderWidth);
            }   
        } else if ( borderType ==='left' || borderType === 'right' ){
            if(borderType === 'left') pleft = 0;
            if(borderType === 'right') pright = 0;
            pwidth = borderWidth;
            ptop = nonoverlap[0];
            pheight = nonoverlap[1]-nonoverlap[0];
            // add adjustment for non-end borders:
            if(nonoverlap[2]){
                ptop = ptop - borderWidth;
            }   
            if(nonoverlap[3]){
                pheight = parseInt(pheight) + parseInt(borderWidth);
            }   
        }
        styleStr = "position: absolute; background-color: " + borderColor + ";";
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

        this.styleBorders = function(styleOptions){
            that.styleOptions = styleOptions;
            drawAllBorders(that);
        };

    }

}(jQuery));


