
export function isLocalUrl(urlOrPath: string): boolean {
    return !urlOrPath.includes('://') || urlOrPath.startsWith('file://') || urlOrPath.startsWith('http://localhost') || urlOrPath.startsWith('http://127.0.0.1');
}