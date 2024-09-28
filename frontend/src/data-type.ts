export interface signUp {
    id: number,
    name: string,
    email: string,
    password: string
}
export interface logIn {
    id: number,
    email: string,
    password: string
}

export interface product {
    name: string,
    price: number,
    category: string,
    color: string,
    description: string,
    image: string,
    id: number,
    quantity: number | undefined
    productId: number | undefined
    sellerId?: number;
    sellerName?: string;
}

export interface cart {
    name: string,
    price: number,
    // category: string,
    // color: string,
    // description: string,
    image: string,
    id?: number | undefined,
    quantity: number | undefined,
    productId: number,
    userId: number
}

export interface priceSummary {
    price: number,
    discount: number,
    tax: number,
    delivery: number,
    total: number
}

export interface orderUserInformation {
    fullname: string,
    email: string,
    phonenumber: string,
    address: string,
    city: string,
    zipcode: number,
    country: string
}

export interface order {
    fullname: string,
    email: string,
    address: string,
    phonenumber: string,
    priceSummary: number,
    paymentMethod: string,
    userId: number | undefined,
    id: number | undefined,
    city: string,
    zipcode: number,
    country: string,
    orderDate: Date
}

