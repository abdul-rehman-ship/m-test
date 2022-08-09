import { IRegister } from "../../components/types";
import { auth } from "../../Firebase";
import {browserLocalPersistence, createUserWithEmailAndPassword,updateProfile,
    signInWithEmailAndPassword,sendPasswordResetEmail,setPersistence, signOut} from 'firebase/auth'
import toast from "react-hot-toast";
import { db } from "../../Firebase";
import { useRouter } from "next/router";
import { addDoc, collection ,doc,getDocs,serverTimestamp} from "firebase/firestore"; 


export const registerApi=async(user:any)=>{

try {

    const result=await createUserWithEmailAndPassword(auth,user.email,user.password)
    
    

    let docRef:any;
    if(user.accountType=="customer"){
       docRef= await addDoc(collection(db, "users"), {
            email: user.email,
            firstName: user.firstName,
            surname: user.surname,
            buisnessAddress:user.buisnessAddress,
            state:user.state,
            mobileNumber:user.mobileNumber,
            WNumber:user.WNumber,
            accountType:user.accountType,
            cart:[],
            notes:user.notes?user.notes:"",
            wishList:[],
            createdAt: serverTimestamp()
          });
          

    }else if(user.accountType=="deliveryPartner"){
      docRef=await addDoc(collection(db, "users"), {
            email: user.email,
            
            
            firstName: user.firstName,
            surname: user.surname,
            buisnessAddress:user.buisnessAddress,
            state:user.state,
            mobileNumber:user.mobileNumber,
            WNumber:user.WNumber,
            accountType:user.accountType,
            paymentMethod:"",
            public_key:"",
            fullAccess:false,
            createdAt: serverTimestamp()
            
          });

    }
    else if(user.accountType=="vendorEmployee"){

        docRef= await addDoc(collection(db, "users"), {
            email: user.email,
            
            
            firstName: user.firstName,
            surname: user.surname,
            buisnessAddress:user.buisnessAddress,
            state:user.state,
            mobileNumber:user.mobileNumber,
            WNumber:user.WNumber,
            accountType:user.accountType,
            fullAccess:false,
            allowedRoles:{
              orders:false,
              quality :false,
              delivery:false,
            return:false,
            partners:false,
            products:false,
            customers:false,
            marketing:false

            },
            createdAt: serverTimestamp(),
            orders:[]
            
          });
    
    }
 toast.success("user created successfully")
 
    
return
    
    
    
} catch (error:any) {
    
        toast.error(error.message)
    
}
    
    

}
export const forgotPasswordApi=async(email:string)=>{
    try {
        const result=await sendPasswordResetEmail(auth,email)
    toast.success('Password reset email sent. Please check your email. If email not check spam folder')
        return result
    } catch (error) {
        toast.error(error.message)
    }
}
export const loginApi=async(email:string,password:string)=>{
;
try {
  

  await setPersistence(auth, browserLocalPersistence)

       const result=  await signInWithEmailAndPassword(auth,email,password)
       
       
        let route:any;
        let user:any
        
            const querySnapshot = await getDocs(collection(db, "users",));
            querySnapshot.forEach((doc) => {
              if(doc.data().email===email){
                user=doc.data()
                console.log(user);
                
                if(doc.data().accountType==="customer"){
                 return route="/Customer"
                 
                }else if(doc.data().accountType==="deliveryPartner"){
                  return route="/DeliveryPartner"
                 
                }
                else if(doc.data().accountType==="vendorEmployee"){
                  return route="/VendorEmployee"
                 
                }
                else if(doc.data().accountType==="DPEmployee"){
                  return route="/DPEmployeeDashboard"
                 
                }else{
                  return
                }
               
                
              }
            }
            )
         
             toast.success('Logged in successfully.')
        return {result:result.user,route,newUser:user}
    } catch (error) {
        toast.error(error.message)
        
    }
}