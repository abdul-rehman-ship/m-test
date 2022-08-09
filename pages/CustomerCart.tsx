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
import {updateDoc,doc,collection,addDoc, serverTimestamp, getDoc, getDocs} from 'firebase/firestore'

import {db} from '../Firebase'
import { PaystackButton } from 'react-paystack'

import axios from 'axios'
import { FlutterWaveButton, useFlutterwave,closePaymentModal } from 'flutterwave-react-v3';




function CustomerCart() {
    const user:any=useSelector((state:any)=>state.auth.user)
    const loading=useSelector((state:any)=>state.auth.loading)
    const vendorSettings:any=useSelector((state:any)=>state.auth.vendorSettings)
    let wish:any= user? user.cart:""
    const [wishList,setWishList]=useState([])
    const dispatch=useDispatch<AppDispatch>()
    const [searchString,setSearchString]=useState("")
    const router=useRouter()
  const [allcustomers, setAllCustomers]: any = useState([]);
    
  const [customers, setCustomers]: any = useState([]);
  const [total_price,setTotalPrice]=useState(0)
 const userID=useSelector((state:any)=>state.auth.id)
   
 const config:any = {
  public_key: vendorSettings?vendorSettings.public_key:"",
  tx_ref: Date.now(),
  amount: total_price ,
  currency: 'NGN',
  payment_options: 'card,mobilemoney,ussd',
  customer: {
    email: user? user.email:"",
    phonenumber: user ?user.mobileNumber :"",
    name: user ?user.firstName:"",
  },
  customizations: {
    title: 'my Payment Title',
    description: 'Payment for items ',
    logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
  },
};

const handleFlutterPayment = useFlutterwave(config);





  const handleClick=(email:any)=>{
    
    router.push(`/CustomerDetailProduct`)
}


  
  
  
const getData=async()=>{
  try {
    
    const data=await getDoc(doc(db,userID))
    dispatch(setUser(data.data()))

      
  } catch (error) {
    toast.error(error.message)
    
  }
}
  
useEffect(()=>{
  if(!user.email){
    router.push("/")
  }
  let price:any=0
  Object.entries(wish).forEach(([key, value]) => {
    
    const{product}:any=value
    const {quantity}:any=value
    
    let basePrice:any=0
     basePrice= product.salePrice 
     price= parseInt(price)+((quantity)  * (basePrice))
     price=parseFloat(price).toFixed(2)
  })
    setTotalPrice(price)

    
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
  {...user,cart:[...Object.values(newWish)]})
dispatch(setUser({...user,cart:[...Object.values(newWish)]}))
  
  dispatch(setLoading(false))
  toast.success("Product Removed from Cart")
} catch (error) {
  dispatch(setLoading(false))
  toast.error(error.message)
}
  
  

}
const componentProps :any= {
  publicKey:vendorSettings? vendorSettings.public_key:"",
  email:user?user.email:"",
  amount: total_price *100,
  firstname:user?user.firstName:"",
  
  text: "checkout",
  onSuccess:async () =>

  {
    const deliveryDate=new Date()


deliveryDate.setDate(deliveryDate.getDate() + parseInt( vendorSettings.numberOfDeliveryDate))

    Object.entries(wish).forEach(async([key,value])=>{
      let {product}:any=value
      let {quantity}:any=value
    dispatch(setLoading(true))
    await addDoc(collection(db, "orders"), {
      customer:user?user:"",
       product:product,
       quantity:quantity,
       totalPrice: parseInt(product.salePrice) * (quantity),
       deliveryDate:deliveryDate,
       createdAt:serverTimestamp(),
       status:"open",
       employee:{},  
       deliveryPartner:{},
       deliveryPrice:"0",
       DPEmployee:{},
       paid:false,
  
  
   })
     await updateDoc(doc(db, "users", userID), 
     {...user,cart:[]})
   dispatch(setUser({...user,cart:[]}))
  
  
   await updateDoc(doc(db,"products",product.id),
   {...product,initialStock:parseInt(product.initialStock)-quantity})
  
    await axios.post('/api/sendMail',{
    email:'rehmanabdul22655@gmail.com',
    buisnessName:"RehmanEnterprice",
    customerName:user ?user.firstName+" "+user.surname:"",
    item:product.name,
    price:product.salePrice,
    quantity:quantity,
    totalPrice: parseInt(product.salePrice) * (quantity),
    deliveryDate:deliveryDate.toDateString()
  
  })
  
     dispatch(setLoading(false))
      toast.success("Order Placed Successfully")
     
  
        
     
    })
        dispatch(setLoading(false))
        toast.success("order placed successfully")
  }
    ,
  onClose: () => alert("Wait! You need this product, don't go!!!!"),
}


