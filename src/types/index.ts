export interface ProductFilters {
    page?: number;
    limit?: number;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    search?: string;
    sortBy?: 'price' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}