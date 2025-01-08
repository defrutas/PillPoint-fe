import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Product.css';
import Toolbar from '../Toolbar';

const Product = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newMedication, setNewMedication] = useState({
    nomeMedicamento: '',
    tipoMedicamento: '',
    dataValidade: '',
    lote: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in and if the user is an admin
    const checkAdminStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
          setIsAdmin(decodedToken.isAdmin); // Set the admin status from the token
        } catch (error) {
          console.error('Failed to decode token', error);
        }
      }
    };

    const fetchMedicamentos = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/products/all');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setMedicamentos(data);
      } catch (error) {
        setError('Failed to load medicamentos data');
        console.error(error);
      }
    };

    checkAdminStatus(); // Check if the user is an admin based on the JWT token
    fetchMedicamentos(); // Fetch the medicamentos
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication({ ...newMedication, [name]: value });
  };

  const handleCreateMedication = () => {
    setShowCreateForm(true); // Open the pop-up
  };

  const submitCreateMedication = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get token from localStorage
    try {
      const response = await fetch('http://4.211.87.132:5000/api/products/new', { //O ENDPOINT PRECISA DE SER ATUALIZADO
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
        body: JSON.stringify(newMedication),
      });
      if (!response.ok) {
        throw new Error('Failed to create medication');
      }
      const createdMedication = await response.json();
      setMedicamentos([...medicamentos, createdMedication]);
      setShowCreateForm(false); // Close the form after successful creation
    } catch (error) {
      console.error('Error creating medication:', error);
    }
  };

  return (
    <div className="product-page">
      <Toolbar
        name="Medicamentos"
        buttonLabel="Adicionar Medicamento"
        onButtonClick={handleCreateMedication} // Call the function to open the pop-up
      />
      <div className="product-content">
        {error && <p>{error}</p>}
        {medicamentos.length > 0 ? (
          <div className="product-table-container">
            <div className="product-table-header">
              <div className="column">#</div>
              <div className="column">Nome</div>
              <div className="column">Tipo</div>
              <div className="column">Data de Validade</div>
              <div className="column">Lote</div>
            </div>
            {medicamentos.map((medicamento, index) => (
              <div className="product-table-row" key={index}>
                <div className="column">{medicamento.medicamentoid}</div>
                <div className="column">{medicamento.nomeMedicamento}</div>
                <div className="column">{medicamento.tipoMedicamento}</div>
                <div className="column">{medicamento.dataValidade}</div>
                <div className="column">{medicamento.lote}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há medicamentos disponíveis.</p>
        )}
      </div>

      {showCreateForm && (
        <div className="popup-overlay">
          <div className="popup-products">
            <h3>Criar Novo Medicamento</h3>
            <form className="products-form" onSubmit={submitCreateMedication}>
              <input
                className="input-product"
                type="text"
                name="nomeMedicamento"
                placeholder="Nome do Medicamento"
                value={newMedication.nomeMedicamento}
                onChange={handleInputChange}
                required
              />
              <input
                className="input-product"
                type="text"
                name="tipoMedicamento"
                placeholder="Tipo do Medicamento"
                value={newMedication.tipoMedicamento}
                onChange={handleInputChange}
                required
              />
              <input
                className="input-product"
                type="date"
                name="dataValidade"
                placeholder="Data de Validade"
                value={newMedication.dataValidade}
                onChange={handleInputChange}
                required
              />
              <input
                className="input-product"
                type="text"
                name="lote"
                placeholder="Lote"
                value={newMedication.lote}
                onChange={handleInputChange}
                required
              />
              <button onClick={submitCreateMedication}>Salvar</button>
            </form>
            <button className="close-button" onClick={() => setShowCreateForm(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
