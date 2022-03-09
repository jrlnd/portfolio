/* eslint-disable @next/next/no-img-element */
import { Tween } from "react-gsap"
import { Element } from "react-scroll"
import { Controller, Scene } from "react-scrollmagic"

const DesignPortfolio = ({ projectData, setImages, setIsLightBoxOpen  }) => {


  const openLightBox = (images) => {
    setImages(images)
    setIsLightBoxOpen(true)
  }

  return (
    <Element id="design-portfolio" name="design-portfolio" className="md:min-h-screen flex items-center justify-center bg-theme-red-600 text-theme-white-100 pt-8 md:pt-24 pb-36 md:pb-64 overflow-hidden">
    <div className="w-full max-w-screen-xl flex flex-col items-center px-8 2xl:px-0">
      <Controller>
        
        <Scene triggerElement="#des-portfolio-title" triggerHook={0.95} duration={400}>
          {(progress) => (
            <Tween from={{ autoAlpha: 0, y: '-50%' }} ease="back.out(1.7)" stagger={0.9} totalProgress={progress} paused>
              <h1 id="des-portfolio-title" className="font-display uppercase text-3xl sm:text-4xl md:text-6xl lg:text-8xl mb-1 md:mb-4">Designs</h1>
              <h2 className="font-light text-lg md:text-xl lg:text-2xl space-y-1 mb-2 md:mb-8 text-center">
                Besides websites, I also enjoy designing logos, user interfaces, mobile apps, and other marketing materials.
              </h2>
            </Tween>
          )}
        </Scene>

        <div id="design-projects-content" className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-theme-gray-900">
        <Scene duration={500} triggerElement="#design-projects-content" triggerHook={0.8}>
          {(progress) => (
          <Tween from={{ autoAlpha: 0, transform: 'scale(0.8)' }} to={{ autoAlpha: 1, transform: 'scale(1)' }} stagger={0.4} totalProgress={progress} ease="back.out(1.7)" paused>
          {projectData.map((project, i) => (
            <div key={i} className="group relative bg-gray-900 w-full rounded-lg aspect-square overflow-hidden">
              <button onClick={() => openLightBox(project.screenshotsCollection.items)}>
                <img src={project.screenshotsCollection.items[0].url} alt={project.title} className="h-full object-cover" />
                <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center text-theme-white-100 p-4 md:p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h5 className="absolute top-4 text-sm uppercase tracking-[0.5em]">{project.type}</h5>
                  <h3 className="font-display text-2xl md:text-3xl text-center">{project.title}</h3>
                </div>
              </button>
            </div>
          ))}
          </Tween>
          )}
        </Scene>
        </div>


      </Controller>
    </div>
    </Element>
  )
}
export default DesignPortfolio