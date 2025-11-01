import httpService from "./httpservice";

async function createOrder(orderData) {
    const { data } = await httpService.post("/order", orderData)
    return data
}

const orderService = {
    createOrder
}

export default orderService;