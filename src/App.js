import { useEffect, useContext } from 'react';

import { CurrencyRateContext } from './context/currency_rate';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

import InvoicesPage from 'pages/invoices';
import VentasPage from 'pages/ventas';
import ClientesPage from 'pages/clientes';
import ProductosPage from 'pages/productos';
import EmployeesPage from 'pages/employees';
import CategoriesPage from './pages/categories';

import { ShowNoeContext } from 'context/show_noe';

import { Link, Switch, Route, useLocation } from 'react-router-dom';
import { fetchCurrencyRates } from './api/currency_rates';

function App() {
    const location = useLocation();
    const { currencyRate, setCurrencyRate } = useContext(CurrencyRateContext);
    const { showNoe, setShowNoe } = useContext(ShowNoeContext);

    useEffect(() => {
        fetchCurrencyRates().then((response) => {
            if (response.status === 200) {
                setCurrencyRate(response.data.find((currency) => currency.Simbolo === 'BsS'));
            }
        });
    }, []);

    return (
        <div className='App bg-dark'>
            <Container fluid id='main' className='m-0 p-0 vh-100'>
                <Navbar bg='dark' variant='dark' className='border-bottom' expand='lg'>
                    <Container fluid>
                        <Navbar.Brand>SISTEMA DE REPORTES</Navbar.Brand>

                        <Navbar.Toggle aria-controls='basic-navbar-nav' />
                        <Navbar.Collapse id='basic-navbar-nav'>
                            <Container fluid className='d-flex gap-5 justify-content-between align-items-center'>
                                <Nav className='me-auto'>
                                    {['facturas', 'ventas', 'clientes', 'productos', 'vendedores', 'categorias'].map(
                                        (route, index) => {
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
                                        },
                                    )}
                                </Nav>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <span className='text-light'>Facturas</span>
                                    <div>
                                        <label className='switch'>
                                            <input
                                                type='checkbox'
                                                checked={showNoe}
                                                onChange={(e) => setShowNoe(e.target.checked)}
                                            />
                                            <span className='slider round'></span>
                                        </label>
                                    </div>
                                    <span className='text-light'>Notas de entrega</span>
                                </div>
                                <div className='text-light'>
                                    <span>
                                        REF: <span className='fw-bold text-info'>{currencyRate?.Cambio}</span>{' '}
                                        {currencyRate?.Simbolo}
                                    </span>
                                </div>
                            </Container>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Container fluid className='py-3'>
                    <Switch>
                        <Route path='/categorias' component={CategoriesPage} />
                        <Route path='/facturas' component={InvoicesPage} />
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
