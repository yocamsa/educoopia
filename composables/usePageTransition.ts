import { gsap } from 'gsap'

export const usePageTransition = (target: Ref<HTMLElement | null>) => {
  let ctx: gsap.Context | undefined

  onMounted(() => {
    if (!target.value) return
    ctx = gsap.context(() => {
      gsap.from(target.value, {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out'
      })
    }, target.value)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
