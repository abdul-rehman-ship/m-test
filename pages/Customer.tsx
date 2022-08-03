import React, { useEffect ,useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import CustomerNavbar from '../components/CustomerNavabar'
import Link from 'next/link'
import style from '../styles/vendor.module.css'
import { setLoading,setProducts,setID ,setVendorSettings} from '../redux/slices/authSlice'
import Loading from '../components/Loading'
import { db } from '../Firebase'
import { collection ,getDocs} from 'firebase/firestore'
import CustomerProductItem from '../components/CustomerProductItem'



export default function Customer() {
    const state:any=useSelector((state:any)=>state.auth)
    const dispatch=useDispatch()
    const router=useRouter()
    const [products,setproducts]:any=useState([])
    const [allProducts,setAllProducts]:any=useState([])
    
    const [searchString,setSearchString]:any=useState("")

    useEffect(() => {
      

        // if(!state.vendor){
        //     router.push("/")
            
            
        // }
        getData()


    },[])
    const getData = async () => {

      const data5=await getDocs(collection(db,"users"))
      data5.forEach((snap)=>{
        if(snap.data()){
          dispatch(setID(snap.id))
        }
      }) 
      dispatch(setLoading(true))
      let arr: any = [];
      const data = await getDocs(collection(db, "products"));
      data.forEach((doc: any) => {
        const prod={id:doc.id,...doc.data()}
          arr.push(prod);
        
      });
     setAllProducts(arr)
     setProducts(arr)
      setproducts(arr)
      const data2 = await getDocs(collection(db, "vendor_settings"));
      data2.forEach((snap)=>{
          if(snap.data()){
              
              dispatch(setVendorSettings({...snap.data(),id:snap.id}))
              }
      })
dispatch(setLoading(false))

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
    <CustomerNavbar/>
    <div className="container mt-4 pt-4">

    
    
        <div className='row mb-4'>

<div className="input-group">
  <div className="form-outline">
    <input type="search"  name="search" value={searchString} onChange={onSearchChange} className="form-control"  placeholder='search customers...'/>
    
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
   return <CustomerProductItem probs={product} key={product.id}/>
  })
 
  
  :''
}

</div>
    </div>

    






    </>
  )
}
