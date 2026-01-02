/**
 * WooCommerce TypeScript Types
 * Definiciones completas para productos de WooCommerce
 */

export interface WCImage {
    id: number;
    src: string;
    name: string;
    alt: string;
}

export interface WCCategory {
    id: number;
    name: string;
    slug: string;
}

export interface WCMetaData {
    id: number;
    key: string;
    value: string | number | boolean;
}

export interface WCAttribute {
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
}

export interface WCProduct {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    date_created: string;
    date_modified: string;
    type: 'simple' | 'grouped' | 'external' | 'variable';
    status: 'draft' | 'pending' | 'private' | 'publish';
    featured: boolean;
    catalog_visibility: string;
    description: string;
    short_description: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    on_sale: boolean;
    purchasable: boolean;
    total_sales: number;
    virtual: boolean;
    downloadable: boolean;
    downloads: any[];
    download_limit: number;
    download_expiry: number;
    external_url: string;
    button_text: string;
    tax_status: string;
    tax_class: string;
    manage_stock: boolean;
    stock_quantity: number | null;
    stock_status: 'instock' | 'outofstock' | 'onbackorder';
    backorders: string;
    backorders_allowed: boolean;
    backordered: boolean;
    sold_individually: boolean;
    weight: string;
    dimensions: {
        length: string;
        width: string;
        height: string;
    };
    shipping_required: boolean;
    shipping_taxable: boolean;
    shipping_class: string;
    shipping_class_id: number;
    reviews_allowed: boolean;
    average_rating: string;
    rating_count: number;
    related_ids: number[];
    upsell_ids: number[];
    cross_sell_ids: number[];
    parent_id: number;
    purchase_note: string;
    categories: WCCategory[];
    tags: any[];
    images: WCImage[];
    attributes: WCAttribute[];
    default_attributes: any[];
    variations: number[];
    grouped_products: number[];
    menu_order: number;
    meta_data: WCMetaData[];
    _links?: any;
}

export interface WCProductsResponse {
    products: WCProduct[];
    total: number;
    totalPages: number;
}

export interface WCErrorResponse {
    code: string;
    message: string;
    data: {
        status: number;
    };
}
