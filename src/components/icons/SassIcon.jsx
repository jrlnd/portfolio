const SassIcon = ({className, bw, colour}) => {
  
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 547.8 410.6" className={colour}>
        <path fill="#CD6799" d="M471.4 236c-19.1.1-35.7 4.7-49.6 11.5-5.1-10.1-10.2-19.1-11.1-25.7-1-7.7-2.2-12.4-1-21.6 1.2-9.2 6.6-22.3 6.5-23.3s-1.2-5.7-12.2-5.8-20.5 2.1-21.6 5-3.2 9.5-4.6 16.3c-1.9 10-22 45.7-33.5 64.4-3.7-7.3-6.9-13.7-7.6-18.8-1-7.7-2.2-12.4-1-21.6 1.2-9.2 6.6-22.3 6.5-23.3s-1.2-5.7-12.2-5.8-20.5 2.1-21.6 5-2.3 9.7-4.6 16.3c-2.3 6.6-29 66.2-36 81.6-3.6 7.9-6.7 14.2-8.9 18.5 0 0-.1.3-.4.8-1.9 3.7-3 5.7-3 5.7v.1c-1.5 2.7-3.1 5.2-3.9 5.2-.6 0-1.7-7.2.2-17 4-20.7 13.5-52.9 13.4-54 0-.6 1.8-6.2-6.2-9.1-7.8-2.9-10.6 1.9-11.3 1.9s-1.2 1.7-1.2 1.7 8.7-36.2-16.6-36.2c-15.8 0-37.6 17.3-48.4 32.9-6.8 3.7-21.3 11.6-36.8 20.1-5.9 3.3-12 6.6-17.7 9.7-.4-.4-.8-.9-1.2-1.3-30.6-32.7-87.2-55.8-84.8-99.7.9-16 6.4-58 108.7-109 84.2-41.5 151.2-30 162.8-4.5 16.6 36.4-35.9 104-122.9 113.8-33.2 3.7-50.6-9.1-55-13.9-4.6-5-5.3-5.3-7-4.3-2.8 1.5-1 6 0 8.6 2.6 6.8 13.3 18.8 31.4 24.7 16 5.2 54.9 8.1 102-10.1 52.7-20.4 93.9-77.1 81.8-124.6C330.7 2 250.7-13.9 175 13 130 29 81.2 54.2 46.1 87 4.4 126-2.2 159.9.5 174.1c9.7 50.4 79.2 83.2 107 107.5-1.4.8-2.7 1.5-3.8 2.1-13.9 6.9-66.9 34.6-80.1 63.9-15 33.2 2.4 57 13.9 60.2 35.7 9.9 72.4-7.9 92.1-37.3s17.3-67.6 8.2-85.1c-.1-.2-.2-.4-.4-.6 3.6-2.1 7.3-4.3 10.9-6.4 7.1-4.2 14.1-8.1 20.1-11.3-3.4 9.3-5.9 20.4-7.1 36.4-1.5 18.8 6.2 43.2 16.3 52.8 4.5 4.2 9.8 4.3 13.2 4.3 11.8 0 17.1-9.8 23-21.4 7.2-14.2 13.7-30.7 13.7-30.7s-8.1 44.6 13.9 44.6c8 0 16.1-10.4 19.7-15.7v.1s.2-.3.6-1c.8-1.3 1.3-2.1 1.3-2.1v-.2c3.2-5.6 10.4-18.3 21.1-39.4 13.8-27.2 27.1-61.2 27.1-61.2s1.2 8.3 5.3 22.1c2.4 8.1 7.4 17 11.4 25.6-3.2 4.5-5.2 7-5.2 7l.1.1c-2.6 3.4-5.4 7.1-8.5 10.7-10.9 13-23.9 27.9-25.7 32.2-2.1 5.1-1.6 8.8 2.4 11.8 2.9 2.2 8.1 2.5 13.4 2.2 9.8-.7 16.7-3.1 20.1-4.6 5.3-1.9 11.5-4.8 17.3-9.1 10.7-7.9 17.2-19.2 16.6-34.1-.3-8.2-3-16.4-6.3-24.1 1-1.4 1.9-2.8 2.9-4.2 16.9-24.7 30-51.8 30-51.8s1.2 8.3 5.3 22.1c2 7 6.1 14.6 9.7 22-15.9 12.9-25.7 27.9-29.2 37.7-6.3 18.2-1.4 26.4 7.9 28.3 4.2.9 10.2-1.1 14.6-3 5.6-1.8 12.2-4.9 18.5-9.5 10.7-7.9 21-18.9 20.4-33.8-.3-6.8-2.1-13.5-4.6-20 13.5-5.6 30.9-8.7 53.1-6.1 47.6 5.6 57 35.3 55.2 47.8s-11.8 19.3-15.1 21.4-4.4 2.8-4.1 4.3c.4 2.2 2 2.1 4.8 1.7 3.9-.7 25-10.1 25.9-33.1 1.5-29.4-26.5-61.5-76-61.2zM104.2 359.8C88.4 377 66.4 383.5 56.9 378c-10.2-5.9-6.2-31.3 13.2-49.5 11.8-11.1 27-21.4 37.1-27.7 2.3-1.4 5.7-3.4 9.8-5.9.7-.4 1.1-.6 1.1-.6l2.4-1.5c7.1 26 .3 48.9-16.3 67zm115-78.2c-5.5 13.4-17 47.7-24 45.8-6-1.6-9.7-27.6-1.2-53.3 4.3-12.9 13.4-28.3 18.7-34.3 8.6-9.6 18.1-12.8 20.4-8.9 2.9 5.1-10.5 42.3-13.9 50.7zm94.9 45.4c-2.3 1.2-4.5 2-5.5 1.4-.7-.4 1-2 1-2s11.9-12.8 16.6-18.6c2.7-3.4 5.9-7.4 9.3-11.9v1.3c0 15.3-14.8 25.6-21.4 29.8zm73.2-16.7c-1.7-1.2-1.4-5.2 4.3-17.7 2.2-4.9 7.4-13.1 16.3-21 1 3.2 1.7 6.3 1.6 9.2-.1 19.3-13.9 26.5-22.2 29.5z"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 547.8 410.6" className={bw}>
        <path d="M471.4 236c-19.1.1-35.7 4.7-49.6 11.5-5.1-10.1-10.2-19.1-11.1-25.7-1-7.7-2.2-12.4-1-21.6 1.2-9.2 6.6-22.3 6.5-23.3s-1.2-5.7-12.2-5.8-20.5 2.1-21.6 5-3.2 9.5-4.6 16.3c-1.9 10-22 45.7-33.5 64.4-3.7-7.3-6.9-13.7-7.6-18.8-1-7.7-2.2-12.4-1-21.6 1.2-9.2 6.6-22.3 6.5-23.3s-1.2-5.7-12.2-5.8-20.5 2.1-21.6 5-2.3 9.7-4.6 16.3c-2.3 6.6-29 66.2-36 81.6-3.6 7.9-6.7 14.2-8.9 18.5 0 0-.1.3-.4.8-1.9 3.7-3 5.7-3 5.7v.1c-1.5 2.7-3.1 5.2-3.9 5.2-.6 0-1.7-7.2.2-17 4-20.7 13.5-52.9 13.4-54 0-.6 1.8-6.2-6.2-9.1-7.8-2.9-10.6 1.9-11.3 1.9s-1.2 1.7-1.2 1.7 8.7-36.2-16.6-36.2c-15.8 0-37.6 17.3-48.4 32.9-6.8 3.7-21.3 11.6-36.8 20.1-5.9 3.3-12 6.6-17.7 9.7-.4-.4-.8-.9-1.2-1.3-30.6-32.7-87.2-55.8-84.8-99.7.9-16 6.4-58 108.7-109 84.2-41.5 151.2-30 162.8-4.5 16.6 36.4-35.9 104-122.9 113.8-33.2 3.7-50.6-9.1-55-13.9-4.6-5-5.3-5.3-7-4.3-2.8 1.5-1 6 0 8.6 2.6 6.8 13.3 18.8 31.4 24.7 16 5.2 54.9 8.1 102-10.1 52.7-20.4 93.9-77.1 81.8-124.6C330.7 2 250.7-13.9 175 13 130 29 81.2 54.2 46.1 87 4.4 126-2.2 159.9.5 174.1c9.7 50.4 79.2 83.2 107 107.5-1.4.8-2.7 1.5-3.8 2.1-13.9 6.9-66.9 34.6-80.1 63.9-15 33.2 2.4 57 13.9 60.2 35.7 9.9 72.4-7.9 92.1-37.3s17.3-67.6 8.2-85.1c-.1-.2-.2-.4-.4-.6 3.6-2.1 7.3-4.3 10.9-6.4 7.1-4.2 14.1-8.1 20.1-11.3-3.4 9.3-5.9 20.4-7.1 36.4-1.5 18.8 6.2 43.2 16.3 52.8 4.5 4.2 9.8 4.3 13.2 4.3 11.8 0 17.1-9.8 23-21.4 7.2-14.2 13.7-30.7 13.7-30.7s-8.1 44.6 13.9 44.6c8 0 16.1-10.4 19.7-15.7v.1s.2-.3.6-1c.8-1.3 1.3-2.1 1.3-2.1v-.2c3.2-5.6 10.4-18.3 21.1-39.4 13.8-27.2 27.1-61.2 27.1-61.2s1.2 8.3 5.3 22.1c2.4 8.1 7.4 17 11.4 25.6-3.2 4.5-5.2 7-5.2 7l.1.1c-2.6 3.4-5.4 7.1-8.5 10.7-10.9 13-23.9 27.9-25.7 32.2-2.1 5.1-1.6 8.8 2.4 11.8 2.9 2.2 8.1 2.5 13.4 2.2 9.8-.7 16.7-3.1 20.1-4.6 5.3-1.9 11.5-4.8 17.3-9.1 10.7-7.9 17.2-19.2 16.6-34.1-.3-8.2-3-16.4-6.3-24.1 1-1.4 1.9-2.8 2.9-4.2 16.9-24.7 30-51.8 30-51.8s1.2 8.3 5.3 22.1c2 7 6.1 14.6 9.7 22-15.9 12.9-25.7 27.9-29.2 37.7-6.3 18.2-1.4 26.4 7.9 28.3 4.2.9 10.2-1.1 14.6-3 5.6-1.8 12.2-4.9 18.5-9.5 10.7-7.9 21-18.9 20.4-33.8-.3-6.8-2.1-13.5-4.6-20 13.5-5.6 30.9-8.7 53.1-6.1 47.6 5.6 57 35.3 55.2 47.8s-11.8 19.3-15.1 21.4-4.4 2.8-4.1 4.3c.4 2.2 2 2.1 4.8 1.7 3.9-.7 25-10.1 25.9-33.1 1.5-29.4-26.5-61.5-76-61.2zM104.2 359.8C88.4 377 66.4 383.5 56.9 378c-10.2-5.9-6.2-31.3 13.2-49.5 11.8-11.1 27-21.4 37.1-27.7 2.3-1.4 5.7-3.4 9.8-5.9.7-.4 1.1-.6 1.1-.6l2.4-1.5c7.1 26 .3 48.9-16.3 67zm115-78.2c-5.5 13.4-17 47.7-24 45.8-6-1.6-9.7-27.6-1.2-53.3 4.3-12.9 13.4-28.3 18.7-34.3 8.6-9.6 18.1-12.8 20.4-8.9 2.9 5.1-10.5 42.3-13.9 50.7zm94.9 45.4c-2.3 1.2-4.5 2-5.5 1.4-.7-.4 1-2 1-2s11.9-12.8 16.6-18.6c2.7-3.4 5.9-7.4 9.3-11.9v1.3c0 15.3-14.8 25.6-21.4 29.8zm73.2-16.7c-1.7-1.2-1.4-5.2 4.3-17.7 2.2-4.9 7.4-13.1 16.3-21 1 3.2 1.7 6.3 1.6 9.2-.1 19.3-13.9 26.5-22.2 29.5z"></path>
      </svg>
    </div>
  )
}
export default SassIcon