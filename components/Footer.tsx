'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import {Instagram, Facebook, Mail} from 'lucide-react'

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
      setMounted(true)
  }, [])
  
  return mounted && 
  <footer className=" border-t-[1.5px] py-4 dark:border-slate-900 border-blue-200 flex flex-col px-10">
    <div className="flex justify-between ">
        <div className="flex flex-col gap-2">
              <p className="dark:text-slate-400 text-slate-600">My Portfolio</p>
              <div className="flex text-slate-500 gap-4 text-sm">
                  <Link href='/home'> <Instagram className=" text-pink-500"/></Link>
                  <Link href='/home'> <Facebook  className="text-blue-500"/></Link>
                  <Link href='/home'> <Mail className="text-blue-600"/></Link>
              </div>
        </div>
        <div>
          <h1 className="text-slate-600 dark:text-slate-400"> Links</h1>
          <ul className="text-slate-500 text-sm">
            <li>Home</li>
            <li>Contact Us</li>
            <li>Explore</li>
            <li>Vehichle Explorer</li>
            <li>Terms of use</li>
          </ul>
        </div>
        <div>
        <h1 className="text-slate-600 dark:text-slate-400"> Account</h1>
          <ul className="text-slate-500 text-sm">
            <li>Login</li>
            <li>Signup</li>
            <li>Forgot Password</li>
            <li>Contact</li>
          </ul>

        </div>
    </div>
    <div className="flex text-sm text-slate-600 justify-between pt-4">
        <div>@All rights reserved. Saurabh Thapliyal</div>
        <div>Terms and condition</div>
    </div>
  </footer>
}

export default Footer