import { useEffect, useState } from "react";
import productService from "../service/productService";
import ProductCard from "../component/product";
import { useNavigate } from "react-router-dom";
import orderService from "../service/orderService";

function NewOrder() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadProducts();
  }, []);
  const handleAddProduct = (product) => {
    setSelectedProducts((prev) => [
      ...prev,
      { product: product._id, quantity: 1 },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const orderData = {
        products: selectedProducts,
        status: "pending",
      };
      await orderService.createOrder(orderData);
      alert("ההזמנה נוצרה בהצלחה!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("שגיאה ביצירת ההזמנה");
    }
  };

  return (
    <div className="container mt-4">
      <h2>בחר מוצרים להזמנה</h2>
      <div className="row">
        {products.map((p) => (
          <div key={p._id} className="col-md-4 d-flex justify-content-center">
            <ProductCard product={p} onAdd={handleAddProduct} />
          </div>
        ))}
      </div>

      {selectedProducts.length > 0 && (
        <div className="text-center mt-4">
          <button className="btn btn-success" onClick={handleSubmit}>
            שלח הזמנה
          </button>
        </div>
      )}
    </div>
  );
}

export default NewOrder;
