// Encodes sequential DB IDs into non-obvious display codes.
// decode(encode(n)) === n for any positive integer n.
const M = 7919;
const O = 100000;

export function encodeOrderId(id: number): string {
    return 'LX-' + (id * M + O).toString(36).toUpperCase();
}

export function decodeOrderId(code: string): number {
    return (parseInt(code.replace('LX-', ''), 36) - O) / M;
}
