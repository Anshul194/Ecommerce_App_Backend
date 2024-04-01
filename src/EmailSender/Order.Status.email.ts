import nodemailer from 'nodemailer'

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
                user: 'mailer1499@gmail.com',
        pass: 'aivd qmxd hhmf xdjv'
    }
});

export const SendOrderConfirmationEmail=(async(sellerEmail:any, UserId:any)=>{
    try{

    await transporter.sendMail({
        from: '"Ecommerce-App" <mailer1499@gmail.com>',
        to: sellerEmail,
        subject: 'Order Approval Request',
        text: `Orderr placed from ${UserId} , please go on further process`,
      });
      console.log(`Notification email sent to ${sellerEmail} for approval`);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
})

export const orderStatusMail=(async(userEmail:any,subject:any,task:any)=>{
  try{

    await transporter.sendMail({
        from: '"Ecommerce-App" <mailer1499@gmail.com>',
        to: userEmail,
        subject: subject,
        text: task,
      });
      console.log(`Notification email sent to ${userEmail}, Your order has been confirmed`);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
})

