
import { useEffect, useState } from "react";

import { animateScroll } from "react-scroll";
import { Tween } from "react-gsap";

import { UserCircleIcon, CollectionIcon, ChatIcon, DocumentTextIcon, HomeIcon } from "@heroicons/react/solid"

import { Logo, TopNavLink } from "../components";
import { MenuIcon } from "../components/icons";


const TopNav = () => {
  const [clicked, setClicked] = useState(false);
  const [screenSize, setScreenSize] = useState(null);

  useEffect(() => {
    if (clicked) {
      document.querySelector("body").classList.add("overflow-hidden");
      document.querySelector("#content").classList.add("blur-sm");
    } else {
      document.querySelector("body").classList.remove("overflow-hidden");
      document.querySelector("#content").classList.remove("blur-sm"); 
    }
  }, [clicked]);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize >= 768) setClicked(false);
  }, [screenSize]);
 
 
  const classes = {
    navItemsIcon: 'h-7 md:h-5 fill-white transition-colors duration-300 fill-theme-white-100 md:fill-theme-orange-500 md:group-active:fill-theme-white-100 md:group-hover:fill-theme-white-100',
    navItem: "group w-full flex flex-col md:flex-row items-center md:w-auto space-x-1.5 p-4 md:py-2 transition-colors duration-300 hover:bg-theme-orange-500 md:hover:bg-theme-orange-500 md:rounded-full text-xl md:text-base md:hover:text-theme-white-100  hover:cursor-pointer",
  } 

  const navItems = [
    {title: 'Home', name: 'home', icon: <HomeIcon className={classes.navItemsIcon} />},
    {title: 'About', name: 'about', icon: <UserCircleIcon className={classes.navItemsIcon}/>},
    {title: 'Portfolio', name: 'portfolio', icon: <CollectionIcon className={classes.navItemsIcon } />},
    {title: 'Contact', name: 'contact', icon: <ChatIcon className={classes.navItemsIcon} />}
  ]

  return (
    <>
      <Logo />
      <Tween from={{ opacity: 0, y: '-100%' }} to={{ opacity: 1, y: '0%' }} duration={1} delay={4}>
        <div id="header-bar" className="fixed bg-theme-gray-900 bg-opacity-75 backdrop-blur-sm  w-full h-16 flex items-center justify-end pl-20 pr-4 text-theme-white-100 z-40 top-0 transition-[top] duration-500">
          <MenuIcon className="z-50 md:hidden hover:cursor-pointer" clicked={clicked} setClicked={setClicked} /> 
          <Tween from={{ opacity: 0, y: '-50%' }} to={{ opacity: 1, y: '0%' }} duration={1} delay={4.5}>
          <nav id="header-nav" className={`fixed bg-theme-red-600 md:bg-transparent top-0 right-0 h-screen z-40 shadow-[-10px_0px_24px_-10px_rgba(0,0,0,0.35)] md:shadow-none overflow-hidden md:h-auto md:w-auto md:inline-flex md:top-auto md:right-auto transition-[width] duration-300 ${clicked ? "w-64" : "w-0"}`}>
            <ul className="h-full flex flex-col items-center justify-center md:flex-row md:space-y-0 md:space-x-2 font-semibold">
              {navItems.map((item, i) => (
                <li key={i} className="w-full">
                  <TopNavLink onClick={() => { item.name === "home" && animateScroll.scrollToTop(); setClicked(!clicked); }} className={classes.navItem} to={item.name} smooth={true} duration={1500}>
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </TopNavLink>                
                </li>
              ))}
              <li className="group flex items-center space-x-1.5 text-xl md:text-base border-2 border-theme-white-100 md:border-theme-red-400 rounded-full py-3 px-6 md:px-4 md:py-1.5 mt-4 md:mt-0 md:text-theme-red-400 transition-colors duration-300 hover:cursor-pointer hover:bg-theme-white-100 hover:text-theme-red-600 md:hover:bg-theme-red-400 md:hover:text-theme-white-100">
                <DocumentTextIcon className={`${classes.navItemsIcon} md:fill-theme-red-400 group-hover:fill-theme-red-600 md:group-hover:fill-theme-white-100`}/>
                <a href="/files/resume_cv.pdf" target="_blank" rel="noreferrer noopener">Resume</a>
              </li>
            </ul>
          </nav>
          </Tween>
        </div>
      </Tween>
    </>
  );
};
export default TopNav;