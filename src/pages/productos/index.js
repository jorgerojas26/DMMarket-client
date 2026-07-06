import CostFluctuationCard from "components/Cards/CostFluctuation";
import GroupStock from "components/Cards/GroupStock";
import ProductCostPerGroup from "components/ProductCostPerGroup/Card";
import Container from "react-bootstrap/Container";

const ProductosPage = () => {
    return (
        <Container fluid className="p-4">
            <div className="d-flex flex-column flex-xl-row justify-content-center gap-3">
                <div className="col-12 col-xl-4">
                    <CostFluctuationCard />
                </div>
                <div className="col-12 col-xl-4">
                    <GroupStock />
                </div>
                <div className="col-12 col-xl-4">
                    <ProductCostPerGroup />
                </div>
            </div>
        </Container>
    );
};

export default ProductosPage;
