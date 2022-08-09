import React, { useEffect, useState } from 'react'
import {db} from '../Firebase'
import {collection ,getDocs,doc,updateDoc} from 'firebase/firestore'
import {useRouter} from 'next/router'
import{toast,Toaster} from 'react-hot-toast'
import { useSelector ,useDispatch} from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import style from '../styles/profile.module.css'
import Link from 'next/link'
import { validateUpdateProfile } from '../components/valid'
import { setLoading, setUser } from '../redux/slices/authSlice'
import Loading from '../components/Loading'
import VendorNavbar from '../components/VendorNavbar'
export default function VECustomerDetail() {


    const loading=useSelector((state:RootState)=>state.auth.loading)
    const email=useSelector((state:RootState)=>state.auth.customerEmail)
    const isVendor=useSelector((state:RootState)=>state.auth.vendor)

    const router=useRouter()
    const {query}=router
    
    const dispatch=useDispatch<AppDispatch>()
    const [userID,setUserID]=useState<string>("")
    const [mUser,setMUser]:any=useState()

    const getData = async () => {


        try {
            
            const data = await getDocs(collection(db, "users"));
            data.forEach((doc: any) => {
                
                if (doc.data().email == email) {
                    setMUser(doc.data())
                    setUserID(doc.id)
                    return
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
        const res=validateUpdateProfile(mUser)
        if (res.length > 0) {
            let error = "";
            res.forEach((err: any) => {
              error += err + "\n";
            });
            toast.error(error);
          } else {
            dispatch(setLoading(true))
            await updateDoc(doc(db, "users", userID), 
                mUser)
                dispatch(setUser(mUser))
                dispatch(setLoading(false))
                toast.success("Profile Updated")
          
          
          }

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
        {mUser?
        <div className={` ${style.formContainer} container mt-5 `} >
            <Link href="VendorEmployeeDashboard">
            <button className={`btn ${style.back_btn} btn-light `} style={{fontSize:'large'}}>
            &#8592; Back </button></Link>
        <form onSubmit={handleSubmit}>
        <div className={`row d-flex justify-content-center `}>
            <img src={'avatar.jpg'} alt="avatar" className={`${style.avatar} img-fluid rounded-circle border border-primary`} />
        </div>

        <div className={`row mt-4 px-3`}>

            <div className="col-md-6">
                    <span>First name*</span>
                    <input type="text"  name="firstName" onChange={handleChange}  className="form-control mt-2" value={mUser.firstName}  />


            </div>
            <div className="col-md-6">
                
            <span>Surname*</span>
                    <input type="text"   name="surname" onChange={handleChange}  className="form-control mt-2" value={mUser.surname}  />

            </div>

        </div>

        <div className="row mt-4 mx-2">


<div className="col-md-6">
        <span>Email*</span>
        <input type="text"   className="form-control mt-2"  value={mUser.email}  disabled/>


</div>
<div className="col-md-6">
    
<span>Buisness Address*</span>
        <input type="text"  className="form-control mt-2"  name="buisnessAddress" onChange={handleChange}  value={mUser.buisnessAddress}  />

</div>

</div>


<div className="row mt-4 mx-2">

<div className="col-md-6">
        <span>Whatsapp Number*</span>
        <input type="text"   className="form-control mt-2" name="WNumber" onChange={handleChange}  value={mUser.WNumber}  />


</div>
<div className="col-md-6">
    
<span>Mobile Number*</span>
        <input type="text"  className="form-control mt-2"  name="mobileNumber" onChange={handleChange}  value={mUser.mobileNumber}  />

</div>

</div>

<div className="row mt-4 mx-2">

<div className="col-md-6">
        <span>State*</span>
        <input type="text"   className="form-control mt-2"  name="state" onChange={handleChange}  value={mUser.state}  />


</div>
<div className="col-md-6 text-center">
    

</div>

</div>
<div className="row mt-4 mx-2">

<div className="col-md-6">
       
<button type='submit' className='btn'>update profile</button>

</div>
<div className="col-md-6">
    
</div>

</div>
</form>
        
        </div>
        :'loading...'}
    
    
    
    
    
    </>
  )
}
