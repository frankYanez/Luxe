const AUTH_URL      = 'https://auth.developers.ar.ua.la/v2/api/auth/token';
const CHECKOUT_URL  = 'https://checkout.developers.ar.ua.la/v2/api/checkout';

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.value;
    }

    const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username:         process.env.UALA_USERNAME,
            client_id:        process.env.UALA_CLIENT_ID,
            client_secret_id: process.env.UALA_CLIENT_SECRET,
            grant_type:       'client_credentials',
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Ualá auth failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    cachedToken = {
        value:     data.access_token,
        expiresAt: Date.now() + (data.expires_in - 300) * 1000,
    };
    return cachedToken.value;
}

export async function createUalaPayment({
    amount,
    description,
    orderId,
    baseUrl,
}: {
    amount: number;
    description: string;
    orderId: number;
    baseUrl: string;
}): Promise<{ uuid: string; checkoutLink: string }> {
    const token = await getToken();

    const res = await fetch(CHECKOUT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
            amount:             amount.toFixed(2),
            description,
            callback_success:   `${baseUrl}/checkout?payment=success`,
            callback_fail:      `${baseUrl}/checkout?payment=failed`,
            notification_url:   `${baseUrl}/api/uala/webhook`,
            external_reference: String(orderId),
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Ualá payment creation failed (${res.status}): ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    return {
        uuid:         data.uuid,
        checkoutLink: data.links.checkout_link,
    };
}
