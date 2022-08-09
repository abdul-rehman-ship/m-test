import React, { useEffect,useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import VendorNavbar from '../components/VendorNavbar'
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import {setCustomerEmail, setEmployeeId} from '../redux/slices/authSlice'
import Link from 'next/link';
function VendorEmployees() {
    const state=useSelector((state:any)=>state.auth)
    const dispatch=useDispatch<AppDispatch>()
    const [searchString,setSearchString]=useState("")
    const router=useRouter()
  const [allcustomers, setAllCustomers]: any = useState([]);
    
  const [customers, setCustomers]: any = useState([]);
  const getData = async () => {
    let arr: any = [];
    const data = await getDocs(collection(db, "users"));
    data.forEach((doc: any) => {
      if (doc.data().accountType === "vendorEmployee") {
        arr.push({...doc.data(),id:doc.id});
      }
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
            
            
        }else{
            getData()
        }
    },[])

    const handleClick=(email:any,id:any)=>{
        dispatch(setCustomerEmail(email))
        dispatch(setEmployeeId(id))
        router.push(`/VendorEmployeeDashboard`)
  }

  return (<>
    <VendorNavbar/>






    <div className="container pt-5">
     

        <div className="row mt-4 mb-3  d-flex justify-content-end" >
           
           <Link href={"VendorAddNewEmployee"}><button className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>

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
          <th>Phone</th>

        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return  <tr onClick={()=>handleClick(customer.email,customer.id)} key={index}>

            <td>{customer.firstName}</td>
            <td>{customer.surname}</td>
            <td>{customer.email}</td>
            <td>{customer.mobileNumber}</td>


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

export default VendorEmployees