const CALLMEBOT_URL = 'https://api.callmebot.com/whatsapp.php';

export async function sendWhatsApp(message: string): Promise<void> {
    const phone  = process.env.CALLMEBOT_PHONE;
    const apikey = process.env.CALLMEBOT_APIKEY;

    if (!phone || !apikey) {
        console.log('WhatsApp notify skipped: CALLMEBOT_PHONE or CALLMEBOT_APIKEY not set');
        return;
    }

    const url = `${CALLMEBOT_URL}?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apikey}`;

    try {
        const res = await fetch(url);
        if (!res.ok) console.error('CallMeBot error:', res.status, await res.text());
        else console.log('✅ WhatsApp notification sent');
    } catch (err) {
        console.error('WhatsApp notify failed:', err);
    }
}
