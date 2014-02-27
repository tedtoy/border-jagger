
// ---------------------------------------------------------
// Create seamless borders around overlapping html elements 
// to make them appear as if they shared one common border.
//
// For example:
//
// |````````|
// |  div1  |                      |```````````````````````|
// |        `````````````|         |    A                  |
// |                     ``````|   |              B        |
// `````|     div2             |   `````````|              | 
//      |                      |            |              |
//      |              div3    |            ```````````````` 
//      ``````````|            |   |`````|
//                |            |   |  C  |
//                ``````````````   |     |
//                                 ```````
//
// For now the implementation will be based on css classes.
// eg: 
//    new Jagged('my-class').border('1px solid #999');
// 
//    var ducks = new Jagged('ducks');
//    ducks.border('1px solid red');
//     .. do stuff
//    ducks.border('1px solid blue'); 
//
//  With options:
//    var ducks = new Jagged('ducks', 'bottom', 'left')
//    ducks.border('1px solid red', '4px') // 4px rounded corners
//    
//
//
// ToDo's:
//     - Ability to round corners.
//     - Shadows.
//     - Only border specific sides.
//     - Have text and inline elements.
//       within bordered areas wrap around 
//       overlapping elements.
//
// Oh man, why... I have found a much, much 
// simpler way to do it      
// --------------------------------------------------------

var Jagged = (function($){

    // For each element A, finds all overlapping elements
    function getOverlappingElements(className){
        var elems = document.getElementsByClassName(className);
        var positionEls = [];
        // Save positions in allPos:
        for(var i=0; i< elems.length; i++){
            var el = $(elems[i]);
            var elPos = el.offset();
            positionEls.push({
                'left':   elPos.left,
                'right':  elPos.left + el.width(),
                'top':    elPos.top,
                'bottom': elPos.top + el.height(),
                'overlapsWith': [],
                // defined as vertical ranges:
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
        for(var a=0; a<positionEls.length; a++){
            for(var b=0; b< al; b++){
                if( comparePos(positionEls[a], positionEls[b]) ){
                    a.overlapsWith.push(positionEls[b]);
                }
            }
            getExposedBorders(a);
        }
       return positionEls;
    }

    function findCorners(){

    }




    function getExposedBorders(p){
        // 1. First find the overlapping portions of p's edges:
        for(var a=0; a< p.overlapsWith.length; a++){
            var p2 = p.overlapsWith[a];
            // horizontal overlapping range:
            var overlapH = [
                (p2.left <= p.left) ? 0 : p2.left - p1.left ,
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
        // 2. Find the non-overlapping portions:
        p.topNonOverlaps = getNonOverlapping(p.topOverlaps,'v');
        p.bottomNonOverlaps = getNonOverlapping(p.bottomOverlaps,'v');
        p.leftNonOverlaps = getNonOverlapping(p.leftOverlaps,'h');
        p.rightNonOverlaps = getNonOverlapping(p.rightOverlaps,'h');
        
        function getNonOverlapping(overlaps, s){
            var nonOverlaps = [];
            if (s === 'h'){
                var pEnd = p.bottom-p.top;
            } else if (s === 'v'){
                var pEnd = p.right-p.left;   
            }
            var currEnd=0;
            $.each( overlaps , function(idx, overlap){
                var thisStart = overlap[0];
                var thisEnd = overlap[1];
                if(thisStart > currEnd){
                    nonOverlaps.push([currEnd, thisStart]);
                }
                if(thisEnd > currEnd){
                    currEnd = thisEnd;
                }
            });
            if (currEnd < pEnd){
                nonOverlaps.push([]);
            }
            return nonOverlaps;
        }
    }
    // Checks if integer x is between a and b
    function isBetween(x,a,b){
        if( (x >= a) && (x <= b) ){
            return true;
        } else {
            return false;
        }
    }

    

    function comparePos(p1, p2){
        // Determine if p1 overlaps p2
        var overlap = false;
        // overlap horizontally?
        if( (p1.left >= p2.left) && (p1.left <= p2.right) ){
            // vertically?
            if( (p1.top >= p2.top) && (p1.top <= p2.bottom) ){
                overlap = true;
            }
        }
        return overlap;
    }

    function createBorderElements(){
        
    }


    return function(className){
       
        this.elements=[]; 
        this.options=[];

        var __construct = function(that){
            that.elements = document.getElementsByClassName(className);
            if(typeof that.arguments !== 'undefined'){
                for(var i = 1; i< that.arguments.length; i++){
                    that.options.push(that.arguments[i]);
                }
            }
        }(this);



        this.overlappingElements = getOverlappingElements();
        

        this.border = function(style, cornerRadius){
             console.log("border");
             console.log(style);
        };

        //return this;
    }

}(jQuery));





