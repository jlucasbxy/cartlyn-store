import { toNumber } from '@/lib/price';
import type { ProductInput, ProductUpdateInput, SearchProductsInput } from '@/schemas';
import { productsRepository } from '@/repositories/products-repository';
import { ServiceError } from '@/services/service-error';
import type { ProductBaseDTO, ProductDTO, ProductListDTO } from '@/dtos';

type SearchProductsFilters = SearchProductsInput & {
    sellerId?: string;
};

async function getProducts(filters: SearchProductsFilters): Promise<ProductListDTO> {
    const { products, total } = await productsRepository.findProducts(filters);

    return {
        products: products.map((product) => ({
            ...product,
            price: toNumber(product.price),
        })),
        pagination: {
            page: filters.page,
            limit: filters.limit,
            total,
            totalPages: Math.ceil(total / filters.limit),
        },
    };
}

async function getProductById(id: string): Promise<ProductDTO> {
    const product = await productsRepository.findVisibleById(id);

    if (!product) {
        throw new ServiceError('Produto não encontrado', 404);
    }

    return {
        ...product,
        price: toNumber(product.price),
    };
}

async function createProduct(sellerId: string, data: ProductInput): Promise<ProductBaseDTO> {
    const product = await productsRepository.createProduct(sellerId, data);

    return {
        ...product,
        price: toNumber(product.price),
    };
}

async function updateProduct(sellerId: string, productId: string, data: ProductUpdateInput): Promise<ProductBaseDTO> {
    const existingProduct = await productsRepository.findById(productId);

    if (!existingProduct) {
        throw new ServiceError('Produto não encontrado', 404);
    }

    if (existingProduct.sellerId !== sellerId) {
        throw new ServiceError('Não autorizado', 403);
    }

    const product = await productsRepository.updateById(productId, data);

    return {
        ...product,
        price: toNumber(product.price),
    };
}

async function deleteProduct(sellerId: string, productId: string) {
    const existingProduct = await productsRepository.findById(productId);

    if (!existingProduct) {
        throw new ServiceError('Produto não encontrado', 404);
    }

    if (existingProduct.sellerId !== sellerId) {
        throw new ServiceError('Não autorizado', 403);
    }

    await productsRepository.deactivateById(productId);
}

async function createBulkProducts(
    sellerId: string,
    products: Array<ProductInput>
) {
    const result = await productsRepository.createManyProducts(
        products.map((product) => ({ ...product, sellerId }))
    );

    return result.count;
}

export const productsService = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createBulkProducts,
};
