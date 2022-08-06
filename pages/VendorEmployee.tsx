import React, { useEffect ,useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import VendorNavbar from '../components/VendorEmployeeNavbar'
import Link from 'next/link'
import style from '../styles/vendor.module.css'
import { setLoading,setVendorSettings } from '../redux/slices/authSlice'
import Loading from '../components/Loading'
import { db } from '../Firebase'
import { collection ,getDocs} from 'firebase/firestore'
import VendorProductItem from '../components/VEProductItem'



export default function VendorDashboard() {
    const state=useSelector((state:any)=>state.auth)
    const dispatch=useDispatch()
    const router=useRouter()
    const [products,setProducts]=useState([])
    const [allProducts,setAllProducts]=useState([])
    const vendorSettings=useSelector((state:any)=>state.auth.vendorSettings)
    
    const [searchString,setSearchString]=useState("")

    useEffect(() => {
      if(!state.user.email){
        router.push("/")
      }

     
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
    {state.loading && <Loading/>}
    <VendorNavbar/>



{ state.user && state.user.allowedRoles.products==true?
    <div className="container mt-4 pt-4">

    
    <div className="row mt-4 mb-3  d-flex justify-content-end" >
           
           <Link href={"VEAddNewProduct"}><button className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`}>

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
    </div>:

    <div className="container mt-5">
      <h3 style={{fontFamily:"Poppins"}}>you are not allowed to see products </h3>
    </div> 
}

    






    </>
  )
}
