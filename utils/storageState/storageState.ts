import * as fs from 'fs';

export function getSidFromStorageState(storageStatePath: string) {
    const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
    const sidCookie = storageState.cookies.find((cookie: any) => cookie.name === 'sid');
    if (!sidCookie) {
        throw new Error('sid cookie not found in storageState');
    }
    return `sid=${sidCookie.value}`;

}