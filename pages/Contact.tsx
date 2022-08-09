import React, { useEffect, useState } from 'react'

import CustomerNavbar from '../components/CustomerNavabar'
import {toast,Toaster} from 'react-hot-toast'
import Loading from '../components/Loading'
import { useDispatch,useSelector } from 'react-redux'
import { setLoading ,setVendorProfile} from '../redux/slices/authSlice'
import style from '../styles/vendor.module.css'
import axios from 'axios'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../Firebase'
import { AppDispatch } from '../redux/store'

function Contact() {
    const user:any=useSelector((state:any)=>state.auth.user)
    const loading:any=useSelector((state:any)=>state.auth.loading)
    const vendorProfile:any=useSelector((state:any)=>state.auth.vendorProfile)
    const dispatch=useDispatch<AppDispatch>()
    const [text,setText]:any=useState("")
    const [profile,setProfile]:any=useState({})
    const handleChange=async(e:any)=>{
      setText(e.target.value)
    }
    const handleClick=async()=>{
      if(text==""){
        toast.error("enter some text ")
      }else{

        try {
          dispatch(setLoading(true))

          const response = await axios.post('/api/sendMailToVendor',{
            email:profile?profile.email:"",
            customerName:user?user.firstName+" "+user.surname:"",
            text,
            customerEmail:user? user.email:""
         
        
          })
          if(response){
            dispatch(setLoading(false))
               toast(response.data.msg)
          }
        
          
          dispatch(setLoading(false))
          
        } catch (error) {
          dispatch(setLoading(false))
          toast.error(error.message)

        }
       
      }
    }
    const getData=async()=>{
      const data=await getDocs(collection(db,"vendor_profile"))
      data.forEach((snap)=>{
        if(snap.data()){
          setVendorProfile(snap.data())
          setProfile(snap.data())
        }
      })
    }
    useEffect(()=>{
getData()
    },[])
  return (
    <>
    <Toaster/>
    {loading && <Loading/>}
    <CustomerNavbar/>
    <div className={`${style.contact} container mt-5 pt-5`}>

<div className="row">

    

        <textarea name="description" id="" onChange={handleChange} placeholder='Kindly type your message here to send us an email...' />
    
</div>
<div className="row">
    <div className="col-md-6"></div>
    <div className="col-md-6 text-end">
    <button className='btn' onClick={handleClick}> Send Email</button>

    </div>
</div>
    </div>
    
    </>
  )
}

export default Contact