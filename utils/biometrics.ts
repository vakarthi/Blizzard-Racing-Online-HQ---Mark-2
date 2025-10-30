// Helper functions to convert between ArrayBuffer and Base64URL
export function bufferToB64Url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function b64UrlToBuffer(b64Url: string): ArrayBuffer {
  const b64 = b64Url.replace(/-/g, '+').replace(/_/g, '/');
  const byteString = atob(b64);
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }
  return bytes.buffer;
}

// WebAuthn registration
export async function registerBiometrics(user: { id: string, name: string, displayName: string }): Promise<PublicKeyCredential> {
  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: {
        name: 'Blizzard Racing HQ',
        id: window.location.hostname,
      },
      user: {
        id: b64UrlToBuffer(user.id), // User ID must be an ArrayBuffer
        name: user.name,
        displayName: user.displayName,
      },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }], // ES256 algorithm
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'required',
      },
      timeout: 60000,
    },
  });

  if (!credential) {
    throw new Error('Biometric registration failed.');
  }

  return credential as PublicKeyCredential;
}

// WebAuthn authentication
export async function authenticateWithBiometrics(credentialIdB64Url: string): Promise<PublicKeyCredential> {
  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  const credential = await navigator.credentials.get({
    publicKey: {
      challenge,
      timeout: 60000,
      allowCredentials: [{
        type: 'public-key',
        id: b64UrlToBuffer(credentialIdB64Url),
        transports: ['internal'],
      }],
      userVerification: 'required',
    },
  });

  if (!credential) {
    throw new Error('Biometric authentication failed.');
  }
  
  return credential as PublicKeyCredential;
}
