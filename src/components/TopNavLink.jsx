import { ScrollLink } from "react-scroll"

const TopNavLink = (props) => {
  return (
    <button {...props}>
      {props.children}
    </button>
  )
}

module.exports = ScrollLink(TopNavLink);

export default TopNavLink