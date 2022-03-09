import { Element } from "react-scroll";
import { AtSymbolIcon } from "@heroicons/react/solid";
import { GithubIcon, LinkedInIcon, CodePenIcon } from "../components/icons";

const Footer = () => {

  const classes = {
    socialIcon: 'w-8 fill-theme-white-100/50 transition duration-300 hover:fill-theme-white-100 hover:scale-110',
  }

  return (
    
    <>
    <Element name="footer" className="h-72 flex items-center justify-center bg-theme-gray-900 text-theme-white-100">
      <footer className="p-4 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-8">
          <span>
            <a href="https://www.linkedin.com/in/jrlnd/" target="_blank" rel="noreferrer noopener">
              <LinkedInIcon className={classes.socialIcon} />
            </a>
          </span>
          <span>
            <a href="https://github.com/jrlnd" target="_blank" rel="noreferrer noopener">
              <GithubIcon className={classes.socialIcon} />
            </a>
          </span>
          <span>
            <a href="https://codepen.io/jrlnd" target="_blank" rel="noreferrer noopener">
              <CodePenIcon className={classes.socialIcon} />
            </a>
          </span>
          <span>
            <a href="mailto:rjgaoat@gmail.com" target="_blank" rel="noreferrer noopener">
              <AtSymbolIcon className={classes.socialIcon} />
            </a>
          </span>
          
          
        </div>
        <span className="font-mono text-xs md:text-sm text-center">2022 &copy; Designed &amp; Developed by JRLND</span>
      </footer>
    </Element>
    </>
    
  )
};
export default Footer;