const checkOut=async()=>{
const deliveryDate=new Date()


deliveryDate.setDate(deliveryDate.getDate() + parseInt( vendorSettings.numberOfDeliveryDate))


try {
  if(vendorSettings.paymentMethod=="paystack"){
  //   const paystack=new PaystackPop()
  //   paystack.newTransaction({
  //     key:vendorSettings.public_key,
  //     email:user.email,
  //     amount: total_price *100,
  //     firstname:user.firstName,
  //     onSuccess:async()=>{
  //       Object.entries(wish).forEach(async([key,value])=>{
  //         let {product}:any=value
  //         let {quantity}:any=value
  //       dispatch(setLoading(true))
  //       await addDoc(collection(db, "orders"), {
  //         customer:userID,
  //          product:product,
  //          quantity:quantity,
  //          totalPrice: parseInt(product.salePrice) * (quantity),
  //          deliveryDate:deliveryDate,
  //          createdAt:serverTimestamp(),
  //          status:"open",
  //          employee:{},  
  //          deliveryPartner:{},
  //          deliveryPrice:"0",
  //          DPEmployee:{},
  //          paid:false,
      
      
  //      })
  //        await updateDoc(doc(db, "users", userID), 
  //        {...user,cart:[]})
  //      dispatch(setUser({...user,cart:[]}))
      
      
  //      await updateDoc(doc(db,"products",product.id),
  //      {...product,initialStock:parseInt(product.initialStock)-quantity})
      
  //      const response = await axios.post('/api/sendMail',{
  //       email:'rehmanabdul22655@gmail.com',
  //       buisnessName:"RehmanEnterprice",
  //       customerName:user.firstName+" "+user.surname,
  //       item:product.name,
  //       price:product.salePrice,
  //       quantity:quantity,
  //       totalPrice: parseInt(product.salePrice) * (quantity),
  //       deliveryDate:deliveryDate.toDateString()
      
  //     })
      
  //        dispatch(setLoading(false))
  //         toast.success("Order Placed Successfully")
         
      
            
         
  //       })
  //     },
      
  //         onCencel:()=>{
  //           toast.error("payment cencel")
  //         }

  //   })
 
 
 
  }else{

      handleFlutterPayment({

        callback:async(response)=>{
              if(response){
                Object.entries(wish).forEach(async([key,value])=>{
          let{product}:any=value
          let{quantity}:any=value
                  dispatch(setLoading(true))
                  await addDoc(collection(db, "orders"), {
                    customer:user?user:"",
                     product:product,
                     quantity:quantity,
                     totalPrice: parseInt(product.salePrice) * (quantity),
                     deliveryDate:deliveryDate,
                     createdAt:serverTimestamp(),
                     status:"open",
                     employee:{},  
                     deliveryPartner:{},
                     deliveryPrice:"0",
                     DPEmployee:{},
                     paid:false,
                
                
                 })
                   await updateDoc(doc(db, "users", userID), 
                   {...user,cart:[]})
                 dispatch(setUser({...user,cart:[]}))
                
                
                 await updateDoc(doc(db,"products",product.id),
                 {...product,initialStock:parseInt(product.initialStock)-quantity})
                
                 const response = await axios.post('/api/sendMail',{
                  email:user? user.email:"",
                  buisnessName:"RehmanEnterprice",
                  customerName:user ?user.firstName+" "+user.surname :"",
                  item:product.name,
                  price:product.salePrice,
                  quantity:quantity,
                  totalPrice: parseInt(product.salePrice) * (quantity),
                  deliveryDate:deliveryDate.toDateString()
                
                })
                
                   dispatch(setLoading(false))
                    toast.success("Order Placed Successfully")
                   
                
                      
                   
                  })
              }
        },
        onClose:()=>{

        }
      })

  }
 
  
  
  
 dispatch(setLoading(false))

 
} catch (error) {
  dispatch(setLoading(false))
  toast.error(error.message)
  
}







}

