# html-scoped-js
  
```html
    <section>
        <h1 idx="title">Hello, world!</h1>
        <p evx onmouseover="thing(r)">
            Scoped JS
        </p>
        <button evx onclick="add()">Add to r</button>

        <script type="module" scoped>
            import { scope } from "./html-scoped-js.js"

            const { title } = scope(() => 
                ({thing, r, add}))

            const thing = (num) => console.log("r: ", num)
            
            const add = () => r++
            
            let r = 4
        </script>
    </section>
```
  
+ HTML Scoped JS runs `document.getElementById` automatic for you.
+ Why `idx="my_id"`?
+ No elements can have the same `id=""` in HTML.
+ Elements can have the same `idx=""` as long as each is in own "scope".
  
+ What is this for?
+ Code can be way shorter.
+ No global variables means reusing variable names.
+ Shorter variable names!
+ `onclick=""` or on* functions also use 0 globals.
  
What to remember?
1. Scoped elements use `idx="the_name_you_want"`.
2. You import the function `scope` from this lib to use the scoped elements.
3. If you want scoped event handlers like `onclick` add `evx` to the element
`<p onclick="console.log('hi')" evx>Hello!</p>`
