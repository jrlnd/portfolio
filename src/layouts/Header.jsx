// @refresh reset
import { useEffect } from 'react'
import { Controller, Scene } from 'react-scrollmagic'
import { gsap } from 'gsap/dist/gsap'
import { Tween } from 'react-gsap'

import { ExclamationCircleIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { Portrait } from '../components'



const Header = ({setDialogOpen}) => {
 
  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo('#greeting', { autoAlpha: 0, x: '-15%'}, {autoAlpha: 1, x: 0, duration: 1, delay: 5})
    tl.fromTo('#intro-title', { autoAlpha: 0, x: '-15%'}, {autoAlpha: 1, x: 0, duration: 1, }, "<25%")
    tl.fromTo('#intro-subtitle', { autoAlpha: 0, x: '-15%'}, {autoAlpha: 1, x: 0, duration: 1}, "<25%")
    tl.fromTo('#intro-notice', { autoAlpha: 0, x: '-15%'}, {autoAlpha: 1, x: 0, duration: 1}, "<25%")
    tl.fromTo('#intro-cta', { autoAlpha: 0, x: '-15%'}, {autoAlpha: 1, x: 0, duration: 1}, "<25%")
    tl.fromTo('#caveat', { autoAlpha: 0}, {autoAlpha: 1, duration: 1}, "<25%")
  }, [])

  return (
    <header className="relative min-h-screen flex items-center justify-center py-16">
      <div className="flex w-full max-w-screen-2xl px-4 2xl:px-0 items-center justify-between flex-col md:flex-row">
        
        <div id="header-left" className="order-2 text-center md:text-left lg:order-1 text-theme-white-100 z-10">
          
          <Controller>
            <Scene triggerElement="#header-left" duration="50%" triggerHook="0.2">
              {(progress) => (
                <Tween to={{ autoAlpha: 0, transform: "translateX(-15%)" }} stagger={0.25} ease="back.out(1.7)" totalProgress={progress} paused>
                  
                  <div id="greeting" className="-mb-6 mt-4 md:mt-0 md:-mb-9 lg:-mb-14 font-cursive text-7xl sm:text-8xl lg:text-[10rem] xl:text-[11rem] text-theme-white-100/10"> Hello </div>
                  <h1 id="intro-title" className="md:text-3xl lg:text-5xl mb-1 md:mb-4 font-display font-semibold text-xl">My name is JR Rolando</h1>
                  <h2 id="intro-subtitle" className="text-md sm:text-lg md:text-2xl lg:text-4xl font-light mb-4 md:mb-8">
                    I&rsquo;m a <span className="font-semibold">front-end developer</span> + <span className="relative font-serif italic">designer. <span id="caveat" className="absolute -top-2.5 -right-2.5 md:-top-3.5 md:-right-3.5 lg:-top-2.5 lg:-right-2.5 font-cursive2 font-normal text-sm md:text-xl rotate-6 text-theme-white-100/20">(occasionally)</span></span> 
                  </h2>
                  <div className="flex flex-col items-center md:items-start space-y-2 md:space-y-4">
                    <h3 id="intro-notice" className="flex flex-col sm:flex-row items-center space-x-2 md:text-lg lg:text-xl">
                      <span className="flex h-6 w-6">
                        <span className="animate-ping [animation-duration:1500ms] absolute inline-flex"><ExclamationCircleIcon className="w-6 h-6 fill-theme-red-400" /></span>
                        <span className="relative inline-flex"><ExclamationCircleIcon className="w-6 h-6 fill-theme-red-400" /></span>
                      </span>
                      <span>I&rsquo;m currently looking for work opportunities</span>
                    </h3>

                    <button id="intro-cta" onClick={() => setDialogOpen(true)} className="flex items-center pl-6 p-3 border-2 border-theme-orange-500 bg-transparent rounded-full font-bold md:text-lg lg:text-xl transition-colors duration-300 hover:bg-theme-orange-500 hover:text-theme-white-100 text-theme-orange-500">
                      <span><span className="font-normal">Want to hire me?</span> Let&rsquo;s talk</span> <ChevronRightIcon className="w-5 h-5 md:w-7 md:h-7" />
                    </button>
                  
                  </div>
               
                </Tween>
              )}
            </Scene>
          </Controller>
          
          
        </div>
        <Portrait className="w-full max-w-[16rem] md:max-w-[20rem] lg:max-w-[24rem] xl:max-w-[32rem] order-1 md:order-2 z-10" />
      </div>
    </header>
  )
}

export default Header
