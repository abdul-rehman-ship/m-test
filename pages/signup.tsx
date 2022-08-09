import React, { useState } from "react";
import { validateRegister } from "../components/valid";
import style from "../styles/signup.module.css";
import { toast, Toaster } from "react-hot-toast";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { addUser, authRegister } from "../redux/slices/authSlice";
import Link from "next/link";

export default function Signup() {
  const state = useSelector((state: RootState) =>state.auth)
    
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword]:any = useState(false);
  const [showPassword2, setShowPassword2]:any = useState(false);

  const handlePassword2 = () => {
    setShowPassword2(!showPassword2);
    
    
  }
  const handlePassword = () => {
    setShowPassword(!showPassword);
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const user:any = {
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.password_c.value,
      firstName: e.target.firstName.value,
      surname: e.target.surname.value,
      buisnessAddress: e.target.buisnessAddress.value,
      state: e.target.state.value,
      mobileNumber: e.target.mobileNumber.value,
      WNumber: e.target.WNumber.value,
      accountType: e.target.accountType.value,
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

  return (
    <>
      <div className={style.main_container}>
        <div className="container ">
          <Toaster />
          {state.loading ?  <Loading />: ''}
          <br />

          <div
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
          </div>
          <h2 className="mt-4">Create an account</h2>
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
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    placeholder="Create Password*"
                    required
                  />
                  
                  <img
                    src="password_icon.png"
                    className={`img-fluid ${style.icon}`}
                    alt=""
                    onClick={handlePassword}
                  />
                </div>{" "}
                <div className="input_container mt-4 position-relative">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    className="form-control"
                    name="password_c"
                    placeholder="Confirm Password”"
                    required
                  />
                  <img
                    src="password_icon.png"
                    className={`img-fluid ${style.icon}`}
                    alt=""
                    onClick={handlePassword2}
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
                <select
                  className="form-select form-select-lg mt-4"
                  name="accountType"
                  aria-label=".form-select-lg example"
                  required
                >
                  <option value="Choose Account Type">
                    Choose Account Type
                  </option>
                  <option value="customer">Customer</option>
                  <option value="deliveryPartner">Delivery Partner</option>
                  <option value="vendorEmployee">Vendor Employee</option>
                </select>
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
