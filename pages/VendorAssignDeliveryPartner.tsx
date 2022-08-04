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
      
        arr.push({...doc.data(),id:doc.id})
      
    });
    arr.reverse()    
    await setCustomers(arr);
    await setAllCustomers(arr)
  };
  
const getAllCustomers=async()=>{
  let arr: any = [];
  const data = await getDocs(collection(db, "users"));
  data.forEach(async(doc: any) => {
    if(doc.data().accountType==="deliveryPartner"){
      arr.push({...doc.data(),id:doc.id})

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
  

    const handleClick=(id:any)=>{
        // dispatch(setCustomerEmail(email))
        // router.push(`/VendorCustomerDashboard`)
        
        
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

const handleEmployee=async(e:any,customer:any)=>{

  
try {
  dispatch(setLoading(true))
  if(e.target.value==="none"){

    const emp=await getDoc(doc(db,"users",e.target.value))
    await updateDoc(doc(db,"orders",customer.id),{
        deliveryPartner:{none:true}
  })
    
    dispatch(setLoading(false))
    toast.success(`order assigned to no one`)

  }else{
    const emp=await getDoc(doc(db,"users",e.target.value))
    await updateDoc(doc(db,"orders",customer.id),{
        deliveryPartner:{id:emp.id,...emp.data(),none:false}
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
const handlePrice=async(e:any,id:any)=>{
    e.preventDefault()
    try {
        dispatch(setLoading(true))
        await updateDoc(doc(db,"orders",id),{
            deliveryPrice:e.target.delivery.value
        })
        
        getData()
        dispatch(setLoading(false))

    
    } catch (error) {
        dispatch(setLoading(false))
        toast.error(error.message)
        
    
    }
}

  return (<>
    <VendorNavbar/>
    <Toaster/>

{loading?<Loading/>:" "}



    <div className="container  mt-5 pt-5">
     

 
        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>product Name</th>
          <th>price</th>
          <th>delivery date</th>
          <th>delivery price</th>
          <th> change delivery price</th>
          <th>assign Delivery Partner</th>


        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return <tr onClick={()=>handleClick(customer.id)}  key={index}>

            <td  className={compareDate(customer.deliveryDate)==false ?'': style.overDate}>{customer.product.name}</td>
            <td  className={compareDate(customer.deliveryDate)==false ? '': style.overDate}>{customer.totalPrice}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{convertDate(customer.deliveryDate)}</td>
            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>{customer.deliveryPrice}</td>

            <td className={compareDate(customer.deliveryDate)==true  ?  style.overDate:''}>

            <td className='d-flex  justify-content center'> 
            <form onSubmit={(e)=>handlePrice(e,customer.id)}>
                
                <input type="number" min={0}  name="delivery"  placeholder="enter new delivery price" className="form-control" />
            
                </form>
            </td>


            </td>

            <td>   
              
            
            {
              <select name="status"  value={customer.deliveryPartner.none==true ?"none" :customer.deliveryPartner.id}  onChange={(e)=>handleEmployee(e,customer)} className="form-control mt-2" >
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
<td>...</td>
</tr>}
       
      </tbody>
    </Table>
            
        </div>
    </>


    
  )
}

export default VendorCustomers