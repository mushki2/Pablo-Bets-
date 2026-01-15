import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import admin from 'firebase-admin';

// --- Firebase Admin Initialization ---
// This function ensures Firebase is initialized only once.
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return true;
  }

  const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!FIREBASE_SERVICE_ACCOUNT) {
    console.error("Firebase Admin initialization failed: FIREBASE_SERVICE_ACCOUNT env var not set.");
    return false;
  }

  try {
    const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully for /api/auth.");
    return true;
  } catch (e) {
    console.error("Firebase Admin initialization error:", e);
    return false;
  }
}

const isFirebaseInitialized = initializeFirebaseAdmin();

function unauthorized(msg: string) {
  return NextResponse.json({ error: msg }, { status: 401 });
}

export async function POST(req: NextRequest) {
  if (!isFirebaseInitialized) {
    return NextResponse.json({ error: 'Firebase Admin SDK not initialized. Please check server configuration.' }, { status: 500 });
  }

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

    const customToken = await admin.auth().createCustomToken(String(userId));

    return NextResponse.json({ firebase_token: customToken });

  } catch (e: any) {
    console.error("Error in /api/auth:", e);
    return NextResponse.json({ error: 'An internal server error occurred.', details: e.message }, { status: 500 });
  }
}
