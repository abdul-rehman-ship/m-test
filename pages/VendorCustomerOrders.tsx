import React, { useEffect,useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import VendorNavbar from '../components/VendorNavbar'
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import {setCustomerEmail} from '../redux/slices/authSlice'
import Link from 'next/link';
import style2 from '../styles/profile.module.css'
import { Toaster } from 'react-hot-toast';
import Loading from '../components/Loading';

function VendorCustomers() {
    const state=useSelector((state:any)=>state.auth)
    const user=useSelector((state:any)=>state.auth.user)
    const dispatch=useDispatch<AppDispatch>()
    const [searchString,setSearchString]=useState("")
    const loading=useSelector((state:any)=>state.auth.loading)
 const userID=useSelector((state:any)=>state.auth.id)

    const router=useRouter()
  const [allcustomers, setAllCustomers]: any = useState([]);
    
  const [customers, setCustomers]: any = useState([]);
  const getData = async () => {
    let arr: any = [];
    const data = await getDocs(collection(db, "orders"))

    

    data.forEach((doc: any) => {

        
        
        
      if (doc.data().customer.id === state.customerId) {
        arr.push({...doc.data(),id:doc.id})}
      
    });
    
    
    
    
    
    
    await setCustomers(arr);
    await setAllCustomers(arr)
  };
  const onSearchChange=async(e:any)=>{
    setSearchString(e.target.value)
    if(e.target.value===""){
      setCustomers(allcustomers)
    }else{
      filter()
    }
  
  }
const filter=async()=>{
  setCustomers([])
  let arr=[]
  allcustomers.forEach((customer:any)=>{
    

    if(customer.firstName.toLowerCase().includes(searchString.toLowerCase())){
      arr.push(customer)
      
    }

  })
  
  setCustomers(arr)
  

}
    useEffect(()=>{
      if(!state.vendor){
        router.push("/")
        
        
    }
       getData()
    },[])

    const handleClick=(email:any)=>{
       
  }
const convertDate=(date:any)=>{
    return new Date(date.seconds * 1000).toLocaleDateString()
}
const compareDate=(a:any)=>{
  const date:any=(new Date().getTime())
              
              
  const date2:any= (new Date(a.seconds * 1000).getTime())
  const time=date2-date
  const res=Math.round(time /(1000*3600*24))
  
  
 
if(res<=0){
  return true
}else{
  return false
}
      

}
  return (<>
    <VendorNavbar/>
    <Toaster/>

{loading?<Loading/>:" "}





<div className={` ${style2.formContainer} container mt-5 `} >
            <Link href="VendorCustomerDashboard">
            <button className={`btn ${style2.back_btn} btn-light `} style={{fontSize:'large'}}>
            &#8592; Back </button></Link>
      
        <div className='row mb-4'>



</div>
        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>Product Name</th>
          <th>Price</th>
          <th>Delivery date</th>
          <th>Status</th>

        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return  <tr onClick={()=>handleClick(customer.email)}  key={index}>

            <td  className={compareDate(customer.deliveryDate)==false ?'': style.overDate}>{customer.product.name}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '': style.overDate}>{customer.totalPrice}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{convertDate(customer.deliveryDate)}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{customer.status}</td>
            


      </tr>
    }
    )

:<tr><td>...</td>
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