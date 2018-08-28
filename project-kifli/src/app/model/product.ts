export class Product {
    id: number;
    title: string;
    description: string;
    price: number;
    type: string;
    state: string;
    uploadDate: string;
    premiumExpirationDate: string;
    pictureIds: Array<number>;
    categoryId: number;
    categoryName: string;
    attributes: {};
    ownerId: number;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    activation: boolean;
}
