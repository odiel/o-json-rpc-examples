import { Buffer } from 'node:buffer';
import { SignJWT } from 'jose';

export function generateSessionId(): string {
    const array = new Uint8Array(32);
    const sessionKey = crypto.getRandomValues(array);

    return Buffer.from(sessionKey).toString('base64');
}

export function generateApiKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);

    // Convert bytes to hex string
    const hexKey = Array.from(array)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    return hexKey;
}

export async function generateTokens(userId: string, secretKey: Uint8Array): Promise<{
    access: string;
    refresh: string;
}> {
    const access = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secretKey);

    const refresh = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secretKey);

    return {
        access,
        refresh,
    };
}
