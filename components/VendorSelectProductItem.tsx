import React, { FunctionComponent, useEffect } from 'react'
import style from '../styles/vendor.module.css'
import Carousel from 'react-bootstrap/Carousel';
import {useDispatch,useSelector} from 'react-redux'
import { AppDispatch } from '../redux/store';
import {setProduct} from '../redux/slices/authSlice'
import {useRouter} from 'next/router'


function VendorProductItem(props:any) {
    const product=props.probs
    const dispatch=useDispatch<AppDispatch>()
    const router=useRouter()
    const vendorSettings=useSelector((state:any)=>state.auth.vendorSettings)


  
    const handleClick=async()=>{ 
        
        dispatch(setProduct(product))
        router.push("VendorUpdateProduct")
    }

  return (
    <>


    { vendorSettings && parseInt(vendorSettings.minimumStockLevel) <= parseInt(product.initialStock) ?
    <div className="col-md-4 mt-4 w-100">
    <div className={`${style.productItem} card text-center p-3 shadow-sm`} >
    <p className={style.product_title}>{product.name}</p>
    {product.salePrice < product.price ? <p className={style.price}>
        <del>{vendorSettings && vendorSettings.currency}{product.price}</del>
        <span>{vendorSettings && vendorSettings.currency}{product.salePrice}</span>
    </p> : <p className={style.price}>{ vendorSettings && vendorSettings.currency}{product.price}</p>}

    <Carousel>
        {product.images.map((image:any,index:any)=>{
            
              return  <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image}
                  style={{width:'100%',maxHeight:'13rem',objectFit:'contain'}}
                  alt="First slide"
                />
              
              </Carousel.Item>

        })}   
</Carousel>
{product.description.length<60?<p className={style.description}> {product.description}</p>:<p className={style.description}>{product.description.substring(0,60)}...</p>}
   <div className='d-flex justify-content-between align-item-center'>
   <p style={{fontWeight:'600'}}>In stock : {product.initialStock}</p>
   
   {/* <button className={`btn ${style.edit_btn}`} onClick={handleClick}>Edit</button> */}
   </div>
    </div>
</div>:


<div className="col-md-4 mt-4 w-100">
        <div className={`${style.productItem2} card text-center p-3 shadow-sm`} >
        <p className={style.product_title}>{product.name}</p>
        {product.salePrice < product.price ? <p className={style.price}>
            <del>{ vendorSettings && vendorSettings.currency}{product.price}</del>
            <span>{vendorSettings && vendorSettings.currency}{product.salePrice}</span>
        </p> : <p className={style.price}>{vendorSettings && vendorSettings.currency}{product.price}</p>}

        <Carousel>
            {product.images.map((image:any,index:any)=>{
                
                  return  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={image}
                      style={{width:'100%',maxHeight:'13rem',objectFit:'contain'}}
                      alt="First slide"
                    />
                  
                  </Carousel.Item>

            })}   
    </Carousel>
    {product.description.length<60?<p className={style.description}> {product.description}</p>:<p className={style.description}>{product.description.substring(0,60)}...</p>}
       <div className='d-flex justify-content-between align-item-center'>
       <p style={{fontWeight:'600'}}>In stock : {product.initialStock}</p>
       
       {/* <button className={`btn btn-danger `} onClick={handleClick}>Edit</button> */}
       </div>
        </div>
    </div>
    }
    
    </>
  )
}

export default VendorProductItem