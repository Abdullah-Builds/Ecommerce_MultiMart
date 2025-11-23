import { useEffect, useState } from "react";
import { products as productsApi } from "../api/index";
import axios from "axios";
import { Container, Row } from "react-bootstrap";
import ProductCard from "./ProductCard/ProductCard";

const Section = ({ title, bgColor }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const { data } = await productsApi.getproducts({
          signal: controller.signal,
        });

        if (data?.data?.length > 0) {
          setList(data.data);
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(err);
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <section style={{ background: bgColor }}>
      <Container>
        <div className="heading">
          <h1>{title}</h1>
        </div>

        <Row className="justify-content-center">
          {list.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
            />
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Section;
