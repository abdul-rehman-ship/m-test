import React, { useEffect ,useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import VendorNavbar from '../components/VendorNavbar'
import Link from 'next/link'
import style from '../styles/vendor.module.css'
import { setLoading,setVendorProfile,setVendorSettings } from '../redux/slices/authSlice'
import Loading from '../components/Loading'
import { db } from '../Firebase'
import { collection ,getDocs, doc,updateDoc} from 'firebase/firestore'
import VendorProductItem from '../components/VendorProductItem'
import { toast,Toaster } from 'react-hot-toast'



export default function VendorDashboard() {
    const state=useSelector((state:any)=>state.auth)
    const dispatch=useDispatch()
    const router=useRouter()
    const [products,setProducts]=useState([])
    const [allProducts,setAllProducts]=useState([])
    const vendorSettings=useSelector((state:any)=>state.auth.vendorSettings)
    const vendorProfile=useSelector((state:any)=>state.auth.vendorProfile)
    const [unAssignOrders,setUnAssignOrders]:any=useState(0)
    const [lowStock,setLowStock]:any=useState(0)
    
    const [searchString,setSearchString]=useState("")
    const [pending,setPending]:any=useState(0)
    const [awaitngDelivery,setAwaitingDelivery]:any=useState(0)
    const [pickedUp,setPickedUp]:any=useState(0)
    const [returned,setReturned]:any=useState(0)
const checkSubscription=async()=>{
  try {
            let profile:any=null;
    const data = await getDocs(collection(db, "vendor_profile"));
    data.forEach((snap)=>{
        if(snap.data()){
          
            dispatch(setVendorProfile({...snap.data(),id:snap.id}))
            profile={...snap.data(),id:snap.id}
          }
            })

            
           
            if(profile){
              const date:any=new Date().getTime()
                
                
            const date2:any= new Date(profile.createdAt.seconds * 1000).getTime()

           const time=date-date2
           const res=Math.round(time /(1000*3600*24))
           
              if(profile.testPeriod==true){
              
               if(res>=14){
                await updateDoc(doc(db, "vendor_profile",profile.id), 
                {
                    testPeriod:false
                })
                router.push("/VendorSubscribe")
               }else{
                

               }
                

               }
                

                
              else if(profile.subscribe==true){
                if(profile.subscriptionPeriod=="monthly"){
                  
                  
                  
                  if(res>=30){
                    await updateDoc(doc(db, "vendor_profile",profile.id), 
                    {
                      subscribe:false
                    })

                    toast.error("subscription ended")
                router.push("/VendorSubscribe")

                  }
                  
                  

                }else if(profile.subscriptionPeriod=="yearly"){
                  if(res>=365){
                    await updateDoc(doc(db, "vendor_profile",profile.id), 
                    {
                      subscribe:false
                    })
                    toast.error("subscription ended")
                router.push("/VendorSubscribe")


                  }
                  

                }
              }
              
             else{
              toast.error("subscription ended")
              router.push("/VendorSubscribe")

             }
    
            }else{
              router.push("/VendorProfile")
            }
  
} catch (error) {
    toast.error(error.message)
    
}

}
    useEffect(() => {
      

        if(!state.vendor){
            router.push("/")
            
            
        }
        checkSubscription()
        
        getData()


    },[])
    const getData = async () => {
      dispatch(setLoading(true))
      let settings:any={}
      const data2 = await getDocs(collection(db, "vendor_settings"));
      data2.forEach((snap)=>{
          if(snap.data()){
              
              dispatch(setVendorSettings({...snap.data(),id:snap.id}))
              settings={...snap.data()}
              }
      })
      let arr: any = [];
      const data = await getDocs(collection(db, "products"));
      let low:any=0
      data.forEach((doc: any) => {
        if(doc.data()){
          const prod={id:doc.id,...doc.data()}
          arr.push(prod);
            
            

          if(parseInt(doc.data().initialStock) <  settings.minimumStockLevel){
            
            
            low= parseInt(low) + 1
          }
        }
       
        
      });
      setLowStock(low)
     setAllProducts(arr)
      setProducts(arr)
let un:any=0
let open:any=0
let pend:any=0
let  picked:any=0
let ret:any=0
     
            const data3 = await getDocs(collection(db, "orders"));
            data3.forEach((snap)=>{
                if(snap.data()){
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
            })
            setPending(open)
            setAwaitingDelivery(pend)
            setPickedUp(picked)
            setReturned(ret)
            setUnAssignOrders(un)
      dispatch(setLoading(false))
     
    };
    
     
    


    const onSearchChange=async(e:any)=>{
      setSearchString(e.target.value)
      if(e.target.value===""){
        setProducts(allProducts)
      }
      
    
    }
  const filter=async()=>{
    setProducts([])
    let arr=[]
    allProducts.forEach((product:any)=>{
      
  
      if(product.name.toLowerCase().includes(searchString.toLowerCase())){
        arr.push(product)
        
      }
  
    })
    
    setProducts(arr)
    
  
  }
  return (
    <>
    <Toaster/>
    {state.loading && <Loading/>}
    <VendorNavbar/>

    
    <div className="container mt-4 pt-0">
<div className="row">
<div className="col-md-6 col-lg-4 " >

<Link href={"VendorOrders"}>
<div className={`
${style.card} card mb-4 text-center p-5  shadow-sm
    `}>

<p> {pending? pending :0}: Pending Orders</p>


</div>
</Link>

    
</div>

<div className="col-md-6 col-lg-4 " >

<Link href={"VendorOrders"}>
<div className={`
${style.card} card mb-4 text-center p-5  shadow-sm
    `}>

<p> {awaitngDelivery? awaitngDelivery :0}: Awaiting Delivery</p>


</div>
</Link>

    
</div>
<div className="col-md-6 col-lg-4 " >

<Link href={"VendorOrders"}>
<div className={`
${style.card} card mb-4 text-center p-5  shadow-sm
    `}>

<p> {pickedUp? pickedUp :0}: Picked Up  Orders</p>


</div>
</Link>

    
</div>
<div className="col-md-6 col-lg-4 " >

<Link href={"VendorOrders"}>
<div className={`
${style.card} card mb-4 text-center p-5  shadow-sm
    `}>

<p> {returned? returned :0}: Returned Orders</p>


</div>
</Link>

    
</div>


<div className="col-md-6 col-lg-4 " >

<Link href={"VendorUnAssignOrders"}>
<div className={`
${style.card} card mb-4 text-center p-5  shadow-sm
    `}>

<p> {unAssignOrders}: UnAssigned order</p>


</div>
</Link>

    
</div>
<div className="col-md-6 col-lg-4 " >

<Link href={"VendorLowStackProducts"}>
<div className={`
${style.card} card mb-4 text-center p-5  shadow-sm
    `}>

<p>{ lowStock}: Low Stock </p>


</div>
</Link>

    
</div>
</div>
 
    <div className="row mt-4 mb-3  d-flex justify-content-end" >
           
           <Link href={"VendorAddNewProduct"}><button className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>

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

<div className="row">
{
  products.length>0?

  products.map((product:any)=>{
   return <VendorProductItem probs={product} key={product.id}/>
  })
 
  
  :''
}

</div>
    </div>

    






    </>
  )
}
