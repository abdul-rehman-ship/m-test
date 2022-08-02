import React from 'react'
import style from '../../../../../../styles/admin.module.css'
import {toast,Toaster} from 'react-hot-toast'
import { db } from '../../../../../../Firebase'
import { collection,getDocs } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useDispatch,useSelector } from 'react-redux'
import { AppDispatch } from '../../../../../../redux/store'
import { setAdmin,setLoading } from '../../../../../../redux/slices/authSlice'
import Loading from '../../../../../../components/Loading'
export default function Index() {
   
    const router=useRouter()
    const dispacth=useDispatch<AppDispatch>()
    const laoding=useSelector((state:any)=>state.auth.loading)
    
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const key=e.target.key.value;
        dispacth(setLoading(true))
        const snapshot=await getDocs(collection(db,"admin_key"))
        snapshot.forEach((doc)=>{
            
            
            if(doc.data().key===key){
                dispacth(setAdmin(true))
                dispacth(setLoading(false))
                router.push("/adminDashboard")
            }
            else{
                dispacth(setLoading(false))
                toast.error("Invalid Key")
            }
        })
        

        dispacth(setLoading(false))
        
    }
  return (
    <>
        {laoding ? <Loading/> : ''}

    
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
