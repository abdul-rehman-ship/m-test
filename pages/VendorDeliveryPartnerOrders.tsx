import React, { useEffect,useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { db } from "../Firebase";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import {setCustomerEmail, setLoading} from '../redux/slices/authSlice'
import Link from 'next/link';
import VendorNavbar from '../components/VendorNavbar';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../components/Loading';
import { PaystackButton } from 'react-paystack'

import style2 from '../styles/profile.module.css'

import { FlutterWaveButton, useFlutterwave,closePaymentModal } from 'flutterwave-react-v3';



function VendorCustomers() {
    const state=useSelector((state:any)=>state.auth)
    const vendorSettings=useSelector((state:any)=>state.auth.vendorSettings)
    const vendorProfile=useSelector((state:any)=>state.auth.vendorProfile)
    const user=useSelector((state:any)=>state.auth.user)
    const dispatch=useDispatch<AppDispatch>()
    const [searchString,setSearchString]=useState("")
    const [searchValue,setSearchValue]=useState("")
    const loading=useSelector((state:any)=>state.auth.loading)
    const [allEmployees,setallEmployees]:any=useState([])
  const [selectedCustomers, setSelectedCustomers]: any = useState([]);

 const userID=useSelector((state:any)=>state.auth.id)
const [assign,setAssign]:any=useState("none")
    const router=useRouter()
  const [allcustomers, setAllCustomers]: any = useState([]);
  const [mCustomers,setMCustomers]:any=useState([])
  const [totalAmount,setTotalAmount]:any=useState(0)
  const [mTotalAmount,setmTotalAmount]:any=useState(0)
  const [customers, setCustomers]: any = useState([]);
 

  const componentProps:any= {
    publicKey:vendorSettings?vendorSettings.public_key:"",
    email:vendorProfile?vendorProfile.email:"",
    amount: totalAmount * 100,
    firstname:"vendor name",
    
    text: "pay selected",
    onSuccess:async () =>
  
    {
      const deliveryDate=new Date()
  
  
  deliveryDate.setDate(deliveryDate.getDate() + parseInt(vendorSettings? vendorSettings.numberOfDeliveryDate:""))
  
  dispatch(setLoading(true))
    
  allcustomers.forEach(async(i:any)=>{
    if(selectedCustomers.includes(i.id)){
      await updateDoc(doc(db, "orders", i.id), 
      {

       paid:true
      })
  }
   
  
  })
  




   dispatch(setLoading(false))
    toast.success("Orders paid Successfully")
   getData()
   getAllCustomers()


          
    }
      ,
    onClose: () => alert("Wait! You need this product, don't go!!!!"),
  }
  const componentProps2:any= {
    publicKey:vendorSettings?vendorSettings.public_key:"",
    email:vendorProfile?vendorProfile.email:"",
    amount: mTotalAmount * 100,
    firstname:"vendor name",
    
    text: "pay all",
    onSuccess:async () =>
  
    {
      dispatch(setLoading(true))
      try {
        
      
      
        allcustomers.forEach(async(i:any)=>{
          await updateDoc(doc(db, "orders", i.id), 
          {
   
           paid:true
          })
        
        })
        
      
  
      
      
         dispatch(setLoading(false))
          toast.success("Orders paid Successfully")
         getData()
       getAllCustomers()

      }
         catch (error) {
        dispatch(setLoading(false))
        toast.error(error.message)
        }
          
    }
      ,
    onClose: () => alert("Wait! You need this product, don't go!!!!"),
  }
  const config:any = {
    public_key:vendorSettings ? vendorSettings.public_key:"",
    tx_ref: Date.now(),
    amount: totalAmount ,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email:vendorProfile ?vendorProfile.email:"",
      
    },
    customizations: {
      title: 'my Payment Title',
      description: 'Payment for items ',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };
  const config2:any = {
    public_key:vendorSettings ? vendorSettings.public_key:"",
    tx_ref: Date.now(),
    amount: mTotalAmount ,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email:vendorProfile ?vendorProfile.email:"",
      
    },
    customizations: {
      title: 'my Payment Title',
      description: 'Payment for items ',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };
  const handleFlutterPayment = useFlutterwave(config);
  const handleFlutterPayment2 = useFlutterwave(config2);
  const getData = async () => {
    let arr: any = [];
    let amount:any=0
    const data = await getDocs(collection(db, "orders"));
    data.forEach((doc: any) => {

        
        
        if(doc.data().deliveryPartner.id==state.deliveryPartnerId){

          if(doc.data().paid==false){
            amount = parseInt(amount) + parseInt(doc.data().deliveryPrice)
            
          }
        arr.push({...doc.data(),id:doc.id})

        }

      
      
    });
    
    await setmTotalAmount(amount)
    
    arr.reverse()    
    await setCustomers(arr);
    await setAllCustomers(arr)
  };
  
const getAllCustomers=async()=>{
  let arr: any = [];
  let arr2:any=[]

  const data = await getDocs(collection(db, "users"));
  data.forEach(async(doc: any) => {

    if(doc.data()){
      if(doc.data().accountType==="vendorEmployee"){
        arr.push({...doc.data(),id:doc.id})
  
      }
      
    }
    
    await setallEmployees(arr)
    
    
  });
}
    useEffect(()=>{
      if(!state.vendor){
        router.push("/")
      }
       getData()
       getAllCustomers()
    },[])
    const onSearchChange=async(e:any)=>{
        setCustomers([])
        let arr=[]

        if(e.target.value=="all"){
            setCustomers(allcustomers)
        }else{
            setSearchString(e.target.value)
            allcustomers.forEach((c:any)=>{
                    if(e.target.value==c.status){
                        arr.push(c)
                    }
            })
            setCustomers(arr)
        }
       

       
        
        
    }

    const handleClick=(id:any)=>{
        // dispatch(setCustomerEmail(email))
        // router.push(`/VendorCustomerDashboard`)
        
        
  }
const convertDate=(date:any)=>{
    return new Date(date.seconds * 1000).toLocaleDateString()
}
const compareDate=(a:any)=>{
    const date=(new Date().getTime())
                
                
    const date2= (new Date(a.seconds * 1000).getTime())
    const time=date2-date
    const res=Math.round(time /(1000*3600*24))
    
    
   
if(res<=0){
    return true
}else{
    return false
}
        

}
const handleStatus=async(e:any,id:any)=>{
    try {
        dispatch(setLoading(true))
        await updateDoc(doc(db,"orders",id),{status:e.target.value})
        getData()


        dispatch(setLoading(false))

    } catch (error) {
        dispatch(setLoading(false))

        toast.error(error.message)
        
    }
}

const handleCheckChange=async(e:any,id:any,p:any)=>{
    try {
      let price:any=0
      let selected:any=[]
      let result:any=[]
      
      console.log("vallle");
      
      
        if(e.target.checked){
            // unique add

            setTotalAmount(totalAmount+ parseInt(p))

            setSelectedCustomers([...selectedCustomers,id])
            
            
            
        }else{
         
          
          
          setTotalAmount(totalAmount- parseInt(p))
          
          
          
          setSelectedCustomers(selectedCustomers.filter((i:any)=>i!==id))
          
        }
      
  
      
      
        
        
        
        
        
        
      
        
        
        
        
        
    } catch (error) {
        toast.error(error)
        
    }



}
const paySelected=async()=>{
try {
  handleFlutterPayment({
    callback: (response: any) => {
              if(response){
                
      const deliveryDate=new Date()
  
  
      deliveryDate.setDate(deliveryDate.getDate() + parseInt(vendorSettings? vendorSettings.numberOfDeliveryDate:""))
      
      dispatch(setLoading(true))
        
      allcustomers.forEach(async(i:any)=>{
        if(selectedCustomers.includes(i.id)){
          await updateDoc(doc(db, "orders", i.id), 
          {
    
           paid:true
          })
      }
       
      
      })
      
    
    
    
    
       dispatch(setLoading(false))
        toast.success("Orders paid Successfully")
       getData()
    
     }
      
    },
    onClose: () => {
      alert("Wait! You need this product, don't go!!!!")}
  })
  
} catch (error) {
  dispatch(setLoading(false))
  toast.error(error.message)

}

 
}
  const payAll=async()=>{
    try {
      handleFlutterPayment2({
        callback: (response: any) => {
                  
      dispatch(setLoading(true))
      try {
        
      
      
        allcustomers.forEach(async(i:any)=>{
          await updateDoc(doc(db, "orders", i.id), 
          {
   
           paid:true
          })
        
        })
        
      
  
      
      
         dispatch(setLoading(false))
          toast.success("Orders paid Successfully")
         getData()
      }
         catch (error) {
        dispatch(setLoading(false))
        toast.error(error.message)
        }
        },
        onClose: () => {
          alert("Wait! You need this product, don't go!!!!")
        }
      })
      
    } catch (error) {
      dispatch(setLoading(false))
      toast.error(error.message)
    
    }
    }
  
  return (<>
    <VendorNavbar/>
    <Toaster/>

{loading?<Loading/>:" "}



<div className={` ${style2.formContainer} container mt-5 `} >
            <Link href="VendorDeliveryPartnerDashboard">
            <button className={`btn ${style2.back_btn} btn-light `} style={{fontSize:'large'}}>
            &#8592; Back </button></Link>

    <div className="row mt-4 mb-3   d-flex justify-content-end" >
           
           {vendorSettings && vendorSettings.paymentMethod=="paystack" ? 
           
           
            
           <Link href=""><button className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>
           
           <PaystackButton {...componentProps2} className={`${style.login_btn}`}/>
           </button></Link>
           
           :
           <Link href={""}><button onClick={payAll} className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>
           
           Pay All
           </button></Link>}
           
             {vendorSettings && vendorSettings.paymentMethod=="paystack" ? 
           
           
            
           <Link href=""><button  className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>
           
           
           
           
                   {totalAmount>0?  <PaystackButton {...componentProps} className={`${style.login_btn}` }/>  :"Select Order"} 
           </button></Link>
           
           :
           <Link href={""}><button onClick={paySelected} className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>
           
           Pay Selected
           </button></Link>}
                       
                   </div>

      
        <div className='row mb-4'>



</div>
        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>Product Name</th>
          <th>Price</th>
          <th>Customer Name</th>
          <th>Delivery Date</th>
          <th>Delivery Price</th>
          <th>Status</th>
          <th>Select</th>


        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return  <tr onClick={()=>handleClick(customer.id)}  key={index}>

            <td  className={compareDate(customer.deliveryDate)==false ?'': style.overDate}>{customer.product.name}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '': style.overDate}>{customer.totalPrice}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '':style.overDate} >{customer.customer.firstName}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{convertDate(customer.deliveryDate)}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '':style.overDate} >{customer.deliveryPrice}</td>

            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>



                    {customer.paid===true?"Paid":"Not Paid"}
            </td>
<td>
{customer.paid===false?

<input type="checkbox" onChange={(e)=>handleCheckChange(e,customer.id,customer.deliveryPrice)} />:""}
    
</td>

            


      </tr>
    }
    )

:<tr><td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>

</tr>}
       
      </tbody>
    </Table>
            
        </div>
    </>


    
  )
}

export default VendorCustomers