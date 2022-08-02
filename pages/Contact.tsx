import React from 'react'

import CustomerNavbar from '../components/CustomerNavabar'
import {toast,Toaster} from 'react-hot-toast'
import Loading from '../components/Loading'
import { useDispatch,useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/authSlice'
import style from '../styles/vendor.module.css'

function Contact() {
    const user=useSelector((state:any)=>state.auth.user)
    const loading=useSelector((state:any)=>state.auth.loading)
  return (
    <>
    <Toaster/>
    {loading && <Loading/>}
    <CustomerNavbar/>
    <div className={`${style.contact} container mt-5 pt-5`}>

<div className="row">

    

        <textarea name="description" id="" placeholder='write something here...' />
    
</div>
<div className="row">
    <div className="col-md-6"></div>
    <div className="col-md-6 text-end">
    <button className='btn'> Send Email</button>

    </div>
</div>
    </div>
    
    </>
  )
}

export default Contact