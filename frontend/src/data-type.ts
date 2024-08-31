export interface signUp {
    name: string,
    email: string,
    password: string
}
export interface logIn {
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
}

export interface cart {
    name: string,
    price: number,
    category: string,
    color: string,
    description: string,
    image: string,
    id: number | undefined,
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
    contactno: string,
    address: string,
    city: string,
    zipcode: number,
    country: string,
    cardNumber: number,
    cardName: string,
    expiryDate: string,
    cvv: number
}

export interface order {
    fullname: string,
    email: string,
    address: string,
    contactno: string,
    priceSummary: number,
    userId: string,
    id: number | undefined,
    city: string,
    zipcode: number,
    country: string,
    cardNumber: number,
    cardName: string,
    expiryDate: string,
    cvv: number
}

