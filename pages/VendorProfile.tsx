import React, { useEffect, useState } from 'react'
import {db} from '../Firebase'
import {collection ,getDocs,addDoc,serverTimestamp,doc,updateDoc} from 'firebase/firestore'
import {useRouter} from 'next/router'
import{toast,Toaster} from 'react-hot-toast'
import { useSelector ,useDispatch} from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import style from '../styles/profile.module.css'

import { validateUpdateProfile } from '../components/valid'
import { setLoading, setUser,setVendorProfile } from '../redux/slices/authSlice'
import Loading from '../components/Loading'
import Vendornavbar from '../components/VendorNavbar'

function Profile() {

    
    
    
    const isVendor=useSelector((state:RootState)=>state.auth.vendor)
    const vendorProfile=useSelector((state:RootState)=>state.auth.vendorProfile)
    
    const loading=useSelector((state:RootState)=>state.auth.loading)
    const router=useRouter()
    const dispatch=useDispatch<AppDispatch>()

    const initialState={
        name:"",
        buisnessName:"",
        email:"",
        buisnessAddress:"",
        WNumber:"",
        mobileNumber:""
    }
    const [mUser,setMUser]:any=useState(initialState)
    const getData = async () => {


        try {
            
            const data = await getDocs(collection(db, "vendor_profile"));
            data.forEach((snap)=>{
                if(snap.data()){
                    setMUser(snap.data())
                    dispatch(setVendorProfile({...snap.data(),id:snap.id}))
                    }
            })
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }


    const handleSubmit=async(e:any)=>{
        e.preventDefault()
        
        
        try {
            
            
            
            dispatch(setLoading(true))
    
            
            
            if(vendorProfile!==null){
               if( Object.keys(vendorProfile).length>0 ){
                await updateDoc(doc(db, "vendor_profile",vendorProfile.id),mUser )
            
               }  
            }else{
                    await addDoc(collection(db,"vendor_profile"),{...mUser,
                    createdAt:serverTimestamp(),
                    testPeriod:true,
                    subscriptionPeriod:"",
                    subscribe:false

                    })
                    
                    
                
            }
    
              
                    dispatch(setVendorProfile({...mUser,id:vendorProfile.id}))
                    dispatch(setLoading(false))
                    toast.success("Profile Updated")
              
              
              
    
        }catch(error:any){
            toast.error(error)
    
        }
        
        
       }
   useEffect(()=>{
    

    if(!isVendor){
        router.push("/")
    }
  
        getData()
        
        
    
    
   },[])
 
   const handleChange=async(e:any)=>{
    const {name,value}=e.target
    setMUser({...mUser,[name]:value})
   }
  return (
    <>
        <Vendornavbar/>
        <Toaster/>
        { loading && <Loading/>}
        <div className={` ${style.formContainer} container mt-5 `} >

        <form onSubmit={handleSubmit}>
        <div className={`row d-flex justify-content-center `}>
            <img src={'avatar.jpg'} alt="avatar" className={`${style.avatar} img-fluid rounded-circle border border-primary`} />
        </div>

        <div className={`row px-3`}>

            <div className="col-md-6 mt-4">
                    <span>Name*</span>
                    <input type="text"  name="name" onChange={handleChange}  className="form-control mt-2" value={mUser.name}  />


            </div>
            <div className="col-md-6 mt-4">
                
            <span>Buisness Name*</span>
                    <input type="text"   name="buisnessName" onChange={handleChange}  className="form-control mt-2" value={mUser.buisnessName}  />

            </div>

        </div>

        <div className="row  mx-2">


<div className="col-md-6 mt-4">
        <span>Email*</span>
        <input type="email" name='email' onChange={handleChange}  className="form-control mt-2"  value={mUser.email}  required />


</div>
<div className="col-md-6 mt-4">
    
<span>Buisness Address*</span>
        <input type="text"  className="form-control mt-2"  name="buisnessAddress" onChange={handleChange}  value={mUser.buisnessAddress}  />

</div>

</div>


<div className="row  mx-2">

<div className="col-md-6 mt-4">
        <span>Whatsapp Number*</span>
        <input type="text"   className="form-control mt-2" name="WNumber" onChange={handleChange}  value={mUser.WNumber}  />


</div>
<div className="col-md-6 mt-4">
    
<span>Mobile Number*</span>
        <input type="text"  className="form-control mt-2"  name="mobileNumber" onChange={handleChange}  value={mUser.mobileNumber}  />

</div>

</div>

<div className="row  mx-2">

<div className="col-md-6 mt-4">
       
<button type='submit' className='btn'>update profile</button>

</div>
<div className="col-md-6">
    
</div>

</div>
</form>
        
        </div>
    </>
  )
}

export default Profile