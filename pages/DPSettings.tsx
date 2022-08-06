import React, { useEffect, useState } from 'react'
import DeliveryPartnerNav from '../components/DeliveryPartnerNavbar'
import style from '../styles/profile.module.css'
import { useSelector ,useDispatch} from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import {toast,Toaster} from 'react-hot-toast'
import {useRouter} from 'next/router'
import Loading from '../components/Loading'
import { setLoading,setUser } from '../redux/slices/authSlice'
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase'

export default function DPSettings() {
    const user=useSelector((state:RootState)=>state.auth.user)
    const userAuth=useSelector((state:RootState)=>state.auth.currentUser)
    const loading=useSelector((state:any)=>state.auth.loading)
    const userID=useSelector((state:RootState)=>state.auth.id)
    const [userPayment,setUserPayment]:any=useState({paymentMethod:user?user.paymentMethod:"",public_key:user?user.public_key:""})
    const router=useRouter()
    const dispatch=useDispatch<AppDispatch>()
    const[isAuthorized,setIsAuthorized]=useState(false)

    const handleChange=async(e:any)=>{
        const {name,value}=e.target
        setUserPayment({...userPayment,[name]:value})
    }
    useEffect(()=>{
      
    },[])

 const handleSubmit=async(e:any)=>{
    e.preventDefault()
    try {
        let id:any=""
        dispatch(setLoading(true))
        const data=await getDocs(collection(db,"users"))
        data.forEach((i)=>{
            if(i.data().email==user.email){
                id=i.id
            }
        })

        await updateDoc(doc(db,"users",id),{
            paymentMethod:userPayment.paymentMethod,
            public_key:userPayment.public_key

        })
        dispatch(setUser({...user, paymentMethod:userPayment.paymentMethod,
            public_key:userPayment.public_key}))


        dispatch(setLoading(false))
        toast.success("settings updated")

        
    } catch (error) {
        dispatch(setLoading(false))
        toast.error(error.message)

        
    }
    
 }
  return (
    <>
    <DeliveryPartnerNav/>
<Toaster/>
{loading && <Loading/>}

    <div className="container mt-5 ">

   <form onSubmit={handleSubmit}>

<div className={`row mt-4 px-3 ${style.formContainer}`}>

                        <div className="col-md-6 mt-3">
                        <span>Public key*</span>
                        <input type="text"  name="public_key" value={userPayment.public_key} onChange={handleChange}  className="form-control mt-2"  />


                    </div>
                    <div className="col-md-6 mt-3">
                        <span>Payment method*</span>
                        <select name="paymentMethod" value={userPayment.paymentMethod} onChange={handleChange} className="form-control mt-2" >


                            <option value="paystack">Paystack</option>
                            <option value="flutterwave">FlutterWave</option>

                        </select>


                    </div>
</div>
                <div  className={`row mt-4 px-3 ${style.formContainer}`}>
                <div className="col-md-6 ">

                <button type='submit' className='btn'>Save Payment Details</button>

                </div>

                </div>
</form>
</div>
    
    
    
    </>
  )
}
