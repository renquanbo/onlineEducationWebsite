export interface Country {
    id: number;
    cn: string;
    en: string;
    phone_code: string;
}

export type CountryResponse = Country[];