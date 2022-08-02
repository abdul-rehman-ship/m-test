import React from 'react'
import style from '../styles/forgotPassword.module.css'
import { toast,Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import Loading from '../components/Loading'
import { forgotPasswordAsyncThunk } from '../redux/slices/authSlice'


export default function ForgotPassword() {
  const state = useSelector((state: RootState) =>state.auth)
  const dispatch = useDispatch<AppDispatch>();


  const handleSubmit=async(e:any)=>{
    e.preventDefault()
    const email=e.target.email.value
    if(!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
      toast.error('Please enter a valid email')
    }else{
      dispatch(forgotPasswordAsyncThunk(email))
    }


  }
  return (
    <>
            <div className={style.main_container}>
              <Toaster/>
              {state.loading ?  <Loading />: ''}
            <div className="container w-100 h-100 d-flex position-relative justify-content-center pt-5">
                <div className={`text-center ${style.main_div} mt-5`}>
                {/* <img src="./images/header_logo.png" className="img-fluid " alt=""/> */}
                    <br/>
                    <figure className="rounded mt-5">
                        <img src="forgot_password_2.png" className="img-fluid" alt=""/>
                    </figure>
                    <form  onSubmit={handleSubmit}>
                    <h3 className="mt-3">Forgot your password?</h3>
                    <p className="text-center mt-2">Enter your email address and we will send you a link to reset your password.</p>
                    <div className={` ${style.input_container} mt-5 position-relative`}>
                        <input type="email" className="form-control" name="email" required placeholder="Email Address"/>
                        <img src="email_icon.png" className={`img-fluid ${style.icon}`}  alt=""/>
                      </div>

                     <button type="submit"  className=" btn text-white mt-4 w-100 mb-md-4 signin_btn">Submit Email</button>
                </form>
              

                </div>
            </div>

        </div>
    
    </>
  )
}
