import React, { useEffect } from 'react'
import {useSelector} from 'react-redux'
import { RootState } from '../redux/store'
import {useRouter} from 'next/router'
import VendorNavbar from '../components/VendorNavbar'
import style from '../styles/vendor.module.css'
import Link from 'next/link'
import style2 from '../styles/profile.module.css'


function VendorCustomerDashboard() {

const isVendor=useSelector((state:RootState)=>state.auth.vendor)
const router=useRouter()



    useEffect(()=>{
        if(!isVendor){
            router.push("/")
            
            
        }

    },[])
  return (
    <>
    
    <VendorNavbar/>

    <div className={` ${style2.formContainer} container mt-5 `} >
            <Link href="VendorCustomers">
            <button className={`btn ${style2.back_btn} btn-light `} style={{fontSize:'large'}}>
            &#8592; Back </button></Link>
      
        <div className="row mt-4">

            <div className="col-md-6 col-lg-4 " >

                <Link href={"VendorCustomerDetail"}>
                <div className={`
                ${style.card} card mb-4 text-center p-5  shadow-sm
                    `}>

                <p>Info</p>


                </div>
                </Link>

                    
            </div>
          
            <div className="col-md-6 col-lg-4 " >

    <Link href={"VendorCustomerOrders"}>
    <div className={`
    ${style.card} card mb-4 text-center p-5  shadow-sm
        `}>

    <p>Orders</p>


    </div>
    </Link>

        
</div>
<div className="col-md-6 col-lg-4 " >

    <Link href={"VendorCustomerStatistics"}>
    <div className={`
    ${style.card} card mb-4 text-center p-5  shadow-sm
        `}>

    <p>Statistics</p>


    </div>
    </Link>

        
</div>



        </div>


    

<div className="row mt-4">





</div>


    </div>
    
    
    
    
    
    </>
  )
}

export default VendorCustomerDashboard