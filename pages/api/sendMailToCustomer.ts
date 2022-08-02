export default function(req:any,res:any){
    var nodemailer = require('nodemailer');
    
      
      if(req.method=='POST'){
        const {email,customerName}=req.body
        
        
        
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
      subject: 'marketing',
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
    <p>Dear ${customerName}</p>
        
    
        <p>this email is send from  vendor</p>
    
    
        
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