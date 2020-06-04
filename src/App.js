import React, { useState, useEffect } from "react";
import "./App.css";
import { Query2, Query1 } from "./info";
import * as ReactBootStrap from "react-bootstrap";
import * as Scroll from "react-scroll";
import StatusAPI from "./API/StatusAPI";

const App = () => {
  const [realData, setRealData] = useState();
  const [type, setType] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [timer, setTimer] = useState(60);

  const scrollLib = Scroll.animateScroll;

  useEffect(() => {
    (async () => {
      await StatusAPI.get("/Reporte1")
        .then((data) => {
          // console.log(data)
          setRealData(data.data);
          setLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  useEffect(() => {
    const timerId = setInterval(async () => {
      if (timer <= 0) {
        if (type === 0) {
          setTimer(240);
        } else {
          setTimer(80);
        }
        if (type === 0) {
          scrollLib.scrollToTop();
          setLoaded(false);
          await StatusAPI.get("/Reporte2")
            .then((data) => {
              setRealData(data.data);
              console.log(data.data);
            })
            .then(() => {
              setLoaded(true);
              setType(1);
            });
          scrollLib.scrollToBottom({
            delay: 2000,
            duration: 240000,
            isDynamic: true,
            smooth: "linear",
          });
        } else {
          scrollLib.scrollToTop();
          setLoaded(false);
          await StatusAPI.get("/Reporte1").then((data) => {
            console.log(data.data);
            setRealData(data.data);
            setLoaded(true);
            setType(0);
          });
        }
      } else {
        setTimer((x) => x - 1);
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [timer, type, scrollLib]);

  const renderRow2 = (row, index) => {
    return (
      <tr key={index}>
        <td>{row.NumDoc}</td>
        <td>{row.NumArt}</td>
        <td>{row.Desc}</td>
        <td>{row.CantOr}</td>
        <td>{row.CantPend}</td>
        <td>{row.Stock}</td>
        <td>{row.PrecioU}</td>
        <td>{row.Moneda}</td>
        <td>{row.Fecha}</td>
        <td>{row.NomEmpleado}</td>
      </tr>
    );
  };

  const renderRow1 = (row, index) => {
    return (
      <tr key={index}>
        <td> {row.Folio} </td>
        <td> {row.FCreacion} </td>
        <td> {row.FVencimiento} </td>
        <td> {row.Cod} </td>
        <td> {row.Cliente} </td>
        <td> {row.Referencia} </td>
        <td> {row.Comentario} </td>
        <td> {row.Vendedor} </td>
      </tr>
    );
  };

  if (loaded) {
    return (
      <div>
        <ReactBootStrap.Table striped bordered hover>
          <thead>
            {type === 0 ? (
              <tr>
                <th>Folio</th>
                <th>FCreacion</th>
                <th>FVencimiento</th>
                <th>Cod</th>
                <th>Cliente</th>
                <th>Referencia</th>
                <th>Comentario</th>
                <th>Vendedor</th>
              </tr>
            ) : (
              <tr>
                <th>Numero de Documento</th>
                <th>Numero de Articulo</th>
                <th>Descripcion</th>
                <th>Cantidad Original</th>
                <th>Cantidad Pendiente</th>
                <th>Stock</th>
                <th>Precio Unitario</th>
                <th>Moneda</th>
                <th>Fecha</th>
                <th>Nombre de Empleado</th>
              </tr>
            )}
          </thead>
          <tbody>
            {type === 0 ? realData.map(renderRow1) : realData.map(renderRow2)}
          </tbody>
        </ReactBootStrap.Table>
        {/* <h1> {timer} </h1>
        <h1> {type} </h1> */}
      </div>
    );
  } else {
    return <h1>Cargando...</h1>;
  }
};

export default App;
