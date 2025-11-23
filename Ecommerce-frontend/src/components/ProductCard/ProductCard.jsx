import { Col } from "react-bootstrap";
import "./product-card.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const router = useNavigate();

  const handelAdd = () => {
  const normalized = {
    ...product,
    id: product.product_id,     
    name: product.product_name, 
  };

  dispatch(addToCart({ product: normalized, num: 1 }));
  toast.success("Product has been added to cart!");
};

  return (
    <Col md={3} sm={5} xs={10} className="product mtop">
      {product?.stock >= 0 && (
        <span className="discount">{product?.price * 0.05}% Off</span>
      )}

      <img
        loading="lazy"
        src={product?.image_url}
        alt={product?.product_name}
      />

      <div className="product-like">
        <ion-icon name="heart-outline"></ion-icon>
      </div>

      <div className="product-details">
        <h3>{product?.product_name}</h3>
        <h4>{product?.description}</h4>

        <div className="rate">
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
        </div>

        <div className="price">
          <h4>${product?.price}</h4>
          <button className="add" onClick={handelAdd}>
            <ion-icon name="add"></ion-icon>
          </button>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
