import suitnames from "suitnames"
import parseTag from "virtual-hyperscript/parse-tag"
import { contains, curry, type } from "ramda"

let isChildren = x => {
  return contains(type(x), ["String", "Number", "Array"])
}

let eachKey = (fn, obj) => !!obj ? Object.keys(obj).forEach(fn) : null

let hx = (pragma, styles, componentOrTag, properties = {}, children) => {
  // If a child array or text node are passed as the second argument, shift them
  if (!children) {
    if (isChildren(properties)) {
      children = properties
      properties = {}
    } else {
      children = []
    }
  }

  // Supported nested dataset attributes
  eachKey(attrName => {
    let dashedAttr = attrName.replace(/([a-z])([A-Z])/, match => {
      return match[0] + "-" + match[1].toLowerCase()
    })
    properties[`data-${dashedAttr}`] = properties.dataset[attrName]
  }, properties.dataset)

  // Support nested attributes
  eachKey(attrName => {
    properties[attrName] = properties.attributes[attrName]
  }, properties.attributees)

  // When a selector, parse the tag name and fill out the properties object
  let outProps = {}
  if (type(componentOrTag) === "String") {
    componentOrTag = parseTag(componentOrTag, outProps)
    if (styles && (outProps.className || properties.mods)) {
      outProps.className = suitnames.call(styles, outProps.className.split(" "), properties.mods)
    }
  }
  if (properties.mods) {
    delete properties.mods
  }

  let classes = [properties.className, outProps.className];
  properties.className = classes.join(" ").trim()
  if (!properties.className && properties.hasOwnProperty('className')) {
    delete properties.className
  }

  // Create the element
  return pragma(componentOrTag, properties, children)
}

export default curry(hx)
