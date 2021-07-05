import './App.css';
import {useState, useEffect} from "react";
//Grado III
const NumerosEnJuego = props => (
  <button className="number"
            style={{backgroundColor: colors[props.status]}}         
            onClick={() => props.onClick(props.number, props.status)}>
              {props.number}
  </button>
);
//Grado III
const NuevoJuego = props => (  
  <div className="game-done">
    <div className="message" style={{color: props.gameStatus === 'lost' ? 'red':'green'}} > 
      {props.gameStatus === 'lost'?'Juego Terminado': 'Victoria'}
    </div>
    <button className="reiniciar" onClick={props.onClick}>Volver a Jugar</button>
  </div>
);
//Grado III
const PantallaDeEstrellas = props => (
  <>
  {utils.range(1, props.count).map(starId =>(
    <div key={starId} className="star" />
    ))}
  </>
);
//Grado II
const Juego = (props) => {
  const [dificultad, setDificultad]=useState(0)
  const [estrellas, setEstrellas]= useState(utils.random(1,dificultad));
  const [numerosDisponibles, setNumerosDisponibles]=useState(utils.range(1,9));
  const [numerosCandidatos, setNumerosCandidatos]=useState([]);
  const [segundosRestantes, setSegundosRestantes]=useState(0);
  const [nombreDeJugador,setNombreDeJugador]=useState("");
  
  
  const candidatoEquivocado= utils.sum(numerosCandidatos)>estrellas;
  const estadoDelJuego= numerosDisponibles.length === 0 ? 'won' 
        : segundosRestantes === 0 ? 'lost' : 'active';

  const reiniciarJuego=()=>{
    setEstrellas(utils.random(1,dificultad));
    setNumerosDisponibles(utils.range(1,dificultad));
    setNumerosCandidatos([]);
    setSegundosRestantes(dificultad);
  }

  useEffect(()=>{
    if(segundosRestantes>0 && numerosDisponibles.length>0){
      const timerId = setTimeout(()=>{
        setSegundosRestantes(segundosRestantes-1);
        },1000);
          return ()=> clearTimeout(timerId);
        }
      }
    );

  const estadoDelNumero = (number) => {
    if(!numerosDisponibles.includes(number)){
      return 'used'
    }if (numerosCandidatos.includes(number)){
      return candidatoEquivocado ? 'wrong': 'candidate'
    }
    return 'available'
  };

  const onNumberClick=(number, estadoActual)=>{
      if(estadoDelJuego !=='active' || estadoActual === 'used'){
        return;
      }
      const nuevoNumeroCandidato = 
        estadoActual === 'available' 
        ? numerosCandidatos.concat(number)
        : numerosCandidatos.filter(cn=>cn !== number)
        if(utils.sum(nuevoNumeroCandidato) !== estrellas){
        setNumerosCandidatos(nuevoNumeroCandidato)
          }else{
            const newAvailableNumbers= numerosDisponibles.filter(  
            n=> !nuevoNumeroCandidato.includes(n)
          );
          setEstrellas(utils.randomSumIn(newAvailableNumbers,9));
          setNumerosDisponibles(newAvailableNumbers);
          setNumerosCandidatos([]);
      }
  }; 

  return (
    <div className="game">
      <div className="help">
        Elija 1 o más números que sumen la cantidad de estrellas 
      </div>
      <div className="body">
        <div className="left">
          {estadoDelJuego!=='active' ?
            ( 
              <div>
              <NuevoJuego onClick={reiniciarJuego} gameStatus={estadoDelJuego}/>
              <input value={nombreDeJugador} 
            onChange={({ target: { value }}) => setNombreDeJugador(value)}
            className="input" placeholder="Ingresa tu nick"/>
            <input type="number" value={dificultad} 
            onChange={({ target: { value }}) => setDificultad(value)}
            className="input" placeholder="Numero de estrellas" />  
              </div>
            ) : ( 
              <PantallaDeEstrellas count={estrellas}/> 
            )}
        </div>
        <div className="right">
          {utils.range(1, dificultad).map(number=>
            <NumerosEnJuego 
            key={number} 
            number={number}
            status={estadoDelNumero(number)}
            onClick={onNumberClick}
            />
            )}
        </div>
      </div>
      <div className="timer">Tiempo restante : {segundosRestantes}</div>
      <div className="timer">Jugador: {nombreDeJugador}</div>
    </div>
  );
};

const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

const utils = {
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

//Grado I
function App() { 
  return (
    <div className="App">
      <Juego/>
    </div>
  );
}
export default App;
