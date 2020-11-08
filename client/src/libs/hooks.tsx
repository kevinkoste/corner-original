import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  createRef,
} from 'react'

const getWidth = (): number => {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  )
}

const useCurrentWidth = (timeout: number = 150) => {
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
      window.removeEventListener('resize', resizeListener)
    }
  }, [timeout])

  return width
}

export const useMobile = (breakpoint: number = 768) => {
  const [mobile, setMobile] = useState<boolean>(true)

  let width = useCurrentWidth()

  useEffect(() => {
    if (width <= breakpoint && !mobile) {
      setMobile(true)
    } else if (width > breakpoint && mobile) {
      setMobile(false)
    }
  }, [width, breakpoint, mobile])

  return mobile
}

export const usePrevious = (value: any) => {
  const prevRef = useRef<any>()

  useEffect(() => {
    prevRef.current = value
  }, [value])

  return prevRef.current
}

export const useRect = (): [React.RefObject<HTMLDivElement>, DOMRect] => {
  const ref = createRef<HTMLDivElement>()
  const [rect, setRect] = useState<DOMRect>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    right: 0,
    bottom: 0,
    toJSON: () => {},
  })

  const getRect = () => {
    window.requestAnimationFrame(() => {
      if (ref.current) {
        setRect(ref.current.getBoundingClientRect())
      }
    })
  }

  useLayoutEffect(() => {
    getRect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    window.addEventListener('resize', getRect)
    window.addEventListener('scroll', getRect)

    return () => {
      window.removeEventListener('resize', getRect)
      window.removeEventListener('scroll', getRect)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])

  return [ref, rect]
}
