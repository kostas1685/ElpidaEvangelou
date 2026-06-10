export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.evangeloulaw.gr');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, surname, email, phone, area, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Συμπληρώστε τα υποχρεωτικά πεδία.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Μη έγκυρο email.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Επικοινωνία <noreply@evangeloulaw.gr>',
        to: ['kostas1685@gmail.com'],
        reply_to: email,
        subject: `Νέο μήνυμα από ${name} ${surname || ''} – ${area || 'Γενικό'}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1E293B;">
            <div style="background: #1E293B; padding: 28px 32px; border-bottom: 3px solid #A8895A;">
              <h1 style="color: #fff; font-size: 22px; margin: 0; font-weight: 300;">
                Νέο Μήνυμα <span style="color: #A8895A; font-style: italic;">Επικοινωνίας</span>
              </h1>
              <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 6px 0 0; font-family: Arial, sans-serif; letter-spacing: 1px;">
                ΔΙΚΗΓΟΡΙΚΟ ΓΡΑΦΕΙΟ ΕΛΠΙΔΑΣ ΕΥΑΓΓΕΛΟΥ
              </p>
            </div>
            <div style="background: #fff; padding: 32px; border: 1px solid #e2e8f0; border-top: none;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; width: 130px;">
                    <span style="font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #A8895A; font-family: Arial, sans-serif; font-weight: 700;">Ονοματεπώνυμο</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1E293B;">
                    ${name} ${surname || ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                    <span style="font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #A8895A; font-family: Arial, sans-serif; font-weight: 700;">Email</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #A8895A;">${email}</a>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                    <span style="font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #A8895A; font-family: Arial, sans-serif; font-weight: 700;">Τηλέφωνο</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1E293B;">
                    <a href="tel:${phone}" style="color: #A8895A;">${phone}</a>
                  </td>
                </tr>` : ''}
                ${area ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                    <span style="font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #A8895A; font-family: Arial, sans-serif; font-weight: 700;">Τομέας</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1E293B;">
                    ${area}
                  </td>
                </tr>` : ''}
              </table>
              <div style="margin-top: 24px;">
                <div style="font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #A8895A; font-family: Arial, sans-serif; font-weight: 700; margin-bottom: 10px;">Μήνυμα</div>
                <div style="background: #F8F9FA; border-left: 3px solid #A8895A; padding: 16px 18px; font-size: 14px; line-height: 1.8; color: #4A5568; white-space: pre-wrap;">
                  ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                </div>
              </div>
            </div>
            <div style="background: #F8F9FA; padding: 16px 32px; border: 1px solid #e2e8f0; border-top: none; text-align: center;">
              <p style="font-size: 11px; color: #718096; font-family: Arial, sans-serif; margin: 0;">
                Αυτό το email στάλθηκε από τη φόρμα επικοινωνίας του <strong>evangeloulaw.gr</strong>
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Αποτυχία αποστολής. Παρακαλώ δοκιμάστε ξανά.' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Σφάλμα διακομιστή. Παρακαλώ δοκιμάστε ξανά.' });
  }
}
