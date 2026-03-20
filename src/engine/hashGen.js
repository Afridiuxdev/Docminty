// Verification ID generator for certificates

export function generateVerificationId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const timestamp = Date.now().toString(36).toUpperCase();
    let random = "";
    for (let i = 0; i < 6; i++) {
        random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `DM-${timestamp}-${random}`;
}

export function generateQRData(verificationId) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://docminty.com";
    return `${baseUrl}/verify/${verificationId}`;
}