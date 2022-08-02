import React, { useEffect, useState } from 'react'
import {db} from '../Firebase'
import {collection ,getDocs,addDoc,serverTimestamp,doc,updateDoc} from 'firebase/firestore'
import {useRouter} from 'next/router'
import{toast,Toaster} from 'react-hot-toast'
import { useSelector ,useDispatch} from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import style from '../styles/profile.module.css'

import { validateUpdateProfile } from '../components/valid'
import { setLoading,setVendorSettings, setUser,setVendorProfile } from '../redux/slices/authSlice'
import Loading from '../components/Loading'
import Vendornavbar from '../components/VendorNavbar'
import { PaystackButton } from 'react-paystack'


function Profile() {

    
    
    
    const vendorSettings=useSelector((state:RootState)=>state.auth.vendorSettings)
    const vendorProfile=useSelector((state:RootState)=>state.auth.vendorProfile)
    
    const loading=useSelector((state:RootState)=>state.auth.loading)
    const router=useRouter()
    const dispatch=useDispatch<AppDispatch>()
    const [profile,setProfile]:any=useState()
    const [settings,setSettings]:any=useState()

    const getData = async () => {


        try {
            
            const data = await getDocs(collection(db, "vendor_profile"));
            data.forEach((snap)=>{
                if(snap.data()){
                    
                    dispatch(setVendorProfile({...snap.data(),id:snap.id}))
                    setProfile({...snap.data(),id:snap.id})

                    }
            })
            const data2 = await getDocs(collection(db, "admin_profile"));
            data2.forEach((snap)=>{
                if(snap.data()){
                    
                    
                    setSettings({...snap.data(),id:snap.id})
                    
                    
                    console.log(settings);
                    
                    }
            })
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }
    const componentProps :any= {
        email:"abd22655@gmail.com",
        amount:settings && settings.SubscriptionFee * 100,
        metadata: {
          name: profile && profile.name,
          phone: profile && profile.mobileNumber,
        },
        publicKey:"pk_test_529c008634299b5fdf147ab6be3283ceea233bc0",
        text: "Subscribe Package",
        onSuccess:async () =>

        {
                try {

                    dispatch(setLoading(true))
                    await updateDoc(doc(db,"vendor_profile",profile.id),{
                            createdAt:serverTimestamp(),
                            subscriptionPeriod:settings && settings.SubscriptionPeriod,
                            testPeriod:false,
                            subscribe:true
                    })
                    dispatch(setLoading(false))

                    toast.success("subscribed successfully")

                } catch (error) {

                    toast.error(error)
                }
        }
          ,
        onClose: () => alert("Wait! You need this oil, don't go!!!!"),
      }

   useEffect(()=>{
    

    
 
        getData()
        
        
    
    
   },[])
 
  
  return (
    <>
     
    <Toaster/>
    { loading && <Loading/>}
    { settings ?
    
    
    
   
    <div className={` ${style.formContainer} w-100 h-100 d-flex justify-content-center align-items-center container mt-5 `} >
         <div>
         <div className="row ">
            

                
            <h3>Subscription fee :  {settings && settings.SubscriptionFee}</h3>

            

            
         </div>
         <br />
         <div className="row">

            <h3>Subscription Time period : {settings && settings.SubscriptionPeriod}</h3>
         </div>
         <PaystackButton {...componentProps}/> 


         </div>
    
    </div>: " loading ..."}
    </>
  )
}

export default Profile