import { ChevronRightIcon } from '@heroicons/react/solid'
import { Player, Controls } from '@lottiefiles/react-lottie-player'
import Link from 'next/link'
import { Logo } from '../components'

const Custom404 = () => {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center flex-col space-y-4 text-theme-white-100">
      <Link href="/">
        <a><Logo animate={false} className="w-24 hover:cursor-pointer"/></a>
      </Link>
      
      <h1 className="font-display text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-theme-orange-500 to-theme-red-600 text-center">Uh oh, this page does not exists</h1>

      <Player
        autoplay
        loop
        src="/images/astronaut.json"
        style={{ height: '100%', width: '100%', maxHeight: '600px', maxWidth: '600px' }}>
      </Player>
      <Link href="/">
        <a className="flex items-center pl-6 p-3 border-2 border-theme-orange-500 bg-transparent rounded-full font-bold md:text-lg lg:text-xl transition-colors duration-300 hover:bg-theme-orange-500 hover:text-theme-white-100 text-theme-orange-500">
          <span>Go back to the portfolio</span>
          <ChevronRightIcon className="w-5 h-5 md:w-7 md:h-7" />
        </a>
      </Link>

    </div>
  )
  
}

export default Custom404