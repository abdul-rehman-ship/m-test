import React, { useEffect, useState } from 'react'
import {db} from '../Firebase'
import {collection ,getDocs,doc,updateDoc, addDoc, serverTimestamp} from 'firebase/firestore'
import {useRouter} from 'next/router'
import{toast,Toaster} from 'react-hot-toast'
import { useSelector ,useDispatch} from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import style from '../styles/profile.module.css'
import Link from 'next/link'
import { validateUpdateProfile } from '../components/valid'
import { setLoading, setUser,setVendorSettings } from '../redux/slices/authSlice'
import Loading from '../components/Loading'
import VendorNavbar from '../components/VendorNavbar'
export default function VendorSettings() {


    const loading=useSelector((state:RootState)=>state.auth.loading)
    const email=useSelector((state:RootState)=>state.auth.customerEmail)
    const isVendor=useSelector((state:RootState)=>state.auth.vendor)
    const vendorSettings=useSelector((state:RootState)=>state.auth.vendorSettings)
    const router=useRouter()
    const dispatch=useDispatch<AppDispatch>()
    const initialSettings={
      currency:"",
      employeeDeliveryBuffer:"",
      orderDeliveryBuffer:"",
      numberOfDeliveryDate:"",
      paymentSuccessfullMessage:"",
      paymentFailedMessage:"",
      minimumStockLevel:"",
      paymentMethod:"paystack",
      public_key:""
      
    }
    
    const [mUser,setMUser]:any=useState(initialSettings)

    const getData = async () => {


        try {
            
            const data = await getDocs(collection(db, "vendor_settings"));
            data.forEach((snap)=>{
                if(snap.data()){
                    setMUser(snap.data())
                    dispatch(setVendorSettings({...snap.data(),id:snap.id}))
                    }
            })
          

            
        } catch (error) {
            toast.error(error.message)
            
        }
    }
   useEffect(()=>{
    if(!isVendor){
        router.push("/")
    }
  
        getData()
        
        
    

    
        
    
   },[])
   const handleSubmit=async(e:any)=>{
    e.preventDefault()
    
    
    try {
        
        
        
        dispatch(setLoading(true))

        
        
        if(vendorSettings!==null){
           if( Object.keys(vendorSettings).length>0 ){
            await updateDoc(doc(db, "vendor_settings",vendorSettings.id),mUser )
        
           }  
        }else{
                await addDoc(collection(db,"vendor_settings"),{...mUser,
                createdAt:serverTimestamp()
                })
                
                
            
        }

          
                dispatch(setVendorSettings(mUser))
                dispatch(setLoading(false))
                toast.success("Settings Updated")
          
          
          

    }catch(error:any){
        toast.error(error)

    }
    
    
   }
   const handleChange=async(e:any)=>{
    const {name,value}=e.target
    setMUser({...mUser,[name]:value})
    
   }
  return (
    <>
   <Toaster/>
    <VendorNavbar/>
        { loading && <Loading/>}
      
        <div className={` ${style.formContainer} container mt-5 `} >
      
            {/* <Link href="VendorCustomerDashboard">
            <button className={`btn ${style.back_btn} btn-light `} style={{fontSize:'large'}}>
            &#8592; Back </button></Link> */}
        <form onSubmit={handleSubmit}>
      

        <div className={`row mt-4 px-3`}>

            <div className="col-md-6">
                    <span>Currency *</span>
                    <input type="text"  name="currency" onChange={handleChange}  className="form-control mt-2" value={mUser.currency}   required/>


            </div>
            <div className="col-md-6">
                
            <span>Employee Delivery Buffer*</span>
                    <input type="number"  min={0}  name="employeeDeliveryBuffer" onChange={handleChange}  className="form-control mt-2" value={mUser.employeeDeliveryBuffer} required  />

            </div>

        </div>

        <div className="row mt-4 mx-2">


<div className="col-md-6">
        <span>Order Delivery Buffer*</span>
        <input type="number"   min={0} className="form-control mt-2"  name='orderDeliveryBuffer' value={mUser.orderDeliveryBuffer} onChange={handleChange}  required/>


</div>
<div className="col-md-6">
    
<span>Number Of Delivery Date*</span>
        <input type="number"  min={0}  className="form-control mt-2"  name="numberOfDeliveryDate" onChange={handleChange}  value={mUser.numberOfDeliveryDate} required  />

</div>

</div>


<div className="row mt-4 mx-2">

<div className="col-md-6">
        <span>Payment Successfull Message*</span>
        <input type="text"   className="form-control mt-2" name="paymentSuccessfullMessage" onChange={handleChange}  value={mUser.paymentSuccessfullMessage}  required/>


</div>
<div className="col-md-6">
    
<span>Payment Failed Message*</span>
        <input type="text"  className="form-control mt-2"  name="paymentFailedMessage" onChange={handleChange}  value={mUser.paymentFailedMessage} required />

</div>

</div>

<div className="row mt-4 mx-2">

<div className="col-md-6">
        <span>Minimum Stock Level*</span>
        <input type="number"     min={0} className="form-control mt-2"  name="minimumStockLevel" onChange={handleChange}  value={mUser.minimumStockLevel} required />


</div>
<div className="col-md-6">
<span>Payment method*</span>
    <select name="paymentMethod" value={mUser.paymentMethod} onChange={handleChange} className="form-control mt-2" >


        <option value="paystack">Paystack</option>
        <option value="flutterWave">FlutterWave</option>

    </select>

</div>

</div>

<div className="row mt-4 mx-2">

<div className="col-md-6">
        <span>Payment Public key*</span>
        <input type="text"   className="form-control mt-2"  name="public_key" onChange={handleChange}  value={mUser.public_key} required  />


</div>


</div>
<div className="row mt-4 mx-2">

<div className="col-md-6">
       
<button type='submit' className='btn'>update settings</button>

</div>


</div>
</form>
        
        </div>
        
    
    
    
    
    
    </>
  )
}
