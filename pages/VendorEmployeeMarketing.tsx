import React, { useEffect,useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import VendorNavbar from '../components/VendorEmployeeNavbar'
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import {setCustomerEmail, setLoading} from '../redux/slices/authSlice'
import Link from 'next/link';
import toast from 'react-hot-toast';
import * as XLSX from "xlsx";
import * as FileSaver from 'file-saver';
import axios from 'axios';
import Loading from '../components/Loading';
function VendorCustomers() {
    const state=useSelector((state:any)=>state.auth)
    const dispatch=useDispatch<AppDispatch>()
    const [searchString,setSearchString]=useState("")
    const router=useRouter()
  const [allcustomers, setAllCustomers]: any = useState([]);
  const [selectedCustomers, setSelectedCustomers]: any = useState([]);
    
  const [customers, setCustomers]: any = useState([]);
  const getData = async () => {
    let arr: any = [];
    const data = await getDocs(collection(db, "users"));
    data.forEach((doc: any) => {
      if (doc.data().accountType === "customer") {
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
      if(!state.user.email){
        router.push("/")
      }
        
          getData()

        

    },[])

    const handleClick=(email:any)=>{
        // dispatch(setCustomerEmail(email))
        // router.push(`/VendorCustomerDashboard`)
  }
  const handleCheckChange=async(e:any,customer:any)=>{
        try {
            if(e.target.checked){
                // unique add

                setSelectedCustomers([...selectedCustomers,customer.id])
                
                
            }else{
              setSelectedCustomers(selectedCustomers.filter((id:any)=>id!==customer.id))
            }
            
            console.log(selectedCustomers);
            
        } catch (error) {
            toast.error(error)
            
        }

  

}
const selectedEmail=async()=>{
    try {
        dispatch(setLoading(true))
        allcustomers.forEach(async(customer:any)=>{
            if(selectedCustomers.includes(customer.id)){
                const response = await axios.post('/api/sendMailToCustomer',{
                    email:customer.email,
                    customerName:customer.firstName+" "+customer.surname,
                 
                
                  })
            }
         
        })
        dispatch(setLoading(false))
        toast.success("Email Sent")
        
    } catch (error) {
        toast.error(error)
        
    }
}
const allEmail=async()=>{
    try {
        dispatch(setLoading(true))
        allcustomers.forEach(async(customer:any)=>{

            const response = await axios.post('/api/sendMailToCustomer',{
                email:'rehmanabdul22655@gmail.com',
                customerName:customer.firstName+" "+customer.surname,
             
            
              })
        })
        dispatch(setLoading(false))
        toast.success("Email Sent")
        
    } catch (error) {
        toast.error(error)
        
    }

}
const downloadInfo=async()=>{
    try {
        let csvData=[]
        allcustomers.forEach((customer:any)=>{

            let object={
                firstName:customer.firstName,
                surname:customer.surname,
                email:customer.email,
                phone:customer.mobileNumber,
                address:customer.buisnessAddress,
                whatsapp:customer.WNumber
            }
            csvData.push(object)
        })





        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
    const fileName="data"
      const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
        
    } catch (error) {

        toast.error(error)
        
    }

}
  return (<>
    <VendorNavbar/>




{state.loading && <Loading/>}

{state.user && state.user.allowedRoles.marketing==true?

<div className="container pt-5">
     
     <div className="row mt-4 mb-3  d-flex justify-content-end" >
            
            <Link href={""}><button onClick={selectedEmail} className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>
 Send  Selected Email
 </button></Link>
 <Link href={""}><button onClick={allEmail} className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>
 Send Email to All
 </button></Link>
 <Link href={""}><button onClick={downloadInfo} className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>
 Download info
 </button></Link>
             
         </div>
         <div className="row mt-4 mb-3  d-flex justify-content-end" >
            
        
             
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
           <th>Select</th>
 
         </tr>
       </thead>
       <tbody>
       {customers.length>0?
     customers.map((customer:any,index:number)=>{
 
       return  <tr onClick={()=>handleClick(customer.email)} key={index}>
 
             <td>{customer.firstName}</td>
             <td>{customer.surname}</td>
             <td>{customer.email}</td>
             <td>{customer.mobileNumber}</td>
             <td>
                 <input type="checkbox" onChange={(e)=>handleCheckChange(e,customer)} />
             </td>
 
 
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

:
<div className="container mt-5">
<h3 style={{fontFamily:"Poppins"}}>you are not allowed to see marketing </h3>
</div> 
}

    
    </>


    
  )
}

export default VendorCustomers