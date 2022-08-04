import React,{useEffect, useState} from 'react'
import CustomerNavbar from '../components/CustomerNavabar'
import {toast,Toaster} from 'react-hot-toast'
import {setLoading,setUser} from '../redux/slices/authSlice'
import {useDispatch,useSelector} from 'react-redux'
import Loading from '../components/Loading'
import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import { AppDispatch } from '../redux/store'
import {useRouter} from 'next/router'
import {updateDoc,doc,collection} from 'firebase/firestore'
import {db} from '../Firebase'



function CustomerCart() {
    const user=useSelector((state:any)=>state.auth.user)
    const loading=useSelector((state:any)=>state.auth.loading)
    let wish=user?user.wishList:""
    const [wishList,setWishList]=useState([])
    const dispatch=useDispatch<AppDispatch>()
    const [searchString,setSearchString]=useState("")
    const router=useRouter()
  const [allcustomers, setAllCustomers]: any = useState([]);
    
  const [customers, setCustomers]: any = useState([]);
 const userID=useSelector((state:any)=>state.auth.id)
  



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
      if(customer.firstName){
        if(customer.firstName.toLowerCase().includes(searchString.toLowerCase())){
          arr.push(customer)
          
        }
      }
  
     
  
    })
    
    setCustomers(arr)
    
  
  } 
  const handleClick=(email:any)=>{
    
    router.push(`/CustomerDetailProduct`)
}


  
  
  useEffect(()=>{
    if(!user.email){
      router.push("/")
    }
  },[])

  

const removeFromWishlist=async(k:any)=>{

try {let newWish={};
  dispatch(setLoading(true))

  
  Object.entries(wish).forEach(([key, value]) => {
    
    if(key!==k){
      newWish={...newWish,[key]:value}
    }
    
    
    
  })
  
  
  
  await updateDoc(doc(db, "users", userID), 
  {...user,wishList:[...Object.values(newWish)]})
dispatch(setUser({...user,wishList:[...Object.values(newWish)]}))
  
  dispatch(setLoading(false))
  toast.success("Product Removed from Wishlist")
} catch (error) {
  dispatch(setLoading(false))
  toast.error(error.message)
}
  
  

}
  return (
    <>
    <Toaster/>
    {loading && <Loading/>}
    
    <CustomerNavbar/>

  <div className="container mt-5 pt-5" >



        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>Product Name</th>
          <th>Product Price</th>
          <th>Action</th>
          

        </tr>
      </thead>
      <tbody>
       
        
      {Object.entries(wish).length>0?
  Object.entries(wish).map(([key, value])=>{
    let {product}:any=value
    

      return  <tr  key={key}>

            <td onClick={()=>handleClick(key)}>{  product.name}</td>
            <td onClick={()=>handleClick(key)}>{product.price}</td>
            <td><button className='btn btn-danger' onClick={()=>removeFromWishlist(key)}>Remove</button></td>
            


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

export default CustomerCart