import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

import VentasPage from 'pages/ventas';
import ClientesPage from 'pages/clientes';
import ProductosPage from 'pages/productos';
import EmployeesPage from 'pages/employees';

import { Link, Switch, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  return (
    <div className='App bg-dark'>
      <Container fluid id='main' className='m-0 p-0 vh-100'>
        <Navbar bg='dark' variant='dark' className='border-bottom' expand='lg'>
          <Container fluid>
            <Navbar.Brand>SISTEMA DE REPORTES</Navbar.Brand>

            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Container fluid>
                <Nav className='me-auto'>
                  {['ventas', 'clientes', 'productos', 'vendedores'].map((route, index) => {
                    return (
                      <Link
                        key={index}
                        to={`/${route}`}
                        className={`text-decoration-none mx-1 text-secondary nav-link ${
                          (location.pathname.includes(route) && 'active') || ''
                        }`}
                      >
                        <span style={{ textTransform: 'capitalize' }}>{route}</span>
                      </Link>
                    );
                  })}
                </Nav>
              </Container>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container fluid className='py-3'>
          <Switch>
            <Route path='/ventas' component={VentasPage} />
            <Route path='/clientes' component={ClientesPage} />
            <Route path='/productos' component={ProductosPage} />
            <Route path='/vendedores' component={EmployeesPage} />
          </Switch>
        </Container>
      </Container>
    </div>
  );
}

export default App;
