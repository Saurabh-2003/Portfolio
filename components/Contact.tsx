'use client'

import { useState } from "react"
import {Roboto} from 'next/font/google'
import { Mail, MessageCircleMoreIcon, UserCircleIcon } from "lucide-react"

const roboto = Roboto ({
  weight: '500',
  subsets: ['latin'],
})

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message,setMessage] = useState('')

  const contactMe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    console.log('form submitted')
    setName('')
    setEmail('')
    setMessage('')

    console.log('form cleared')
  }


  return (
    <div className='w-full grid place-items-center'>
       <div className={`text-4xl pt-10 underline text-center bg-clip-text bg-gradient-to-br font-mono 
      from-violet-500 to-blue-600 text-transparent ${roboto.className}`}>
        Contact <span className="text-slate-500">Me</span>
      </div>

      <form className="lg:w-2/4 w-full  grid place-items-center lg:p-10 p-4 gap-4 
      dark:text-slate-100 text-slate-700 antialiased" 
      onSubmit={contactMe}>
        <div className="w-full h-full relative flex flex-col">
          <input 
          onChange={(e) => setName(e.target.value)}
          placeholder="Name" 
          className=" py-2 pr-4 pl-12 dark:bg-white/10 bg-white/50 rounded-lg" 
          type='text' />
          <UserCircleIcon size={30} className="absolute left-2 top-1 text-blue-600" />
        </div>

        <div className="w-full h-full relative flex flex-col">
          <input 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" 
          type='email' 
          className=" py-2  pr-4 dark:bg-white/10 bg-white/50 pl-12 rounded-lg"/>
          <Mail size={30} className="absolute left-2 top-1 text-blue-600" />
        </div>

        <div className="w-full h-full relative flex flex-col ">
          <textarea 
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message" 
          className=" py-2 pr-4 bg-white/50  dark:bg-white/10 min-h-80 pl-12 rounded-lg" />
          <MessageCircleMoreIcon size={30} className="absolute left-2 top-1 text-blue-600"/>
        </div>

        <button className='bg-gradient-to-tr from-blue-500 to-violet-500  py-2 w-full rounded-lg
         text-slate-100 hover:bg-gradient-radial'
        type='submit'>Send Mail</button>
      </form>
    </div>
  )
}

export default Contact