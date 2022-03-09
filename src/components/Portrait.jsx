// @refresh reset
import { useEffect, useState } from 'react';
import { Controller, Scene } from 'react-scrollmagic'
import { gsap } from 'gsap'
import { Tween } from 'react-gsap'


const Portrait = ({ className }) => {

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [gradientDeg, setGradientDeg] = useState(30);

  useEffect(() => {
    const setFromEvent = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", setFromEvent)
    return () => window.removeEventListener("mousemove", setFromEvent)
  }, [])

  useEffect(() => {
    gsap.fromTo('#portrait-bg', { autoAlpha: 0, y: '-20%'}, {autoAlpha: 1, y: 0, duration: 1, delay: 4.75})
    gsap.fromTo('#portrait-body', { autoAlpha: 0, y: '20%'}, {autoAlpha: 1, y: 0, duration: 1, delay: 5})
  }, [])

  useEffect(() => {
    
    const calcCenters = () => {
      const item = document.getElementById("portrait-bg"),
            itemBox = item.getBoundingClientRect(),
            centerPoint = window.getComputedStyle(item).transformOrigin,
            centers = centerPoint.split(" "),
            centerY = itemBox.top + parseInt(centers[1]) - window.scrollY,
            centerX = itemBox.left + parseInt(centers[0]) - window.scrollX

      return [centerX, centerY]
    }

    const calcAngle = (e) => {
      const event = e;
      let mouseX = mousePos.x,
          mouseY = mousePos.y

      if (e.targetTouches && e.targetTouches[0]) {
        event = e.targetTouches[0]
        mouseX = event.pageX
        mouseY = event.pageY
      }

      const [centerX, centerY] = calcCenters(),
            radians = Math.atan2(mouseX - centerX, mouseY - centerY),
            degree = (radians * (180 / Math.PI) * -1) - 90

      setGradientDeg(degree)
    }
    
    window.addEventListener("mousemove", calcAngle)
    window.addEventListener("touchmove", calcAngle)
    window.addEventListener("touchstart", calcAngle)

    return () => {
      window.removeEventListener("mousemove", calcAngle)
      window.removeEventListener("touchmove", calcAngle)
      window.removeEventListener("touchstart", calcAngle)
    }
    
  }, [mousePos.x, mousePos.y])

  return (
    <div id="portrait-container" className={className}>
      <Controller>
        <Scene triggerElement="#portrait-container" duration={400} triggerHook="0.1">
          {(progress) => (
            <Tween to={{ opacity: "0", y: '-25%' }} ease="sine.out" totalProgress={progress} paused>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 756.79 691.51" id="portrait-bg">
                <defs>
                  <linearGradient id="portrait-gradient" gradientTransform={`rotate(${gradientDeg} .5 .5)`} >
                    <stop offset="0%" stopColor="#C04954" />
                    <stop offset="100%" stopColor="#DA965E" />
                  </linearGradient>
                  <clipPath id="a" transform="translate(-105.1 -94.42)">
                    <path d="M378.67,786.93c-82.77,0-273.57-32.19-273.57-162.1,0-315,229.91-529.4,404.66-529.41,108,0,352.13,89.1,352.13,412.48C861.89,708.75,583,786.93,378.67,786.93Z" fill="none" />
                  </clipPath>
                  <clipPath id="b" transform="translate(-105.1 -95.42)">
                    <path d="M413.46 540.35h173.08A165.7 165.7 0 01752.24 706v114.78a15.88 15.88 0 01-15.88 15.88H263.64a15.88 15.88 0 01-15.88-15.88V706a165.7 165.7 0 01165.7-165.65z" fill="none" />
                  </clipPath>
                  <clipPath id="c" transform="translate(-105.1 -95.42)">
                    <ellipse cx="500" cy="533.45" fill="none" rx="140.08" ry="68.13" />
                  </clipPath>
                </defs>
                <path fill="url(#portrait-gradient)" d="M273.57 691.51C190.8 691.51 0 659.32 0 529.41 0 214.41 229.91.01 404.66 0c108 0 352.13 89.1 352.13 412.48 0 200.85-278.89 279.03-483.22 279.03z" />
                <g clipPath="url(#a)">
                  <g id="portrait-body">
                    <path d="M308.36 444.93h173.09a165.7 165.7 0 01165.7 165.7v278.08a15.88 15.88 0 01-15.88 15.88H158.54a15.88 15.88 0 01-15.88-15.88V610.63a165.7 165.7 0 01165.7-165.7z" className="sweater" />
                    <g clipPath="url(#b)">
                      <path d="M565.23 464.76a175.12 175.12 0 00-85-21.85H309.61a175.12 175.12 0 00-85 21.85c26.7 30.6 92.88 52.26 170.33 52.26s143.59-21.66 170.29-52.26z" fill="rgba(0,0,0,0.35)" />
                    </g>
                    <rect width="9" height="160.9" x="322.9" y="468.91" fill="white" rx="4.5" />
                    <rect width="9" height="160.9" x="457.9" y="421.47" fill="white" rx="4.5" />
                    <ellipse cx="394.9" cy="438.03" className="sweater" rx="164.08" ry="79.8" />
                    <ellipse cx="394.9" cy="438.03" fill="rgba(0,0,0,0.35)" rx="140.08" ry="68.13" />
                    <g clipPath="url(#c)">
                      <path d="M542.57 472.33a239.71 239.71 0 00-97.16-20.25H341.9a239.68 239.68 0 00-97.16 20.25c19.75 26.25 78.95 45.25 148.93 45.25s129.23-19 148.9-45.25z" fill="white" />
                    </g>
                    <path d="M457.4 455.93h-125a178.53 178.53 0 000-83.31h125a178.53 178.53 0 000 83.31z" fill="#b08e72" />
                    <ellipse cx="394.9" cy="455.93" fill="#b08e72" rx="62.5" ry="28.15" />
                    <ellipse cx="382.5" cy="384.79" fill="#b08e72" rx="16.09" ry="39.6" transform="rotate(-12.16 -118.02 830.327)" />
                    <path d="M286.96 282.42c-.14.25-.32.82-.48.82-.45 0-1.16-.16-1.3-.46-2.12-4.85-6.6-7.32-10.41-10.47a1.85 1.85 0 01-.38-2.42c.62-1 1.43-.46 2.27 0 5 2.5 7.12 7.48 10 11.77a3.75 3.75 0 01.3.76z" fill="#a47b5d" />
                    <ellipse cx="617.5" cy="384.79" fill="#b08e72" rx="39.6" ry="16.09" transform="rotate(-77.84 505.896 402.156)" />
                    <path d="M504.43 282.42c.14.25.32.82.48.82.45 0 1.16-.16 1.3-.46 2.12-4.85 6.6-7.32 10.41-10.47a1.83 1.83 0 00.37-2.42c-.61-1-1.42-.46-2.26 0-5 2.5-7.12 7.48-10 11.77a3.75 3.75 0 00-.3.76z" fill="#a47b5d" />
                    <ellipse cx="395.68" cy="278.23" fill="#bfa084" rx="110.41" ry="151.35" />
                    <path d="M309.43 252.83c9.9-8 21.2-10.7 33.74-9.16a146.2 146.2 0 0120.31 3.91 4.22 4.22 0 013.37 4c.26 2.13-1 3.62-2.82 4.53a17.61 17.61 0 01-14 .6c-7.83-2.86-15.72-3.23-23.75-2.61a55.73 55.73 0 00-15.63 4c-3.41-.84-3.41-.84-1.22-5.27zm170.94 0c-9.9-8-21.2-10.7-33.74-9.16a146.2 146.2 0 00-20.31 3.91 4.22 4.22 0 00-3.37 4c-.26 2.13 1 3.62 2.82 4.53a17.61 17.61 0 0014 .6c7.83-2.86 15.72-3.23 23.75-2.61a55.73 55.73 0 0115.63 4c3.41-.84 3.41-.84 1.22-5.27z" fill="#201f1d" />
                    <ellipse cx="344.9" cy="288.74" fill="#201f1d" rx="8.5" ry="11.67" />
                    <ellipse cx="444.9" cy="288.74" fill="#201f1d" rx="8.5" ry="11.67" />
                    <path d="M412.75 338.19c.67 18.74-36.52 17.62-35.21-.26 7.84 11.9 26.7 13.75 35.21.26z" fill="#a47b5d" />
                    <path fill="#fff" stroke="#a47b5d" strokeLinecap="round" strokeLinejoin="bevel" strokeWidth="3" d="M372.64 375.84s23.47 14.76 46-1" />
                    <path d="M494.9 166.85c-.59-5.25-3.42-9.23-6.32-13.65a25.75 25.75 0 00-2.68-3.21c-10.91-11.55-40.31-23.77-40.31-23.77-.56-.62-23.39-11.41-33.47-12.63a27.16 27.16 0 01-7.92-2.34c-3.52-1.58-7.1-3.13-11.08-3.19l-.74-.1c-.81-.57-14.91-.62-15.3-.19h-4.7l-.95-.7c-.23-.36-.38-1-.69-1.05-5.27-1.75-10.69-3.14-15.92-.37a9.86 9.86 0 01-9.24.29 53.16 53.16 0 00-9.77-3.43c-2.09-.43-4 0-5 1.77-2.19 4-5.85 5.22-9.91 6-3.15.56-6 1.64-7.82 4.56a4.38 4.38 0 01-3 1.93 15 15 0 00-9.09 5.53c-2.94 3.93-6.21 7.83-6.23 13a7.47 7.47 0 01-2.33 5.46c-4 4.47-5.87 9.72-4.84 15.73a3.29 3.29 0 01-1.37 3.47c-2.37 1.87-5.22 8.21-5.26 9-.13 2.87 1.05 4.48 1.9 6.62.12.45.24.9.35 1.35v2.76a4.22 4.22 0 00-.37 2.69c-.09.67-.17 1.34-.26 2a3.86 3.86 0 00-.32 2.69 15.28 15.28 0 00.73 9.8c1 2.68 2.49 5.27 2.25 8.31-.56 1.05-1.34 9.38-1.41 10.05-.46.86-1.4 22.11-.61 29.47l.18 6c.57 7.3-.26 14.7 1.53 21.92a44.84 44.84 0 00.74 5.05c1.23 0 1.84-.13 1.78-1.89a33.77 33.77 0 01.9-9.18c1.25-5 1.32-10.23 2.68-15.28 1.64-6.07 2.29-12.39 3.19-18.64a272.74 272.74 0 015.76-29.84c2.52-3.69 4.24-8 8.25-10.54 5.3-7.1 22-11.45 22.32-11.51 8.8-1.45 47.32 1.67 53.89 1.67 8.54.15 59.33-3.73 69.1-4.08l5.67.19a28 28 0 017.08 2.25c5.26 2.32 17.93 12.53 18.81 14.9a15 15 0 013.23 4.62 67.17 67.17 0 016.31 21c1.61 11.77 3.84 23.45 6.56 35 .78 3.33 3 16.74 3.3 20.12 1.34-.73 1.87-2.51 2.14-5 1.38-19.79 2.54-39.65 2.31-59.5-.37-12.43-2.9-24.19-12.56-33.11-1.75-1.62-1.1-3.47-1.32-5.27M443.8 374.17c-.45-2.88-2.88-3.12-4.82-2.86-2.2.3-3.07 2.29-3 4.55.1 6.19-1.3 12-5.29 16.84a16.15 16.15 0 01-18 5.06c-2.3-.87-3.57-2.95-5.52-4.19s-4.07-1.38-6.26-1.37h-11.95c-2.19 0-4.38 0-6.26 1.37s-3.22 3.32-5.52 4.19a16.15 16.15 0 01-18-5.06c-4-4.89-5.39-10.65-5.29-16.84 0-2.26-.84-4.25-3-4.55-1.94-.26-4.37 0-4.82 2.86-2.19 4.47 2.31 33.78 5.74 39.8a64.23 64.23 0 005.16 6.39c5 5.19 11.17 8.4 17.66 11.12a49.83 49.83 0 0040.68 0c6.49-2.72 12.7-5.93 17.66-11.12a64.23 64.23 0 005.16-6.39c3.36-6.02 7.86-35.33 5.67-39.8zm-2.8-13.03c-9.52-4.69-21.89-.12-32.38-2.56-6.05-3.1-15.2 5.89-5.75 6.89 10.4-3.67 34.5 4.86 38.13-4.33zm-92.2.3c9.52-4.7 21.89-.13 32.38-2.56 6.05-3.1 15.2 5.89 5.75 6.89-10.4-3.67-34.5 4.86-38.13-4.33z" fill="#201f1d" />
                  </g>
                </g>
              </svg>
            </Tween>
            
          )}
        </Scene>
      </Controller>
    </div>
  );
};

export default Portrait;
