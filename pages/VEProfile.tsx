import React, { useEffect, useState } from 'react'
import {db} from '../Firebase'
import {collection ,getDocs,doc,updateDoc} from 'firebase/firestore'
import {useRouter} from 'next/router'
import{toast,Toaster} from 'react-hot-toast'
import { useSelector ,useDispatch} from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import style from '../styles/profile.module.css'

import { validateUpdateProfile } from '../components/valid'
import { setLoading, setUser } from '../redux/slices/authSlice'
import Loading from '../components/Loading'
import CustomerNavbar from '../components/VendorEmployeeNavbar'

const  Profile=()=> {

    const user:any=useSelector((state:RootState)=>state.auth.user)
    const userAuth:any=useSelector((state:RootState)=>state.auth.currentUser)
    const userID:any=useSelector((state:RootState)=>state.auth.id)
    const loading:any=useSelector((state:RootState)=>state.auth.loading)
    const router:any=useRouter()
    const dispatch=useDispatch<AppDispatch>()

    const [mUser,setMUser]:any=useState(user?user:{
        firstName:"",
        surname:"",
        email:"",
        buisnessAddress:"",
        state:"",
        WNumber:"",
        mobileNumber:""
    })
   useEffect(()=>{
        if(!user.email){
                router.push("/")
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

                let id:any=""
                dispatch(setLoading(true))
                const data=await getDocs(collection(db,"users"))
                data.forEach((i)=>{
                    if(i.data().email==user.email){
                        id=i.id
                    }
                })

            dispatch(setLoading(true))
            await updateDoc(doc(db, "users", id), 
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
        <CustomerNavbar/>
        <Toaster/>
        { loading && <Loading/>}
        <div className={` ${style.formContainer} container mt-5 `} >

        <form onSubmit={handleSubmit}>
        <div className={`row d-flex justify-content-center `}>
            <img src={'avatar.jpg'} alt="avatar" className={`${style.avatar} img-fluid rounded-circle border border-primary`} />
        </div>

        <div className={`row px-3`}>

            <div className="col-md-6 mt-4">
                    <span>First name*</span>
                    <input type="text"  name="firstName" onChange={handleChange}  className="form-control mt-2" value={mUser.firstName}  />


            </div>
            <div className="col-md-6 mt-4">
                
            <span>Surname*</span>
                    <input type="text"   name="surname" onChange={handleChange}  className="form-control mt-2" value={mUser.surname}  />

            </div>

        </div>

        <div className="row  mx-2">


<div className="col-md-6 mt-4">
        <span>Email*</span>
        <input type="text"   className="form-control mt-2"  value={mUser.email}  disabled/>


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

<div className="row mx-2">

<div className="col-md-6 mt-4">
        <span>State*</span>
        <input type="text"   className="form-control mt-2"  name="state" onChange={handleChange}  value={mUser.state}  />


</div>
<div className="col-md-6 mt-4 text-center">
    

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