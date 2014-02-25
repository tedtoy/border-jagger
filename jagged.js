
// ---------------------------------------------------------
// This is a library that uses javascript to create seamless
// borders around overlapping html elements to make a set of 
// elements appear as if they shared one common border.
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
// This was just a quick idea I had and I was surprised to
// see that no one seems to have tackled this problem yet.
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
// ToDo's:
//     - Ability to round corners.
//     - Shadows.
//     - Only border specific sides.
//     - Have text and inline elements.
//       within bordered areas wrap around 
//       overlapping elements.
// --------------------------------------------------------

var Jagged = (function($){

    // For each element A, finds all overlapping elements
    // and stores the resulting array as an attribute of A.
    function getOverlappingElements(className){
        var elems = document.getElementsByClassName(className);
        var positionEls = [];
        // Save positions in allPos:
        for(var i=0; il=elems.length; i< il; i++){
            var el = $(all[i]);
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
                'bottomOverlaps': []
            });
        }
        // Determine overlaps. n^2 is the best I can do.
        for(var a=0; al=positionEls.length; a< al; a++){
            for(var b=0; b< al; b++){
                if( comparePos(positionEls[a], positionEls[b]) ){
                    a.overlapsWith.push(positionEls[b]);
                }
            }
            getExposedBorders(a);
        }
        return positionEls;
    }

    function getExposedBorders(p){
        // 1. First find the overlapping portions of p's edges:
        for(var a=0; l = p.overlapsWith.length; a<l; a++){
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
        // 2. Find the non-overlapping portions:
        var allOverlaps = [p.topOverlaps, p.bottomOverlaps, p.leftOverlaps, p.rightOverlaps];
        $.each( allOverlaps , function(idx, overlaps){
            $.each( overlaps, function(idx2, o){
                // saving work..
            });
        });
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

    return function(className){
        
        this.overlappingElements = getOverlappingElements(className);
        

        this.border = function(style){
             console.log("border");
             console.log(style);
        };

        //return this;
    }

}(jQuery));





