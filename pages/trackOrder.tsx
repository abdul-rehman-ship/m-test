import React, { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import {db} from "../Firebase"
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import style from '../styles/profile.module.css'


function TrackOrder() {

    console.log("called");
    
    const router=useRouter()
    const {query}=router
    const [id,setId]:any=useState()
    
    let mid=query.id
    let customerId:any=query.customerId
    
    const [order,setOrder]:any=useState({})
    const [customer,setCustomer]:any=useState({})
const getData=async()=>{
  
      
        if(mid){
            const data = await getDocs(collection(db, "orders"));
            data.forEach((doc: any) => {
              
                if(doc.id==mid){
                    setOrder(doc.data())
                    console.log(doc.data().product.name)
                }
                
              
            });
        }
        
        
        if(customerId){
            const data2=await getDocs(collection(db,"users"))
            data2.forEach((i)=>{
               if(i.id==customerId){
                
                
                setCustomer(i.data())
               }
               
            })
            
        }

   
   
}


    useEffect(()=>{
        getData()
        
    },[query])
  return (

    <>
    { Object.entries(order).length>0 ? <div className={` ${style.formContainer} container mt-5 `} >

<form >


<div className={`row px-3`}>

    <div className="col-md-6 mt-4">
            <span>Customer name*</span>
            <input type="text"   readOnly  className="form-control mt-2" value={ customer.firstName}  />


    </div>
    <div className="col-md-6 mt-4">
            <span>Customer address*</span>
            <input type="text"  name="firstName" readOnly  className="form-control mt-2" value={customer.buisnessAddress}  />


    </div>
    <div className="col-md-6 mt-4">
            <span>Customer phone*</span>
            <input type="text"  readOnly  className="form-control mt-2" value={customer.mobileNumber}  />


    </div>
    <div className="col-md-6 mt-4">
            <span>Product name*</span>
            <input type="text"   readOnly  className="form-control mt-2" value={order.product ? order.product.name :''}  />


    </div>
    <div className="col-md-6 mt-4">
            <span>total price*</span>
            <input type="text"   readOnly  className="form-control mt-2" value={order.totalPrice}  />


    </div>
    
    <div className="col-md-6 mt-4">
            <span>quantity</span>
            <input type="text"   readOnly  className="form-control mt-2" value={order.quantity}  />


    </div>
    
    

</div>


</form>

</div>:"loading"}
    </>
  )
}

export default TrackOrder