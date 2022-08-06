import React from 'react'
import style from '../styles/navbar.module.css'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Link from 'next/link'
import { auth } from '../Firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useSelector ,useDispatch} from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { addUser ,setUser,setID} from '../redux/slices/authSlice';



export default function DeliveryPartner() {
  const user=useSelector((state:RootState)=>state.auth.user)
  const userAuth=useSelector((state:RootState)=>state.auth.currentUser)
  const userID=useSelector((state:RootState)=>state.auth.id)
  const dispatch=useDispatch<AppDispatch>()

  const router=useRouter()

  const handleSignOut=async()=>{
    await signOut(auth)
    dispatch(setUser(null))
    dispatch(addUser(null))
    dispatch(setID(null))
    router.push("/")
  }
  return (
    <>
     <Navbar   expand={'lg'} className={`mb-3  shadow-sm ${style.navbarContainer}`}>
          <Container >
            <Navbar.Brand style={{color:"#1F7B6F"}}>Delivery Employee</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-md`}
              aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title style={{color:"#1F7B6F"}} id={`offcanvasNavbarLabel-expand-lg`}>
                  Delivery Employee
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                 
                  <Nav.Link className={`mx-3 ${style.menu} `}><Link href={"DPEmployeeDashboard"}>Orders</Link></Nav.Link>
                  <Nav.Link className={`mx-3 ${style.menu} `}><Link href={"DPemployeeProfile"}>Profile</Link></Nav.Link>
                  <Nav.Link className={`mx-3 ${style.menu} `} onClick={handleSignOut} ><Link href={""}>Sign out</Link></Nav.Link>
                  



                 

             
                    
                    
                    
                  
                </Nav>
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    
    
    </>
  )
}
