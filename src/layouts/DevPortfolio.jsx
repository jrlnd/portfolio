/* eslint-disable @next/next/no-img-element */
import { Tween } from "react-gsap"
import { animateScroll, Element } from "react-scroll"
import { Controller, Scene } from "react-scrollmagic"

import { ExternalLinkIcon, PhotographIcon } from "@heroicons/react/solid"

import { GithubIcon } from "../components/icons"


const Portfolio = ({ projectData, setImages, setIsLightBoxOpen  }) => {

  const openLightBox = (images) => {
    setImages(images)
    setIsLightBoxOpen(true)
  }
  
  return (
    <Element id="portfolio" name="portfolio" className="flex items-center justify-center bg-gradient-to-b from-theme-orange-500 to-theme-red-600 text-theme-gray-900 py-4 md:py-20 overflow-hidden">
      
      <div className="w-full max-w-screen-2xl flex flex-col items-center space-y-4 px-8 2xl:px-0">
      <Controller>
      
        <Scene triggerElement="#portfolio-title" triggerHook={0.95} duration={400}>
          {(progress) => (
            <Tween from={{ autoAlpha: 0, y: '-50%' }} ease="back.out(1.7)" totalProgress={progress} paused>
              <h1 id="portfolio-title" className="font-display uppercase text-3xl sm:text-4xl md:text-6xl lg:text-8xl mb-1 md:mb-4">Portfolio</h1>
            </Tween>
          )}
        </Scene>

        <div className="space-y-16">
          {projectData.map((project, i) => (
            <div key={i} id={`project-${i}`} className="w-full grid grid-cols-1 lg:grid-cols-5 gap-y-8 lg:gap-y-0 lg:gap-x-8">
            <Scene triggerElement={`#project-${i}`} triggerHook={0.85} duration={500}>
              {(progress) => (
                <Tween from={{ autoAlpha: 0, x: i % 2 === 0 ? '-10%' : '10%' }} stagger={0.75} ease="back.out(1.7)" totalProgress={progress} paused>
                  <div className={`lg:col-span-3 order-1 ${i % 2 === 0 && "lg:order-2"}`}>
                    <div className="w-full rounded-lg overflow-hidden">
                      <div className="h-10 px-3 bg-theme-white-200 hidden sm:flex w-full items-center justify-between space-x-3">
                        <div className="flex-none space-x-1.5">
                          <span className="w-3 aspect-square rounded-full bg-red-500 inline-block"></span>
                          <span className="w-3 aspect-square rounded-full bg-yellow-500 inline-block"></span>
                          <span className="w-3 aspect-square rounded-full bg-green-500 inline-block"></span>
                        </div>
                        <div className="w-full bg-white px-3 py-1.5 rounded-lg text-xs text-center">
                          {project.title === "JRLND Portfolio" ? (
                            <button onClick={animateScroll.scrollToTop}>{project.previewUrl}</button>
                          ) : (<a href={project.previewUrl} target="_blank" rel="noreferrer noopener">{project.previewUrl}</a>)}
                        </div>
                        <div className="flex-none space-x-1.5 flex items-center">
                          <button onClick={() => openLightBox(project.screenshotsCollection.items)}>
                            <PhotographIcon className="w-6 fill-theme-gray-500 transition-colors duration-300 hover:fill-theme-gray-900" />
                          </button>
                          {project.title === "JRLND Portfolio" ? (
                            <button onClick={animateScroll.scrollToTop}>
                              <ExternalLinkIcon className="w-6 fill-theme-gray-500 transition-colors duration-300 hover:fill-theme-gray-900" />
                            </button>
                          ) : (
                            <a href={project.previewUrl} target="_blank" rel="noreferrer noopener">
                              <ExternalLinkIcon className="w-6 fill-theme-gray-500 transition-colors duration-300 hover:fill-theme-gray-900" />
                            </a>
                          )}
                          
                          <a href={project.githubUrl} target="_blank" rel="noreferrer noopener"><GithubIcon className="w-5 fill-theme-gray-500 transition-colors duration-300 hover:fill-theme-gray-900" /></a>
                        </div>
                      </div>
                      <div className="w-full aspect-video overflow-hidden bg-theme-gray-900">
                        <button onClick={() => openLightBox(project.screenshotsCollection.items)}>
                          <img key={i} src={project.screenshotsCollection.items[0]?.url || ""} className="w-full transition duration-300 hover:opacity-25" alt={project.screenshotsCollection.items[0]?.name || ""} />
                        </button>
                      </div>
                      

                      
                    </div>
                  </div>

                  <div className={`lg:col-span-2 order-2 ${i % 2 === 0 && "lg:order-1"} flex flex-col justify-center space-y-4`}>
                    <div className="flex items-center justify-between space-x-1.5 md:space-x-3">
                      {project.title === "JRLND Portfolio" ? (
                        <button onClick={animateScroll.scrollToTop}><h2 className="font-bold sm:font-display text-2xl sm:text-3xl md:text-4xl ">{project.title}</h2></button>
                       ) : (
                        <a href={project.previewUrl} target="_blank" rel="noreferrer noopener"><h2 className="font-bold sm:font-display text-2xl sm:text-3xl md:text-4xl">{project.title}</h2></a>
                       )}
                      <div className="flex items-center justify-end space-x-1.5 md:space-x-3">
                        <button onClick={() => openLightBox(project.screenshotsCollection.items)}>
                          <PhotographIcon className="w-5 md:w-7 fill-theme-gray-900 transition-colors duration-300 hover:fill-theme-white-100" />
                        </button>
                        {project.title === "JRLND Portfolio" ? (
                          <button onClick={animateScroll.scrollToTop}>
                            <ExternalLinkIcon className="w-6 md:w-8 fill-theme-gray-900 transition-colors duration-300 hover:fill-theme-white-100" />
                          </button>
                        ) : (
                          <a href={project.previewUrl} target="_blank" rel="noreferrer noopener">
                            <ExternalLinkIcon className="w-6 md:w-8 fill-theme-gray-900 transition-colors duration-300 hover:fill-theme-white-100" />
                          </a>
                        )}
                        
                        <a href={project.githubUrl} target="_blank" rel="noreferrer noopener"><GithubIcon className="w-5 md:w-7 fill-theme-gray-900 transition-colors duration-300 hover:fill-theme-white-100" /></a>
                      </div>
                    </div>
                    <p className="text-sm md:text-base">
                      {project.description}
                    </p>
                    {project.hasDemo && (<p className="text-sm md:text-base">
                      To preview a demo, use this account to sign in: <br />
                      <span className="font-bold">Email: </span> {project.demoEmail} <br />
                      <span className="font-bold">Passsword: </span> {project.demoPassword}
                    </p>)}
                    
                    <div className="text-xs md:text-sm font-mono space-x-4 space-y-2">
                      {project.techStack.map((item, i) => (
                        <span key={i} className="rounded-full inline-block">{item}</span>
                      ))}
                    </div>
                  </div>

                </Tween>
              )}
            </Scene>
            
            
            </div>
          ))}
        </div>
        </Controller>

      </div>
    </Element>
  )
}
export default Portfolio
