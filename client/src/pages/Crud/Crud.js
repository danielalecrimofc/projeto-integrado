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
  InputAdornment,
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import axios from "axios";
import Cookies from 'js-cookie';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-input": {
      color: "white",
    },
    "& .MuiInputLabel-filled": {
      color: "white",
      "&.MuiInputLabel-shrink": {
        transform: "translate(12px, 8px)",
      },
    },
    "& .MuiFilledInput-underline:before": {
      borderBottom: "none",
    },
    "& .MuiFilledInput-root": {
      "&.Mui-focused": {
        "& fieldset": {
          borderColor: "white",
          borderWidth: "1px",
        },
      },
    },
  },
}));


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
  const [services,setServices] = React.useState([]);
  const classes = useStyles();
  //url do endpoint que pega todos os serviços do usuário
  const API_URL = "http://localhost:3001/service";
  //url do endpoint que cadastra um novo serviço para usuário
  const API_URL_POST = "http://localhost:3001/services";
  //url do endpoint que edita um  serviço para usuário
  const API_URL_PUT = "http://localhost:3001/services";
  //url do endpoint que deleta um  serviço para usuário
  const API_URL_DELETE = "http://localhost:3001/services";

  // Pegando o token de autenticação  para poder fazer as requisições para o usuário
  const AUTH_TOKEN = Cookies.get('token');
  
  //Função para mostrar os dados atualizados na tela de crud
 const fetchServices = React.useCallback(async () => {
    try {
      const response = await axios.get(API_URL,{
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
      });
      
      console.log(response.data);
      setServices(response.data);
      //console.log(response);
    } catch (error) {
      console.error(error);
    }
  }, [AUTH_TOKEN]);
 
  console.log(services);
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
    handleEditService(editService.id_service);
    handleCloseEditModal();
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
     // Se o campo que foi alterado é o valor, faz a conversão
  if (name === "value") {
    const floatValue = parseFloat(value.replace(",", ".")).toFixed(2);
    setService((prevService) => ({ ...prevService, [name]: floatValue}));
  } else {
    setService((prevService) => ({ ...prevService, [name]: value }));
  }
  };

  const handleSaveService = () => {
    if (!service.name || !service.description || !service.status || !service.value) {
      alert("Por favor Preencha todos os campos");
      return;
    }
    axios.post(
      API_URL_POST,
      { ...service },
      { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
    )
      .then((response) => {
        setServices((prevServices) => [...prevServices, response.data]);
        setService(initialService);
        setOpenModal(false);
        console.log(services);
        fetchServices();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  

  const handleEditService = (id) => {
    axios.put(
      API_URL_PUT,
      {...editService},
      { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
    )
    
      .then((response) => {
        const editedServiceIndex = services.findIndex((service) => service.id === id);
        const editedService = response.data;
        console.log(editedService);
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
    if (name === "value") {
      const floatValue = parseFloat(value.replace(",", ".")).toFixed(2);
      setEditService((prevService) => ({ ...prevService, [name]: floatValue}));
    } else {
      setEditService((prevService) => ({ ...prevService, [name]: value }));
    }
    console.log(service);
  };

  const handleDeleteService = (id,name) => {
    console.log(id);
    axios.delete(
      API_URL_DELETE,
      { 
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        data: { id_service: id , name_service:name}
      }
    )
     .then((response) => {
        if (response.status === 200) {
          const newServices = services.filter((service) => service.id_service !== id);
          setServices(newServices);
          fetchServices();
        }
      })
      .catch((error) => {
        console.error(error.response.status);
        console.error(error.response.data);
        console.error(error);
      });
  };

  const generateServiceReports = () => {
    const pendingServices = services.filter(service => service.status_service === 'Pendente');
    const inProgressServices = services.filter(service => service.status_service === 'Em Andamento');
    const completedServices = services.filter(service => service.status_service === 'Realizado');
    
    window.alert('Quantidade de Serviços Pendentes: ' + pendingServices.length
    + "\n" +  'Quantidade de Serviços em Andamento: ' + inProgressServices.length + "\n" +
    'Quantidade de Serviços Realizados: ' + completedServices.length);

    };
  
  /*function validateNumber(event) {
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
  };*/

  /*const CustomInput = (props) => {
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
  };*/
  const isNotUnique = (services) => {
    const duplicateServices = [];
    console.log(services);
    //console.log("services", services);
    for (let i = 0; i < services.length; i++) {
      for (let j = i + 1; j < services.length; j++) {
        if (services[i].id_service === services[j].id_service) {
          console.log(services);
          duplicateServices.push(services[i]);
          duplicateServices.push(services[j]);
          console.log("Há serviços com IDs duplicados:", duplicateServices);
        }
      }
    }
   
    return duplicateServices;
  };

  //console.log(services);
  React.useEffect(() => {
   //console.log('chamou o useEffect com o fetchServices');
   fetchServices();
  }, [fetchServices]);
  /*React.useEffect(() => {
    console.log('chamou o useEffect com o fetchServices');
    const fetchServices = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });
  
        console.log(response.data);
        console.log(services);
        setServices([...response.data]);
        console.log(services); // adicionar console.log aqui
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchServices();
  }, [AUTH_TOKEN, setServices]);*/
  
  /*React.useEffect(() => {
   console.log(services);
  }, [services]);*/
  console.log(services);
 if (isNotUnique(services)) {
    const duplicateServices = isNotUnique(services);
    console.log(duplicateServices);
  }
  


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
            variant="filled"
            value={searchTerm}
            className= {classes.root}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{marginTop: "1rem", backgroundColor: "rgb(24, 12, 12,0.8)" , borderRadius: "6px"}}
            InputLabelProps={{
              style: { color: "white"}
            }}
            inputProps={{
              style: {color: "white"}
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={generateServiceReports}
            style={{ marginTop: "1rem",background: "linear-gradient(45deg, #006400, #00FF00)"}}
          >
            Gerar Relatório[STATUS]
          </Button>
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
                .filter((service) => {
                    const searchTermNormalized = unidecode(searchTerm.toLowerCase() || '');
                    if (!searchTermNormalized) {
                        return true; // Retorna true para mostrar todos os serviços se não houver um searchTerm
                    }
                    const serviceNameNormalized = unidecode(service.name_service.toLowerCase());
                    return serviceNameNormalized.includes(searchTermNormalized);
                  })
                  .map((service) => (
                    //Aqui na TableRow coloquei o service.id_service + 1 para não dar conflito de ids duplicados
                      <TableRow key={service.id_service + 1}>
                          <TableCell >{service.id_service}</TableCell>
                          <TableCell >{service.name_service}</TableCell>
                          <TableCell >{service.description_service}</TableCell>
                          <TableCell >{service.status_service}</TableCell>
                          <TableCell >R$ {service.value_service}</TableCell>
                          <TableCell>
                              <IconButton onClick={() => handleOpenEditModal(service)}>
                                  <Edit />
                              </IconButton>
                              <IconButton onClick={() => handleDeleteService(service.id_service,service.name_service)}>
                                  <Delete />
                              </IconButton>
                          </TableCell>
                      </TableRow>
                  ))
                }
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
                    <MenuItem value="Em andamento">Em andamento</MenuItem>
                    <MenuItem value="Realizado">Realizado</MenuItem>
                </Select>
            </FormControl>
            <TextField
            label="Valor"
            name="value"
            value={service.value ? service.value : ""}
            onChange={handleInputChange}
            type="text"
            margin="normal"
            variant="outlined"
            inputProps={{
              min: 0,
              max: 9999999999.99,
              step: 0.01,
              onFocus: (event) => {
                event.target.select();
              },
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              inputMode: "numeric",
              pattern: "[0-9]*",
              title: "Coloque um valor permitido",
              placeholder: "0.00",
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
                <MenuItem value="Em andamento">Em andamento</MenuItem>
                <MenuItem value="Realizado">Realizado</MenuItem>
            </Select>
            </FormControl>
            <TextField
            label="Valor"
            name="value"
            value={editService ? editService.value: '' }
            onChange={handleEditInputChange}
            type="text"
            margin="normal"
            variant="outlined"
            inputProps={{
              min: 0,
              max: 9999999999.99,
              step: 0.01,
              onFocus: (event) => {
                event.target.select();
              },
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              inputMode: "numeric",
              pattern: "[0-9]*",
              title: "Coloque um valor permitido",
              placeholder: "0.00",
            }}
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