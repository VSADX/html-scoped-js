/** @type {HTMLElement[]} */
const elements_named = []
/** @type {HTMLElement[]} */
const elements_event = []

start()

/** 
 * @param {() => Object} exports
 * @returns {{[x: string]: HTMLInputElement}}
 */
export function scope(exports) {
    elements_event.shift().forEach(eventer => eventer.exports = exports)
    return elements_named.shift()
}

function start() {
    document.querySelectorAll("script[scoped]").forEach(script => {
        const parent = script.parentElement
        {
            const obj = {}
            parent.querySelectorAll("[idx]").forEach(named => {
                const name = named.getAttribute("idx")
                if(name) obj[name] = named
            })
            elements_named.push(obj)
        }
        {
            const eventers = parent.querySelectorAll("[evx]")
            elements_event.push(eventers)
            eventers.forEach(eventer => {
                const event_names = eventer.getAttributeNames().filter(attr => attr.startsWith("on"))
                event_names.forEach(attr => {
                    eventer.setAttribute(attr, `with(exports()){${eventer.getAttribute(attr)}}`)
                })
            })
        }
    })
}
