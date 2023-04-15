import { LayoutHome } from "../../components/LayoutHome";
import unidecode from 'unidecode';
import 'react-intl';
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import axios from "axios";
import Cookies from 'js-cookie';

const initialService = {
  name: "",
  description: "",
  status: "Pendente",
  value: "",
};

export const Crud = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const [service, setService] = React.useState(initialService);
  const [editService, setEditService] = React.useState(null);
  const [editModal, setEditModal] = React.useState(false);
  const [services, setServices] = React.useState([]);

  //url do endpoint que pega todos os serviços do usuário
  const API_URL = "http://localhost:3001/services";
  //url do endpoint que cadastra um novo serviço para usuário
  const API_URL_POST = "http://localhost:3001/services";
  //url do endpoint que edita um  serviço para usuário
  const API_URL_PUT = "http://localhost:3001/services/:id";
  //url do endpoint que deleta um  serviço para usuário
  const API_URL_DELETE = "http://localhost:3001/services/:id";

  // Pegando o token de autenticação  para poder fazer as requisições para o usuário
  const AUTH_TOKEN = Cookies.get('token');

  //Função para mostrar os dados atualizados na tela de crud
  const fetchServices = React.useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/services`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
      });
      setServices(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [AUTH_TOKEN]);
  

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenEditModal = (service) => {
    setEditService(service);
    setEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
  };


  const handleSaveEditService = () => {
    handleEditService(editService.id);
    handleCloseEditModal();
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setService((prevService) => ({ ...prevService, [name]: value }));
  };

  const handleSaveService = () => {
    axios.post(
      API_URL_POST,
      { ...service, id: Math.floor(Math.random() * 100000) },
      { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
    )
      .then((response) => {
        setServices((prevServices) => [...prevServices, response.data]);
        setService(initialService);
        setOpenModal(false);
        fetchServices();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditService = (id) => {
    axios.put(
      `${API_URL_PUT}/${id}`,
      editService,
      { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
    )
      .then((response) => {
        const editedServiceIndex = services.findIndex((s) => s.id === id);
        const editedService = response.data;
        const newServices = [...services];
        newServices.splice(editedServiceIndex, 1, editedService);
        setServices(newServices);
        setEditService(null);
        setEditModal(false);
        fetchServices();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditService((prevService) => ({ ...prevService, [name]: value }));
    console.log(service);
  };

  const handleDeleteService = (id) => {
    axios.delete(
      `${API_URL_DELETE}/${id}`,
      { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
    )
      .then((response) => {
        if (response.status === 200) {
          const newServices = services.filter((s) => s.id !== id);
          setServices(newServices);
          fetchServices();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  function validateNumber(event) {
    const value = parseFloat(event.target.value);
    const maxValue = 9999999999.99;
  
    if (value > maxValue) {
      alert("O valor inserido é maior que o máximo permitido.");
      event.target.value = maxValue; // Define o valor máximo permitido
    }
  }
  
  const inputProps = {
    min: 0,
    max: 9999999999.99,
    step: 10.00,
    onChange: validateNumber
  };

  const CustomInput = (props) => {
    const { inputRef, onChange, onBlur, ...other } = props;
  
    const formatValue = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      }).format(value);
    };
  
    return (
      <input
        {...other}
        ref={inputRef}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          onChange({
            target: {
              name: props.name,
              value: value,
            },
          });
        }}
        onBlur={onBlur}
        value={formatValue(props.value)}
      />
    );
  };
  
  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  


  return (
    <LayoutHome>
      <div >
        <div style={{ display: "flex"}}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            style={{ marginTop: "1rem",background: "linear-gradient(45deg, #006400, #00FF00)"}}
          >
            Cadastrar Serviço
          </Button>
          <TextField
            label="Pesquisar"
            variant="outlined"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{marginTop: "1rem", backgroundColor: "rgb(24, 12, 12,0.8)" , borderRadius: "6px"}}
            InputLabelProps={{
              style: { color: "white"}
            }}
    
          />
        </div>
          <TableContainer component={Paper} style={{marginTop:'auto' , marginBottom: 16,overflowX:"auto"}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services
                  .filter((service) =>
                  unidecode(service.name.toLowerCase()).includes(unidecode(searchTerm.toLowerCase()))
                  )
                  .map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.id}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>{service.status}</TableCell>
                      <TableCell>{service.value}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenEditModal(service)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteService(service.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        <Modal open={openModal} onClose={handleCloseModal}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 5,
            }}
          >
            <h2>Cadastrar Serviço</h2>
            <TextField
              label="Nome"
              name="name"
              value={service.name}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <TextField
            label="Descrição"
            name="description"
            value={service.description}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            fullWidth
            />
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={service.status}
                    onChange={handleInputChange}
                    label="Status"
                >
                    <MenuItem value="Pendente">Pendente</MenuItem>
                    <MenuItem value="Realizado">Realizado</MenuItem>
                </Select>
            </FormControl>
            <TextField
            label="Valor"
            name="value"
            value={service.value}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            variant="outlined"
            inputProps={{
              inputcomponent: CustomInput,
              ...inputProps
            }}
            fullWidth
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
                color="secondary"
                variant="outlined"
                style={{ marginRight: 16 }}
                onClick={handleCloseModal}
            >
                Cancelar
            </Button>
            <Button
                color="primary"
                variant="contained"
                onClick={handleSaveService}
            >
                Salvar
            </Button>
        </div>
      </div>
    </Modal>
    <Modal open={editModal} onClose={handleCloseEditModal}>
        <div
            style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 5,
            }}
        >
            <h2>Editar Serviço</h2>
            <TextField
            label="Nome"
            name="name"
            value={editService ? editService.name : ''}
            onChange={handleEditInputChange}
            margin="normal"
            variant="outlined"
            fullWidth
            />
            <TextField
            label="Descrição"
            name="description"
            value={editService ? editService.description : ''}
            onChange={handleEditInputChange}
            margin="normal"
            variant="outlined"
            fullWidth
            />
            <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
                name="status"
                value={editService ? editService.status : ''}
                onChange={handleEditInputChange}
                label="Status"
            >
                <MenuItem value="Pendente">Pendente</MenuItem>
                <MenuItem value="Realizado">Realizado</MenuItem>
            </Select>
            </FormControl>
            <TextField
            label="Valor"
            name="value"
            value={editService ? editService.value: '' }
            onChange={handleEditInputChange}
            type="number"
            margin="normal"
            variant="outlined"
            inputProps={inputProps}
            fullWidth
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
                color="secondary"
                variant="outlined"
                style={{ marginRight: 16 }}
                onClick={handleCloseEditModal}
            >
                Cancelar
            </Button>
            <Button
                color="primary"
                variant="contained"
                onClick={handleSaveEditService}
            >
                Salvar
            </Button>
            </div>
        </div>
    </Modal>
  </div>
</LayoutHome>
);
};

export default Crud;