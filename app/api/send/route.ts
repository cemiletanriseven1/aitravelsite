import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const data = await resend.emails.send({
      from: 'AI Travel <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL as string], // Burada senin samsun.edu.tr adresin kullanılacak
      subject: `Yeni İletişim Formu: ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Yeni Mesaj Alındı</h2>
          <p><strong>Gönderen:</strong> ${name} (${email})</p>
          <p><strong>Mesaj:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            ${message}
          </div>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Mail gönderilirken bir hata oluştu.' }, { status: 500 });
  }
}