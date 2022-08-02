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
import PaystackPop from '@paystack/inline-js'



function VendorCustomers() {
    const state=useSelector((state:any)=>state.auth)
    const vendorSettings=useSelector((state:any)=>state.auth.vendorSettings)
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
    
  const [customers, setCustomers]: any = useState([]);
  const getData = async () => {
    let arr: any = [];
    const data = await getDocs(collection(db, "orders"));
    data.forEach((doc: any) => {

        
        
        if(doc.data().deliveryPartner.id==state.deliveryPartnerId){
        arr.push({...doc.data(),id:doc.id})

        }

      
      
    });
    
    
    arr.reverse()    
    await setCustomers(arr);
    await setAllCustomers(arr)
  };
  
const getAllCustomers=async()=>{
  let arr: any = [];
  const data = await getDocs(collection(db, "users"));
  data.forEach(async(doc: any) => {
    if(doc.data().accountType==="vendorEmployee"){
      arr.push({...doc.data(),id:doc.id})

    }
    await setallEmployees(arr)
    
  });
}
    useEffect(()=>{
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

const handleCheckChange=async(e:any,id:any)=>{
    try {
        if(e.target.checked){
            // unique add

            setSelectedCustomers([...selectedCustomers,id])
            
            
        }else{
          setSelectedCustomers(selectedCustomers.filter((id:any)=>id!==id))
        }
        
        
        
    } catch (error) {
        toast.error(error)
        
    }



}
const paySelected=async()=>{
  try {
    let total_amount=0
    allcustomers.forEach((i:any)=>{
      if(selectedCustomers.includes(i.id)){
      if(i.paid==false){
        total_amount+= parseInt(i.deliveryPrice)
        
      }
    }
    })
    const paystack=new PaystackPop()
    paystack.newTransaction({
      key:"pk_test_529c008634299b5fdf147ab6be3283ceea233bc0",
      email:state.vendorProfile.email,
      amount: total_amount * 100,
      firstname:state.vendorProfile.buisnessName,
      
      onSuccess:async()=>{
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
  
        
      },
      onCencel:()=>{
        toast.error("payment cencel")
      }
  
    })
    
    
  } catch (error) {
      toast.error(error)
      
  }
}
  const payAll=async()=>{
    try {
      let total_amount=0
      allcustomers.forEach((i:any)=>{
        if(i.paid==false){
          total_amount+=i.totalPrice
        }
      })
      const paystack=new PaystackPop()
      paystack.newTransaction({
        key:"pk_test_529c008634299b5fdf147ab6be3283ceea233bc0",
        email:state.vendorProfile.email,
        amount: total_amount * 100,
        firstname:state.vendorProfile.buisnessName,
        
        onSuccess:async()=>{
      dispatch(setLoading(true))
      
      allcustomers.forEach(async(i:any)=>{
        await updateDoc(doc(db, "orders", i.id), 
        {
 
         paid:true
        })
      
      })
      
    

    
    
       dispatch(setLoading(false))
        toast.success("Orders paid Successfully")
       getData()
    
          
        },
        onCencel:()=>{
          toast.error("payment cencel")
        }
    
      })
      
      
    } catch (error) {
        toast.error(error)
        
    }
      
    }
  
  return (<>
    <VendorNavbar/>
    <Toaster/>

{loading?<Loading/>:" "}




    <div className="container  mt-5 pt-5">
     
<div className="row mt-4 mb-3   d-flex justify-content-end" >
           
           <Link href=""><button onClick={payAll} className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>

pay to all
</button></Link>
<Link href={""}><button onClick={paySelected} className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>

pay selected
</button></Link>
            
        </div>

      
        <div className='row mb-4'>



</div>
        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>product Name</th>
          <th>price</th>
          <th>customer Id</th>
          <th>delivery date</th>
          <th>status</th>
          <th>select</th>


        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return  <tr onClick={()=>handleClick(customer.id)}  key={index}>

            <td  className={compareDate(customer.deliveryDate)==false ?'': style.overDate}>{customer.product.name}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '': style.overDate}>{customer.totalPrice}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '':style.overDate} >{customer.customer}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{convertDate(customer.deliveryDate)}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>



                    {customer.paid===true?"Paid":"Not Paid"}
            </td>
<td>
{customer.paid==true?"":
<input type="checkbox" onChange={(e)=>handleCheckChange(e,customer.id)} />
    }
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