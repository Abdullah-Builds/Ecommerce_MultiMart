// import { Col } from "react-bootstrap";
// import "./product-card.css";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../app/features/cart/cartSlice";
// import { useEffect, useState } from "react";
// import { products as productsApi } from "../../api";
// import axios from "axios";

// const ProductCard = ({products}) => {
//   const dispatch = useDispatch();
//   const router = useNavigate();

//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     // const controller = new AbortController();
//     // (async () => {
//     //   try {
//     //     const { data } = await productsApi.getproducts({
//     //       signal: controller.signal,
//     //     });

//     //     if (data?.data?.length > 0) {
//     //       setProduct(data.data[0]);
//     //     }
//     //   } catch (err) {
//     //     if (axios.isCancel(err) || err.name === "CanceledError") return;
//     //     console.error(err);
//     //   }
//     // })();
//     setProduct(products)
//     console.log("hdkhksdha",products)
//    // return () => controller.abort();
//   }, []);

//   if (!product) return null;

//   const handelClick = () => {
//     router(`/shop/${product.product_id}`);
//   };

//   const handelAdd = () => {
//     dispatch(addToCart({ product, num: 1 }));
//     toast.success("Product has been added to cart!");
//   };

//   return (
//     <Col md={3} sm={5} xs={10} className="product mtop">
//       {product.stock >= 0 && (
//         <span className="discount">{product.price * 0.05}% Off</span>
//       )}

//       <img
//         loading="lazy"
//         onClick={handelClick}
//         src={"https://plus.unsplash.com/premium_photo-1684769161054-2fa9a998dcb6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3RhcnR1cHN8ZW58MHx8MHx8fDA%3D"}
//         alt={product.product_name}
//       />

//       <div className="product-like">
//         <ion-icon name="heart-outline"></ion-icon>
//       </div>

//       <div className="product-details">
//         <h3 onClick={handelClick}>{product.product_name}</h3>

//         <div className="rate">
//           <i className="fa fa-star"></i>
//           <i className="fa fa-star"></i>
//           <i className="fa fa-star"></i>
//           <i className="fa fa-star"></i>
//           <i className="fa fa-star"></i>
//         </div>

//         <div className="price">
//           <h4>${product.price}</h4>
//           <button
//             aria-label="Add"
//             type="submit"
//             className="add"
//             onClick={handelAdd}
//           >
//             <ion-icon name="add"></ion-icon>
//           </button>
//         </div>
//       </div>
//     </Col>
//   );
// };

// export default ProductCard;

import { Col } from "react-bootstrap";
import "./product-card.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { products } from "../../api";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const router = useNavigate();

  // const handelClick = () => {
  //   router(`/shop/${product.product_id}`);
  // };

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
