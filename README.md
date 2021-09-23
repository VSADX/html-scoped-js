# Module Scripts inside HTML
This tiny library uses JavaScript features to let you write `<script type="module">` inside your HTML files. 
Typically, variables or functions you write inside `modules` don't become global variables so your HTML can't 
see your functions. 
  
## Problem 1: Using functions from modules in HTML
  
If we tried to combine modules to normal HTML, they can't see each other. That means this won't work!
```html
<div>
    <button onclick="clickit()"> Click me, but nothing will happen :( </button>

    <script type="module">
        function clickit() {
            alert("Hello world")
        }
    </script>
</div>
```
  
<br>  
  
If we weren't using modules, this would work fine. `clickit` would be a global function, but let's fix this adding not one global variable! 
Scoped JS doesn't make your functions global, instead you give it the exact functions you want a few HTML elements to see. 
This keeps all the benefits of modules like multiple functions safely named the same, imports, top-level-await, etc.  
  
<br>  
  
### Scoped JS bridges specific elements to specific functions  
1. Notice, `evx` is added to our `<button>`
2. See how the `scope()` function receives our `clickit()` function.
3. Also, `scoped` is added to our `<script>`
```html
<div>
    <button evx onclick="clickit()"> Click me, it works! </button>

    <script type="module" scoped>
        import { scope } from "./html-scoped-js.js"

        scope(() => ({ clickit }))

        function clickit() {
            alert("Hello world")
        }
    </script>
</div>
```
  
<br>  
  
### When to add `evx`
Adding the HTML attribute `evx` tells ScopedJS to allow that element to see all the functions (or variables) 
that are part of your "scope", all that you send to the `scope()` function.
  
<br>  
  
### What exactly is a "scope" / What does `scoped` do?
When you add `scoped` to your `<script type="module">`, that tells ScopedJS to create an HTML scope. 
The parent element of your script (in our example it's a `div`) will share whatever is passed to the `scope()` 
function to any child element that has the `evx` attribute.
  
<br>  
  
### The `scope()` function
Since `evx` is our bridge that signs up HTML elements to have access to parts of our module, `scope()` is the 
bridge that signs up what parts of our module we want to share by our HTML! 
  
Functions or variables can be shared, let's see:
```html
<p>
    Everything was fine... <span evx onclick="go(text[0])"> until </span> <br>
    We thought we were... <span evx onclick="go(text[1])"> safe </span>

    <script type="module" scoped>
        import { scope } from "./html-scoped-js.js"
        scope(() => ({ go, text }))

        const text = ["we weren't", "goners"]
        function go(message) {
            alert(message)
        }
    </script>
</p>
```
  
<br>  
  
## Problem 2: Referencing specific HTML elements from modules
  
Modules are reusable! They allow us to create a unique space where our variables can be at the "top-level", yet not 
create global variables. To reference an HTML element we might try giving it a global id (like `<p id="some-id">`). 
Scoped JS adds our favorite `module` feature to HTML elements, we can use a "scoped" id. Instead of global ids, 
scoped ids only need to be unique inside our scope (a scope is all the elements inside your script's parent element).
```html
<div>
    <p> You have <span idx="cookies"> 0 </span> cookies. </p>

    <script type="module" scoped>
        import { scope } from "./html-scoped-js.js"

        const { cookies } = scope(() => ({}))

        setTimeout(
            () => cookies.textContent = 7, // set `<span>0</span>` to contain `7`
            1000) // wait 1 second
    </script>
</div>
```
  
<br>  
  
## Complete example  
  
```html
    <section>
        <h1> Cookie count down! </h1>
        <p> Click the button when it's as close to 0 as you can. </p>
        <p> 
          Cookies: <span idx="cookies">0</span> <br>
          Timer: <span idx="timer">10</span> 
        </p>
      
        <button evx onclick="fire()">Click!</button>

        <script type="module" scoped>
            import { scope } from "./html-scoped-js.js"

            const { cookies, timer } = scope(() => ({ fire }))

            setTimeout(countdown, 1000)

            let time = 10
            let count = 0
            function countdown() {
                time--
                if(time < 0) time = 10
                timer.textContent = time
            }
            function fire() {
                const reward = 10 - time
                count += reward
                cookies.textContent = count
            }
        </script>
    </section>
```
  
<br>  
  
## Notes
  
+ HTML Scoped JS pulls the exact elements you need directly to the code snippet that uses them.
+ It uses `idx=""` instead of `id=""` so you can reuse ids or use shorter ones.
+ Elements only need to have an idx="" that isn't identically to another element in scope (possibly nice for components).
  
+ No global variables are created.
+ Editor support for `onclick`, `onmouseover`, `on*` etc.
+ Only elements that have `evx` can see the shared content from your module.  
