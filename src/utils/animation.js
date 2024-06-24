import gsap from "gsap"
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

export const animateWithGsap = (target , animationProps , scrollProps) => {
    gsap.to(target , {
        ...animationProps,
        scrollTrigger : {
            trigger:target ,
            toggleActions : 'restart reverse restart reverse',
            start: 'top 85%',
            ...scrollProps,
        }
    })
}


export const animateWithGsapTimeline = (timelinie , rotationRef , rotationState , firstTarget , secondTarget , animationProps) => {
    timelinie.to(rotationRef.current.rotation , {
        y:rotationState,
        duration: 1,
        ease: 'power2.inOut'
    })

    timelinie.to(firstTarget , {...animationProps , ease: 'power2.inOut'},'<')

    timelinie.to(secondTarget , {...animationProps , ease: 'power2.inOut'},'<')

}