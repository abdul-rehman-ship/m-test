import React, { useEffect, useState } from "react";
import { validateRegister } from "../components/valid";
import style from "../styles/signup.module.css";
import { toast, Toaster } from "react-hot-toast";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { addUser, authRegister } from "../redux/slices/authSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import VendorNavbar from "../components/VendorEmployeeNavbar";

export default function Signup() {
  const state = useSelector((state: RootState) =>state.auth)
    const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const user = {
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.password_c.value,
      firstName: e.target.firstName.value,
      surname: e.target.surname.value,
      buisnessAddress: e.target.buisnessAddress.value,
      state: e.target.state.value,
      mobileNumber: e.target.mobileNumber.value,
      WNumber: e.target.WNumber.value,
      accountType: "customer",
      notes:e.target.notes.value
    };
    const res = validateRegister(user);
    if (res.length > 0) {
      let error = "";
      res.forEach((err: any) => {
        error += err + "\n";
      });
      toast.error(error);
    } else {
      dispatch(authRegister(user));
      
      
      
      
      
    }
  };

useEffect(()=>{
    if(!state.user.email){
        router.push("/")
    }
},[])
  return (
    <>

    <VendorNavbar/>
      <div className={style.main_container}>
        <div className="container ">
          <Toaster />
          {state.loading ?  <Loading />: ''}
          <br />

          {/* <div
            className={` ${style.btnGroup} btn-group bg-white mt-1 px-sm-1" role="group" aria-label="Basic example`}
          >
            
              <button type="button" className={`btn  px-4 `}>
                <Link href='/'  className="text-danger"> Log In </Link>
              </button>
            
            <button
              type="button"
              className={`btn  text-white ${style.login_btn} `}
            >
              Sign Up
            </button>
          </div> */}
          <h2 className="mt-4">Create an customer account</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-5 mt-2">
                <h4 className="">User Access</h4>
                <input
                  type="email"
                  className="form-control mt-4"
                  name="email"
                  placeholder="Your Email*"
                  required
                />
                <input
                  type="text"
                  className="form-control mt-4"
                  name="firstName"
                  placeholder="First Name*"
                  required
                />
                <input
                  type="text"
                  className="form-control mt-4"
                  name="surname"
                  placeholder=" Surname*"
                  required
                />
                <div className="input_container mt-4 position-relative">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Create Password*"
                    required
                  />
                  <img
                    src="password_icon.png"
                    className={`img-fluid ${style.icon}`}
                    alt=""
                  />
                </div>{" "}
                <div className="input_container mt-4 position-relative">
                  <input
                    type="password"
                    className="form-control"
                    name="password_c"
                    placeholder="Confirm Password”"
                    required
                  />
                  <img
                    src="password_icon.png"
                    className={`img-fluid ${style.icon}`}
                    alt=""
                  />
                </div>
              </div>
              <div className="col-lg-5 mt-2">
                <h4 className="">Billing Address</h4>
                <input
                  type="text"
                  className="form-control mt-4"
                  id="buisnessAddress"
                  placeholder="Buisness Address*"
                  required
                />

                <input
                  type="text"
                  className="form-control mt-4"
                  name="state"
                  placeholder="State*"
                  required
                />

                <input
                  type="number"
                  className="form-control mt-4"
                  name="mobileNumber"
                  placeholder="Phone Number*"
                  required
                />
                <input
                  type="number"
                  className="form-control mt-4"
                  name="WNumber"
                  placeholder="Whats App Number*"
                  required
                />
                <input
                  type="text"
                  className="form-control mt-4"
                  name="notes"
                  placeholder="Notes(optional)"
                  
                />
               
              </div>
            </div>
            <div className="row">
              <div className="col-lg-5"></div>
              <div className="col-lg-5">
                <button type="submit" className={`${style.signup} btn mt-3`}>
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
