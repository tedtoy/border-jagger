border-jagger
===============

Create non-overlapping borders around overlapping html elements

![Jagged Elements](http://i.imgur.com/QcARcDz.png)


```html
<style>
    div.testme {
        background-color: #FA8072;
        position: absolute;
        padding: 50px 10px 0px 10px;
        background-image:url("example-background.jpg");
        font-family: "Goudy Bookletter 1911", sans-serif;
        text-align: center;
    }
</style>

<div style="width: 200px; height: 200px; top: 100px; left: 100px; " 
     class="testme">
    div1
</div>
<div style="width: 200px; height: 200px; top: 200px; left:200px; " 
     class="testme">
    div2
</div>
<div style="width: 200px; height: 270px; top: 300px; left: 400px;" 
     class="testme">
    div3
</div>

```

```javascript
Jag = new Jagged('testme', 
  [
    "-moz-box-shadow: 0px 0px 8px blue;",
    "-webkit-box-shadow: 0px 0px 8px blue;",
    "box-shadow: 0px 0px 8px blue;"
  ]
);
Jag.styleBorders({
    'color': '#8A2BE2',
    'width': '2' // pixels
});
```


