import Mailjet from 'node-mailjet';

if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
  console.warn("MAILJET_API_KEY and/or MAILJET_SECRET_KEY environment variables are not set. Email services will not function.");
}

// Create client with proper type casting as Mailjet's types seem to have issues
const mailjet = process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY ? 
  Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
  ) : null;

const FROM_EMAIL = 'awladnasem800@gmail.com';
const FROM_NAME = 'Alef Bata';

export interface EmailOptions {
  to: string;
  toName?: string;
  subject: string;
  textPart?: string;
  htmlPart: string;
}

/**
 * Send an email using Mailjet
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!mailjet) {
    console.error('Mailjet client not initialized. Email not sent.');
    return false;
  }

  try {
    const data = {
      Messages: [
        {
          From: {
            Email: FROM_EMAIL,
            Name: FROM_NAME
          },
          To: [
            {
              Email: options.to,
              Name: options.toName || options.to
            }
          ],
          Subject: options.subject,
          TextPart: options.textPart || '',
          HTMLPart: options.htmlPart
        }
      ]
    };

    const response = await mailjet
      .post('send', { version: 'v3.1' })
      .request(data as any);

    return response.body.Messages?.[0]?.Status === 'success';
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string, 
  name: string, 
  token: string,
  baseUrl: string
): Promise<boolean> {
  const verificationLink = `${baseUrl}/api/verify-email?token=${token}`;
  
  return sendEmail({
    to: email,
    toName: name,
    subject: 'تحقق من بريدك الإلكتروني - ألف باتا',
    htmlPart: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #4F46E5; text-align: center;">ألف باتا</h2>
        <h3 style="text-align: center;">تحقق من بريدك الإلكتروني</h3>
        <p>مرحباً ${name}،</p>
        <p>شكراً للتسجيل في موقع ألف باتا. يرجى النقر على الرابط أدناه للتحقق من بريدك الإلكتروني:</p>
        <p style="text-align: center;">
          <a href="${verificationLink}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">تحقق من بريدك</a>
        </p>
        <p>أو يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
        <p>${verificationLink}</p>
        <p>إذا لم تقم بالتسجيل في ألف باتا، يمكنك تجاهل هذا البريد الإلكتروني.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <p style="text-align: center; font-size: 12px; color: #666;">
          © ${new Date().getFullYear()} ألف باتا. جميع الحقوق محفوظة.
        </p>
      </div>
    `,
    textPart: `
      مرحباً ${name}،
      
      شكراً للتسجيل في موقع ألف باتا. يرجى استخدام الرابط التالي للتحقق من بريدك الإلكتروني:
      
      ${verificationLink}
      
      إذا لم تقم بالتسجيل في ألف باتا، يمكنك تجاهل هذا البريد الإلكتروني.
      
      © ${new Date().getFullYear()} ألف باتا. جميع الحقوق محفوظة.
    `
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string, 
  name: string, 
  token: string,
  baseUrl: string
): Promise<boolean> {
  const resetLink = `${baseUrl}/reset-password?token=${token}`;
  
  return sendEmail({
    to: email,
    toName: name,
    subject: 'إعادة تعيين كلمة المرور - ألف باتا',
    htmlPart: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #4F46E5; text-align: center;">ألف باتا</h2>
        <h3 style="text-align: center;">إعادة تعيين كلمة المرور</h3>
        <p>مرحباً ${name}،</p>
        <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور لحسابك. يرجى النقر على الرابط أدناه لإعادة تعيين كلمة المرور:</p>
        <p style="text-align: center;">
          <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">إعادة تعيين كلمة المرور</a>
        </p>
        <p>أو يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
        <p>${resetLink}</p>
        <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.</p>
        <p>ينتهي هذا الرابط خلال ساعة واحدة.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <p style="text-align: center; font-size: 12px; color: #666;">
          © ${new Date().getFullYear()} ألف باتا. جميع الحقوق محفوظة.
        </p>
      </div>
    `,
    textPart: `
      مرحباً ${name}،
      
      لقد تلقينا طلبًا لإعادة تعيين كلمة المرور لحسابك. يرجى استخدام الرابط التالي لإعادة تعيين كلمة المرور:
      
      ${resetLink}
      
      إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.
      
      ينتهي هذا الرابط خلال ساعة واحدة.
      
      © ${new Date().getFullYear()} ألف باتا. جميع الحقوق محفوظة.
    `
  });
}