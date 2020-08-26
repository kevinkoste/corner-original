// base imports
import { useState, useEffect } from 'react'

const getWidth = () => window.innerWidth 
  || document.documentElement.clientWidth 
  || document.body.clientWidth

const useCurrentWidth = ( timeout=150 ) => {
  // save current window width in the state object
  let [width, setWidth] = useState(getWidth())

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId: number
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId)
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => setWidth(getWidth()), timeout)
    }
    // set resize listener
    window.addEventListener('resize', resizeListener)

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener('resize', resizeListener)
    }
  }, [timeout])

  return width
}

export const useDetectMobile = ( breakpoint=960 ) => {

  const [mobile, setMobile] = useState(true)

  let width = useCurrentWidth()

  useEffect(() => {
    if (width <= breakpoint && !mobile) {
      setMobile(true)
    } else if (width > breakpoint && mobile){
      setMobile(false)
    }
  }, [width, breakpoint, mobile])

  return mobile
}

