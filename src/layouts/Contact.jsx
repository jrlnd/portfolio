import { Element } from "react-scroll"
import { Controller, Scene } from "react-scrollmagic"
import { Tween } from "react-gsap"
import { ChatIcon, MailIcon } from "@heroicons/react/solid"

const Contact = ({ setDialogOpen }) => {

  const classes = {
    input: "w-full py-2 px-3 md:py-3 md:px-4 border-2 border-theme-gray-900/20 rounded-lg",
    textarea: "w-full h-48 min-h-[12rem] resize-y max-h-96 py-2 px-3 md:py-3 md:px-4 border-2 border-theme-gray-900/20 rounded-lg"
  }

  const sendEmail = () => {
    window.open('mailto:rjgaoat@gmail.com')
  }

  return (
    <>
      <div className="bg-theme-gray-900 w-full h-24 md:h-32 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 310" preserveAspectRatio="none" className="w-full h-24 md:h-36 rotate-180">
          <path className="fill-theme-red-600/25" d="M0 186l18.5 5.2C36.9 196 74 207 111 217c36.7 10 74 21 111 0 36.5-21 73-72 110-87.8 37.2-15.2 74 4.8 111-5.2s74-52 111-46.5C590.8 83 628 134 665 155c36.5 21 73 10 110-10.3 37.3-20.7 74-51.7 111-41.4 37.1 10.7 74 61.7 111 93 36.8 30.7 74 41.7 111 15.5 36.6-25.8 74-87.8 110-118.8 37.4-31 74-31 111-31 37.2 0 74 0 111 10.3 36.9 10.7 74 30.7 111 51.7 36.7 21 74 41 111 31 36.5-10 73-52 110-36.2 37.2 15.2 74 88.2 111 118.9 37 31.3 74 20.3 111-10.4 36.8-31.3 74-82.3 111-98.1 36.5-15.2 73 4.8 110-10.4 37.3-15.8 74-66.8 111-77.5 37.1-10.3 74 20.7 111 46.5 36.8 26.2 74 46.2 111 41.4 36.6-5.2 74-36.2 92-51.7l18.5-15.5v248H0z" />
          <path className="fill-theme-red-600/50 translate-y-12" d="M0 155l18.5-20.7C36.9 114 74 72 111 87.8 147.7 103 185 176 222 217c36.5 41 73 52 110 20.7C369.2 207 406 134 443 124s74 41 111 36.2c36.8-5.2 74-67.2 111-77.5 36.5-10.7 73 31.3 110 51.6C812.3 155 849 155 886 155c37.1 0 74 0 111-20.7 36.8-20.3 74-62.3 111-67.1 36.6-5.2 74 25.8 110 62 37.4 35.8 74 77.8 111 82.6 37.2 5.2 74-25.8 111-51.6 36.9-26.2 74-46.2 111-41.4 36.7 5.2 74 36.2 111 41.4 36.5 4.8 73-15.2 110-31 37.2-15.2 74-26.2 111 0 37 25.8 74 87.8 111 108.5 36.8 20.3 74 .3 111-25.9 36.5-25.8 73-56.8 110-56.8 37.3 0 74 31 111 31 37.1 0 74-31 111-56.8 36.8-26.2 74-46.2 111-62 36.6-15.2 74-26.2 92-31l18.5-5.2v279H0z" />
          <path className="fill-theme-red-600 translate-y-20" d="M0 0l18.5 36.2C36.9 72 74 145 111 144.7c36.7.3 74-72.7 111-103.4C258.5 10 295 21 332 46.5 369.2 72 406 114 443 149.8c37 36.2 74 67.2 111 62 36.8-4.8 74-46.8 111-51.6 36.5-5.2 73 25.8 110 41.3 37.3 15.5 74 15.5 111-20.7C923.1 145 960 72 997 72.3c36.8-.3 74 72.7 111 98.2 36.6 25.5 74 5.5 110-15.5 37.4-21 74-41 111-31 37.2 10 74 52 111 72.3 36.9 20.7 74 20.7 111 0 36.7-20.3 74-62.3 111-56.8 36.5 5.5 73 56.5 110 87.8 37.2 30.7 74 41.7 111 5.2S1957 114 1994 93c36.8-21 74 21 111 51.7 36.5 31.3 73 51.3 110 46.5 37.3-5.2 74-36.2 111-41.4 37.1-4.8 74 15.2 111 41.4 36.8 25.8 74 56.8 111 56.8 36.6 0 74-31 92-46.5l18.5-15.5v124H0z" />
        </svg>
      </div>
      <Element name="contact" className="relative flex flex-col items-center justify-center -mt-48 px-8 xl:px-0"> 
  
        <div className="w-full max-w-screen-lg text-center p-4 md:p-8 bg-theme-white-100 text-theme-gray-900 rounded-lg">
          <div id="contact-title" className="font-display text-3xl uppercase sm:text-4xl lg:text-5xl mb-1 md:mb-4">
            <Controller>
              <Scene duration={300} triggerElement="#contact-title" triggerHook={0.975}>
                {(progress, event) => (
                  <Tween from={{ opacity: 0, transform: 'translateY(-75%)' }} to={{ opacity: 1, transform: 'translateY(0)' }} totalProgress={progress} paused>
                    <h1 className="font-display text-3xl uppercase sm:text-4xl lg:text-5xl mb-1 md:mb-4">Stay in Contact</h1>
                  </Tween>
                )}
              </Scene>
            </Controller>
          </div>
          
            
          <div id="contact-content" className="font-light text-lg md:text-xl lg:text-2xl space-y-1">
            <Controller>
              <Scene duration={300} triggerElement="#contact-content" triggerHook={0.975}>
                {(progress, event) => (
                  <Tween from={{ opacity: 0, transform: 'translateY(-75%)' }} to={{ opacity: 1, transform: 'translateY(0)' }} stagger={0.35} totalProgress={progress} paused>
                    <p className="font-semibold">My inbox is always open to any inquries, questions, or comments.</p>
                    <p>Interested in working together? Have a project in mind and need some help?</p> 
                    <p>Let&rsquo;s have a chat. Give me the details and I&rsquo;ll try my best to get back to you.</p>
                    <div id="contact-buttons" className="flex flex-col md:flex-row items-center justify-center !mt-4 !md:mt-8 space-y-2 md:space-y-0 md:space-x-4 font-bold text-lg md:text-xl">
                      <a target="_blank" rel="noreferrer noopener" href="mailto:rjgaoat@gmail.com" className="flex items-center py-2 md:py-3 px-4 md:px-6 space-x-2 border-2 border-theme-orange-500 rounded-full transition-colors duration-300 hover:bg-theme-orange-500 hover:text-theme-white-100 text-theme-orange-500">
                        <span>Send an e-mail</span> <MailIcon className="w-6 md:w-7" />
                      </a>
                      <button onClick={() => setDialogOpen(true)} className="flex items-center py-2 md:py-3 px-4 md:px-6 space-x-2 border-2 border-theme-red-600 rounded-full font-bold transition-colors duration-300 hover:bg-theme-red-600 hover:text-theme-white-100 text-theme-red-600">
                        <span>Leave a message</span> <ChatIcon className="w-6 md:w-7" />
                      </button>
                    </div>
                  </Tween>
                )}
              </Scene>
            </Controller>
          </div>

          {/* <div id="contact-buttons" className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Controller>
              <Scene duration={300} triggerElement="#contact-content" offset={100} triggerHook={0.95}>
                {(progress, event) => (
                  <>
                    <Tween from={{ opacity: 0, transform: 'translateY(-100%)' }} to={{ opacity: 1, transform: 'translateY(0)' }} ease="sine.out" totalProgress={progress} paused>
                      <a target="_blank" rel="noreferrer noopener" href="mailto:rjgaoat@gmail.com" className="flex items-center py-2 md:py-3 px-4 md:px-6 space-x-2 border-2 border-theme-orange-500 rounded-full font-bold md:text-lg lg:text-xl xl:text-2xl transition-colors duration-300 hover:bg-theme-orange-500 hover:text-theme-white-100 text-theme-orange-500">
                        <span>Send an e-mail</span> <MailIcon className="w-6 md:w-7" />
                      </a>
                      <button onClick={() => setDialogOpen(true)} className="flex items-center py-2 md:py-3 px-4 md:px-6 space-x-2 border-2 border-theme-red-600 rounded-full font-bold md:text-lg lg:text-xl xl:text-2xl transition-colors duration-300 hover:bg-theme-red-600 hover:text-theme-white-100 text-theme-red-600">
                        <span>Send a message</span> <ChatIcon className="w-6 md:w-7" />
                      </button>
                    </Tween>
                  </>
                  )}
                </Scene>
              </Controller>
          </div> */}
        </div>

      </Element>
    </>
    
  )
}

export default Contact