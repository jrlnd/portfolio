const FigmaIcon = ({className, bw, colour}) => {

  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" className={colour}>
        <path fill="#0acf83" d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z" />
        <path fill="#a259ff" d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z" />
        <path fill="#f24e1e" d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z" />
        <path fill="#ff7262" d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z" />
        <path fill="#1abcfe" d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1667 2500" className={bw}>
        <path d="M1250.2 833.3c230 0 416.7-186.7 416.7-416.7S1480.2 0 1250.2 0H416.8C186.8 0 .2 186.7.2 416.7s186.7 416.7 416.7 416.7C186.8 833.3.2 1020 .2 1250s186.7 416.7 416.7 416.7c-230 0-416.7 186.7-416.7 416.7S186.8 2500 416.8 2500s416.7-186.7 416.7-416.7v-1250h416.7z"/>
        <circle cx="1250.2" cy="1250" r="416.7"/>
     </svg>
    </div>
  )
}
export default FigmaIcon