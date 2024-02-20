'use client'

import {Roboto} from 'next/font/google'
import { Mail, MessageCircleMoreIcon, UserCircleIcon } from "lucide-react"
import {type FieldValues, useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { zodResolver } from '@hookform/resolvers/zod';
import { TcontactSchema, contactSchema } from '@/utils/types';

const roboto = Roboto ({
  weight: '500',
  subsets: ['latin'],
})



const Contact = () => {
  const {register, 
          handleSubmit,
          formState:{errors, isSubmitting}, 
          reset,
          setError,
        } = useForm<TcontactSchema>({
        resolver:zodResolver(contactSchema)
      });

      const onSubmit = async(data:TcontactSchema) => {
        const response = await fetch('/api/send-mail', {
          method:'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body:JSON.stringify({
            name:data.name,
            email:data.email,
            message:data.message
          })
        });
    
        if (response.ok) {
           toast.success('Email Sent Successfully');
           reset();
        } else {
          const responseData = await response.json();
          if (responseData.errors) {
            const errors = responseData.errors;
            if (errors.name) {
              setError("name", {
                type: "server",
                message: errors.name
              });
            }
            if (errors.email) {
              setError('email', {
                type: 'server',
                message: errors.email
              });
            }
            if (errors.message) {
              setError('message', {
                type: 'server',
                message: errors.message
              });
            }
          } else {
            toast.error("Something went wrong!");
          }
        }
    }
    

  return (
    <div className='w-full grid place-items-center'>
       <div className={`text-4xl pt-10 underline text-center bg-clip-text bg-gradient-to-br font-mono 
      from-violet-500 to-blue-600 text-transparent ${roboto.className}`}>
        Contact <span className="text-slate-500">Me</span>
      </div>

      <form 
      onSubmit={handleSubmit(onSubmit)}
      className="lg:w-2/4 w-full  grid place-items-center lg:p-10 p-4 gap-4 
      dark:text-slate-100 text-slate-700 antialiased" 
     >
        <div className="w-full h-full relative flex flex-col">
          <input 
            {...register('name')}
            placeholder="Name" 
            className=" py-2 pr-4 pl-12 dark:bg-white/10 bg-white/50 rounded-lg" 
            type='text' 
            disabled={isSubmitting}
          />
          <UserCircleIcon size={30} className="absolute left-2 top-1 text-blue-600" />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm border-[.5px] border-red-500 w-full 
          py-2 text-center">{`${errors.name.message}`}</p>
        )}

        <div className="w-full h-full relative flex flex-col">
          <input 
          {...register('email')}
          placeholder="Email" 
          type='email' 
          disabled={isSubmitting}
          className=" py-2  pr-4 dark:bg-white/10 bg-white/50 pl-12 rounded-lg"
          />
          <Mail size={30} className="absolute left-2 top-1 text-blue-600" />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm border-[.5px] border-red-500  w-full text-center
          py-2">{`${errors.email.message}`}</p>
        )}

        <div className="w-full h-full relative flex flex-col ">
          <textarea 
          {...register('message')}
          placeholder="Message" 
          disabled={isSubmitting}
          className=" py-2 pr-4 bg-white/50  dark:bg-white/10 min-h-64 pl-12 rounded-lg" />
          <MessageCircleMoreIcon size={30} className="absolute left-2 top-1 text-blue-600"/>
        </div>
        {errors.message && (
          <p className="text-red-500 text-sm border-[.5px] border-red-500  w-full text-center
          py-2">{`${errors.message.message}`}</p>
        )}

        <button 
        className={`bg-gradient-to-tr from-blue-500 to-violet-500  py-2 w-full 
                    rounded-lg text-slate-100 hover:bg-gradient-to-bl
                    ${'disabled:from-blue-700 '}`}
        type='submit'
        disabled={isSubmitting}
        >Send Mail</button>
      </form>
    </div>
  )
}

export default Contact