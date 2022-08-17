import React,{useEffect, useState} from 'react'
import CustomerNavbar from '../components/CustomerNavabar'
import style from '../styles/vendor.module.css'
import Carousel from 'react-bootstrap/Carousel';
import {useDispatch,useSelector} from 'react-redux'
import { addDoc,collection,doc, updateDoc,serverTimestamp, getDocs } from 'firebase/firestore';
import {useRouter} from 'next/router'
import CustomerProductItem from '../components/CustomerProductItem'
import toast, { Toaster } from 'react-hot-toast';
import { db } from '../Firebase';
import {setID, setLoading,setUser} from '../redux/slices/authSlice'
import { AppDispatch } from '../redux/store';
import Loading from '../components/Loading';
import { PaystackButton } from 'react-paystack'
import axios from 'axios'
import { FlutterWaveButton, useFlutterwave,closePaymentModal } from 'flutterwave-react-v3';




function CustomerDetailProduct() {

  const router=useRouter()
  const vendorSettings:any=useSelector((state:any)=>state.auth.vendorSettings)
  const product:any=useSelector((state:any)=>state.auth.product)
 const products=useSelector((state:any)=>state.auth.products)
 const [quantity,setQuantity]:any=useState(1)
 const userID:any=useSelector((state:any)=>state.auth.id)
 const user:any=useSelector((state:any)=>state.auth.user)
 const dispatch=useDispatch<AppDispatch>()
const [productVariation,setProductVariation]:any=useState({})

 const loading=useSelector((state:any)=>state.auth.loading)


const getData=async()=>{
  const data=await getDocs(collection(db,"users"))
  data.forEach((snap)=>{
    if(snap.data()){
      dispatch(setID(snap.id))
    }
  })
  const keys=Object.keys(product.customerFields)
  const myObj={}
  keys.forEach((key)=>{
    myObj[key]=""
  }
  )
  setProductVariation(myObj)
}
useEffect(()=>{
  if(!user.email){
    router.push("/")
  }
getData()
},[])
 
 const config:any = {
  public_key: vendorSettings?vendorSettings.public_key:"",
  tx_ref: Date.now(),
  amount: product ?parseInt(product.salePrice) * (quantity) :"",
  currency: 'NGN',
  payment_options: 'card,mobilemoney,ussd',
  customer: {
    email: user?user.email:"",
    phonenumber:user? user.mobileNumber:"",
    name: user?user.firstName:"",
  },
  customizations: {
    title: 'my Payment Title',
    description: 'Payment for items ',
    logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
  },
};
const componentProps :any= {
  publicKey:vendorSettings?vendorSettings.public_key:"",
  email:user?user.email:"",
  amount: product ?product.salePrice * quantity * 100:"",
  firstname:user?user.firstName:"",
  
  text: "checkout",
  onSuccess:async () =>

  {
    const deliveryDate=new Date()


deliveryDate.setDate(deliveryDate.getDate() + parseInt( vendorSettings.numberOfDeliveryDate))
dispatch(setLoading(true))
await addDoc(collection(db, "orders"), {
  customer:user?user:"",
   product:product,
   quantity:quantity,
   totalPrice:product? parseInt(product.salePrice) * (quantity):"",
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
{...product,initialStock: parseInt(product.initialStock)-quantity})

const response = await axios.post('/api/sendMail',{
email:user? user.email:"",
buisnessName:"RehmanEnterprice",
customerName:user?user.firstName+" "+user.surname:"",
item:product.name,
price:product ?product.salePrice :"", 
quantity:quantity,
totalPrice:product? parseInt(product.salePrice) * (quantity):"",
deliveryDate:deliveryDate.toDateString()

})

 dispatch(setLoading(false))
  toast.success("Order Placed Successfully")
 

    
    
        
  }
    ,
  onClose: () => alert("Wait! You need this oil, don't go!!!!"),
}

const handleFlutterPayment = useFlutterwave(config);



//  const componentProps = {
//   email:user.email,
//   amount:(parseFloat(product.salePrice).toFixed(2)) * (quantity),
//   metadata: {
//     name:user.firstName,
//     phone:user.mobileNumber,
//   },
//   publicKey:"pk_test_529c008634299b5fdf147ab6be3283ceea233bc0",
//   text: "Pay Now",
//   onSuccess: () =>
//     alert("Thanks for doing business with us! Come back soon!!"),
//   onClose: () => alert("Wait! You need this oil, don't go!!!!"),
// }


 const handleChange=(e:any)=>{
  setQuantity(e.target.value)
 }

 const addToWishList=async()=>{
  try {


    dispatch(setLoading(true))
   
   
    await updateDoc(doc(db, "users", userID), 
        {...user,wishList:{...user.wishList,[product.id]:{product,quantity}}})
      dispatch(setUser({...user,wishList:{...user.wishList,[product.id]:{product,quantity}}}))
        dispatch(setLoading(false))
        
    toast.success("Product Added to WishList")
    
  } catch (error) {
    dispatch(setLoading(false))
    toast.error(error.message)
  }

 }
 const addToCart=async()=>{
  try {


    dispatch(setLoading(true))
   if(quantity< product.initialStock){


    await updateDoc(doc(db, "users", userID), 

    {...user,cart:{...user.cart,[product.id]:{product,quantity}}})





  dispatch(setUser({...user,cart:{...user.cart,[product.id]:{product,quantity}}}))
    dispatch(setLoading(false))

    
    toast.success("Product Added to Cart")

   }else{
    dispatch(setLoading(false))

      toast.error("not enough stock")
   }
   
    
  } catch (error) {
    dispatch(setLoading(false))

    toast.error(error.message)
  }
    
  }
  

 
 const buyNow=async()=>{

  
const deliveryDate=new Date()


deliveryDate.setDate(deliveryDate.getDate() + parseInt( vendorSettings.numberOfDeliveryDate))


try {
 
    if(parseInt(product.initialStock) >= quantity){
      if(vendorSettings.paymentMethod=="flutterWave"){


        
       
        handleFlutterPayment({
          callback: async(response) => {
             if(response.transaction_id){
              
    dispatch(setLoading(true))
    await addDoc(collection(db, "orders"), {
      customer:user?user:"",
       product:product,
       quantity:quantity,
       totalPrice: product?parseInt(product.salePrice) * (quantity):"",
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
    email:user?user.email:"",
    buisnessName:"RehmanEnterprice",
    customerName:user.firstName+" "+user.surname,
    item:product.name,
    price:product?product.salePrice:"",
    quantity:quantity,
    totalPrice:product? parseInt(product.salePrice) * (quantity):"",
    deliveryDate:deliveryDate.toDateString()
  
  })
  
     dispatch(setLoading(false))
      toast.success("Order Placed Successfully")
     
  
        
             }
              closePaymentModal() // this will close the modal programmatically
          },
          onClose: () => {},
      
        })
  
      }
      // else{
      //   const paystack=new PaystackPop()
      //   paystack.newTransaction({
      //     key:vendorSettings.public_key,
      //     email:user.email,
      //     amount: parseInt(product.salePrice) * (quantity) *100,
      //     firstname:user.firstName,
      //     onSuccess:async()=>{
      //   dispatch(setLoading(true))
      //   await addDoc(collection(db, "orders"), {
      //     customer:userID,
      //      product:product,
      //      quantity:quantity,
      //      totalPrice: parseInt(product.salePrice) * (quantity),
      //      deliveryDate:deliveryDate,
      //      createdAt:serverTimestamp(),
      //      status:"open",
      //      employee:{},  
      //      deliveryPartner:{},
      //      deliveryPrice:"0",
      //      DPEmployee:{},
      //      paid:false,
      
      
      //  })
      //    await updateDoc(doc(db, "users", userID), 
      //    {...user,cart:[]})
      //  dispatch(setUser({...user,cart:[]}))
      
      
      //  await updateDoc(doc(db,"products",product.id),
      //  {...product,initialStock:parseInt(product.initialStock)-quantity})
      
      //  const response = await axios.post('/api/sendMail',{
      //   email:'rehmanabdul22655@gmail.com',
      //   buisnessName:"RehmanEnterprice",
      //   customerName:user.firstName+" "+user.surname,
      //   item:product.name,
      //   price:product.salePrice,
      //   quantity:quantity,
      //   totalPrice: parseInt(product.salePrice) * (quantity),
      //   deliveryDate:deliveryDate.toDateString()
      
      // })
      
      //    dispatch(setLoading(false))
      //     toast.success("Order Placed Successfully")
         
      
            
      //     },
      //     onCencel:()=>{
      //       toast.error("payment cencel")
      //     }
      
      //   })
      // }
  


  

      
    
      

    }else{
      dispatch(setLoading(false))
      toast.error("Not Enough Stock")
    }
    
const res=await fetch('/api/sendMail')
const s=await res.json()
console.log(s);

  

 
} catch (error) {
  dispatch(setLoading(false))
  toast.error(error.message)
  
}



}
  

const checkStock=()=>{
  if(parseInt(product.initialStock )>= parseInt(quantity)){
    return true
  }else{
    toast.error("low stock")
    return false
  }
}

const handleCustomFieldsClick=async(key:any,value:any)=>{
  setProductVariation({...productVariation,[key]:value})
  console.log(productVariation);
  

}

  return (
    <>
    <Toaster/>
{loading && <Loading/>}
    <CustomerNavbar/>
    {product && <div className={style.productDetail}>
      
      
        <div className="container mt-5">

          <div className="row">
            <div className="col-md-6">


              
    <Carousel>
        {product.images.map((image:any,index:any)=>{
            
              return  <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image}
                  style={{width:'100%',maxHeight:'100%',objectFit:'contain',border:'1px solid #ccc',borderRadius:'5px'}}
                  alt="First slide"
                />
              
              </Carousel.Item>

        })}   
</Carousel>
            </div>

        <div className="col-md-6 px-5 mt-4">

        <div className="d-flex justify-content-between">
        <h3 style={{fontWeight:'600',fontSize:'1.5rem'}}>{product.name}</h3>
        <h3 style={{fontWeight:'600',fontSize:'1.5rem'}}>{vendorSettings && vendorSettings.currency}{product?product.salePrice:""}</h3>
          
        </div>
        <div className="mt-4 d-flex justify-content-between">
          <h3 style={{fontWeight:'600',fontSize:'1.5rem'}}>Stock :</h3>
          <p>{product.initialStock}</p>
        </div>
        <div className="mt-4 d-flex flex-column">
         {product.customerFields && Object.entries(product.customerFields).map(([key,value])=>{

            return <>
            
            <div key={key} className="d-flex gap-2">
              <h3 style={{fontWeight:'600',fontSize:'1.5rem',marginTop:"0.3rem"}}>{key} :</h3>
              {value && value.map((i:any)=>{
                return <span className={`btn  mt-0  m-2 ${style.mBtn}`} onClick={()=>handleCustomFieldsClick(key,i)} style={{background:"#d3d3d3" ,padding:"0.2rem 0.5rem",borderRadius:"5px",textAlign:"center"}}>{i}</span>
              })}
              
              </div>
              </>
         })}
        </div>
        <div className="mt-4 d-flex flex-column">
         {productVariation && Object.entries(productVariation).map(([key,value])=>{

            return <>
            
            <div key={key} className="d-flex gap-2">
              <h3 style={{fontWeight:'600',fontSize:'1.5rem',marginTop:"0.3rem"}}>Selected {key} :</h3>
              
                 <span className={`btn  mt-0  m-2 ${style.mBtn}`}  style={{background:"#d3d3d3" ,padding:"0.2rem 0.5rem",borderRadius:"5px",textAlign:"center"}}>{value}</span>
              
              
              </div>
              </>
         })}
        </div>
        <div className="mt-4">
          <h3>Description: </h3>
          <p>{product.description}</p>

          </div>
          <span style={{fontWeight:600}}>Enter Quantity*</span>
    <input type="number" min={1}  name="quantity"  onChange={handleChange}  className="form-control mt-2"  />

          <div className="mt-4 d-flex justify-content-between flex-column flex-lg-row gap-2">
          <button className='btn' onClick={addToCart}>Add to Cart</button>
          <button className='btn' onClick={addToWishList}>Add to Wishlist </button>



      {vendorSettings.paymentMethod=="paystack"?
      checkStock() == true ?  <PaystackButton {...componentProps}/>: ""
    
    :
    <button className={`btn `}  onClick={buyNow}>Buy Now</button>

    }
          
          


          </div>
        </div>

          </div>

          

  
        </div>
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
     
     
     
      </div>
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      }
    
    
    
    
    
    
    
    </>
  )
}

export default CustomerDetailProduct