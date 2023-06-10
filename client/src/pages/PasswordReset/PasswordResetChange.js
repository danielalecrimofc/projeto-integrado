    import React, { useState } from 'react';
    import { TextField, Button, Grid , InputAdornment } from '@material-ui/core';
    import { makeStyles } from '@material-ui/core/styles';
    import IconButton from "@material-ui/core/IconButton";
    import { Visibility, VisibilityOff } from "@material-ui/icons";
    import { Lock } from '@material-ui/icons';
    import axios from "axios";
    //para pegar o token que vai ser passado no parâmetro na rota de definição de senha
    import { ToastContainer,toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import { useParams } from 'react-router-dom';
    import { useNavigate } from 'react-router-dom';

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

    export const PasswordResetChange = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    // declara o token que vai ser pego no useParams
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showFirstPassword, setShowFirstPassword] = useState(false);
    const [showSecondPassword, setShowSecondPassword] = useState(false);

    const handleClickFirstShowPassword = () => {
        console.log(showFirstPassword);
        setShowFirstPassword(!showFirstPassword);
      };
      const handleClickSecondShowPassword = () => {
        console.log(showSecondPassword);
        setShowSecondPassword(!showSecondPassword);
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
      
        // Verifica se as senhas são iguais
        if (password !== confirmPassword) {
          // Exibe uma mensagem de erro
          toast.error('As senhas não são iguais.');
          return;
        }
      
      
        try {
          // Faz a requisição POST para atualizar a senha do usuário
          const response = await axios.put('http://localhost:3001/change-password', {
            newPassword: password,
            token: token,
          });
      
          // Exibe uma mensagem de sucesso
          toast.success(response.data.message);

          // Aguarda 1 segundo antes de navegar para a página de login
            setTimeout(() => {
            navigate('/login');
          }, 4000);
        } catch (error) {
          // Exibe uma mensagem de erro
          toast.error('Ocorreu um erro ao atualizar a senha.');
        }
      };
      

    const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    };

    return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
     <div>
        <h2 style={{color:'azure',marginBottom:'1rem',}}>Insira sua nova senha</h2>
        <form onSubmit={handleSubmit}>
            <TextField
            fullWidth
            id="password"
            label="Nova Senha"
            type={showFirstPassword ? 'text' : 'password'}
            required
            value={password}
            className={classes.root}
            style={{ backgroundColor: "rgb(24, 12, 12,0.8)" , borderRadius: "5px"}}
            InputLabelProps={{
            style: { color: "white"}
            }}
            inputProps={{
            style: {color: "white"},
            }}
            onChange={handlePasswordChange}
            InputProps={{
            startAdornment: <Lock style={{color:'azure'}} />,
            endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickFirstShowPassword}>
                    {showFirstPassword ? <Visibility style={{color:'azure'}} /> : <VisibilityOff style={{color:'azure'}} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            />
            <TextField
            fullWidth
            id="confirmPassword"
            label="Confirme a Nova Senha"
            type={showSecondPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            className={classes.root}
            style={{ backgroundColor: "rgb(24, 12, 12,0.8)" , borderRadius: "5px", marginTop: "1rem"}}
            InputLabelProps={{
            style: { color: "white"}
            }}
            inputProps={{
            style: {color: "white"},
            }}
            onChange={handleConfirmPasswordChange}
            InputProps={{
            startAdornment: <Lock style={{color:'azure'}} />,
            endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickSecondShowPassword}>
                    {showSecondPassword ? <Visibility style={{color:'azure'}} /> : <VisibilityOff style={{color:'azure'}} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            />
            <Grid container justify="center">
            <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "1rem",background: "linear-gradient(45deg, #006400, #00FF00)"}}>
            Atualizar
            </Button>
            </Grid>
        </form>
     </div>
     <ToastContainer/>
    </div>
  );
};

export default PasswordResetChange;