import { useState, useEffect } from "react";
import { Card, Col } from "react-bootstrap";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { analytics } from "../../api";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

export default function StocksChart() {
  const [stockData, setStockData] = useState([]);
  const [totalAmt, setTotalAmt] = useState(0); // <<< FIXED

  useEffect(() => {
    async function fetchStock() {
      const res = await analytics.getStock();
      const raw = res?.data?.stock || [];

      const formatted = raw.map((item) => ({
        name: item.category_name,
        value: item.total,
      }));

      const total = raw.reduce((sum, item) => sum + item.total, 0);

      setStockData(formatted);
      setTotalAmt(total);  // <<< FIXED
    }

    fetchStock();
  }, []);

  return (
    <Col xs={12} md={4}>
      <Card className="h-100 shadow-sm">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">Stock Share by Category</small>
            <div className="mt-2">
              {stockData.map((item, i) => (
                <div key={i} className="d-flex align-items-center gap-2">
                  {/* Color indicator */}
                  <span
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      backgroundColor: COLORS[i % COLORS.length],
                      borderRadius: 3,
                    }}
                  ></span>

                  <span>
                    {item.name}:{" "}
                    {totalAmt > 0
                      ? ((item.value / totalAmt) * 100).toFixed(1) + "%"
                      : "0%"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: 90, height: 90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={24}
                  outerRadius={36}
                  startAngle={90}
                  endAngle={-270}
                >
                  {stockData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
