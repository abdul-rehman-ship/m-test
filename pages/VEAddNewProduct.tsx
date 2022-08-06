import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import VendorNavbar from "../components/VendorEmployeeNavbar";
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
  useEffect(() => {
  if(!state.user.email){
    router.push("/")
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
  return (
    <>
      <VendorNavbar />

      <Toaster />
      {state.loading && <Loading />}
      <div className={` ${style.formContainer} container mt-5 `}>
        <Link href="VendorEmployee">
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
      </div>
    </>
  );
}

export default VendorAddNewProduct;
