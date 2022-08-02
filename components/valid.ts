import { IRegister,IDPEmployee } from "./types"

export const validateRegister = (values: IRegister) => {    
    const errors: string[] = [];
    if (!values.email) {
        errors.push ('Email is required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.push ('Email is invalid');

        
    }
    if (!values.password) {
        errors.push ('password is required');
        
    } else if (values.password.length < 8) {
        errors.push (' password must be at least 8 characters');
        
    }
    if (!values.confirmPassword) {
        errors.push ('confirm password is required');
        
    } else if (values.password !== values.confirmPassword) {
        console.log(values.password, values.confirmPassword);
        
        errors.push ('password and confirm password must match');
        
    }
    if (!values.firstName) {
        errors.push ('first name is required');
        
    }
    if (!values.surname) {
        errors.push ('surname is required');
        
    }
    if (!values.buisnessAddress) {
        errors.push ('buisness address is required');
        
    }
    if (!values.state) {
        errors.push ('state is required');
        
    }
    if (!values.mobileNumber) {
        errors.push ('mobile number is required');
        
    }else if(values.mobileNumber.length <= 8){
        errors.push ('invalid mobile number');
        
    }
    if (!values.WNumber) {
        errors.push ("what's app number is required")
        
    }else if(values.mobileNumber.length <= 8){
        errors.push ('invalid whatsapp  number');
        
    }
    if (!values.accountType) {
        errors.push ('invalid account type');
        
    }else if(values.accountType=="Choose Account Type"){
        errors.push ('invalid account type');}
    return errors;

    }

    export const validateUpdateProfile = (values: IRegister) => {    
        const errors: string[] = [];
        if (!values.email) {
            errors.push ('Email is required');
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.push ('Email is invalid');
    
            
        }
        
        if (!values.firstName) {
            errors.push ('first name is required');
            
        }
        if (!values.surname) {
            errors.push ('surname is required');
            
        }
        if (!values.buisnessAddress) {
            errors.push ('buisness address is required');
            
        }
        if (!values.state) {
            errors.push ('state is required');
            
        }
        if (!values.mobileNumber) {
            errors.push ('mobile number is required');
            
        }else if(values.mobileNumber.length <= 8){
            errors.push ('invalid mobile number');
            
        }
        if (!values.WNumber) {
            errors.push ("what's app number is required")
            
        }else if(values.mobileNumber.length <= 8){
            errors.push ('invalid whatsapp  number');
            
        }
        if (!values.accountType) {
            errors.push ('invalid account type');
            
        }else if(values.accountType=="Choose Account Type"){
            errors.push ('invalid account type');}
        return errors;
    
        }
 
        export const validateDPEmployee = (values: IDPEmployee) => {    
            const errors: string[] = [];
            if (!values.email) {
                errors.push ('Email is required');
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.push ('Email is invalid');
        
                
            }
            if (!values.password) {
                errors.push ('password is required');
                
            } else if (values.password.length < 8) {
                errors.push (' password must be at least 8 characters');
                
            }
            if (!values.confirmPassword) {
                errors.push ('confirm password is required');
                
            } else if (values.password !== values.confirmPassword) {
                console.log(values.password, values.confirmPassword);
                
                errors.push ('password and confirm password must match');
                
            }
            if (!values.firstName) {
                errors.push ('first name is required');
                
            }
            if (!values.surname) {
                errors.push ('surname is required');
                
            }
   
            return errors;
        
            }
    