import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import VendorNavbar from "../components/VendorNavbar";
import { db } from "../Firebase";
import { collection, getDocs,doc,updateDoc } from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import style from "../styles/vendor.module.css";
import Link from "next/link";
import { setLoading } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

export default function VendorEmployeeRoles() {
  const state = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [emp, setEmp] = useState({});
  const [userID,setUserID]=useState("")
  const [roles, setRoles] = useState({
    orders: false,
    quality: false,
    delivery: false,
    return: false,
    partners: false,
    products: false,
    customers: false,
    marketing: false,
  });

  const router = useRouter();

  const getData = async () => {
    dispatch(setLoading(true));
    let arr: any = [];
    const data = await getDocs(collection(db, "users"));
    data.forEach((doc: any) => {
      if (doc.data().email === state.customerEmail) {
        setUserID(doc.id)
        
        setEmp(doc.data());
    

        setRoles(doc.data().allowedRoles);
      }
    });
    dispatch(setLoading(false));
  };
  useEffect(() => {
    if (!state.vendor) {
      router.push("/");
    } else {
      getData();
    }
  }, []);

  const handleChange=async(e:any)=>{
    setRoles({...roles,[e.target.name]:e.target.checked})
  }
  const updateRoles=async()=>{
dispatch(setLoading(true))

try {
    await updateDoc(doc(db, "users", userID), 
    {
        allowedRoles: roles
    }

    )
    toast.success("Roles Updated")

} catch (error) {
    toast.error(error.message)
    
}
dispatch(setLoading(false))
    
    

  }
  return (
    <>
      <VendorNavbar />
    {state.loading && <Loading/>}
      <div className="container pt-5 mt-4">
        <Link href="VendorEmployeeDashboard">
            <button className={`btn ${style.login_btn}`} style={{fontSize:'medium'}}>
            &#8592; Back </button></Link>
        <div className="row mt-4 ">
          <div className="col-md-6 col-lg-4 ">
            <div
              className={`${style.role_card} card mb-4 p-3 text-center   shadow-sm`}
            >
              <div className="form-check d-flex align-items-center justify-content-center gap-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="orders"
                  onChange={handleChange}
                  checked={roles.orders}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  <p>Orders</p>
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 ">
            <div
              className={`${style.role_card} card mb-4 p-3 text-center   shadow-sm`}
            >
              <div className="form-check d-flex align-items-center justify-content-center gap-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="quality"
                  onChange={handleChange}
                  checked={roles.quality}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  <p>Quality check</p>
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 ">
            <div
              className={`${style.role_card} card mb-4 p-3 text-center   shadow-sm`}
            >
              <div className="form-check d-flex align-items-center justify-content-center gap-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="delivery"
                  onChange={handleChange}
                  checked={roles.delivery}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  <p>Delivery</p>
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 ">
            <div
              className={`${style.role_card} card mb-4 p-3 text-center   shadow-sm`}
            >
              <div className="form-check d-flex align-items-center justify-content-center gap-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="return"
                  onChange={handleChange}
                  checked={roles.return}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  <p>Return</p>
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 ">
            <div
              className={`${style.role_card} card mb-4 p-3 text-center   shadow-sm`}
            >
              <div className="form-check d-flex align-items-center justify-content-center gap-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="partners"
                  onChange={handleChange}
                  checked={roles.partners}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  <p>Delivery Partners</p>
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 ">
            <div
              className={`${style.role_card} card mb-4 p-3 text-center   shadow-sm`}
            >
              <div className="form-check d-flex align-items-center justify-content-center gap-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="products"
                  onChange={handleChange}
                  checked={roles.products}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  <p>Products</p>
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 ">
            <div
              className={`${style.role_card} card mb-4 p-3 text-center   shadow-sm`}
            >
              <div className="form-check d-flex align-items-center justify-content-center gap-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="customers"
                  onChange={handleChange}
                  checked={roles.customers}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  <p>Customers</p>
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 ">
            <div
              className={`${style.role_card} card mb-4 p-3 text-center   shadow-sm`}
            >
              <div className="form-check d-flex align-items-center justify-content-center gap-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="marketing"
                  onChange={handleChange}
                  checked={roles.marketing}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  <p>Marketing</p>
                </label>
              </div>
            </div>
          </div>
        </div>

        <button className={`btn ${style.login_btn}`} onClick={updateRoles}>  update Roles  </button>
      </div>
    </>
  );
}
