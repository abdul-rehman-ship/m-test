import React, { useEffect,useState } from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import { useRouter } from 'next/router'
import AdminNavbar from '../components/AdminNavbar'
import { Toaster,toast } from 'react-hot-toast'
import Loading from '../components/Loading'
import style from '../styles/profile.module.css'
import {db} from '../Firebase'

import {collection ,getDocs,addDoc,serverTimestamp,doc,updateDoc} from 'firebase/firestore'
import { setAdminProfile,setLoading } from '../redux/slices/authSlice'
import { AppDispatch } from '../redux/store'




export default function AdminDashboard() {
    const state:any=useSelector((state:any)=>state.auth)
    const router=useRouter()
    const adminProfile:any=useSelector((state:any)=>state.auth.adminProfile)
    const initialState:any={
      publicKey:"",
      buisnessName:"",
      SubscriptionFee:"",
      SubscriptionPeriod:""
    }
  const [mUser,setMUser]:any=useState(initialState)
  const [user,setUser]:any=useState({oldPassword:"",newPassword:""})
    const dispatch=useDispatch<AppDispatch>()
  const getData = async () => {


    try {
        
        const data = await getDocs(collection(db, "admin_profile"));
        data.forEach((snap)=>{
            if(snap.data()){
                setMUser(snap.data())
                dispatch(setAdminProfile({...snap.data(),id:snap.id}))
                }
        })
        
    } catch (error) {
        toast.error(error.message)
        
    }
}

    useEffect(() => {
        if(!state.admin){
            router.push("/v1/EntreFlow/Employee/admin/login")
            
        }
        getData()


    },[])
    const handleSubmit=async(e:any)=>{
      e.preventDefault()

        
      try {
            
            
            
        dispatch(setLoading(true))

        
        
        if(adminProfile!==null){
           if( Object.keys(adminProfile).length>0 ){
            await updateDoc(doc(db, "admin_profile",adminProfile.id),mUser )
        
           }  
        }else{
                await addDoc(collection(db,"admin_profile"),{...mUser,
                createdAt:serverTimestamp()
                })
                
                
            
        }

          
                dispatch(setAdminProfile({...mUser,id:adminProfile.id}))
                dispatch(setLoading(false))
                toast.success(" Updated Successfully")
          
          
          

    }catch(error:any){
        toast.error(error)

    }




    }
    const handlePasswordSubmit=async(e:any)=>{


      e.preventDefault()

      dispatch(setLoading(true))
        const snapshot=await getDocs(collection(db,"admin_key"))
        snapshot.forEach(async(docs)=>{
            
            
            const key={key:user.newPassword}
            console.log(docs.data().key===user.oldPassword);
            
            if(docs.data().key===user.oldPassword){

            await updateDoc(doc(db, "admin_key",docs.id),key )
              
              toast.success("key updated")
              dispatch(setLoading(false))
                
            }
            else{
              dispatch(setLoading(false))
                toast.error("Invalid Key")
            }
        })
        

        dispatch(setLoading(false))
    }
    const handleChange=async(e:any)=>{
      const {name,value}=e.target
      setMUser({...mUser,[name]:value })
     }
     const handlePasswordChange=async(e:any)=>{
      const {name,value}=e.target
      setUser({...user,[name]:value})
     }
  return (
    <>
      <Toaster/>
      {state.loading && <Loading/>}


      
        <AdminNavbar/>

<div className={` ${style.formContainer} container mt-5 `} >
<form onSubmit={handleSubmit}>
    
    <div className={`row px-3`}>

        <div className="col-md-6 mt-4">
                <span>paystack public key*</span>
                <input type="text"  name="publicKey" onChange={handleChange}  className="form-control mt-2" value={mUser.publicKey}  />


        </div>
        <div className="col-md-6 mt-4">
            
        <span>Subscription fee *</span>
                <input type="number"   name="SubscriptionFee" onChange={handleChange}  className="form-control mt-2" value={mUser.SubscriptionFee}  />

        </div>
        <div className="col-md-6 mt-4">
<span>Subscription period*</span>
<select name="SubscriptionPeriod" value={mUser.SubscriptionPeriod} onChange={handleChange} className="form-control mt-2" >


    <option value="monthly">monthly</option>
    <option value="yearly">yearly</option>

</select>

</div>

    </div>



<div className="row  mx-2">

<div className="col-md-6 mt-4">
   
<button type='submit' className='btn'>update </button>

</div>
<div className="col-md-6">

</div>

</div>
</form>
<form onSubmit={handlePasswordSubmit}>
    
    <div className={`row px-3`}>

        <div className="col-md-6 mt-4">
                <span>old key*</span>
                <input type="password"  name="oldPassword" onChange={handlePasswordChange}  className="form-control mt-2" value={user.oldPassword}  />


        </div>
        <div className="col-md-6 mt-4">
            
        <span>new key  *</span>
                <input type="password"   name="newPassword" onChange={handlePasswordChange}  className="form-control mt-2" value={user.newPassword}  />

        </div>


    </div>



<div className="row  mx-2">

<div className="col-md-6 mt-4">
   
<button type='submit' className='btn'>update key</button>

</div>
<div className="col-md-6">

</div>

</div>
</form>




</div>
      
    </>
  )
}
