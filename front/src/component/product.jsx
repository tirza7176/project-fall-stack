import React from "react";

import { Card, Button } from "react-bootstrap";

function ProductCard({ product, onAdd }) {
  return (
    <Card className="shadow-sm mb-3" style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src={product.image || "https://via.placeholder.com/300x200"}
        alt={product.name}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          {product.description}
          <br />
          <strong>₪{product.price}</strong>
        </Card.Text>
        <Button variant="primary" onClick={() => onAdd(product)}>
          הוסף להזמנה
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
