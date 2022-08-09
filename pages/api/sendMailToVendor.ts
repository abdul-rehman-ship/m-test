export default function(req:any,res:any){
    var nodemailer = require('nodemailer');
    
      
      if(req.method=='POST'){
        const {email,text,customerName,customerEmail}=req.body
        
        
        
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'abd22655@gmail.com',
        pass: 'ujnissnffetbwbga'
      }
    });
    
    var mailOptions = {
      from: customerEmail,
      to: email,
      subject: 'message',
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
    <p>customer name : ${customerName}</p>
    <p>email  : ${customerEmail}</p>
        
    
        <p>message : <br/> ${text}</p>
    
    
        
    </body>
    </html>
      
      
      
      
      `
    };
    
    transporter.sendMail(mailOptions, function(error:any, info:any){
      if (error) {
        return res.status(500).json({msg:error.message})
      } else {
        
    return  res.status(200).json({msg:"email sended successfully"})
    
      }
    });
    
      }
    
    }