import nodemailer from 'nodemailer';

// הגדרת החיבור לשרת המיילים (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-project-email@gmail.com', // המייל של האפליקציה (יוגדר ב-.env)
        pass: process.env.EMAIL_PASS || 'your-app-password'           // סיסמת אפליקציה מ-Google (יוגדר ב-.env)
    }
});

/**
 * 1. שליחת קוד אימות זמני (2FA) להתחברות
 */
export const sendVerificationEmail = async (toEmail: string, code: string) => {
    const mailOptions = {
        from: `"מערכת האימות שלנו" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'קוד האימות שלך להתחברות לאתר',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: right; direction: rtl; padding: 20px; border: 1px solid #7d2e54; border-radius: 8px; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #7d2e54; text-align: center;">שלום רב,</h2>
                <p>קיבלנו בקשה להתחברות לחשבון שלך.</p>
                <p>קוד האימות הזמני שלך הוא (בתוקף ל-10 דקות):</p>
                <div style="text-align: center; margin: 20px 0;">
                    <div style="background-color: #f4f4f4; display: inline-block; padding: 15px 30px; font-size: 26px; font-weight: bold; letter-spacing: 5px; color: #7d2e54; border-radius: 4px; border: 1px dashed #7d2e54;">
                        ${code}
                    </div>
                </div>
                <p>אם לא ביקשת להתחבר, ניתן להתעלם ממייל זה בבטחה.</p>
                <hr style="border: none; border-top: 1px solid #ccc; margin-top: 20px;" />
                <p style="font-size: 12px; color: #666; text-align: center;">צוות הפרויקט של דינה ומירי ✨</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(` Verification email sent successfully to ${toEmail}`);
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        // גיבוי לפיתוח: אם המייל לא מוגדר עדיין ב-.env, נדפיס את הקוד בטרמינל כדי שתוכלי לבדוק את האתר
        console.log(`👉 [DEVELOPMENT BACKUP] Verification code for ${toEmail} is: ${code}`);
    }
};

/**
 * 2. שליחת סיכום פרטי השכרה (Rental Summary) לאחר ביצוע הזמנה
 */
export const sendRentalSummaryEmail = async (toEmail: string, rentalDetails: any) => {
    const mailOptions = {
        from: `"מערכת ההשכרות שלנו" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `אישור הזמנה וסיכום השכרה מס' ${rentalDetails.id || ''}`,
        html: `
            <div style="font-family: Arial, sans-serif; text-align: right; direction: rtl; padding: 20px; border: 1px solid #7d2e54; border-radius: 8px; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #7d2e54; text-align: center;">תודה על הזמנתך! </h2>
                <p>ההזמנה שלך נקלטה בהצלחה במערכת. הנה סיכום פרטי ההשכרה:</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0;">
                    <p><strong> פריט:</strong> ${rentalDetails.itemName || 'שם הפריט'}</p>
                    <p><strong> תאריך התחלה:</strong> ${rentalDetails.startDate || 'תאריך התחלה'}</p>
                    <p><strong> תאריך החזרה:</strong> ${rentalDetails.endDate || 'תאריך סיום'}</p>
                    <p><strong> סה"כ לתשלום:</strong> ₪${rentalDetails.totalPrice || '0'}</p>
                </div>
                <p>נא לשמור על הפריט ולהחזירו במועד הנקוב.</p>
                <hr style="border: none; border-top: 1px solid #ccc; margin-top: 20px;" />
                <p style="font-size: 12px; color: #666; text-align: center;">צוות השכרת upscale</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(` Rental summary email sent successfully to ${toEmail}`);
    } catch (error) {
        console.error('❌ Error sending rental summary email:', error);
    }
};

/**
 * 3. שליחת תזכורת לפני מועד החזרה (Due Date Reminder)
 */
export const sendDueReminderEmail = async (toEmail: string, userName: string, itemName: string, dueDate: string) => {
    const mailOptions = {
        from: `"מערכת ההשכרות שלנו" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `תזכורת: מועד החזרת פריט קרוב `,
        html: `
            <div style="font-family: Arial, sans-serif; text-align: right; direction: rtl; padding: 20px; border: 1px solid #b23b3b; border-radius: 8px; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #b23b3b; text-align: center;">שלום ${userName},</h2>
                <p>זוהי תזכורת ידידותית מטעם מערכת ההשכרות.</p>
                <p>מועד ההחזרה של הפריט <strong>"${itemName}"</strong> שברשותך מתקרב!</p>
                <div style="background-color: #fff5f5; border-right: 4px solid #b23b3b; padding: 10px 15px; margin: 15px 0;">
                    <p style="margin: 0; font-weight: bold; color: #b23b3b;">תאריך החזרה אחרון: ${dueDate}</p>
                </div>
                <p>נא לוודא את החזרת הפריט במועד כדי למנוע קנסות או חיובים נוספים.</p>
                <p>תודה רבה על שיתוף הפעולה!</p>
                <hr style="border: none; border-top: 1px solid #ccc; margin-top: 20px;" />
                <p style="font-size: 12px; color: #666; text-align: center;">צוות הפרויקט של דינה ומירי ✨</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(` Due reminder email sent successfully to ${toEmail}`);
    } catch (error) {
        console.error(' Error sending reminder email:', error);
    }
};