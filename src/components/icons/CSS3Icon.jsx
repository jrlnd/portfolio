const CSS3Icon = ({className, bw, colour}) => {

  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.5 512" className={colour}>
        <path fill="#264de4" d="M41.1 460.8L0 0h451.5l-41.1 460.7L225.5 512 41.1 460.8z" />
        <path fill="#2965f1" d="M375.1 431.4l35.1-393.7H225.7v435.1l149.4-41.4z" />
        <path fill="#ebebeb" d="M94.2 208.6l5.1 56.5h126.5v-56.5H94.2zm-5.1-57.9h136.6V94.2H84l5.1 56.5zm136.6 204.7l-.2.1-62.9-17-4-45.1h-56.7l7.9 88.7 115.8 32.1.3-.1-.2-58.7z" />
        <path fill="#fff" d="M225.5 208.6v56.5h69.6l-6.6 73.3-63 17v58.8l115.9-32.1.9-9.5 13.3-148.8 1.4-15.2 10.2-114.4H225.5v56.5h79.6l-5.1 57.9h-74.5z" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.5 512" className={bw}>
        <path d="M0 0l41.1 460.8L225.5 512l184.9-51.3L451.5 0H0zm356.9 208.6l-1.4 15.2-13.3 148.8-.9 9.5-115.7 32.1-.3.1-115.8-32.1-7.9-88.7h56.7l4 45.1 62.9 17h.1l63-17 6.6-73.3H99.3l-5.1-56.5H300l5.1-57.9h-216L84 94.2h283.1l-10.2 114.4z"/>
      </svg>
    </div>
  )
}
export default CSS3Icon