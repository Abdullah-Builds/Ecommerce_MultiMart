import { Col, Container, Row } from "react-bootstrap";
import FilterSelect from "../components/FilterSelect";
import { Fragment, useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import { products as productsApi, category } from "../api/index.js";
import ProductCard from "../components/ProductCard/ProductCard.jsx";
import axios from "axios";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [allproducts, setallproducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const { data } = await category.getAllCategories({
          signal: controller.signal,
        });

        console.log("API response:", data);

        // data is already an array (based on the log you sent)
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            value: item.category_id,
            label: item.category_name,
          }));

          setCategories(mapped);
        }
      } catch (err) {
        if (!axios.isCancel(err)) console.error(err);
      }
    })();

    (async () => {
      try {
        const { data } = await productsApi.getproducts();
        setProducts(data.data);
        setallproducts(data.data);
      } catch {
        setProducts([]);
      }
    })();
    return () => controller.abort();
  }, []);

  // Make changes in backend
  const handleCategoryChange = async (categoryId) => {
    console.log("Selected category:", categoryId);
    console.log("Length", products.length);
    console.log(products);
    setProducts([]);

    if (!categoryId) {
      setProducts(allproducts);
      return;
    }

    try {
      //product id search
      const { data } = await productsApi.getProductbyID(categoryId);
      console.log(data);
      setProducts(data);
    } catch {
      setProducts(allproducts);
    }
  };

  useWindowScrollToTop();

  return (
    <Fragment>
      <Banner title="product" />

      <section className="filter-bar">
        <Container className="filter-bar-contianer">
          <Row className="justify-content-center">
            <Col md={4}>
              <FilterSelect onCategoryChange={handleCategoryChange} />
            </Col>
          </Row>
        </Container>
        <section style={{ backgroundColor: "#f6f9fc" }}>
          <Container>
            <Row className="justify-content-center">
              {products.length > 0 ? (
                products.map((p) => (
                  <ProductCard key={p.product_id} product={p} />
                ))
              ) : (
                <h4 style={{ textAlign: "center", marginTop: "40px" }}>
                  No products available
                </h4>
              )}
            </Row>
          </Container>
        </section>
      </section>
    </Fragment>
  );
};

export default Shop;
