// import { Fragment, useEffect, useState } from "react";
// import Banner from "../components/Banner/Banner";
// import { Container } from "react-bootstrap";
// import ShopList from "../components/ShopList";
// import { products } from "../utils/products.jsx";
// import { useParams } from "react-router-dom";
// import ProductDetails from "../components/ProductDetails/ProductDetails";
// import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
// import {products as productsApi} from "../api/index.js";
// import axios from 'axios';

// const Product = () => {
//   const { id } = useParams();
//   console.log("Route",id)
//   const [selectedProduct,setselectedProduct] = useState({});

//     useEffect(() => {
//     const controller = new AbortController();

//     (async () => {
//       try {
//         const { data } = await productsApi.getbyCategory(id,{
//           signal: controller.signal,
//         });

//         if (data?.data?.length > 0) {
//           setselectedProduct(data.data);
//         }
//       } catch (err) {
//         if (axios.isCancel(err)) return;
//         console.error(err);
//       }
//     })();

//     return () => controller.abort();
//   }, []);














//   // const [selectedProduct, setSelectedProduct] = useState(
//   //   products.filter((item) => parseInt(item.id) === parseInt(id))[0]
//   // );
//   // const [relatedProducts, setRelatedProducts] = useState([]);
//   // useEffect(() => {
//   //   window.scrollTo(0, 0);
//   //   setSelectedProduct(
//   //     products.filter((item) => parseInt(item.id) === parseInt(id))[0]
//   //   );
//   //   setRelatedProducts(
//   //     products.filter(
//   //       (item) =>
//   //         item.category === selectedProduct?.category &&
//   //         item.id !== selectedProduct?.id
//   //     )
//   //   );
//   // }, [selectedProduct, id]);

//   useWindowScrollToTop();

//   return (
//     <Fragment>
//       <Banner title={selectedProduct?.product_name} />
//       <ProductDetails selectedProduct={selectedProduct} />
//       {/* <ProductReviews selectedProduct={selectedProduct} /> */}
//       {/* <section className="related-products">
//         <Container>
//           <h3>You might also like</h3>
//         </Container>
//         <ShopList productItems={relatedProducts} />
//       </section> */}
//     </Fragment>
//   );
// };

// export default Product;
