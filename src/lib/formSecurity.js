/**
 * Form Security & Validation Utility
 * Provides client-side sanitization, strict validation, anti-spam rate limiting,
 * bot prevention, and reliable offline fallback.
 */

// Strip HTML tags, script injection patterns, control characters and null bytes
export function sanitizeInput(value) {
    if (typeof value !== 'string') return '';
    return value
        .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '') // remove control chars
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // strip scripts
        .replace(/<[^>]+>/g, '') // strip HTML tags
        .replace(/javascript:/gi, '') // strip inline protocol
        .trim();
}

// RFC 5322 compliant email regex check
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim();
    if (trimmed.length < 5 || trimmed.length > 100) return false;
    return EMAIL_REGEX.test(trimmed);
}

// Validate name: 2-80 chars, printable
export function isValidName(name) {
    if (!name || typeof name !== 'string') return false;
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 80;
}

// Validate message: 5-2000 chars
export function isValidMessage(msg) {
    if (!msg || typeof msg !== 'string') return false;
    const trimmed = msg.trim();
    return trimmed.length >= 5 && trimmed.length <= 2000;
}

// Rate limiting cooldown (default: 20 seconds between submissions)
export function checkRateLimit(storageKey = 'signbridge_submission_cooldown', cooldownSeconds = 20) {
    try {
        const lastTime = sessionStorage.getItem(storageKey);
        if (!lastTime) return { allowed: true, remainingSeconds: 0 };
        const elapsed = (Date.now() - parseInt(lastTime, 10)) / 1000;
        if (elapsed < cooldownSeconds) {
            return {
                allowed: false,
                remainingSeconds: Math.ceil(cooldownSeconds - elapsed)
            };
        }
    } catch (e) {
        // Fallback if sessionStorage is disabled
    }
    return { allowed: true, remainingSeconds: 0 };
}

export function recordSubmission(storageKey = 'signbridge_submission_cooldown') {
    try {
        sessionStorage.setItem(storageKey, Date.now().toString());
    } catch (e) {}
}

// Offline / network failure backup store
export function saveOfflineInquiry(payload) {
    try {
        const existing = JSON.parse(localStorage.getItem('signbridge_offline_inquiries') || '[]');
        existing.push({
            ...payload,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('signbridge_offline_inquiries', JSON.stringify(existing.slice(-20)));
    } catch (e) {}
}

// Generate prefilled direct mailto link for fail-safe transmission
export function generateDirectMailto({ name, email, message, subject = 'SignBridge Project Inquiry' }) {
    const encodedSubject = encodeURIComponent(`[Transmission] ${subject} - ${name || 'Inquiry'}`);
    const encodedBody = encodeURIComponent(
        `Name: ${name || 'N/A'}\nEmail: ${email || 'N/A'}\n\nMessage:\n${message || ''}\n\n---\nSent via SignBridge Direct Uplink`
    );
    return `mailto:signbridge.aiauto@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
}
