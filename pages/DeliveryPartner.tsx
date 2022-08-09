import React, { useEffect,useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import VendorNavbar from '../components/DeliveryPartnerNavbar'
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import {setCustomerEmail, setCustomerId, setID} from '../redux/slices/authSlice'
import Link from 'next/link';
import { userAgent } from 'next/server';
function DeliveryPartner() {
    const state=useSelector((state:any)=>state.auth)
    const dispatch=useDispatch<AppDispatch>()
    const [searchString,setSearchString]=useState("")
    const router=useRouter()
  const [allcustomers, setAllCustomers]: any = useState([]);
  const [unAssignOrders,setUnAssignOrders]:any=useState(0)
  const [lowStock,setLowStock]:any=useState(0)
  
  
  const [pending,setPending]:any=useState(0)
  const [awaitngDelivery,setAwaitingDelivery]:any=useState(0)
  const [pickedUp,setPickedUp]:any=useState(0)
  const [returned,setReturned]:any=useState(0)
  const [customers, setCustomers]: any = useState([]);
  const getData = async () => {
    let arr: any = [];
    const data = await getDocs(collection(db, "users"));
    data.forEach((doc: any) => {
      if (doc.data().accountType === "DPEmployee") {
        if(doc.data().email==state.user.email){
dispatch(setID(doc.id))
        }
        arr.push(doc.data());
      }
    });
    await setCustomers(arr);
    await setAllCustomers(arr)

    let un:any=0
let open:any=0
let pend:any=0
let  picked:any=0
let ret:any=0
     
            const data3 = await getDocs(collection(db, "orders"));
            data3.forEach((snap)=>{
                if(snap.data()){
                  console.log(snap.data().deliveryPartner.email,state.user.email);

                  if(snap.data().deliveryPartner.email==state.user.email){
                    
                  if(snap.data().status=="open"){
                    open=parseInt(open)+1

                  }
                  if(snap.data().status=="pickedUp"){
                    picked=parseInt(picked)+1
                  }
                  if(snap.data().status=="returned"){
                    ret=parseInt(ret)+1
                  }
                  if(snap.data().status=="Delivery"){
                    pend=parseInt(pend)+1
                  }
                  if(!snap.data().employee.email)
                  {
                      un= parseInt(un)+1
                  }
                }
              }
            })
            setPending(open)
            setAwaitingDelivery(pend)
            setPickedUp(picked)
            setReturned(ret)
            setUnAssignOrders(un)
            console.log(open);
            
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
        dispatch(setCustomerId(email))
        // router.push(`/VendorEmployeeDashboard`)
  }

  return (<>
    <VendorNavbar/>






    <div className="container pt-5">
    <div className="row">
<div className="col-md-6 col-lg-4 " >

<Link href={"DPOrders"}>
<div className={`
${style.card} card mb-4 text-center p-5  shadow-sm
    `}>

<p> {pending? pending :0}: Pending Orders</p>


</div>
</Link>

    
</div>

<div className="col-md-6 col-lg-4 " >

<Link href={"DPOrders"}>
<div className={`
${style.card} card mb-4 text-center p-5  shadow-sm
    `}>

<p> {awaitngDelivery? awaitngDelivery :0}: Awaiting Delivery</p>


</div>
</Link>

    
</div>
<div className="col-md-6 col-lg-4 " >

<Link href={"DPOrders"}>
<div className={`
${style.card} card mb-4 text-center p-5  shadow-sm
    `}>

<p> {pickedUp? pickedUp :0}: Picked Up  Orders</p>


</div>
</Link>

    
</div>
<div className="col-md-6 col-lg-4 " >

<Link href={"DPOrders"}>
<div className={`
${style.card} card mb-4 text-center p-5  shadow-sm
    `}>

<p> {returned? returned :0}: Returned Orders</p>


</div>
</Link>

    
</div>




</div>
     

        <div className="row mt-4 mb-3  d-flex justify-content-end" >
           
           <Link href={"DPAddNewEmployee"}><button className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>

<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{width:'20px',height:'20px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
</svg>Add New
</button></Link>
            
        </div>
        <div className='row mb-4'>

<div className="input-group">
  <div className="form-outline">
    <input type="search"  name="search" value={searchString} onChange={onSearchChange} className="form-control"  placeholder='search ...'/>
    
  </div>
  <button type="button" onClick={filter} className={`btn ${style.search_btn}`} >
search
  </button>
</div>

</div>
        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>First Name</th>
          <th>Suname</th>
          <th>Email</th>
          

        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return  <tr onClick={()=>handleClick(customer.email)} key={index}>

            <td>{customer.firstName}</td>
            <td>{customer.surname}</td>
            <td>{customer.email}</td>
            


      </tr>
    }
    )

:<tr><td>...</td>
<td>...</td>
<td>...</td>

</tr>}
       
      </tbody>
    </Table>
            
        </div>
    </>


    
  )
}

export default DeliveryPartner