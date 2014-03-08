jagged-elements
===============

Create non-overlapping borders around overlapping html elements

```html
<style>
    div.testme {
        background-color: #ddd;
        position: absolute;
        padding: 10px;
        border: 1px dashed #999;
    }
</style>
<div style="width: 200px; height: 200px; top: 100px; left: 100px;" class="testme">    div1    </div>
<div style="width: 200px; height: 200px; top: 200px; left:200px; " class="testme">    div2    </div>
<div style="width: 200px; height: 270px; top: 300px; left: 400px;" class="testme">    div3    </div>
```


```javascript
Jag = new Jagged('testme');
Jag.styleBorders({
    'color': '#483D8B',
    'width': '3' // pixels
});
```

![Jagged Elements](http://i.imgur.com/k6O8LxG.png)


