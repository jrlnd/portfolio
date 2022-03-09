/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "@heroicons/react/solid"

const LightBox = ({ images, isLightBoxOpen, setIsLightBoxOpen }) => {

  const [imageIndex, setImageIndex] = useState(0)

  const prevIndex = () => setImageIndex(i => (i > 0 ? (i - 1) % images.length : images.length - 1))
  const nextIndex = () => setImageIndex(i => (i + 1) % images.length)

  useEffect(() => {
    setImageIndex(0)
  }, [images])

  useEffect(() => {
    if (isLightBoxOpen) {
      document.querySelector("body").classList.add("md:overflow-y-hidden");
      document.querySelector("body").classList.add("overflow-hidden");
      document.getElementById("lightbox-container").classList.remove("z-50")
      document.getElementById("lightbox-container").classList.add("z-50")
    } else {
      document.querySelector("body").classList.remove("md:overflow-y-hidden");
      document.querySelector("body").classList.remove("overflow-hidden");
      const timer = setTimeout(() => {
        document.getElementById("lightbox-container").classList.remove("z-50")
        document.getElementById("lightbox-container").classList.add("-z-50")
      }, 500);
      return () => clearTimeout(timer);
    }  
  }, [isLightBoxOpen])

  return (
    <div id="lightbox-container" className={`fixed inset-0 w-screen flex flex-col items-center justify-center bg-theme-gray-900/90 transition duration-500 ${isLightBoxOpen ? "backdrop-blur-md opacity-100" : "backdrop-blur-none opacity-0"}`}>
      
    
      <div className={`absolute w-full max-w-screen-xl aspect-square flex flex-col items-center justify-center space-y-2 px-16 2xl:px-0 text-theme-white-100 transition duration-500 ${isLightBoxOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
        
  
          <img src={images[imageIndex]?.url || ""} alt={images[imageIndex]?.title || ""} className="object-contain w-full h-full max-w-screen-xl max-h-[24rem] md:max-h-[48rem]" />
          <p className="md:text-xl text-center">{images[imageIndex]?.title}</p>
          <span className="text-sm font-bold">Image {imageIndex+1} of {images.length}</span>
        
      </div>


      {images.length > 1 && (<>
        <button className="absolute left-3 w-7 h-7 flex items-center justify-center" onClick={prevIndex}>
          <ChevronLeftIcon className="fill-theme-white-100 w-7 transition-colors duration-300 hover:fill-theme-red-600" />
        </button>

        <button className="absolute right-3 w-7 h-7 flex items-center justify-center" onClick={nextIndex}>
          <ChevronRightIcon className="fill-theme-white-100 w-7 transition-colors duration-300 hover:fill-theme-red-600" />
        </button>

        <div className="absolute w-full top-3 flex items-center justify-center space-x-2">
          {images.map((({url, title}, i) => (
            <button key={i} onClick={() => setImageIndex(i)} className="hidden md:inline-flex">
              <img src={url} alt={title} className={`h-8 transition-opacity duration-300 ${imageIndex !== i && "opacity-25 hover:opacity-75"}`} />
            </button>
          )))}
        </div>
      </>)}


      <button className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center" onClick={() => setIsLightBoxOpen(false)}>
        <XIcon className="fill-theme-white-100 w-7 transition-colors duration-300 hover:fill-theme-red-600" />
      </button>

    </div>
  )
}
export default LightBox