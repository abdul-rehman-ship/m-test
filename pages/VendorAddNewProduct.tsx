import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import VendorNavbar from "../components/VendorNavbar";
import { db } from "../Firebase";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

import { storage } from "../Firebase";
import {
  arrayUnion,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import { toast, Toaster } from "react-hot-toast";
import Loading from "../components/Loading";
import style from "../styles/profile.module.css";
import Link from "next/link";
import { setLoading } from "../redux/slices/authSlice";


function VendorAddNewProduct() {
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
  const [attributes,setAttributes]:any=useState([])
  const [attirbuteField,setAttirbuteField]:any=useState(false)
  const [attributesItem,setAttributesItem]:any=useState({})
  const [showAttributesItem,setShowAttributesItem]:any=useState(false)

  useEffect(() => {
    if(!state.vendor){
        router.push("/")
    }else{
    }
  }, []);
  const uploadFiles = async (folder: string, files: File[]) => {
    const promises: any[] = [];

    files.forEach((file) => {
      const storageRef = ref(storage, `${folder}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      promises.push(uploadTask);
    });

    const result = await Promise.all(promises);
    const urlPromises = result.map(async (item) => {
      const path = item.ref.toString();
      return await downloadFile(path);
    });

    return await Promise.all(urlPromises);
  };
  const downloadFile = async (path: string) => {
    let item: string = "";
    await getDownloadURL(ref(storage, path))
      .then((url) => (item = url))
      .catch((err) => {
        return toast.error(err.message);
      });

    return item;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    
    try {
      dispatch(setLoading(true));

      const urls = await uploadFiles("images", images);

      const uploadProduct = await addDoc(collection(db, "products"), {
        name: productItem.name,
        price: productItem.price,
        description: productItem.description,
        category: productItem.category,
        initialStock: productItem.initialStock,
        salePrice: productItem.salePrice,
        images: [...urls],
        createdAt: serverTimestamp(),
        customerFields:attributesItem? attributesItem :{}
      });
      dispatch(setLoading(false));
      toast.success("product uploaded successfully");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error.message);
    }
  };

  const handleChange = async (e: any) => {
    setProductItem({ ...productItem, [e.target.name]: e.target.value });
  };
  const checkImages = (files: FileList) => {
    let newFiles: File[] = [];

    Array.from(files).map((file) => {
      if (!file) return toast.error("File does not exist.");

      const types = ["image/png", "image/jpeg", "image/gif"];
      if (!types.includes(file.type)) {
        return toast.error("The image type is png / jpeg / gif.");
      }

      newFiles.push(file);
    });

    setImage(newFiles);
  };
  const handleImageChange = async (e: any) => {
    setImage([]);

    const target = e.target as HTMLInputElement;
    const files = target.files;
    checkImages(files);
  };
  const showAttributeField=async()=>{
    setAttirbuteField(!attirbuteField)
  }
  const handleAddAttributes=async(e:any)=>{
    e.preventDefault()
    const value=e.target.attribute.value.toLowerCase()
    if(!attributes.includes(value)){
      setAttributes([...attributes,value])
      setAttributesItem({...attributesItem,[value]:[]})
    }
    
    
    
    
    
    

  }
  const AddNewAttributeItem=async()=>{
    
    
    setShowAttributesItem(!showAttributesItem)
    
    



   
  }
  const handleAddNewAttributeItem=async(e:any,item:any)=>{
    e.preventDefault()
    const value=e.target.item.value.toLowerCase()

    setAttributesItem({...attributesItem,[item]:[...attributesItem[item],value]})
    setShowAttributesItem(!showAttributesItem)
    
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
              <span>Initial Stock*</span>
              <input
                type="number"
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
                type="number"
                className="form-control mt-2"
                value={productItem.salePrice}
                name="salePrice"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mt-4">
              <span>Product Images *</span>
              <input
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                className="form-control mt-2"
                name="image"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>

 
          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <button type="submit" className="btn">
                Upload product
              </button>
            </div>
            <div className="col-md-6"></div>
          </div>
        </form>


<div className="row mt-4">
        {attributes.length>0 && 
          attributes.map((item:any)=>{
            return <>
              <div className="col-md-6 mt-4">
                
                <h3 className="m-3" style={{fontFamily:"Poppins",color:"#1C7468"}}>{item}</h3>
                
              {
                attributesItem[item].length>0 && attributesItem[item].map((i:any,index:any)=>{
                  return <span className="m-3"key={index} style={{background:"#d3d3d3",padding:"0.3rem 1rem",borderRadius:"5px"}}>{i}</span>
                })
              }
              <br />
                <span className="btn btn-light mt-2" onClick={()=>AddNewAttributeItem()}>Add New {item}</span>
                {showAttributesItem &&
                
                <form onSubmit={(e)=>handleAddNewAttributeItem(e,item)} >
                    <span>New {item}</span>
                    <input type="text" name="item" className="form-control mt-2"/>
                </form>
          }
                </div>
            
            
            
            </>
          })
        
        
        }


</div>
        <div className="row">
  <div className="col-md-6">
  <button type="button" onClick={showAttributeField} className="btn mt-2 mx-3">
                Add Custom Fields
              </button>
  </div>

  
</div>
       <div className="row mt-4 mb-5">

        {attirbuteField && 
        <div className="col-md-6">
          <form onSubmit={handleAddAttributes}>
        <span>Custom Field Name</span>
        <input type="text" name="attribute" className="form-control mt-2" />
        </form>
        </div>
}
        
       </div>

      </div>
    </>
  );
}

export default VendorAddNewProduct;
