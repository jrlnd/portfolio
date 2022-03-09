import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircleIcon, XIcon } from "@heroicons/react/solid"
import { LoadingIcon } from "./icons";

const ContactDialog = ({dialogOpen, setDialogOpen}) => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [sentStatus, setSentStatus] = useState(null);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await fetch("/api/message", {
        'method': 'POST',
        'body': JSON.stringify(data),
      })
      setIsLoading(false);
      setSentStatus("sent")
    } catch(error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    if (dialogOpen) {
      document.querySelector("body").classList.add("md:overflow-y-hidden");
      document.querySelector("body").classList.add("overflow-hidden");
      document.getElementById("dialog-container").classList.remove("z-50")
      document.getElementById("dialog-container").classList.add("z-50")
    } else {
      document.querySelector("body").classList.remove("md:overflow-y-hidden");
      document.querySelector("body").classList.remove("overflow-hidden");
      const timer = setTimeout(() => {
        document.getElementById("dialog-container").classList.remove("z-50")
        document.getElementById("dialog-container").classList.add("-z-50")
      }, 500);
      return () => clearTimeout(timer);
    }  
  }, [dialogOpen])

  const classes = {
    label: "flex items-center justify-between text-sm",
    labelError: "flex items-center justify-between text-sm text-theme-red-500 font-semibold",
    input: "w-full py-1.5 px-3 md:py-3 md:px-4 bg-white border-2 border-theme-gray-900/20 rounded-lg outline-theme-orange-500",
    inputError: "w-full py-1.5 px-3 md:py-3 md:px-4 bg-white border-2 border-theme-red-500 rounded-lg outline-theme-gray-900",
    error: "text-sm font-normal italic text-theme-red-500",
    textArea: "w-full h-48 min-h-[12rem] resize-y max-h-96 py-1.5 px-3 md:py-3 md:px-4 bg-white border-2 border-theme-gray-900/20 rounded-lg outline-theme-orange-500",
    textAreaError: "w-full h-48 min-h-[12rem] resize-y max-h-96 py-1.5 px-3 md:py-3 md:px-4 bg-white border-2 border-theme-red-500 rounded-lg outline-theme-gray-900"
  }

  const closeSuccess = () => {
    setIsLoading(false);
    setSentStatus(null);
    reset();
  }

  return (
    <div id="dialog-container" className={`fixed inset-0 flex flex-col items-center bg-theme-gray-900/50 justify-center transition duration-500 ${dialogOpen ? "backdrop-blur-md opacity-100" : "backdrop-blur-none opacity-0"}`}>
      <div className={`relative w-full h-full md:h-auto max-w-screen-md flex flex-col items-center justify-center p-8 md:rounded-lg bg-theme-white-100 text-theme-gray-900 transition duration-500 ${dialogOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
        <button className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center" onClick={() => setDialogOpen(!dialogOpen)}>
          <XIcon className="fill-theme-gray-900 w-7 transition-colors duration-300 hover:fill-theme-orange-500" />
        </button>
        <h1 className="font-display uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl md:mb-2">
          Send me a message
        </h1>
        <h2 className="font-serif italic sm:text-lg md:text-xl lg:text-2xl mb-4">
          I&rsquo;ll get back to you as soon as I can!
        </h2>

        <div className="w-full relative">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-screen-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className={errors.fullName ? classes.labelError : classes.label}>Full Name {errors.fullName && <span className={classes.error}>{errors.fullName.message}</span>}</label>
              <input type="text" name="fullName" placeholder="Enter your name" className={errors.fullName ? classes.inputError: classes.input} {...register('fullName', { required: "Name is required" })} />
              
            </div>
            <div>
            <label htmlFor="email" className={errors.email ? classes.labelError : classes.label}>Email {errors.email && <span className={classes.error}>{errors.email.message}</span>}</label>
              <input type="email" name="email" placeholder="Enter your e-mail" className={errors.email ? classes.inputError: classes.input} {...register('email', { required: "Email is required", pattern: {value: /\S+@\S+\.\S+/, message: "Please enter a valid email"} })} />
            </div>
            <div className="md:col-span-2">
            <label htmlFor="subject" className={errors.subject ? classes.labelError : classes.label}>Subject {errors.subject && <span className={classes.error}>{errors.subject.message}</span>}</label>
              <input type="text" name="subject" placeholder="Enter your subject" className={errors.subject ? classes.inputError: classes.input} {...register('subject', { required: "A subject line is required" })} />
            </div>
            <div className="md:col-span-2">
            <label htmlFor="content" className={errors.content ? classes.labelError : classes.label}>Message {errors.content && <span className={classes.error}>{errors.content.message}</span>}</label>
              <textarea name="content" placeholder="Enter your message..." className={errors.content ? classes.textAreaError: classes.textArea} {...register('content', { required: "A message body is required" })} />
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <input value="Clear" type="button" onClick={() => reset()} className="w-full border-2 border-theme-gray-900/20 bg-white hover:bg-theme-gray-900/10 hover:cursor-pointer rounded-full p-2 md:p-3 font-bold uppercase transition-colors duration-300" />
              </div>
              <div>
                <button type="submit" className="w-full flex items-center justify-center border-2 border-transparent bg-theme-orange-500 hover:bg-theme-orange-600 rounded-full p-2 md:p-3 font-bold uppercase text-theme-white-100 transition-colors duration-300">
                  {isLoading ? (<><LoadingIcon /><span>Processing...</span></>) : (<span>Submit</span>)}
                </button>
              </div>
            </div>
          </form>
          {sentStatus === "sent" && (
            <div className="absolute inset-0 bg-green-200 border-2 border-green-700 rounded-lg text-green-800 space-y-4">
              <div className="relative h-full w-full flex flex-col items-center justify-center">
              <button className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center" onClick={() => closeSuccess()}>
                <XIcon className="fill-theme-gray-900 w-7 transition-colors duration-300 hover:fill-theme-white-100" />
              </button>
                <h2 className="font-semibold text-3xl flex items-center space-x-2">
                  <CheckCircleIcon className="w-10 h-10 inline-block" />
                  <span>Your message has been sent</span>
                </h2>
                <p>
                  Thanks so much for reaching out! 
                </p>
              </div>  
            </div>
          )}
        </div>
        
        
      </div>
    </div>
  )
}
export default ContactDialog