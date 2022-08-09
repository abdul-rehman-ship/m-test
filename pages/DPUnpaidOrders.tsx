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
      
      
if(doc.data().paid==false){
        if(doc.data().deliveryPartner.email==state.user.email){
          
            arr.push({...doc.data(),id:doc.id})
    
            
    
        } 
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
  try {    dispatch(setLoading(true))
    
    allcustomers.forEach(async(i:any)=>{
      if(selectedCustomers.includes(i.id)){
        await updateDoc(doc(db, "orders", i.id), 
        {
  
         paid:true
        })
    }
     
    
    })
    
  

    getData()
  
  
     dispatch(setLoading(false))
      toast.success("Orders paid Successfully")
  
        

    
    
  } catch (error) {
      toast.error(error)
      
  }
}
  const payAll=async()=>{
    try {
        dispatch(setLoading(true))
      
        allcustomers.forEach(async(i:any)=>{
          await updateDoc(doc(db, "orders", i.id), 
          {
   
           paid:true
          })
        
        })
        
      
  
      
        getData()
      
         dispatch(setLoading(false))
          toast.success("Orders paid Successfully")
      
            
      
      
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

Mark All Paid
</button></Link>
<Link href={""}><button onClick={paySelected} className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>

Mark Selected Paid
</button></Link>
            
        </div>

      
        <div className='row mb-4'>



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
          <th>Select</th>


        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return  <tr onClick={()=>handleClick(customer.id)}  key={index}>

            <td  className={compareDate(customer.deliveryDate)==false ?'': style.overDate}>{customer.product.name}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '': style.overDate}>{customer.customer.firstName}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '': style.overDate}>{customer.customer.mobileNumber}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '':style.overDate} >{customer.customer.buisnessAddress}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{convertDate(customer.deliveryDate)}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>



                    {customer.paid===true?"Paid":"Not Paid"}
            </td>
<td>
    {customer.paid===false?
<input type="checkbox" onChange={(e)=>handleCheckChange(e,customer.id)} />:""}

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
<td>...</td>

</tr>}
       
      </tbody>
    </Table>
            
        </div>
    </>


    
  )
}

export default VendorCustomers