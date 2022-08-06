import React, { useEffect, useState } from 'react'
import {db} from '../Firebase'
import {collection ,getDocs,doc,updateDoc, addDoc, serverTimestamp} from 'firebase/firestore'
import {useRouter} from 'next/router'
import{toast,Toaster} from 'react-hot-toast'
import { useSelector ,useDispatch} from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import style from '../styles/profile.module.css'
import Link from 'next/link'
import { validateUpdateProfile } from '../components/valid'
import { setLoading, setUser,setVendorSettings } from '../redux/slices/authSlice'
import Loading from '../components/Loading'
import VendorNavbar from '../components/VendorNavbar'
import VendorProductItem from '../components/VendorSelectProductItem'
export default function VendorSettings() {


    const loading=useSelector((state:RootState)=>state.auth.loading)
    const email=useSelector((state:RootState)=>state.auth.customerEmail)
    const isVendor=useSelector((state:RootState)=>state.auth.vendor)
    const vendorSettings=useSelector((state:RootState)=>state.auth.vendorSettings)
    const [products,setProducts]=useState([])
    const [selectedProducts,setselectedProducts]:any=useState({})

    const [allProducts,setAllProducts]=useState([])
    const router=useRouter()
    const [allEmployees,setallEmployees]:any=useState([])
    const [allCustomers,setallCustomers]:any=useState([])


    const [isProduct,setIsProduct]=useState(true)

    const dispatch=useDispatch<AppDispatch>()
    const initialSettings={
      quantity:"",
      employee:"",
      customer:"",
      deliveryDate:""
      
    }
    
    const [mUser,setMUser]:any=useState(initialSettings)

    const getAllEmployees=async()=>{
        let arr: any = [];
        const data = await getDocs(collection(db, "users"));
        data.forEach(async(doc: any) => {
          if(doc.data().accountType==="vendorEmployee"){
            arr.push({...doc.data(),id:doc.id})
      
          }
          console.log(arr);
          
          await setallEmployees(arr)
          
        });
      }
      const getAllCustomers=async()=>{
        let arr: any = [];
        const data = await getDocs(collection(db, "users"));
        data.forEach(async(doc: any) => {
          if(doc.data().accountType==="customer"){
            arr.push({...doc.data(),id:doc.id})
      
          }
          await setallCustomers(arr)
          
        });
      }
      const getData = async () => {
        dispatch(setLoading(true))
      let arr: any = [];
      const data = await getDocs(collection(db, "products"));
      data.forEach((doc: any) => {
        const prod={id:doc.id,...doc.data()}
          arr.push(prod);
        
      });
     setAllProducts(arr)
      setProducts(arr)
      getAllCustomers()
      getAllEmployees()
      dispatch(setLoading(false))
      };
    
   useEffect(()=>{
    if(!isVendor){
        router.push("/")
        
        
    }else{
        getData()
        
        
    }

    
        
    
   },[])
   const selectProductHandle=async(product:any)=>{
    setIsProduct(false)
    setselectedProducts(product)

   }
   const handleSubmit=async(e:any)=>{
    e.preventDefault()

     
      
    
    try {
        
        if(!mUser.quantity  || !mUser.customer || !mUser.deliveryDate || mUser.customer=="none"){

            toast.error("Please fill all fields")
            return
          }
          else{ 
            dispatch(setLoading(true))
            let empId=mUser.employee ? mUser.employee !== "none" ? mUser.employee :"" :""
            allEmployees.forEach((emp:any)=>{
              if(emp.id===empId){
                mUser.employee=emp
              }
            })
             
            let cusId=mUser.customer ? mUser.customer !== "none" ? mUser.customer :"" :""
            
            allCustomers.forEach((cus:any)=>{
              if(cus.id===cusId){
                mUser.customer=cus
              }
            })
            await addDoc(collection(db, "orders"), {
                customer:mUser.customer? mUser.customer :"",
                 product:selectedProducts,
                 quantity:mUser.quantity,
                 totalPrice: parseInt(selectedProducts.salePrice) * (mUser.quantity),
                 deliveryDate:new Date(mUser.deliveryDate),
                 createdAt:serverTimestamp(),
                 status:"open",
                 employee:mUser.employee?mUser.employee:"",  
                 deliveryPartner:{},
                 deliveryPrice:"0",
                 paid:false
            
             })





            dispatch(setLoading(false))
            toast.success("Order added successfully")
            
          }


    }catch(error:any){
        dispatch(setLoading(false))
        toast.error(error)

    }
    
    
   }
   const handleChange=async(e:any)=>{
    const {name,value}=e.target
    setMUser({...mUser,[name]:value})
    
   }
  return (
    <>
   <Toaster/>
    <VendorNavbar/>
        { loading && <Loading/>}
      

{
    isProduct? 
<div className="container mt-4 pt-4">

    


<div className="row">
<h3 className='my-4' style={{fontFamily:"Poppins",color:"#1C7468"}}>Select product</h3>

{

products.length>0?

products.map((product:any)=>{
return <div className='col-md-4'  key={product.id} onClick={()=>selectProductHandle(product)}>
<VendorProductItem  probs={product} key={product.id}/>
    </div>
})


:''
}

</div>
</div>

    :

    <div className={`${style.formContainer} container mt-4 pt-5`}>

<form onSubmit={handleSubmit}>
      

      <div className={`row mt-4 px-3`}>
  
          <div className="col-md-6">
                  <span>Quantity *</span>
                  <input type="number" min={1}  name="quantity" onChange={handleChange}  className="form-control mt-2" value={mUser.quantity}   required/>
  
  
          </div>
          <div className="col-md-6">
              
          <span> Delivery Date*</span>
                  <input type="date"    name="deliveryDate" onChange={handleChange}  className="form-control mt-2" value={mUser.deliveryDate} required  />
  
          </div>
  
      </div>
      <div className={`row mt-4 px-3`}>
  
          <div className="col-md-6">
                  <span>Employee *</span>
                  {
              <select name="employee"  onChange={handleChange}   className="form-control mt-2" >
              <option value={"none"}>none</option>
            {allEmployees.length>0?
              allEmployees.map((employee:any,index:number)=>{
    
                return  <option key={index} value={employee.id}>{employee.firstName}</option>
              })  
          :''}
    
    
                </select>
               
                
            }
  
  
          </div>
          <div className="col-md-6">
              
          <span> Customer*</span>
          {
              <select name="customer"  onChange={handleChange}   className="form-control mt-2" >
              <option value={"none"}>none</option>
            {allCustomers.length>0?
              allCustomers.map((employee:any,index:number)=>{
    
                return  <option key={index} value={employee.id}>{employee.firstName}</option>
              })  
          :''}
    
    
                </select>
               
                
            }
  
          </div>
  
      </div>
      <div className={`row mt-4 px-3`}>
  
  <div className="col-md-6">
          <span>Price *</span>
          <input type="number" min={1} readOnly  name="price"  className="form-control mt-2" value={mUser.quantity * (selectedProducts && selectedProducts.salePrice) }   required/>


  </div>
 

</div>
  
  
  <div className="row mt-4 mx-2">
  
  <div className="col-md-6">
     
  <button type='submit' className='btn'>create order</button>
  
  </div>
  
  
  </div>
  </form>
    </div>
   

}



    
        
        
        
    
    
    
    
    
    </>
  )
}
