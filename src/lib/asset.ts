export const asset = (p: string) => (p.startsWith('/') && !p.startsWith('//') ? import.meta.env.BASE_URL + 'projects/' + p.slice(1) : p);
