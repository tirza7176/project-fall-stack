import httpService from "./httpservice";

async function getProducts() {
    const { data } = await httpService.get("/products")
    return data
}

const productService = {
    getProducts
}

export default productService;