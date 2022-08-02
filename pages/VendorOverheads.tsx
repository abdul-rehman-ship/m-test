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
export default function VendorOverheads() {


    const loading=useSelector((state:RootState)=>state.auth.loading)
    const email=useSelector((state:RootState)=>state.auth.customerEmail)
    const isVendor=useSelector((state:RootState)=>state.auth.vendor)
    const vendorSettings=useSelector((state:RootState)=>state.auth.vendorOverheads)
    const router=useRouter()
    const dispatch=useDispatch<AppDispatch>()
    const initialSettings={
      annualRent:"",
      monthlySalaries:"",
      energyCost:"",
      cleaningCost:"",
      annualInsurance:"",
      maintenance:"",
      securityCost:"",
      
      otherOverheads:""
      
    }
    
    const [mUser,setMUser]:any=useState(initialSettings)

    const getData = async () => {


        try {
            
            const data = await getDocs(collection(db, "vendor_overheads"));
            data.forEach((snap)=>{
                if(snap.data()){
                    setMUser(snap.data())
                    }
            })
          

            
        } catch (error) {
            toast.error(error.message)
            
        }
    }
   useEffect(()=>{
    if(!isVendor){
        router.push("/")
        
        
    }else{
        getData()
        
        
    }

    
        
    
   },[])
   const handleSubmit=async(e:any)=>{
    e.preventDefault()
    
    
    try {
        
        
        
        dispatch(setLoading(true))

        
        
        if(vendorSettings!==null){
           if( Object.keys(vendorSettings).length>0 ){
            await updateDoc(doc(db, "vendor_overheads",vendorSettings.id),mUser )
        
           }  
        }else{
                await addDoc(collection(db,"vendor_overheads"),{...mUser,
                createdAt:serverTimestamp()
                })
                
                
            
        }

          
                dispatch(setVendorSettings(mUser))
                dispatch(setLoading(false))
                toast.success("Overheads Updated")
          
          
          

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
                    <span>Annual Rent *</span>
                    <input type="text"  name="annualRent" onChange={handleChange}  className="form-control mt-2" value={mUser.annualRent}   required/>


            </div>
            <div className="col-md-6">
                
            <span>Total monthly salaries*</span>
                    <input type="number"  min={0}  name="monthlySalaries" onChange={handleChange}  className="form-control mt-2" value={mUser.monthlySalaries} required  />

            </div>

        </div>

        <div className="row mt-4 mx-2">


<div className="col-md-6">
        <span>Monthly Energy cost*</span>
        <input type="number"   min={0} className="form-control mt-2"  name='energyCost' value={mUser.energyCost} onChange={handleChange}  required/>


</div>
<div className="col-md-6">
    
<span>Monthly cleaning cost*</span>
        <input type="number"  min={0}  className="form-control mt-2"  name="cleaningCost" onChange={handleChange}  value={mUser.cleaningCost} required  />

</div>

</div>


<div className="row mt-4 mx-2">

<div className="col-md-6">
        <span>Annual Insurance*</span>
        <input type="number"    className="form-control mt-2" name="annualInsurance" onChange={handleChange}  value={mUser.annualInsurance}  required/>


</div>
<div className="col-md-6">
    
<span>Monthly maintenance*</span>
        <input type="text"  className="form-control mt-2"  name="maintenance" onChange={handleChange}  value={mUser.maintenance} required />

</div>

</div>

<div className="row mt-4 mx-2">

<div className="col-md-6">
        <span>Monthly Security cost*</span>
        <input type="number"     min={0} className="form-control mt-2"  name="securityCost" onChange={handleChange}  value={mUser.securityCost} required />


</div>
<div className="col-md-6">
<span>Other overheads*</span>
<input type="number"     min={0} className="form-control mt-2"  name="otherOverheads" onChange={handleChange}  value={mUser.otherOverheads} required />
   

</div>

</div>

<div className="row mt-4 mx-2">

<div className="col-md-6">
       
<button type='submit' className='btn'>update details</button>

</div>


</div>
</form>
        
        </div>
        
    
    
    
    
    
    </>
  )
}