const handleQuantity=async(e:any,key:any,product:any)=>{
  e.preventDefault()
try {
  dispatch(setLoading(true))
  const value=e.target.quantity.value
  let id:any=""
  const data=await getDocs(collection(db, "users"))
  data.forEach((doc:any)=>{
    if(doc.data()){
      if(doc.data().email===user.email){
        id=doc.id
        
        
      }
    }
  })
  console.log({...user,cart:{...user.cart,[key]:{product,quantity:parseInt(value)}}});
  
  await updateDoc(doc(db, "users", id), {

    ...user,cart:{...user.cart,[key]:{product,quantity:value}}

  })
  dispatch(setUser({

    ...user,cart:{...user.cart,[key]:{product,quantity:value}}

  }))
let USER:any={

  ...user,cart:{...user.cart,[key]:{product,quantity:value}}

}
 wish=USER?USER.cart:""
  let price:any=0
  Object.entries(wish).forEach(([key, value]) => {
    
    const{product}:any=value
    const {quantity}:any=value
    
    let basePrice:any=0
     basePrice= product.salePrice 
     price= parseInt(price)+((parseInt(quantity))  * (basePrice))
     price=parseFloat(price).toFixed(2)
  })
    setTotalPrice(price)

    
  // getData()
  dispatch(setLoading(false))
  toast.success("Quantity Updated")
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

  <div className={`container mt-5 pt-5 `} >



        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>Product Name</th>
          <th>Product Price</th>
          <th>Quantity</th>
          <th>Change Quantity</th>
          <th>Action</th>
          

        </tr>
      </thead>
      <tbody>
       
        
      {wish && Object.entries(wish).length>0?
  Object.entries(wish).map(([key, value])=>{
    let {product}:any=value
    let {quantity}:any=value

      return  <tr  key={key}>

            <td onClick={()=>handleClick(key)}>{  product.name}</td>
            <td onClick={()=>handleClick(key)}>{product.salePrice}</td>
            <td onClick={()=>handleClick(key)}>{quantity}</td>
            <td>
              <form onSubmit={(e)=>handleQuantity(e,key,product)}> <input type="number" name='quantity' min={1}  className='form-control' placeholder='Enter Quantity'/>
              </form>
              </td>
            <td><button className='btn btn-danger' onClick={()=>removeFromWishlist(key)}>Remove</button></td>
            


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

    <div className="row " >
<div className="col-md-6"></div>
     <div className="col-md-6 text-end">
     <p style={{fontFamily:'Poppins',fontWeight:600}}>Total price : {total_price}</p>
      
     </div>
    </div>

  </div>
  <div className={`row  container ${style.productDetail}`}>
    <div className="col-md-6"></div>
    <div className="col-md-6 text-end">
      {vendorSettings&& vendorSettings.paymentMethod=="paystack"?
      <PaystackButton {...componentProps}/> 
      :
      
      <button className='btn ' onClick={checkOut}>checkout</button>
      }
    </div>
  </div>
    
    
    
    
    </>
  )
}

export default CustomerCart