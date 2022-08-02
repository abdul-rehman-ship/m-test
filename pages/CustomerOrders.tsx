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
import CustomerNavbar from '../components/CustomerNavabar';
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

      if (doc.data().customer === userID) {
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
       getData()
    },[])

    const handleClick=(email:any)=>{
        // dispatch(setCustomerEmail(email))
        // router.push(`/VendorCustomerDashboard`)
  }
  const onSearchHandle =async(e:any)=>{
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
const convertDate=(date:any)=>{
    return new Date(date.seconds * 1000).toLocaleDateString()
}
const compareDate=(a:any)=>{
  const date=parseInt(new Date().getTime())
              
              
  const date2= parseInt(new Date(a.seconds * 1000).getTime())
  const time=date2-date
  const res=Math.round(time /(1000*3600*24))
  
  
 
if(res<=0){
  return true
}else{
  return false
}
      

}
  return (<>
    <CustomerNavbar/>
    <Toaster/>

{loading?<Loading/>:" "}





    <div className="container  mt-5 pt-5">
     

      
    <div className='row mb-4'>
<div className="col-md-6">

<select name="status" value={searchString} onChange={onSearchHandle} className="form-control mt-2" >

<option value="all">all</option>
<option value="open">open</option>
<option value="qualityCheck">Quality Check</option>
<option value="packaging">packaging</option>
<option value="Delivery">Delivery</option>
<option value="pickedUp">picked up</option>
<option value="Return">Return</option>
<option value="closed">Closed</option>


</select>
</div>


</div>
        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>product Name</th>
          <th>price</th>
          <th>customer</th>
          <th>delivery date</th>
          <th>status</th>

        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return  <tr onClick={()=>handleClick(customer.email)}  key={index}>

            <td  className={compareDate(customer.deliveryDate)==false ?'': style.overDate}>{customer.product.name}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '': style.overDate}>{customer.totalPrice}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '':style.overDate} >{user.firstName}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{convertDate(customer.deliveryDate)}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{customer.status}</td>
            


      </tr>
    }
    )

:<tr><td>...</td>
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