import React, { useEffect, useState } from "react";
import { validateDPEmployee } from "../components/valid";
import style from "../styles/signup.module.css";
import { toast, Toaster } from "react-hot-toast";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { addUser, authRegister } from "../redux/slices/authSlice";
import Link from "next/link";
import { useRouter } from "next/router";

import VendorNavbar from "../components/DeliveryPartnerNavbar";

export default function signup() {
  const state = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const user = {
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.password_c.value,
      firstName: e.target.firstName.value,
      surname: e.target.surname.value,
      accountType: "DPEmployee"
      
    };
    const res = validateDPEmployee(user);
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

  useEffect(() => {
   
  }, []);
  return (
    <>
    
      <VendorNavbar />
      <div className={style.main_container}>


        <div className="container ">
          <Toaster />
          {state.loading ? <Loading /> : ""}
          <br />
            <div className="row">
                <div className="col-lg-3"></div>
                <div className="col-lg-5">
                <h2 className="mt-4">Create an employee account</h2>

                </div>
            </div>
          <form onSubmit={handleSubmit}>
            <div className="row mt-3">
                <div className="col-lg-3"></div>
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
            
            </div>
            <div className="row">
                <div className="col-lg-3"></div>
              <div className="col-lg-5 mt-4">
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
