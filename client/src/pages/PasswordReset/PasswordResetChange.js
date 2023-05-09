    import React, { useState } from 'react';
    import { TextField, Button, Grid } from '@material-ui/core';
    import { makeStyles } from '@material-ui/core/styles';
    import { Lock } from '@material-ui/icons';

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

    const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui será feita a lógica para atualizar a senha do usuário
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
    type="password"
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
    }}
    />
    <TextField
    fullWidth
    id="confirmPassword"
    label="Confirme a Nova Senha"
    type="password"
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