import { LayoutHome } from "../../components/LayoutHome"


export const Home = () => {
    
    return(
        <LayoutHome>
            <div className="container">
      <header>
        <h1>Serv+</h1>
      </header>
      <section className="hero-section">
        <h2>Cadastre seus serviços com facilidade</h2>
        <p>Com o Serv+, você pode cadastrar diversos tipos de serviços em um só lugar, de maneira simples e fácil.</p>
        <div className="animated-line"></div>
      </section>
      <section className="how-it-works">
        <h2>Como funciona</h2>
        <ol>
          <li>Cadastre seu serviço</li>
          <li>Receba avaliações e comentários dos clientes</li>
          <li>Ganhe visibilidade e novos clientes</li>
        </ol>
      </section>
      <footer>
        <p>&copy; Serv+ 2023</p>
      </footer>
    </div>
        </LayoutHome>
    );
  }