import React, { useState,useEffect } from 'react';
import { TextField, Grid, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle, Email, Lock } from '@material-ui/icons';
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Cookies from 'js-cookie';

const useStyles = makeStyles({
  root: {
    backgroundColor: "rgb(24, 12, 12,0.8)",
    borderRadius: "5px",
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
    '& .MuiInputBase-input:focus': {
      color: 'white',
    },
    '& .MuiInputBase-input:hover::before': {
      borderBottomColor: 'white',
    }
  },
});

export const User = () => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const API_URL_PUT_NAME = "http://localhost:3001/user/name";
  const API_URL_PUT_EMAIL = "http://localhost:3001/user/email";
  const API_URL_PUT_PASS = "http://localhost:3001/user/pass";
  const API_URL_GET = "http://localhost:3001/user";
  const AUTH_TOKEN = Cookies.get('token');

  const handleClickOldShowPassword = () => {
    console.log(showOldPassword);
    setShowOldPassword(!showOldPassword);
  };
  const handleClickNewShowPassword = () => {
    console.log(showNewPassword);
    setShowNewPassword(!showNewPassword);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNameSave = () => {
         axios.put(API_URL_PUT_NAME,
         { name }, 
         { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
         )
        .then(response => {
          // código para lidar com a resposta do servidor
          toast.success("Nome Alterado com Sucesso => " + response.data.user.name);
        })
        .catch(error => {
          // código para lidar com o erro da requisição
          if (error.response && error.response.data && error.response.data.message) {
            toast.error("Erro ao Atualizar nome do Usuário! => " + error.response.data.message);
          } else {
            toast.error("Erro ao Atualizar nome do Usuário! => " + error);
          }
        });
  };
  

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailSave = () => {
    // Save email no server
    axios.put(API_URL_PUT_EMAIL,
      { email }, 
      { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
      )
     .then(response => {
       // código para lidar com a resposta do servidor
       toast.success("Email Alterado com Sucesso => " + response.data.user.email);
     })
     .catch(error => {
       // código para lidar com o erro da requisição
       // código para lidar com o erro da requisição
       if (error.response && error.response.data && error.response.data.message) {
        toast.error("Erro ao Atualizar email do Usuário! => " + error.response.data.message);
      } else {
        toast.error("Erro ao Atualizar email do Usuário! => " + error);
      }
     });
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handlePasswordSave = () => {
    // Aqui será feita a lógica para salvar as alterações de senha do perfil do usuário
    // Faz a requisição para atualizar a senha no servidor
  axios
  .put(
    API_URL_PUT_PASS,
    { oldPassword, newPassword },
    { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
  )
  .then((response) => {
    // Código para lidar com a resposta do servidor
    toast.success(response.data.message);
  })
  .catch((error) => {
    // Código para lidar com o erro da requisição
    console.error(error);
    if (error.response && error.response.data && error.response.data.message) {
      toast.error("Erro ao Atualizar a senha do Usuário! => " + error.response.data.message);
    } else {
      toast.error("Erro ao Atualizar a senha do Usuário! => " + error);
    }
  });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(API_URL_GET, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        });
        setName(response.data.name_user);
        setEmail(response.data.email);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
      <div>
        <h2 style={{color:'azure',marginBottom:'1rem'}}>Meu Perfil</h2>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="name"
                label="Nome"
                required
                value={name}
                className={classes.root}
                pattern="^[\p{L}\p{M}'-]+(?: [\p{L}\p{M}'-]+)*$"
                onInput={(e) => {
                  console.log("onInput sendo chamado")
                  const isValid = e.target.checkValidity();
                  console.log(isValid)
                  if (!isValid) {
                    e.target.setCustomValidity("");
                    e.target.title = "O nome deve conter apenas letras e espaços, com no mínimo 2 e no máximo 50 caracteres";
                  } else {
                    e.target.setCustomValidity("");
                    e.target.title = "";
                  }
                  setName(e.target.value);
                  e.target.reportValidity();
                }}
                style={{ backgroundColor: "rgb(24, 12, 12,0.8)" , borderRadius: "5px"}}
                InputLabelProps={{
                  style: { color: "white"}
                }}
                inputProps={{
                  style: {color: "white"},
                }}
                onChange={handleNameChange}
                InputProps={{
                  startAdornment: <AccountCircle style={{color:'azure'}} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <IconButton
              className={classes.iconButton}
              onClick={handleNameSave}
              disabled={!name}
              style={{background: "linear-gradient(45deg, #006400, #00FF00)"}}
              >
              <SaveIcon style={{ color:'azure'}} />
              </IconButton>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                label="E-mail"
                type="email"
                required
                value={email}
                className={classes.root}
                pattern="^[a-z0-9]+([._]?[a-z0-9]+)*@gmail\.com$"
                onInput={(e) => {
                  console.log("onInput sendo chamado")
                  const isValid = e.target.checkValidity();
                  console.log(isValid)
                  if (!isValid) {
                    e.target.setCustomValidity("");
                    e.target.title = "Por favor, insira um e-mail válido do Gmail (somente letras, números e pontos são permitidos, e o endereço deve terminar com '@gmail.com'";
                  } else {
                    e.target.setCustomValidity("");
                    e.target.title = "";
                  }
                  setEmail(e.target.value);
                  e.target.reportValidity();
                }}
                style={{ backgroundColor: "rgb(24, 12, 12,0.8)" , borderRadius: "5px", marginTop: "1rem"}}
                InputLabelProps={{
                  style: { color: "white"}
                }}
                inputProps={{
                  style: {color: "white"},
                }}
                onChange={handleEmailChange}
                InputProps={{
                  startAdornment: <Email style={{color:'azure'}} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <IconButton
              className={classes.iconButton}
              onClick={handleEmailSave}
              style={{ marginTop: "1rem",background: "linear-gradient(45deg, #006400, #00FF00)"}}
              disabled={!email}
              >
              <SaveIcon style={{ color:'azure'}} />
              </IconButton>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="oldPassword"
                label="Senha atual"
                type={showOldPassword ? 'text' : 'password'}
                required
                value={oldPassword}
                className={classes.root}
                style={{ backgroundColor: "rgb(24, 12, 12,0.8)" , borderRadius: "5px", marginTop: "1rem"}}
                InputLabelProps={{
                  style: { color: "white"}
                }}
                inputProps={{
                  style: {color: "white"},
                }}
                onChange={handleOldPasswordChange}
                InputProps={{
                  startAdornment: <Lock style={{color:'azure'}} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickOldShowPassword}>
                        {showOldPassword ? <Visibility style={{color:'azure'}} /> : <VisibilityOff style={{color:'azure'}} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                id="newPassword"
                label="Nova senha"
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                className={classes.root}
                style={{ backgroundColor: "rgb(24, 12, 12,0.8)" , borderRadius: "5px", marginTop: "1rem"}}
                InputLabelProps={{
                  style: { color: "white"}
                }}
                inputProps={{
                  style: {color: "white"},
                }}
                onChange={handleNewPasswordChange}
                InputProps={{
                  startAdornment: <Lock style={{color:'azure'}} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickNewShowPassword}>
                        {showNewPassword ? <Visibility style={{color:'azure'}} /> : <VisibilityOff style={{color:'azure'}} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <IconButton
              className={classes.iconButton}
              onClick={handlePasswordSave}
              style={{ marginTop: "2.8rem",background: "linear-gradient(45deg, #006400, #00FF00)"}}
              disabled={!oldPassword || !newPassword}
              >
              <SaveIcon style={{ color:'azure'}} />
              </IconButton>
            </Grid>
          </Grid>
        </form>
        </div>
        <ToastContainer/>
        </div>
   );
};
            
export default User;
