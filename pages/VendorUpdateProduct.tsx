import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import VendorNavbar from "../components/VendorNavbar";
import { db } from "../Firebase";

import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import { toast, Toaster } from "react-hot-toast";
import Loading from "../components/Loading";
import style from "../styles/profile.module.css";
import Link from "next/link";
import { setLoading } from "../redux/slices/authSlice";


function VendorUpdateProduct() {
  const initailState = {
    name: "",
    price: "",
    description: "",
    category: "",
    initialStock: "",
    salePrice: "",
  };
  const [productItem, setProductItem] = useState(initailState);
  const [images, setImage] = useState([]);
  const state = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    if(!state.vendor){
        router.push("/")
    }else{
    }
    setProductItem(state.product)
    
    
  }, []);
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));

      

      await updateDoc(doc(db, "products",state.product.id), productItem);
      dispatch(setLoading(false));
      toast.success("product updated successfully");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error.message);
    }
  };

  const handleChange = async (e: any) => {
    setProductItem({ ...productItem, [e.target.name]: e.target.value });
  };
  
  const deleteProduct=async()=>{
    try {
      dispatch(setLoading(true));
      await deleteDoc(doc(db, "products",state.product.id));
      dispatch(setLoading(false));
      toast.success("product deleted successfully");
      router.push("/vendorDashboard");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error.message);
    }
  }
  

  return (
    <>
      <VendorNavbar />

      <Toaster />
      {state.loading && <Loading />}
      <div className={` ${style.formContainer} container mt-5 `}>
        <Link href="vendorDashboard">
          <button
            className={`btn ${style.back_btn} btn-light `}
            style={{ fontSize: "large" }}
          >
            &#8592; Back{" "}
          </button>
        </Link>
        <form onSubmit={handleSubmit}>
          <div className={`row mt-4 px-3`}>
            <div className="col-md-6">
              <span>Product name*</span>
              <input
                type="text"
                value={productItem.name}
                name="name"
                onChange={handleChange}
                className="form-control mt-2"
                required
              />
            </div>
            <div className="col-md-6">
              <span>Product Price*</span>
              <input
              min={1}
                type="number"
                value={productItem.price}
                name="price"
                onChange={handleChange}
                className="form-control mt-2"
                required
              />
            </div>
          </div>

          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <span>Product Category*</span>
              <input
                type="text"
                className="form-control mt-2"
                value={productItem.category}
                name="category"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <span>Product Description *</span>
              <input
                type="text"
                className="form-control mt-2"
                value={productItem.description}
                name="description"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <span> Stock*</span>
              <input
                type="number"
                min={1}
                className="form-control mt-2"
                value={productItem.initialStock}
                name="initialStock"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <span>Sale Price (if not sale enter original price)*</span>
              <input
              min={1}
                type="number"
                className="form-control mt-2"
                value={productItem.salePrice}
                name="salePrice"
                onChange={handleChange}
                required
              />
            </div>
            {/* <div className="col-md-6 mt-4">
              <span>Product Images *</span>
              <input
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                className="form-control mt-2"
                name="image"
                onChange={handleImageChange}
                disabled
              />
            </div> */}
          </div>

          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <button type="submit" className="btn">
                Update product
              </button>
            </div>
            <div className="col-md-6 text-end">
              <span className="btn btn-danger" onClick={deleteProduct}>Delete</span>
            </div>
          </div>
        
        </form>
      </div>
    </>
  );
}

export default VendorUpdateProduct;
