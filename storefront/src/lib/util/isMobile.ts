export const isMobile = () => {
  let window: { navigator?: string } = {}
  let isMob = false

  const userAgent =
    typeof window?.navigator === "undefined" ? "" : navigator.userAgent
  const mobile = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  )
  isMob = mobile

  return isMob
}
