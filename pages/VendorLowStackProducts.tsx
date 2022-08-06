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
import VendorProductItem from '../components/VendorLowStockProductItem'
import { toast,Toaster } from 'react-hot-toast'



export default function VendorDashboard() {
    const state=useSelector((state:any)=>state.auth)
    const dispatch=useDispatch()
    const router=useRouter()
    const [products,setProducts]=useState([])
    const [allProducts,setAllProducts]=useState([])
    const vendorSettings=useSelector((state:any)=>state.auth.vendorSettings)
    const vendorProfile=useSelector((state:any)=>state.auth.vendorProfile)

    
    const [searchString,setSearchString]=useState("")
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
              const date=(new Date().getTime())
                
                
            const date2= (new Date(profile.createdAt.seconds * 1000).getTime())

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
      let arr: any = [];
      const data = await getDocs(collection(db, "products"));
      data.forEach((doc: any) => {
        const prod={id:doc.id,...doc.data()}
          arr.push(prod);
        
      });
     setAllProducts(arr)
      setProducts(arr)

      const data2 = await getDocs(collection(db, "vendor_settings"));
            data2.forEach((snap)=>{
                if(snap.data()){
                    
                    dispatch(setVendorSettings({...snap.data(),id:snap.id}))
                    }
            })
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
