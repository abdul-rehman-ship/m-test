import React from 'react'
import style from '../../../../../../styles/admin.module.css'
import {toast,Toaster} from 'react-hot-toast'
import { db } from '../../../../../../Firebase'
import { collection,getDocs } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { setLoading, setVendor } from '../../../../../../redux/slices/authSlice'
import { useDispatch ,useSelector} from 'react-redux'
import { AppDispatch, RootState } from '../../../../../../redux/store'
import Loading from '../../../../../../components/Loading'
export default function Index() {
   
   const dispactch=useDispatch<AppDispatch>()
   const isLoading=useSelector((state:RootState)=>state.auth.loading)
    const router=useRouter()
    const handleSubmit = async (e: any) => {
        e.preventDefault();
try {
    dispactch(setLoading(true))
    const key=e.target.key.value;
    const snapshot=await getDocs(collection(db,"vendor_key"))
    snapshot.forEach((doc)=>{
        console.log(doc.data().key)
        
        if(doc.data().key===key){
            dispactch(setVendor(true))
            dispactch(setLoading(false))
            router.push("/vendorDashboard")
        }
        else{
            dispactch(setLoading(false))

            toast.error("Invalid Key")

        }
    })
} catch (error) {
    toast.error(error.message)
}
    
}
          
        

        
        
 
  return (
    <>
    
    {isLoading && <Loading/>}
    <div className={style.main_container}>
        <Toaster/>

        <div className="container d-flex justify-content-center">
            <div  className={style.main_div}>
            <form onSubmit={handleSubmit}>
            <input
                  type="password"
                  className="form-control mt-4"
                  name="key"
                  placeholder="Enter your key here...*"
                  required
                />
                <button type='submit' className={style.login_Btn} >Login</button>

                </form>

            </div>


        </div>
    </div>
    
    
    
    </>
  )
  }
