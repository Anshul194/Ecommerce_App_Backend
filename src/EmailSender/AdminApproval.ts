import nodemailer from 'nodemailer'
import { Prisma, PrismaClient  } from '@prisma/client';
const prisma = new PrismaClient(); 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mailer1499@gmail.com',
        pass: 'aivd qmxd hhmf xdjv'
    }
  });
   export const sendUserNotification = async (UserId:any,email: any) => {
    try {

        const admin = await prisma.admin.findFirst({ select: { email: true } });
        if (!admin || !admin.email) {
            throw new Error('Admin email not found');
        }
        const adminEmail=admin.email;
      await transporter.sendMail({
        from: '"Ecommerce-App" <mailer1499@gmail.com>',
        to: adminEmail,
        subject: 'New User Registration',
        text: `New user registration from ${UserId}`,
      });
  
      console.log(`Notification email sent to ${adminEmail} for approval`);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

  export const sendRegistrationResponseNotification=async(email: any,subject: any,message: any)=>{
    try{
await transporter.sendMail({

    from: '"Ecommerce-App" <mailer1499@gmail.com>',
    to: email,
    subject: subject,
    text: message,
});
console.log(`Email sent that request approved`);
    }
    catch(error:any){
        console.error('Error sending email notification:', error);
    }

  }


