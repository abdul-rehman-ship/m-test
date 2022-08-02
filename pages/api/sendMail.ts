export default function(req:any,res:any){
var nodemailer = require('nodemailer');

  
  if(req.method=='POST'){
    const {email,customerName,buisnessName,item,price,quantity,totalPrice,deliveryDate}=req.body
    
    
    
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abd22655@gmail.com',
    pass: 'ujnissnffetbwbga'
  }
});

var mailOptions = {
  from: 'abd22655@gmail.com',
  to: email,
  subject: 'your order',
  html:`
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<p></p>
    Dear ${customerName}
    <p>You have successfully purchased the following item from ${buisnessName}</p>
    <p>product : ${item}</p>
    <p> price : ${price}</p>
    <p> quantity : ${ quantity}</p>
    <p>total price : ${totalPrice}</p>
    <p>Your items will be delivered by ${deliveryDate}</p>
    <p>
    If you have registered your account, you can track your Order here 
    </p>
    <p>Thank you for shopping with us!</p>
    <p>Best wishes</p>
    <p>${buisnessName}</p>


    
</body>
</html>
  
  
  
  
  `
};

transporter.sendMail(mailOptions, function(error:any, info:any){
  if (error) {
    console.log(error.message);
  } else {
    console.log('Email sent: ' + info.response);
  res.status(200).json({msg:"success"})

  }
});

  }

}