import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import admin from 'firebase-admin';

// --- Firebase Admin Initialization ---
// Note: Vercel environment variables are automatically available in API routes.
const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;
if (FIREBASE_SERVICE_ACCOUNT && !admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized for /api/auth.");
  } catch (e) {
    console.error("Firebase Admin initialization error:", e);
  }
}

function unauthorized(msg: string) {
  return NextResponse.json({ error: msg }, { status: 401 });
}

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();
    if (!initData) {
      return NextResponse.json({ error: 'Missing initData' }, { status: 400 });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
        console.error("TELEGRAM_BOT_TOKEN is not set.");
        return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
    }

    // 1. --- Validation Logic ---
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) {
      return unauthorized('Hash parameter not found in initData');
    }

    params.delete('hash');
    const dataCheckString = Array.from(params.entries())
      .map(([k, v]) => `${k}=${v}`)
      .sort()
      .join('\n');

    const secretKey = crypto.createHmac('sha256', BOT_TOKEN)
      .update('WebAppData')
      .digest();

    const computedHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== hash) {
      return unauthorized('Invalid data signature');
    }

    // 2. --- Timestamp Check ---
    const authDate = params.get('auth_date');
    if (!authDate) {
        return unauthorized('auth_date not found in initData');
    }
    if (Math.floor(Date.now() / 1000) - parseInt(authDate) > 86400) { // 24 hours
      return unauthorized('Init data has expired');
    }

    // 3. --- Issue Firebase Custom Token ---
    const userStr = params.get('user');
    if (!userStr) {
      return NextResponse.json({ error: 'User data not found in initData.' }, { status: 400 });
    }
    const user = JSON.parse(userStr);
    const userId = user.id;

    if (!userId) {
        return NextResponse.json({ error: 'User ID not found in user data.' }, { status: 400 });
    }

    if (!admin.apps.length) {
        console.error("Firebase Admin SDK is not initialized.");
        return NextResponse.json({ error: 'Firebase Admin not initialized.' }, { status: 500 });
    }
    const customToken = await admin.auth().createCustomToken(String(userId));

    return NextResponse.json({ firebase_token: customToken });

  } catch (e: any) {
    console.error("Error in /api/auth:", e);
    return NextResponse.json({ error: 'An internal server error occurred.', details: e.message }, { status: 500 });
  }
}
