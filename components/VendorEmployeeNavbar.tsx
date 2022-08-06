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
            <Navbar.Brand style={{color:"#1F7B6F"}}>Vendor Employee</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-md`}
              aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title style={{color:"#1F7B6F"}} id={`offcanvasNavbarLabel-expand-lg`}>
                  Vendor Employee
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link className={`mx-3 ${style.menu} `}><Link href={"VendorEmployee"}>Products</Link></Nav.Link>
                  <Nav.Link className={`mx-3 ${style.menu} `}><Link href={"VECustomers"}>Customers</Link></Nav.Link>
                  <Nav.Link className={`mx-3 ${style.menu} `}> <Link href="VEDeliveryPartner">Delivery partners</Link></Nav.Link>
                  
                  <Nav.Link className={`mx-3 ${style.menu} `}> <Link href="VEOrders">Orders</Link></Nav.Link>
                  <Nav.Link className={`mx-3 ${style.menu} `}> <Link href={"VendorEmployeeMarketing"}>Marketing</Link></Nav.Link>





                  <NavDropdown className={`mx-3 ${style.menu} `} style={{color:"#00000BC !important"}}
                    title="More"
                    
                    id={`offcanvasNavbarDropdown-expand-lg`}
                  >
                    <NavDropdown.Item >
                    <svg xmlns="http://www.w3.org/2000/svg" style={{height:'34px',width:'34px'}} className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>        <Link href="VEProfile">Profile</Link>
                    </NavDropdown.Item>

                    {/* <NavDropdown.Item>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{height:'34px',width:'34px'}} className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>  <Link href="DPSettings">settings</Link>
                    </NavDropdown.Item> */}
                    
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleSignOut} >
                      Sign out
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    
    
    </>
  )
}
