import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IRegister } from '../../components/types'
import { forgotPasswordApi, loginApi, registerApi } from '../actions/auth'



export const authRegister=createAsyncThunk('auth/register',async(data:any)=>{
  return await registerApi(data)

})
export const forgotPasswordAsyncThunk=createAsyncThunk('auth/forgotPassword',async(email:string)=>{
  return await forgotPasswordApi(email)

})
export const authLogin=createAsyncThunk('auth/login',async(data:any)=>{

  return await loginApi(data.email,data.password)
})
export interface authState {
  currentUser?:any;
  loading:boolean;
  vendor:boolean;
  admin:boolean;
  user?:any;
  id?:string;
  product?:string;
  customerEmail?:string;
  products?:any;
  vendorSettings?:any;
  vendorOverheads?:any;
  vendorProfile?:any;
  adminProfile?:any;
  customerId?:any;
  employeeId?:any;
  deliveryPartnerId?:any;
  orderId?:any;
}

const initialState: authState = {
  currentUser:null,
  loading:false,
  vendor:false,
  admin:false,
  user:null,
  id:null,
  customerEmail:null,
  product:null,
  products:null,
  vendorSettings:null,
  vendorOverheads:null,
  vendorProfile:null,
  adminProfile:null,
  customerId:null,
  employeeId:null,
  deliveryPartnerId:null,
  orderId:null



}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   addUser(state:any, action: PayloadAction<any>) {
    state.currentUser=action.payload
  }
  ,
        setVendor(state:any, action: PayloadAction<any>) {
          state.vendor=action.payload
        },
        setCustomerId(state:any, action: PayloadAction<any>) {
          state.customerId=action.payload
        },
        setEmployeeId(state:any, action: PayloadAction<any>) {
          state.employeeId=action.payload
        },
        setDeliveryPartnerId(state:any, action: PayloadAction<any>) {
          state.deliveryPartnerId=action.payload
        },
        setOrderId(state:any,action:PayloadAction<any>){
          state.orderId=action.payload
        }
        ,setAdmin(state:any, action: PayloadAction<any>) {
          state.admin=action.payload
        },setUser(state:any, action: PayloadAction<any>) {
          state.user=action.payload
        }
        ,setID(state:any, action: PayloadAction<any>) {
          state.id=action.payload
        },setLoading(state:any, action: PayloadAction<any>) 
        {
          state.loading=action.payload
        },
        setCustomerEmail(state:any, action: PayloadAction<any>){
          state.customerEmail=action.payload
        },setProduct(state:any, action: PayloadAction<any>){
          state.product=action.payload
        },
        setProducts(state:any, action: PayloadAction<any>){
          state.products=action.payload
        }
        ,setVendorSettings(state:any, action: PayloadAction<any>){
          state.vendorSettings=action.payload
        },
        setVendorOverheads(state:any, action: PayloadAction<any>){
          state.vendorOverheads=action.payload
        },
        setVendorProfile(state:any, action: PayloadAction<any>){
          state.vendorProfile=action.payload
        },
        setAdminProfile(state:any,action: PayloadAction<any>){
            state.adminProfile=action.payload
        }
   },
  extraReducers: (builder)=>{
    builder.addCase(authRegister.pending,(state,action)=>{
      state.loading=true
    }),
    builder.addCase(authRegister.fulfilled,(state,action)=>{
      state.loading=false
    }),
    builder.addCase(authRegister.rejected,(state,action)=>{
      state.loading=false
    })
    , builder.addCase(forgotPasswordAsyncThunk.pending,(state,action)=>{
      state.loading=true
    }),
    builder.addCase(forgotPasswordAsyncThunk.fulfilled,(state,action)=>{
      state.loading=false
    }),
    builder.addCase(forgotPasswordAsyncThunk.rejected,(state,action)=>{
      state.loading=false
    })
    , builder.addCase(authLogin.pending,(state,action)=>{
      state.loading=true
    }),
    builder.addCase(authLogin.fulfilled,(state,action)=>{
      state.loading=false
    }),
    builder.addCase(authLogin.rejected,(state,action)=>{
      state.loading=false
    })
  }
  })



// Action creators are generated for each case reducer function
export const { addUser,setAdmin,setOrderId,setVendorProfile,setCustomerId,setDeliveryPartnerId,setEmployeeId,setAdminProfile,setVendorOverheads,setVendorSettings,setVendor,setUser ,setCustomerEmail,setProduct,setProducts,setID,setLoading} = authSlice.actions

export default authSlice.reducer