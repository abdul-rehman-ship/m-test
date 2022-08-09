import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { RootState } from '../redux/store'
import {useRouter} from 'next/router'
import VendorNavbar from '../components/VendorNavbar'
import style from '../styles/vendor.module.css'
import Link from 'next/link'
import { db } from "../Firebase";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import style2 from '../styles/profile.module.css'

function VendorCustomerDashboard() {

const isVendor=useSelector((state:RootState)=>state.auth.vendor)
const customerEmail=useSelector((state:RootState)=>state.auth.customerEmail)
const[user,setUser]=useState()
const[orders,setOrder]=useState(0)
const [amount,setAmount]=useState(0)
const [salesPercent,setSalesPercent]=useState(0)
const [ordersPercent,setOrdersPercent]=useState(0)

const router=useRouter()
const getData = async () => {
    let arr: any = [];
    let mUser:any={}
    let totalArr: any = [];
    let spend = 0;
    let total = 0;
    const profile=await getDocs(collection(db,"users"));
    profile.forEach((doc:any)=>{
        if(doc.data().accountType=="customer"){
            if(doc.data().email==customerEmail){
                setUser({...doc.data(),id:doc.id})
                mUser={...doc.data(),id:doc.id}
            }
        }
    })
    const data = await getDocs(collection(db, "orders"));

    data.forEach((doc: any) => {
      

        if (doc.data().customer.id == mUser.id) {
            arr.push(doc.data())
            spend+= parseInt(doc.data().totalPrice)
            
        }
        totalArr.push({...doc.data(),id:doc.id})
        total+= parseInt(doc.data().totalPrice)

      
    });
    setOrder(arr.length)
    setAmount(spend)
    setSalesPercent(Math.round((spend/total)*100))
    setOrdersPercent(Math.round((arr.length/totalArr.length)*100))
   
  };
  


    useEffect(()=>{
        if(!isVendor){
            router.push("/")
            
            
        }

getData()



    },[])
  return (
    <>
    
    <VendorNavbar/>

    <div className={` ${style2.formContainer} container mt-5 `} >
            <Link href="VendorCustomerDashboard">
            <button className={`btn ${style2.back_btn} btn-light `} style={{fontSize:'large'}}>
            &#8592; Back </button></Link>
      
        <div className="row mt-4">

            <div className="col-md-6 col-lg-4 " >

                <Link href={""}>
                <div className={`
                ${style.card} card mb-4 text-center p-5  shadow-sm
                    `}>

                <p>orders: {orders}</p>


                </div>
                </Link>

                    
            </div>
          
            <div className="col-md-6 col-lg-4 " >

    <Link href={""}>
    <div className={`
    ${style.card} card mb-4 text-center p-5  shadow-sm
        `}>

    <p>spent amount: {amount}</p>


    </div>
    </Link>

        
</div>
<div className="col-md-6 col-lg-4 " >

    <Link href={""}>
    <div className={`
    ${style.card} card mb-4 text-center p-5  shadow-sm
        `}>

    <p>Sales %:{salesPercent}

    </p>


    </div>
    </Link>

        
</div>
<div className="col-md-6 col-lg-4 " >

    <Link href={""}>
    <div className={`
    ${style.card} card mb-4 text-center p-5  shadow-sm
        `}>

    <p>Oders %:{ordersPercent}</p>


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