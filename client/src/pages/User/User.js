import React, { useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle, Email, Lock } from '@material-ui/icons';

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
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSaveChanges = (event) => {
    event.preventDefault();
    // Aqui será feita a lógica para salvar as alterações no perfil do usuário
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
      <div>
        <h2 style={{color:'azure',marginBottom:'1rem'}}>Meu Perfil</h2>
        <form onSubmit={handleSaveChanges}>
          <TextField
            fullWidth
            id="name"
            label="Nome"
            required
            value={name}
            className={classes.root}
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
          <TextField
            fullWidth
            id="email"
            label="E-mail"
            type="email"
            required
            value={email}
            className={classes.root}
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
          <TextField
            fullWidth
            id="password"
            label="Senha"
            type="password"
            required
            value={password}
            className={classes.root}
            style={{ backgroundColor: "rgb(24, 12, 12,0.8)" , borderRadius: "5px", marginTop: "1rem"}}
            InputLabelProps={{
              style: { color: "white"}
            }}
          inputProps={{
          style: {color: "white"},
          }}
          onChange={handlePasswordChange}
          InputProps={{
          startAdornment: <Lock style={{color:'azure'}} />,
          }}
          />
          <Grid container justify="center" style={{ marginTop: '2rem' }}>
          <Button 
          variant="contained" 
          color="primary" 
          type="submit"
          style={{ marginTop: "1rem",background: "linear-gradient(45deg, #006400, #00FF00)"}}
          >
            Salvar Alterações
          </Button>
          </Grid>
        </form>
        </div>
        </div>
   );
};
            
export default User;
