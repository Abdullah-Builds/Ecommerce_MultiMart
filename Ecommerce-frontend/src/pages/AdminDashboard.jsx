// --- same imports as your original code ---
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Card,
  Badge,
  Table,
} from "react-bootstrap";
import { analytics } from "../api/endpoints/analyticsApi";
import SalesChart from "../components/SalesChart/SalesChart";
import StocksChart from "../components/StocksChart/StocksChart";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const PRIMARY = "#0f3460";
const LIGHT_BG = "#ffffff";

export default function AdminDashboardRB() {
  const [transactions, setTransactions] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState({});
  const [users, setUsers] = useState({});

  const safePercent = (previous, today) => {
    if (!previous || previous === 0) return 0;

    const diff = today - previous;
    const percent = (diff / previous) * 100;

    if (!isFinite(percent)) return 0;
    return Number(percent.toFixed(1));
  };

  useEffect(() => {
    (async () => {
      try {
        const revenueByCat = await analytics.getRevenueByCategory();
        const todaysRev = await analytics.getTodaysRevenue();
        const customers = await analytics.getCustomers();

        if (revenueByCat?.data) {
          const formatted = revenueByCat.data.map((d, index) => ({
            id: d.category_id || index,
            name: d.category_name,
            amount: Number(d.total_sales),
          }));
          setTransactions(formatted);
        }

        if (todaysRev?.data) setTodayRevenue(todaysRev.data);
        if (customers?.data) setUsers(customers.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const customerPercent = safePercent(
    users?.users_before_today,
    users?.users_today
  );

  const RevenuePercent = safePercent(
    todayRevenue?.yesterday,
    todayRevenue?.today
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6fb",
      }}
    >
      {/* NAVBAR */}
      <Navbar
        expand="lg"
        className="shadow-sm"
        style={{ background: PRIMARY, padding: "12px 0" }}
      >
        <Container fluid>
          <Navbar.Brand
            href="#"
            className="d-flex align-items-center"
            style={{ color: "white", fontWeight: 600 }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#ffffff33",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
              }}
            >
              VR
            </div>
            <span className="ms-2">Volt React</span>
          </Navbar.Brand>

          <Navbar.Toggle style={{ background: "#fff" }} />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              {["Overview", "Messages", "Transactions", "Settings"].map(
                (i, idx) => (
                  <Nav.Link
                    key={idx}
                    style={{ color: "white", fontWeight: 500 }}
                    href="#"
                  >
                    {i}
                  </Nav.Link>
                )
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* PAGE CONTENT */}
      <Container fluid className="p-4">
        <Row>
          {/* SIDEBAR */}
          <Col xs={12} md={3} lg={2} className="mb-4">
            <Card
              className="shadow-sm"
              style={{ background: LIGHT_BG, border: "none" }}
            >
              <Card.Body className="d-flex flex-column p-3">
                <Nav defaultActiveKey="#overview" className="flex-column">
                  <Nav.Link style={{ color: PRIMARY }} href="/admin/ListProduct">
                    List Product
                  </Nav.Link>
                  <Nav.Link style={{ color: PRIMARY }} href="#messages">
                    Messages <Badge bg="info">Pro</Badge>
                  </Nav.Link>
                  <Nav.Link style={{ color: PRIMARY }} href="/admin/category">
                    Add Category
                  </Nav.Link>
                  <Nav.Link style={{ color: PRIMARY }} href="#settings">
                    Settings
                  </Nav.Link>
                </Nav>

                <div className="mt-auto pt-3 text-muted small">
                  © {new Date().getFullYear()} Multi Mart
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* MAIN CONTENT */}
          <Col xs={12} md={9} lg={10}>
            <SalesChart />

            {/* METRICS */}
            <Row className="g-3 mb-4">
              {/* CUSTOMERS CARD — FIXED */}
              <Col xs={12} md={4}>
                <Card className="shadow-sm" style={{ border: "none" }}>
                  <Card.Body>
                    <small className="text-muted">Customers</small>

                    <h4>{users?.users_today}</h4>

                    <div className="small text-muted">
                      {new Date().toLocaleDateString()}
                    </div>

                    <div
                      className={`mt-2 small ${
                        customerPercent >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {customerPercent >= 0 ? "▲" : "▼"} {customerPercent}%
                      Since last day
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* REVENUE */}
              <Col xs={12} md={4}>
                <Card className="shadow-sm" style={{ border: "none" }}>
                  <Card.Body>
                    <small className="text-muted">Revenue</small>
                    <h4>{todayRevenue?.today}</h4>
                    <div className="small text-muted">
                      {new Date().toLocaleDateString()}
                    </div>

                     <div
                      className={`mt-2 small ${
                        RevenuePercent >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {RevenuePercent >= 0 ? "▲" : "▼"} {RevenuePercent}%
                      Since last day
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <StocksChart />
            </Row>

            {/* LOWER AREA */}
            <Row className="g-3">
              {/* TRANSACTIONS */}
              <Col lg={4}>
                <Card className="shadow-sm" style={{ border: "none" }}>
                  <Card.Body>
                    <h5>Total Sales</h5>

                    <div style={{ width: "100%", height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={transactions}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            fill="#0d9488"
                            dataKey="amount"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>User</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id}>
                            <td>{tx.id}</td>
                            <td>{tx.name}</td>
                            <td>{tx.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>

              {/* NOTIFICATIONS */}
              <Col lg={4}>
                <Card className="shadow-sm" style={{ border: "none" }}>
                  <Card.Body>
                    <h5>Notifications</h5>
                    <div className="small text-muted">
                      <div
                        className="p-2 rounded mb-2"
                        style={{ background: "#f1f5f9" }}
                      >
                        Server CPU at 65% — <span>5m ago</span>
                      </div>

                      <div
                        className="p-2 rounded mb-2"
                        style={{ background: "#f1f5f9" }}
                      >
                        New user signups increased — <span>1h ago</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
