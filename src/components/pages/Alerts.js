import React, { useState, useEffect } from "react";
import Toolbar from "../Toolbar"; // Toolbar component
import "./Alerts.css"; // Import the CSS file

const Alerts = () => {
  const [medications, setMedications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [services, setServices] = useState({}); // To store service names by ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://4.211.87.132:5000/api/notifications");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("API Response:", data);

        setMedications(Array.isArray(data.medications) ? data.medications : []);
        setOrders(Array.isArray(data.incompleteOrders) ? data.incompleteOrders : []); // Ensure orders is an array
        setRequests(Array.isArray(data.requests) ? data.requests : []);

        const serviceResponse = await fetch("http://4.211.87.132:5000/api/services/all");
        if (!serviceResponse.ok) {
          throw new Error("Failed to fetch services");
        }
        const serviceData = await serviceResponse.json();
        const serviceMap = serviceData.reduce((acc, service) => {
          acc[service.servicoID] = service.nomeServico;
          return acc;
        }, {});
        setServices(serviceMap);
      } catch (error) {
        setError("Failed to load data");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="alerts-page">
      <Toolbar name="Alertas" />
      <div className="alerts-content">
        {error && <p className="error-message">{error}</p>}

        {/* Medications Section */}
        <section className="alerts-section">
          <h2>Medicamentos Em Falta</h2>
          {Array.isArray(medications) && medications.length > 0 ? (
            <div className="alerts-table-container">
              <div className="alerts-table-header">
                <div className="column">Medicamento</div>
                <div className="column">Serviço Hospitalar</div>
                <div className="column">Descricao</div>
                <div className="column">Disponivel</div>
                <div className="column">Minimo</div>
              </div>
              {medications.map((medication) => (
                <div className="alerts-table-row" key={medication.medicamentoID}>
                  <div className="column">{medication.nomeMedicamento || "N/A"}</div>
                  <div className="column">{services[medication.servicoID] || "Serviço não encontrado"}</div>
                  <div className="column">{medication.tipoMedicamento || "N/A"}</div>
                  <div className="column">{medication.quantidadeDisponivel || "N/A"}</div>
                  <div className="column">{medication.quantidadeMinima || "N/A"}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>Nao existem medicamentos em rutura de stock.</p>
          )}
        </section>

        {/* Orders Section */}
        <section className="alerts-section">
          <h2>Encomendas Pendentes</h2>
          {Array.isArray(orders) && orders.length > 0 ? (
            <div className="alerts-table-container">
              <div className="alerts-table-header">
                <div className="column">Encomenda N.º</div>
                <div className="column">Estado</div>
                <div className="column">Data de Encomenda</div>
              </div>
              {orders.map((order) => (
                <div className="alerts-table-row" key={order.encomendaID}>
                  <div className="column">{order.encomendaID}</div>
                  <div className="column">{order.encomendaCompleta ? "Completa" : "Pendente"}</div>
                  <div className="column">{new Date(order.dataEncomenda).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>Não existem encomendas pendentes.</p>
          )}
        </section>

        {/* Requests Section */}
        <section className="alerts-section">
          <h2>Requisições Pendentes</h2>
          {Array.isArray(requests) && requests.length > 0 ? (
            <div className="alerts-table-container-request">
              <div className="alerts-table-header-request">
                <div className="column">Requisição N.º</div>
                <div className="column">Nome</div>
                <div className="column">Data de Pedido</div>
                <div className="column">Estado</div>
              </div>
              {requests.map((request) => (
                <div className="alerts-table-row-request" key={request.requisicaoID}>
                  <div className="column">{request.requisicaoID}</div>
                  <div className="column">{`${request.nomeProprio} ${request.ultimoNome}`}</div>
                  <div className="column">{new Date(request.dataRequisicao).toLocaleDateString()}</div>
                  <div className="column">{request.aprovadoPorAdministrador ? "Aprovado" : "Pendente"}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>Não existem requisições pendentes.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Alerts;
