

import React, { useEffect,useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { db } from "../Firebase";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import {setCustomerEmail, setCustomerId, setLoading, setOrderId, setVendorSettings} from '../redux/slices/authSlice'
import Link from 'next/link';
import VendorNavbar from '../components/DeliveryPartnerNavbar';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../components/Loading';


function VendorCustomers() {
    const state=useSelector((state:any)=>state.auth)
    const vendorSettings=useSelector((state:any)=>state.auth.vendorSettings)
    const user=useSelector((state:any)=>state.auth.user)
    const dispatch=useDispatch<AppDispatch>()
    const [searchString,setSearchString]=useState("")
    const [searchValue,setSearchValue]=useState("")
    const loading=useSelector((state:any)=>state.auth.loading)
    const [allEmployees,setallEmployees]:any=useState([])
 const userID=useSelector((state:any)=>state.auth.id)
const [assign,setAssign]:any=useState("none")
    const router=useRouter()
  const [allcustomers, setAllCustomers]: any = useState([]);
    
  const [customers, setCustomers]: any = useState([]);
  const getData = async () => {
    
    
    let arr: any = [];
    const data = await getDocs(collection(db, "orders"));
    data.forEach((doc: any) => {
      if(doc.data().deliveryPartner.email== state.user?state.user.email:""){
        arr.push({...doc.data(),id:doc.id})
      }
      
        
      
    });
    arr.reverse()  
    const data2=await getDocs(collection(db, "vendor_settings"))  
        data2.forEach((snap:any)=>{
            dispatch(setVendorSettings({...snap.data(),id:snap.id}))
        })
    await setCustomers(arr);
    await setAllCustomers(arr)
  };
  
const getAllCustomers=async()=>{
  let arr: any = [];
  let user:any=[]
  const data = await getDocs(collection(db, "users"));
  data.forEach(async(doc: any) => {
    if(doc.data().accountType==="DPEmployee"){
      arr.push({...doc.data(),id:doc.id})

    }
    
    await setallEmployees(arr)
    
  });
}
    useEffect(()=>{
      if(!state.user.email){
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

    const handleClick=(id:any,cid:any)=>{
        // dispatch(setOrderId(id))
        // dispatch(setCustomerId(cid))
        // router.push('trackOrder',{query:{id:id,customerId:cid}})
        
        
  }
const convertDate=(date:any)=>{
    return new Date(date.seconds * 1000).toLocaleDateString()
}
const compareDate=(a:any)=>{
  const date=new Date().getTime()
              
              
  const date2= new Date(a.seconds * 1000).getTime()
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
const handleEmployee=async(e:any,customer:any)=>{

  
try {
  dispatch(setLoading(true))
  if(e.target.value==="none"){

    const emp=await getDoc(doc(db,"users",e.target.value))
    await updateDoc(doc(db,"orders",customer.id),{
        DPEmployee:{none:true}
  })
    
    dispatch(setLoading(false))
    toast.success(`order assigned to no one`)

  }else{
    const emp=await getDoc(doc(db,"users",e.target.value))
    await updateDoc(doc(db,"orders",customer.id),{
      DPEmployee:{id:emp.id,...emp.data(),none:false}
  })
    dispatch(setLoading(false))
    toast.success(`order assigned to ${emp.data().firstName}`)
  }
  getData()

   
} catch (error) {
  dispatch(setLoading(false))
    toast.error(error.message)
    
  
}




}
  return (<>
    <VendorNavbar/>
    <Toaster/>

{loading?<Loading/>:" "}



{customers ?

    <div className="container  mt-5 pt-5">
     

      
        <div className='row mb-4'>
<div className="col-md-6">

<select name="status" value={searchString} onChange={onSearchChange} className="form-control mt-2" >

<option value="all">All</option>
<option value="open">Open</option>
<option value="qualityCheck">Quality Check</option>
<option value="packaging">Packaging</option>
<option value="Delivery">Delivery</option>
<option value="pickedUp">Picked up</option>
<option value="Return">Return</option>
<option value="closed">Closed</option>


</select>
</div>


</div>
        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>Product Name</th>
          <th>Customer name</th>
          <th>Customer phone</th>
          <th>Customer address</th>
          <th>Delivery date</th>
          <th>Status</th>
          <th>Assign</th>
          


        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return  <tr   key={index}>

            <td  onClick={()=>handleClick(customer.id,customer.customer)} className={compareDate(customer.deliveryDate)==false ?'': style.overDate}>{customer.product.name}</td>
            <td onClick={()=>handleClick(customer.id,customer.customer)} className={compareDate(customer.deliveryDate)==false ? '': style.overDate}>{customer.customer.firstName}</td>
            <td  onClick={()=>handleClick(customer.id,customer.customer)} className={compareDate(customer.deliveryDate)==false ? '':style.overDate} >{customer.customer.mobileNumber}</td>
            <td  onClick={()=>handleClick(customer.id,customer.customer)} className={compareDate(customer.deliveryDate)==false ? '':style.overDate} >{customer.customer.buisnessAddress}</td>

            <td  onClick={()=>handleClick(customer.id,customer.customer)} className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{convertDate(customer.deliveryDate)}</td>
           
<td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>
{customer.status=="open" || customer.status=="pickedUp" || customer.status=="closed"? 
<select name="status"  value={customer.status} onChange={(e)=>handleStatus(e,customer.id)} className="form-control mt-2" >


<option value="open">Open</option>
<option value="pickedUp">Picked up</option>
<option value="closed">Closed</option>


</select>:
<select name="status"  value={customer.status} onChange={(e)=>handleStatus(e,customer.id)} disabled className="form-control mt-2" >


        <option value="open">Open</option>
       
        <option value="pickedUp">Picked up</option>
        
        <option value="closed">Closed</option>


</select>
}



</td>
<td>   
              
            
              {
                <select name="status"  value={customer.DPEmployee.none==true ?"none" :customer.DPEmployee.id}  onChange={(e)=>handleEmployee(e,customer)} className="form-control mt-2" >
                <option value={"none"}>none</option>
              {allEmployees.length>0?
                allEmployees.map((employee:any,index:number)=>{
      
                  return  <option key={index} value={employee.id}>{employee.firstName}</option>
                })  
            :''}
      
      
                  </select>
                 
                  
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
<td>...</td><td>...</td>

</tr>}
       
      </tbody>
    </Table>
            
        </div>
        :"Loading.."}
    </>


    
  )
}

export default VendorCustomers
