import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Container, Row, Col } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
];

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/eve.json")
      .then((response) => response.json())
      .then((data) => {
        try {
          const groupedData = data.reduce((acc, item) => {
            const signature = item.alert;
            if (!acc[signature]) {
              acc[signature] = {
                signature: signature,
                count: 0,
                severity: item.alert,
              };
            }
            acc[signature].count++;
            return acc;
          }, {});
          console.log("hello");
          const chartData = Object.values(groupedData);
          setData(chartData);
        } catch (error) {
          console.log("errorr",error);
        }
      })
      .catch((error) => console.error("Error fetching the data:", error));
  }, []);

  return (
    <Container fluid className="App">
      <Row>
        <Col>
          <h1 className="text-center text-light">Dashboard</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <div className="chart-container">
            <h3 className="text-light">Signature Counts</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="signature" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8">
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
        <Col md={6}>
          <div className="chart-container">
            <h3 className="text-light">Severity Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="severity"
                  nameKey="signature"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="chart-container">
            <h3 className="text-light">Alerts Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="signature" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
