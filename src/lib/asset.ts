export const asset = (p: string) => (p.startsWith('/') && !p.startsWith('//') ? import.meta.env.BASE_URL + p.slice(1) : p);
