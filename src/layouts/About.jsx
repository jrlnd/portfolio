import Image from "next/image";
import { Element } from "react-scroll"

import emoji from 'react-easy-emoji'
import { CSS3Icon, HTML5Icon, SassIcon, JSIcon, ReactIcon, NextJSIcon, MongoDBIcon, NodeJSIcon, GitIcon, PhotoshopIcon, IllustratorIcon, FigmaIcon } from "../components/icons";
import { Controller, Scene } from "react-scrollmagic";
import { Tween } from "react-gsap";


const About = () => {

  const svgEmoji = (input) => (emoji(input, {
      baseUrl: 'https://twemoji.maxcdn.com/2/svg/',
      ext: '.svg',
      size: ''})
  )

  const classes = {
    toolIcon: 'relative group w-12 sm:w-16 h-12 sm:h-16 scale-90 hover:scale-100 transition-transform duration-500',
    toolIconBW: "absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 fill-theme-gray-900 opacity-100 group-hover:opacity-0 transition-all duration-500",
    toolIconColour: "w-12 sm:w-16 h-12 sm:h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
  }
  const tools = [
    {name: 'HTML5', icon: <HTML5Icon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'CSS3', icon: <CSS3Icon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'Sass', icon: <SassIcon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'Javascript', icon: <JSIcon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'React', icon: <ReactIcon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'Next.js', icon: <NextJSIcon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'Node.js', icon: <NodeJSIcon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'MongoDB', icon: <MongoDBIcon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'Git', icon: <GitIcon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'Illustrator', icon: <IllustratorIcon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'Photoshop', icon: <PhotoshopIcon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />},
    {name: 'Figma', icon: <FigmaIcon className={classes.toolIcon} bw={classes.toolIconBW} colour={classes.toolIconColour} />}
  ]

  return (
    <>
      <div className="relative bg-theme-orange-500 w-full h-24 md:h-36 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 490" preserveAspectRatio="none" className="w-full h-24 md:h-36 rotate-180">
          <path className="fill-theme-gray-900 translate-y-12 opacity-25" d="M0 245l21.8-24.5C43.6 196 87 147 131 130.7c43.5-16.7 87 .3 131 40.8C305.5 212 349 278 393 294c43.4 16 87-16 131-65.3 43.3-48.7 87-114.7 131-147 43.2-32.7 87-32.7 130 0 44.1 32.3 88 98.3 131 89.8 44-8.5 88-89.5 131-73.5 43.9 16 88 131 131 163.3 43.8 32.7 87-16.3 131-65.3 43.7-49 87-98 131-98 43.6 0 87 49 131 114.3 43.5 65.7 87 146.7 131 147 43.5-.3 87-81.3 131-138.8 43.4-57.5 87-89.5 131-106.2 43.3-16.3 87-16.3 131 40.9 43.2 56.8 87 171.8 130 155.1 44.1-16.3 88-163.3 131-171.5 44-7.8 88 122.2 131 122.5 43.9-.3 88-130.3 131-171.5 43.8-40.8 87 8.2 131 32.7 43.7 24.5 87 24.5 131 24.5 43.6 0 87 0 131 8.2 43.5 7.8 87 24.8 109 32.6l21.8 8.2v294H0z" />
          <path className="fill-theme-gray-900 translate-y-24 opacity-50" d="M0 147h21.8c21.8 0 65.2 0 109.2 40.8C174.5 229 218 310 262 310.3c43.5-.3 87-81.3 131-81.6 43.4.3 87 81.3 131 114.3 43.3 33 87 16 131-24.5C698.2 278 742 212 785 179.7 829.1 147 873 147 916 196c44 49 88 147 131 196 43.9 49 88 49 131 40.8 43.8-7.8 87-24.8 131-98 43.7-73.8 87-203.8 131-204.1 43.6.3 87 130.3 131 163.3 43.5 33 87-33 131-73.5 43.5-40.5 87-57.5 131-81.7 43.4-24.8 87-56.8 131-32.6 43.3 24.8 87 105.8 131 138.8 43.2 33 87 16 130-24.5 44.1-40.5 88-106.5 131-89.8 44 16.3 88 114.3 131 179.6 43.9 65.7 88 97.7 131 40.9 43.8-57.2 87-204.2 131-236.9 43.7-32.3 87 48.7 131 57.2 43.6 8.5 87-57.5 131-57.2 43.5-.3 87 65.7 109 98l21.8 32.7v245H0z" />
          <path className="fill-theme-gray-900 translate-y-36" d="M0 196l21.8-24.5C43.6 147 87 98 131 98c43.5 0 87 49 131 98 43.5 49 87 98 131 122.5 43.4 24.5 87 24.5 131-32.7C567.3 229 611 114 655 122.5c43.2 8.5 87 138.5 130 138.8 44.1-.3 88-130.3 131-187.8 44-57.5 88-40.5 131 8.2 43.9 49.3 88 130.3 131 179.6 43.8 48.7 87 65.7 131 57.2 43.7-8.5 87-40.5 131-57.2 43.6-16.3 87-16.3 131-16.3 43.5 0 87 0 131 8.2 43.5 7.8 87 24.8 131 16.3 43.4-8.5 87-40.5 131-32.7 43.3 8.2 87 57.2 131 81.7 43.2 24.5 87 24.5 130-8.2 44.1-32.3 88-98.3 131-147 44-49.3 88-81.3 131-65.3 43.9 16 88 82 131 147 43.8 65 87 131 131 163.3 43.7 32.7 87 32.7 131-16.3 43.6-49 87-147 131-212.3 43.5-65.7 87-97.7 109-114.4l21.8-16.3v441H0z" />
        </svg>
      </div>
      <Element name="about" className="min-h-screen flex flex-col items-center justify-center py-20 space-y-8 md:space-y-20 bg-theme-orange-500 text-theme-gray-900 overflow-hidden">
      
        <div className="w-full max-w-screen-xl flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-12 px-8 xl:px-0">

          <div id="about-portrait" className="w-64 md:80 lg:w-96 aspect-square flex-none bg-theme-orange-500">
            <Controller>
              <Scene duration={400} triggerElement="#about-portrait" triggerHook={0.95}>
                {(progress) => (
                  <Tween from={{ opacity: 0, x: '-25%' }} to={{ opacity: 1, x: 0 }} totalProgress={progress} ease="back.out(1.7)" paused>
                    <div className="portrait relative w-64 md:w-80 lg:w-96 bg-theme-orange-500 aspect-square overflow-hidden">
                      <Image src="/images/me.jpg" width="800px" height="800px" alt="me"/>
                    </div> 
                  </Tween>
                )}
              </Scene>
            </Controller>
          </div>
            
          <div id="about-container">

            <div id="about-title" className="text-center lg:text-left">
              <Controller>
                <Scene duration={400} triggerElement="#about-title" triggerHook={1}>
                  {(progress) => (
                    <Tween from={{ opacity: 0, x: '20%' }} to={{ opacity: 1, x: 0 }} totalProgress={progress} ease="back.out(1.7)" paused>
                      <h1 className="font-display uppercase text-3xl sm:text-4xl md:text-6xl lg:text-8xl mb-1 md:mb-4">About Me</h1> 
                    </Tween>
                  )}
                </Scene>
              </Controller>
            </div>

            <div id="about-subtitle" className="font-serif text-base md:text-lg">
              <Controller>
                <Scene duration={300} triggerElement="#about-subtitle" triggerHook={0.95}>
                  {(progress) => (
                    <Tween from={{ opacity: 0, x: '5%' }} to={{ opacity: 1, x: 0 }} stagger={0.25} totalProgress={progress} ease="back.out(1.7)" paused>
                      <p>Hello, again! My full name is Rolando JR Gaoat, but you can call me JR <span className="inline-block">{svgEmoji("😎")}</span>.</p>
                      <p className="mt-2 mb-6 font-serif md:text-lg">
                        I <span className="text-base inline-block">{svgEmoji("❤")}</span> creating beautiful, clean, and exceptional user interfaces and digital experiences. 
                        As a <span className="font-mono text-lg md:text-xl">&lt;developer/&gt;</span><span className="text-base inline-block">{svgEmoji("👨‍💻")}</span> and <span className="font-serif italic">designer</span><span className="text-base inline-block">{svgEmoji("👨‍🎨")}</span>, I can integrate and bring you the best of both worlds <span className="text-base inline-block">{svgEmoji("🌎")}</span>.
                      </p>
                    </Tween>
                  )}
                </Scene>
              </Controller>
            </div>

            <div id="about-content" className="text-sm md:text-base space-y-2">
              <Controller>
                  <Scene duration={300} triggerElement="#about-content" triggerHook={0.95}>
                    {(progress) => (
                      <Tween from={{ opacity: 0, x: '5%' }} to={{ opacity: 1, x: 0 }} stagger={0.35} totalProgress={progress} ease="back.out(1.7)" paused>
                        <p>Hello, again! My full name is Rolando JR Gaoat, but you can call me JR <span className="inline-block">{svgEmoji("😎")}</span>.</p>
                        <p>
                          After graduating, I moved to Shanghai, China to teach high-school level Computer Science and Mathematics. I taught students basic programming skills using Python 
                          and also led various middle school STEM-related co-curricular activities, such as the <span className="italic">FIRST</span>&reg; LEGO&reg; League where students compete to build a robot and develop programs for it using Scratch.
                        </p>
                        <p>
                          Currently, I am back at home in Toronto, Canada due to the on-going pandemic. Being back home has reignited my passion for building and creating things for the web. 
                          With the sudden shift towards reliance on more online technologies, I hope to refine my skills so that I can create a more accessible, aesthetically-pleasing 
                          and intuitive online experience for everyone.
                        </p>
                      </Tween>
                    )}
                  </Scene>
                </Controller>
            </div>
              
          </div>

        </div>

        <div className="w-full max-w-screen-xl flex flex-col items-center">

          <div id="toolkit-title" className="text-center md:text-left">
            <Controller>
              <Scene duration={300} triggerElement="#toolkit-title" triggerHook={0.95}>
                {(progress) => (
                  <Tween from={{ opacity: 0, y: '-100%' }} to={{ opacity: 1, y: 0 }} totalProgress={progress} ease="back.out(1.7)" paused>
                    <h1 className="font-bold text-2xl lg:text-3xl mb-1 md:mb-4">My most recent toolkit</h1>
                  </Tween>
                )}
              </Scene>
            </Controller>
          </div>

          <div id="toolkit-logos" className="w-full grid grid-cols-3 sm:grid-cols-4 gap-y-4 md:gap-y-8 md:grid-cols-6">
            <Controller>
              <Scene duration={350} triggerElement="#toolkit-logos" triggerHook={0.925}>
                {(progress) => (
                  <Tween from={{ opacity: 0, y: '-35%' }} to={{ opacity: 1, y: 0 }} stagger={0.1} totalProgress={progress} ease="back.out(1.7)" paused>
                    {tools.map((tool, i) => (
                      <div key={i} className="flex flex-col items-center justify-center">
                          <div className="w-16: sm:w-20 h-16 sm:h-20 flex items-center justify-center">
                            {tool.icon}
                          </div>
                          <span className="text-sm sm:text-base font-mono tracking-tight">{tool.name}</span>  
                      </div>
                    ))}
                  </Tween>
                )}
              </Scene>
            </Controller>
          </div>
        </div>

      </Element>
    </>
  );
}

export default About