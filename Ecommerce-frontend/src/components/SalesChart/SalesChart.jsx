
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Button } from "react-bootstrap";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { analytics } from "../../api/index";

export default function SalesChart() {
  const [salesData, setSalesData] = useState([]);
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    async function fetchSales() {
      const response1 = await analytics.getUsersInfo();
      const response2 = await analytics.getUsers();

      if( response2?.data){
         setMetrics({users_today :  response2?.data?.users_today,users_before_today : response2?.data?.users_before_today});
      }

      const raw = response1?.data?.sales;

      if(response1?.data?.sales){

        const grouped = {};
  
        raw.forEach(item => {
          const day = item.date.slice(0, 10); // "YYYY-MM-DD"
  
          if (!grouped[day]) {
            grouped[day] = item.total;
          } else {
            grouped[day] += item.total;
          }
        });
  
        const formatted = Object.keys(grouped).map(date => ({
          name: date,
          value: grouped[date]
        }));
  
        setSalesData(formatted);
      }

      
    }

    fetchSales();
  }, []);

  return (
    <Card className="mb-4 shadow-sm overflow-hidden">
      <Row className="g-0">
        <Col md={7} className="p-4 d-flex flex-column justify-content-between">
          <div>
            <h5 className="mb-1">Total Users</h5>
            <div className="d-flex align-items-baseline">
              <h2 className="me-3 mb-0">{metrics.users_today }</h2>
              <div className="text-success small">
                ▲ {metrics.users_today > 0 ? ((metrics.users_before_today/metrics.users_today)*100).toFixed(1) : 0}% (Yesterday)
              </div>
            </div>
            <div className="text-muted mt-2">
              Overview of recent performance
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <Button size="sm" variant="outline-secondary">
              Month
            </Button>
            <Button size="sm" variant="secondary">
              Week
            </Button>
          </div>
        </Col>

        <Col md={5} style={{ minHeight: 220, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.9)",
              opacity: 0.95
            }}
            aria-hidden="true"
          ></div>

          <div style={{ position: "relative", height: "100%", padding: 18 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{ top: 10, right: 10, left: -30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
