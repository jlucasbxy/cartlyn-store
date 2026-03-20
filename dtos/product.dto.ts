export type SellerDTO = {
    id: string;
    name: string;
};

export type ProductBaseDTO = {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    publishedAt: Date;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    sellerId: string;
};

export type ProductDTO = ProductBaseDTO & {
    seller: SellerDTO;
};

export type PaginationDTO = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type ProductListDTO = {
    products: ProductDTO[];
    pagination: PaginationDTO;
};
