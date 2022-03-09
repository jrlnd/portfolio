const HTML5Icon = ({className, bw, colour}) => {
  
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 362.8 411.4" className={colour}>
        <path fill="#e44d26" d="M33 370.4L0 0h362.8l-33 370.2-148.7 41.2"/>
        <path fill="#f16529" d="M181.4 379.9V30.4h148.3l-28.3 316"/>
        <path fill="#ebebeb" d="M67.4 75.7h114v45.4h-64.2l4.2 46.5h60v45.3H79.8m2 22.8h45.6l3.2 36.3 50.8 13.6V333l-93.2-26" />
        <path fill="#fff" d="M295 75.7H181.2v45.4h109.6m-4.1 46.5H181.2V213h56l-5.3 59-50.7 13.6v47.2l93-25.8" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 362.8 411.4" className={bw}>
        <path d="M0 0l33 370.4 148.1 41 148.7-41.2L362.8 0H0zm290.8 121.1H117.2l4.2 46.5h165.3L274.2 307l-92.8 25.7v.3l-93.2-26-6.4-71.3h45.6l3.2 36.3 50.7 13.6 50.6-13.6 5.3-59h-56v-.1H79.8L67.4 75.7H295l-4.2 45.4z"/>
      </svg>
    </div>
  )

}
export default HTML5Icon