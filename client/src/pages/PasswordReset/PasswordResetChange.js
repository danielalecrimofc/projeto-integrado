    import React, { useState } from 'react';
    import { TextField, Button, Grid , InputAdornment } from '@material-ui/core';
    import { makeStyles } from '@material-ui/core/styles';
    import IconButton from "@material-ui/core/IconButton";
    import { Visibility, VisibilityOff } from "@material-ui/icons";
    import { Lock } from '@material-ui/icons';
    import axios from "axios";

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
    const classes = useStyles();
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
          alert('As senhas não são iguais.');
          return;
        }
      
        // Verifica se a senha segue o padrão
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/;
        if (!passwordPattern.test(password)) {
          // Exibe uma mensagem de erro
          alert('A senha deve ter no mínimo 9 caracteres e conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial.');
          return;
        }
      
        try {
          // Faz a requisição POST para atualizar a senha do usuário
          const response = await axios.post('http://localhost:3001/change-password', {
            newPassword: password,
          });
      
          // Exibe uma mensagem de sucesso
          alert(response.data.message);
        } catch (error) {
          // Exibe uma mensagem de erro
          alert('Ocorreu um erro ao atualizar a senha.');
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
    </div>
  );
};

export default PasswordResetChange;