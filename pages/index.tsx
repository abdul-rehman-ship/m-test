import type { NextPage } from "next";
import Head from "next/head";
import loginStyle from "../styles/login.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import Loading from "../components/Loading";
import { authLogin, setID, setLoading } from "../redux/slices/authSlice";
import { useRouter } from "next/router";
import { auth } from "../Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { addUser, setUser } from "../redux/slices/authSlice";
import { getDocs, collection, doc } from "firebase/firestore";
import { db } from "../Firebase";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
} from "firebase/auth";
const Home: NextPage = () => {
  const state = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = async () => {
      dispatch(setLoading(true));
      signOut(auth);
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          let route: any;

          dispatch(addUser(user));
          try {
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
              if (doc.data().email === user.email) {
                if (doc.data().accountType === "customer") {
                  dispatch(setUser(doc.data()));

                  route = "/Customer";
                } else if (doc.data().accountType === "deliveryPartner") {
                  dispatch(setUser(doc.data()));

                  route = "/DeliveryPartner";
                } else if (doc.data().accountType === "vendorEmployee") {
                  dispatch(setUser(doc.data()));

                  route = "/VendorEmployee";
                }
                else if (doc.data().accountType === "DPEmployee") {
                  dispatch(setUser(doc.data()));

                  route = "/DPEmployeeDashboard";
                }
                dispatch(setID(doc.id));
                router.push(route);

                return;
              }
            });
          } catch (error) {
            toast.error(error);
          }
          dispatch(setLoading(false));
        } else {
          dispatch(setLoading(false));

          console.log("no user");
        }
      });
    };
    unsubscribe();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const user = { email, password };

    try {
      await setPersistence(auth, browserLocalPersistence);

       const result=  await signInWithEmailAndPassword(auth,email,password).then(()=>{

       }).catch((error)=>{
        toast.error(error.message)
    })

      // let route: any;
      // let user2: any;
      // dispatch(setLoading(true));
      // const querySnapshot = await getDocs(collection(db, "users"));
      // querySnapshot.forEach((doc) => {
      //   if (doc.data().email === email) {
      //     user2 = doc.data();

      //     if (doc.data().accountType === "customer") {
      //       dispatch(setUser(user2));
      //       dispatch(setLoading(false));

      // toast.success("Logged in successfully.");

      //        router.push("/Customer")
      //     } else if (doc.data().accountType === "deliveryPartner") {
      //       dispatch(setUser(user2));
      //       dispatch(setLoading(false));

      // toast.success("Logged in successfully.");

      //        (router.push( "/DeliveryPartner"));
      //     } else if (doc.data().accountType === "vendorEmployee") {
      //       dispatch(setUser(user2));
      //       dispatch(setLoading(false));

      //       toast.success("Logged in successfully.");
      //        router.push( "/VendorEmployee")
      //     } else if (doc.data().accountType === "DPEmployee") {
      //       dispatch(setUser(user2));
      //       dispatch(setLoading(false));

      // toast.success("Logged in successfully.");

      //        router.push("/DPEmployeeDashboard");
      //     } else {
      //       dispatch(setLoading(false));

      //       return;
      //     }
      //   }
      // });
      
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error);
    }
    // const res=await dispatch(authLogin(user))
    // const {result,route,newUser}:any=res.payload
    // if(!newUser){
    //   toast.error("Invalid email or password")
    //   dispatch(addUser(null))
    //   router.push("/")
    // }
    //   dispatch(setUser(newUser))

    // if(result){
    //   router.push(route)
    // }
  };
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={loginStyle.main_container}>
        <Toaster />
        {state.loading ? <Loading /> : ""}

        <div className={` row ${loginStyle.main_div} px-0 `}>
          <div
            className={`col-lg-5  col-sm-12 col-md-12 pt-5 px-5 ${loginStyle.login_container}`}
          >
            <div className="container">
              {/* <img src="./images/.png" className="img-fluid" alt=""/> */}
              <br />
              <div
                className={` ${loginStyle.btnGroup} btn-group bg-white mt-5 px-sm-1`}
                role="group"
                aria-label="Basic example"
              >
                <button
                  type="button"
                  className={`btn text-white ${loginStyle.login_btn} `}
                >
                  Log In
                </button>
                <button type="button" className="btn  px-4">
                  <Link href="/signup" className="text-decoration-none">
                    Sign Up
                  </Link>
                </button>
              </div>
              <h2 className="mt-5">Welcome back!</h2>
              <p className="mt-3">Please login to your account </p>
              <form onSubmit={handleSubmit}>
                <div
                  className={`${loginStyle.input_container} mt-5 position-relative`}
                >
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    required
                    placeholder="Email Address"
                  />
                  <img
                    src="email_icon.png"
                    className={`img-fluid  ${loginStyle.icon}`}
                    alt=""
                  />
                </div>
                <div
                  className={`${loginStyle.input_container} mt-5 position-relative`}
                >
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    required
                    placeholder="Password"
                  />
                  <img
                    src="password_icon.png"
                    className={`img-fluid  ${loginStyle.icon}`}
                    alt=""
                  />
                </div>
                <div className="row mt-3">
                  <div className="col-lg-6 col-md-6 col-sm-0"></div>
                  <div
                    className={`col-lg-6 col-md-6 col-sm-12 ${loginStyle.textEnd} text-end`}
                  >
                    <a
                      className={`text-decoration-none ${loginStyle.forgotPass} `}
                    >
                      <Link href="/forgotPassword">
                        <p>Forgot your password?</p>
                      </Link>
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  className={`${loginStyle.signin_btn} btn text-white mt-3 w-100 mb-md-4 `}
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-7  p-0  position-relative d-none d-lg-block">
            <div
              id="carouselExampleFade"
              className={`carousel slide  ${loginStyle.carouselExampleFade} carousel-fade`}
              data-bs-ride="carousel"
            >
              <div className="carousel-inner h-100 ">
                <div className="carousel-item h-100 active  position-relative">
                  <img src="login_3.png" className=" h-100 w-100" alt="..." />
                  <div
                    className={`carousel-caption ${loginStyle.carouselCaption} position-absolute`}
                  >
                    <h5>Good Morning</h5>
                    <h2>11:34 AM</h2>

                    <p>
                      “Beauty perishes in life, but is immortal in art.”
                      <br />
                      <span className={loginStyle.author}>
                        {" "}
                        Leonardo da Vinci
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="carousel-item   h-100">
                <img src="login_2.png" className=" h-100 w-100" alt="..." />
                <div
                  className={`carousel-caption ${loginStyle.carouselCaption} position-absolute`}
                >
                  <h5>Good Morning</h5>
                  <h2>
                    &#9729; 22 <sup>&#176;c</sup>
                  </h2>
                  <p>
                    “The first vision aid was invented around 1000 AD. It was
                    called a reading stone”
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <img src="login_3.png" className=" h-100 w-100" alt="..." />
                <div
                  className={`carousel-caption ${loginStyle.carouselCaption} position-absolute`}
                >
                  <h5>Good Morning</h5>
                  <h2>11:34 AM</h2>
                  <p>
                    If you truly love nature, you will find beauty everywhere.
                    Laura Ingalls
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
