import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

import VentasPage from "./pages/ventas";
import ClientesPage from "./pages/clientes";
import ProductosPage from "./pages/productos";

import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [activeLink, setActiveLink] = useState("ventas");

  return (
    <div className="App bg-dark">
      <Container fluid id="main" className="m-0 p-0 vh-100">
        <Router>
          <Navbar bg="dark" variant="dark" className="border-bottom">
            <Container fluid>
              <Navbar.Brand>SISTEMA DE REPORTES</Navbar.Brand>
              <Nav
                className="me-auto"
                onClick={(event) => {
                  if (event.target.tagName === "A") {
                    setActiveLink(event.target.href);
                  }
                }}
              >
                <Link
                  to="/ventas"
                  className={`text-decoration-none text-secondary nav-link ${
                    (activeLink.includes("ventas") && "active") || ""
                  }`}
                >
                  Ventas
                </Link>
                <Link
                  to="/clientes"
                  className={`text-decoration-none text-secondary nav-link ${
                    (activeLink.includes("clientes") && "active") || ""
                  }`}
                >
                  Clientes
                </Link>
                <Link
                  to="/productos"
                  className={`text-decoration-none text-secondary nav-link ${
                    (activeLink.includes("productos") && "active") || ""
                  }`}
                >
                  Productos
                </Link>
              </Nav>
            </Container>
          </Navbar>

          <Switch>
            <Route path="/ventas" component={VentasPage} />
            <Route path="/clientes" component={ClientesPage} />
            <Route path="/productos" component={ProductosPage} />
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
