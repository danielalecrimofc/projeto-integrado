import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import "./ContentHome.css";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color:"#fff"
  },
  slide: {
    padding: "50px",
    [theme.breakpoints.down("xs")]: {
      padding: "20px",
    },
  },
  button: {
    color: "#fff",
    borderColor: "#fff",
    margin: "10px",
    '&:hover': {
      backgroundColor: "#fff",
      color: "#000",
    },
  },
  activeButton: {
    backgroundColor: "#fff",
    color: "#000",
  },
}));

export const ContentHome = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <AutoPlaySwipeableViews
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        <div className={classes.slide}>
          <section className="about">
            <h2>Sobre o Serv+</h2>
            <p>
              O Serv+ é uma aplicação web para cadastro de serviços. Ele é destinado a profissionais que precisam de uma agenda para se organizar na realização de seus serviços.
            </p>
          </section>
        </div>
        <div className={classes.slide}>
          <section className="features">
            <h2>Recursos</h2>
            <ul>
              <li>Cadastro de serviços</li>
              <li>Edição e exclusão de serviços</li>
              <li>Agenda para visualização dos serviços cadastrados</li>
              <li>Notificação por e-mail para serviços cadastrados,excluídos ou editados</li>
            </ul>
          </section>
        </div>
        <div className={classes.slide}>
          <section className="how-to-use">
            <h2>Como utilizar o Serv+</h2>
            <ol>
              <li>Cadastre um novo serviço com a nome,descrição,status e valor</li>
              <li>Visualize os serviços cadastrados na agenda</li>
              <li>Edite ou exclua os serviços conforme necessário</li>
            </ol>
          </section>
        </div>
        <div className={classes.slide}>
          <section className="benefits">
            <h2>Benefícios</h2>
            <ul>
              <li>Melhor organização dos serviços</li>
              <li>Aumento da produtividade</li>
              <li>Redução do estresse</li>
              <li>Melhoria na satisfação dos clientes</li>
            </ul>
          </section>
        </div>
        <div className={classes.slide}>
          <section className="requirements">
          <h2>Requisitos</h2>
            <ul>
              <li>Navegador web moderno (recomendamos Google Chrome ou Edge)</li>
              <li>Acesso à internet</li>
            </ul>
          </section>
        </div>
      </AutoPlaySwipeableViews>
      <AppBar position="static" className="appbar" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
        <Toolbar>
          <Button
            className={`${classes.button} ${
              activeStep === 0 && classes.activeButton
            }`}
            onClick={() => handleStepChange(0)}
          >
            Sobre
          </Button>
          <Button
            className={`${classes.button} ${
              activeStep === 1 && classes.activeButton
            }`}
            onClick={() => handleStepChange(1)}
          >
            Recursos
          </Button>
          <Button
            className={`${classes.button} ${
              activeStep === 2 && classes.activeButton
            }`}
            onClick={() => handleStepChange(2)}
          >
            Como utilizar
          </Button>
          <Button
            className={`${classes.button} ${
              activeStep === 3 && classes.activeButton
            }`}
            onClick={() => handleStepChange(3)}
          >
            Benefícios
          </Button>
          <Button
            className={`${classes.button} ${
              activeStep === 4 && classes.activeButton
            }`}
            onClick={() => handleStepChange(4)}
          >
            Requisitos
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default ContentHome;
