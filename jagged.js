
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

var Jagged = (function(){

    // store the elements in the module
    var els = document.getElementsByClassName(className);
    
    // Find overlapping elements:
    function getOverlapping(){
        for(i=0; i< els.length; i++){
            
        }
    }

    return function(className){
        
        this.overlappingEls = getOverlapping(className),
        

        this.border = function(style){
             
        },

        return this;
    }

}());





