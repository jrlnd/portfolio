import { useEffect, useState } from "react"
import Image from "next/image";
import { Tween } from "react-gsap";
import { ChatAlt2Icon, XIcon, ChevronRightIcon } from "@heroicons/react/solid"
import emoji from 'react-easy-emoji'



const ChatBot = ({setDialogOpen}) => {

  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatQuery, setChatQuery] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [optionFilter, setOptionFilter] = useState(null);
  const [furtherOptionsAvail, setFurtherOptionsAvail] = useState(false);
  const [showFurtherOptions, setShowFurtherOptions] = useState(false);
  const [willOpenDialog, setWillOpenDialog] = useState(false);

  const svgEmoji = (input) => (emoji(input, {
      baseUrl: 'https://twemoji.maxcdn.com/2/svg/',
      ext: '.svg',
      size: '',
      props: {className: 'inline-block !mx-1'}
    })
  )

  const initialMessages = [
    {type: "message", text: "Hi, nice to meet you 👋"},
    {type: "message", text: "Thanks for visiting my portfolio!"},
    {type: "message", text: "Can I help you with anything?"}
  ]

  const chatOptions = [
    {type: "option", name: 'like', text:"👍 I like your site!"},
    {type: "option", name: 'chat', text:"✉ I'd like to chat more..."},
    {type: "option", name: 'hire', text:"👨‍💼 I want to hire you!"},
  ]

  const likedSiteMessages = [
    {type: "message", text: "Oh, thank you so much 🥰"},
    {type: "message", text: "I worked really hard on it~"},
    {type: "message", text: "I appreciate you looking around"},
    {type: "message", text:  "How else can I help you?"},
  ]

  const chatMoreMessages = [
    {type: "message", text: "Cool! I'm always open to chat 🤗"},
    {type: "message", text: "Send me a message and I'll get back to you as soon as I can!"},
  ]

  const hireMeMessages = [
    {type: "message", text: "Awesome! Thanks for your interest 🤸‍♂️"},
    {type: "message", text: "I'm currently available for new work opportunities, so today is your lucky day!"},
    {type: "message", text: "Let's discuss this opportunity further..."},
  ]

  const furtherOptions = [
    {type: "option", name: "email", text: "📨 Send me an e-mail"},
    {type: "option", name: "message", text: "📄 Use the contact form"},
    {type: "option", name: "other", text: "Other options"},
  ]

  const emailMessages = [
    {type: "message", text: "Opening up the mail client..."},
    {type: "message", text: "Can I help you with anything else?"}
  ]

  const messageMessages = [
    {type: "message", text: "Opening up the contact form..."},
    {type: "message", text: "Can I help you with anything else?"}
  ]

  const otherMessages = [
    {type: "message", text: "Can I help you with anything else?"}
  ]

  const replyMessages = {
    'like': {type: "reply", text: "I like your site!"},
    'chat': {type: "reply", text: "I'd like to chat more "},
    'hire': {type: "reply", text: "I want to hire you!"},
    'email': {type: "reply", text: "I want to send you an email"},
    'message': {type: "reply", text: "I want to use the contact form"},
    'other': {type: "reply", text: "I want to see other options"},
  }

  useEffect(() => {
    if (chatOpen)
      document.querySelector("body").classList.add("overflow-hidden");
    else
      document.querySelector("body").classList.remove("overflow-hidden");
  }, [chatOpen])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatQuery.length) {
        const message = chatQuery.shift();
        setChatQuery(chatQuery);
        setChatHistory(x => [...x, message]);
        if (willOpenDialog) {
          setDialogOpen(true);
          setWillOpenDialog(false);
        }
      } else if (furtherOptionsAvail) {
        setShowFurtherOptions(true) 
      } else {
        setShowOptions(true)
      }
      
    }, chatHistory.length === 0 ? 100: 1250)
    return () => clearTimeout(timer);
  }, [chatQuery, chatHistory, furtherOptionsAvail, setDialogOpen, willOpenDialog]);

  const handleOpenChat = () => {
    setShowOptions(false);
    setFurtherOptionsAvail(false);
    setShowFurtherOptions(false);
    setOptionFilter(null);
    setChatOpen(true);
    setChatQuery(initialMessages);
    setChatHistory([]);
  }

  const handleChatOption = (name) => {
    setShowOptions(false);
    setFurtherOptionsAvail(false);
    setShowFurtherOptions(false);
    
    setChatHistory(x => [...x, replyMessages[name]])
    switch (name) {
      case 'like': return handleLike()
      case 'chat': return handleChatMore()
      case 'hire': return handleHire()
      case 'email': return handleEmail()
      case 'message': return handleMessage()
      case 'other': return handleOther()
      default: break;
    }
  }

  const handleLike = () => {
    setOptionFilter("like");
    setChatQuery(likedSiteMessages)
  }

  const handleChatMore = () => {
    setOptionFilter("chat");
    setChatQuery(chatMoreMessages)
    setFurtherOptionsAvail(true);
  }

  const handleHire = () => {
    setOptionFilter("hire");
    setChatQuery(hireMeMessages)
    setFurtherOptionsAvail(true);
  }

  const handleEmail = () => {
    setChatQuery(emailMessages)
    setFurtherOptionsAvail(false);
    const newTab = window.open('')
    newTab.location.href = 'mailto:rjgaoat@gmail.com'
  }

  const handleMessage = () => {
    setWillOpenDialog(true);
    setChatQuery(messageMessages)
    setFurtherOptionsAvail(false)
  }

  const handleOther = () => {
    setChatQuery(otherMessages)
    setFurtherOptionsAvail(false);
  }

  return (
    <>
      <Tween from={{ opacity: 0, y: '100%' }} to={{ opacity: 1, y: '0%' }} duration={1} delay={5}>
        <div className="fixed right-3 bottom-3"> 
          <button className={`group w-12 h-12 flex items-center justify-center bg-theme-gray-900 hover:bg-theme-white-100 border-2 border-theme-white-100 drop-shadow-md rounded-full transition duration-300 ${chatOpen ? "opacity-0" : "opacity-100"}`} onClick={handleOpenChat}>
            <ChatAlt2Icon className="fill-theme-white-100 w-7 group-hover:fill-theme-gray-900 transition duration-300" />
          </button>
        </div>
      </Tween>

      <div className={`fixed inset-0 md:top-auto md:left-auto md:right-3 md:bottom-3 z-50 md:z-30 transition-all duration-300  ${chatOpen ? "translate-y-0 opacity-100 chat-visible" : "opacity-0 translate-y-full" }`}>
        
        <div className="relative w-full md:w-80 h-full md:h-[36rem] pt-16 bg-theme-white-300/75 backdrop-blur-md md:rounded-lg shadow-md shadow-black/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-16 flex items-center justify-between px-4 bg-gradient-to-r from-theme-orange-400 to-theme-red-500 text-theme-gray-900">
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10 border-2 border-theme-gray-900 rounded-full overflow-hidden">
                <Image src="/images/me.jpg" layout="fill" objectFit="cover" alt="Jr Rolando" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold flex items-center space-x-1">JR Rolando</div>
                <span className="text-xs opacity-75">last seen coding at 3:14 PM</span>
              </div>
            </div>
            <button className="w-7 h-7 flex items-center justify-center" onClick={() => setChatOpen(!chatOpen)}>
              <XIcon className="fill-theme-gray-900 w-7 transition-colors duration-300 hover:fill-theme-white-100" />
            </button>
          </div>

          <div className="overflow-y-auto flex flex-col-reverse h-full p-4 text-sm">
            <div className="flex-1 space-y-3">
              {chatHistory.map((message, i) => (
                <div key={i} className="flex message-appear text-theme-gray-900">
                  <div className={`${message.type === "message" ? "bg-theme-white-100 " : "bg-theme-red-200 ml-auto"} py-2 px-3 rounded-lg shadow-sm shadow-black/10`}>
                    {svgEmoji(message.text)}
                  </div>
              </div>
              ))}
              {showFurtherOptions && furtherOptions.map((option, i) => (
                <div key={i} className="flex message-appear">
                  {option.name === "email" ? (
                    <button onClick={() => handleChatOption(option.name)} className="flex items-center ml-auto py-2 pl-3 pr-1 bg-theme-red-600 rounded-full text-theme-white-100 transition-colors duration-300 hover:bg-theme-red-400 shadow-sm">
                      <span>{svgEmoji(option.text)}</span>
                      <span><ChevronRightIcon className="w-5" /></span> 
                  </button>
                  ) : (
                    <button onClick={() => handleChatOption(option.name)} className="flex items-center ml-auto py-2 pl-3 pr-1 bg-theme-red-600 rounded-full text-theme-white-100 transition-colors duration-300 hover:bg-theme-red-400 shadow-sm">
                      <span>{svgEmoji(option.text)}</span>
                      <span><ChevronRightIcon className="w-5" /></span> 
                    </button>
                  )}
                </div>
              ))}
              {showOptions && chatOptions.filter(x => x.name !== optionFilter).map((option, i) => (
                <div key={i} className="flex message-appear">
                  <button onClick={() => handleChatOption(option.name)} className="flex items-center ml-auto py-2 pl-3 pr-1 bg-theme-red-600 rounded-full text-theme-white-100 transition-colors duration-300 hover:bg-theme-red-400  shadow-sm">
                    <span>{svgEmoji(option.text)}</span>
                    <span><ChevronRightIcon className="w-5" /></span> 
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ChatBot