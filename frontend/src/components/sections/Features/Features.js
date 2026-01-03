import Container from '../../layout/Container';
import Card, { CardBody } from '../../ui/Card'; // Importamos nuestra Card reutilizable
import './Features.css';

const Features = () => {
  const services = [
    {
      title: "Diseño Gráfico",
      description: "No solo hago que se vea bien. Como publicista, diseño identidades visuales pensadas para conectar y vender."
    },
    {
      title: "Desarrollo Web Funcional",
      description: "Construyo la presencia digital de tu marca con código limpio (HTML/CSS/JS) y estructuras sólidas."
    },
    {
      title: "Visión E-commerce",
      description: "Entiendo el negocio detrás de la web. Mi experiencia en ventas online asegura que tu sitio tenga un propósito."
    }
  ];

  return (
    <section id="servicios" className="features section">
      <Container>
        <div className="features__header text-center mb-5">
          <h2>Lo que aporto a tu proyecto</h2>
        </div>

        <div className="features__grid">
          {services.map((service, index) => (
            <Card key={index} className="features__card h-100">
              <CardBody>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-text">{service.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;