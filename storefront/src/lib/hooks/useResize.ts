import { useEffect, useState } from "react"

interface Size {
  width: number | undefined
  height: number | undefined
}

const useResize = (): Size => {
  const [size, setSize] = useState<Size>({
    width: undefined,
    height: undefined,
  })

  function handleResize() {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      handleResize()
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return size
}

export default useResize
