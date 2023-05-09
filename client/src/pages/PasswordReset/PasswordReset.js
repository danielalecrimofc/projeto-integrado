import React, { useState } from 'react';
import { TextField, Button,Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Email } from '@material-ui/icons';

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


export const PasswordReset = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui será feito a lógica para enviar o email de redefinição de senha para o usuário
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
      <div>
        <h2 style={{color:'azure',marginBottom:'1rem',}}>Insira o email correspondente a sua conta</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="email"
            label="Email"
            type="email"
            required
            pattern="^[a-z0-9]+([._]?[a-z0-9]+)*@gmail\.com$"
            value={email}
            className={classes.root}
            style={{ backgroundColor: "rgb(24, 12, 12,0.8)" , borderRadius: "5px"}}
            InputLabelProps={{
              style: { color: "white"}
            }}
            inputProps={{
              style: {color: "white"},
            }}
            onInput={(e) => {
              const isValid = e.target.checkValidity();
              if (!isValid) {
                e.target.setCustomValidity('');
                e.target.title =
                  "Por favor, insira um e-mail válido do Gmail (somente letras, números e pontos são permitidos, e o endereço deve terminar com '@gmail.com'";
              } else {
                e.target.setCustomValidity('');
                e.target.title = '';
              }
              setEmail(e.target.value);
              e.target.reportValidity();
            }}
            onChange={handleChange}
            InputProps={{
              startAdornment: <Email style={{color:'azure'}} />,
            }}
          />
          <Grid container justify="center">
            <Button 
            type="submit" 
            variant="contained"
            color="primary"
            style={{ marginTop: "1rem",background: "linear-gradient(45deg, #006400, #00FF00)"}}>
              Enviar
            </Button>
          </Grid>
        </form>
      </div>
    </div>
  );
};

  
  export default PasswordReset;