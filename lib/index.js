import classnames from "@bruitt/classnames"
import parseTag from "parse-sel"
import contains from "ramda/src/contains"
import curry from "ramda/src/curry"
import type from "ramda/src/type"

let isChildren = (x) => {
  return contains(type(x), [ "String", "Number", "Array" ])
}

let eachKey = (fn, obj) => (!!obj ? Object.keys(obj).forEach(fn) : null)

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

  // When a selector, parse the tag name and fill out the properties object
  let outProps = {}
  if (type(componentOrTag) === "String") {
    let s = parseTag(componentOrTag)
    componentOrTag = s.tagName
    outProps = { id: s.id, className: s.className }

    if (styles && (outProps.className || properties.mods)) {
      outProps.className = classnames(styles,
                                      outProps.className.split(" "),
                                      properties.mods)
    }
  } else if (styles && properties.mix) {
    outProps.className = classnames(styles, properties.mix)
  }

  if (properties.mods) {
    delete properties.mods
  }
  if (properties.mix) {
    delete properties.mix
  }

  let classes = [ properties.className, outProps.className ]
  properties.className = classes.join(" ").trim()
  if (!properties.className && properties.hasOwnProperty("className")) {
    delete properties.className
  }

  // Create the element
  return pragma.apply(undefined, [ componentOrTag, properties ].concat(children))
}

export default curry(hx)
