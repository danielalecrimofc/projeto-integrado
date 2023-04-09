import { LayoutHome } from "../../components/LayoutHome";
import unidecode from 'unidecode';
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
  const [services, setServices] = React.useState(
    JSON.parse(localStorage.getItem("services")) || []
  );
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
    const newService = { ...service, id: Date.now() };
    setServices((prevServices) => [...prevServices, newService]);
    setService(initialService);
    setOpenModal(false);
  };

  const handleEditService = (id) => {
    const editedServiceIndex = services.findIndex((s) => s.id === id);
    const editedService = { ...services[editedServiceIndex], ...editService };
    const newServices = [...services];
    newServices.splice(editedServiceIndex, 1, editedService);
    setServices(newServices);
    setEditService(null);
    setEditModal(false);
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditService((prevService) => ({ ...prevService, [name]: value }));
    console.log(service);
  };

  const handleDeleteService = (id) => {
    const newServices = services.filter((s) => s.id !== id);
    setServices(newServices);
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

  React.useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
    localStorage.clear();
  }, [services]);


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
            inputProps={inputProps}
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
            value={editService ? editService.value : ''}
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