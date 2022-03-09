const JSIcon = ({className, bw, colour}) => {
  
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 630" className={colour}> 
        <path fill="#f7df1e" d="M0 0h630v630H0z"/>
        <path d="M423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.37-38.1-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.95 36.4 35.95l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13c9.3 16.5 17.76 30.45 38.1 30.45 19.45 0 31.72-7.61 31.72-37.2v-201.3h59.2v202.1c0 61.3-35.94 89.2-88.4 89.2-47.4 0-74.85-24.53-88.81-54.075z"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 630" className={bw}> 
        <path d="M0 0v630h630V0H0zm343.1 491.4c0 61.3-35.9 89.2-88.4 89.2-47.4 0-74.9-24.5-88.8-54.1l48.2-29.2c9.3 16.5 17.8 30.5 38.1 30.5 19.5 0 31.7-7.6 31.7-37.2V289.3h59.2v202.1zM483 580.7c-55 0-90.5-26.2-107.9-60.5l48.1-28c12.7 20.7 29.2 36 58.4 36 24.5 0 40.2-12.3 40.2-29.2 0-20.3-16.1-27.5-43.1-39.3l-14.8-6.4c-42.7-18.2-71.1-41-71.1-89.2 0-44.4 33.8-78.2 86.7-78.2 37.6 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.1-18.2-21.1-25.4-38.1-25.4-17.3 0-28.3 11-28.3 25.4 0 17.8 11 25 36.4 36l14.8 6.3c50.3 21.6 78.7 43.6 78.7 93 0 53.3-41.9 82.5-98.1 82.5z"/>
      </svg>
    </div>
  )
}
export default JSIcon