import React, { useState, useEffect } from "react";
import backgroundImage from "./images/background.png";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState(0);
  const [itens, setItens] = useState([]);
  const [notaFiscal, setNotaFiscal] = useState(null);
  const [tipoNota, setTipoNota] = useState("nfe"); // "nfe" or "nfse"
  const [nomeServico, setNomeServico] = useState("");

  const [irrf, setIrrf] = useState(5);
  const [pis, setPis] = useState(1.65);
  const [cofins, setCofins] = useState(7.6);
  const [inss, setInss] = useState(7.5); // Valor inicial para o INSS
  const [issqn, setIssqn] = useState(2);
  const [csll, setCsll] = useState(9);
  const [icms, setIcms] = useState(7); // Valor inicial para o INSS
  const [ipi, setIpi] = useState(6);
  const [fcp, setFcp] = useState(2);

  useEffect(() => {
    const data = [
      { codigo: "001", descricao: "Bota de Couro", ncm: "6404.20.00" },
      { codigo: "002", descricao: "Capa de Chuva", ncm: "3926.20.00" },
      { codigo: "003", descricao: "Óculos de Sol", ncm: "9004.10.00" },
      { codigo: "004", descricao: "Mochila", ncm: "4202.92.00" },
      { codigo: "005", descricao: "Relógio de Pulso", ncm: "9101.11.00" },
      { codigo: "006", descricao: "Tênis Esportivo", ncm: "6404.11.00" },
      { codigo: "007", descricao: "Jaqueta de Couro", ncm: "4201.00.10" },
      { codigo: "008", descricao: "Chapéu de Palha", ncm: "6504.00.10" },
      { codigo: "009", descricao: "Luvas de Proteção", ncm: "6116.10.00" },
      { codigo: "010", descricao: "Cinto de Segurança", ncm: "8708.21.00" }
    ];
    setProdutos(data);
  }, []);

  const handleAddItem = () => {
    if (!produtoSelecionado || valorUnitario <= 0 || quantidade <= 0) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const produto = produtos.find((prod) => prod.codigo === produtoSelecionado);
    const total = valorUnitario * quantidade;

    setItens((prevItens) => [
      ...prevItens,
      {
        ...produto,
        quantidade,
        valorUnitario,
        total
      }
    ]);

    setProdutoSelecionado("");
    setQuantidade(1);
    setValorUnitario(0);
  };

  const handleAddService = () => {
    if (!nomeServico || valorUnitario <= 0) {
      alert("Preencha todos os campos corretamente.");
      return;
    }
  
    const total = valorUnitario;
  
    setItens((prevItens) => [
      ...prevItens,
      {
        descricao: nomeServico,
        quantidade: 1,
        valorUnitario,
        total
      }
    ]);
  
    setNomeServico("");
    setValorUnitario(0);
  };
  

  const gerarNumeroNotaFiscal = () => {
    return Math.floor(100000000 + Math.random() * 900000000); // Gera um número aleatório de 9 dígitos
  };

  const gerarSerieNotaFiscal = () => {
    return Math.floor(100 + Math.random() * 900); // Gera um número aleatório de 3 dígitos
  };

  const calcularNotaFiscal = () => {
    const valorTotal = itens.reduce((acc, item) => acc + item.total, 0);

    // Garante valores numéricos padrão
    const impostosValidos = {
        irrf: irrf || 0,
        pis: pis || 0,
        cofins: cofins || 0,
        issqn: issqn || 0,
        csll: csll || 0,
        icms: icms || 0,
        ipi: ipi || 0,
        fcp: fcp || 0,
    };

    const calculos = {
        irrf: tipoNota === "nfse" ? (valorTotal * impostosValidos.irrf) / 100 : 0,
        pis: (valorTotal * impostosValidos.pis) / 100,
        cofins: (valorTotal * impostosValidos.cofins) / 100,
        issqn: tipoNota === "nfse" ? (valorTotal * impostosValidos.issqn) / 100 : 0,
        csll: tipoNota === "nfse" ? (valorTotal * impostosValidos.csll) / 100 : 0,
        icms: tipoNota === "nfe" ? (valorTotal * impostosValidos.icms) / 100 : 0,
        ipi: tipoNota === "nfe" ? (valorTotal * impostosValidos.ipi) / 100 : 0,
        fcp: tipoNota === "nfe" ? (valorTotal * impostosValidos.fcp) / 100 : 0,
    };

    const totalImpostos = Object.values(calculos).reduce((acc, val) => acc + val, 0);

    setNotaFiscal({
        numeroNotaFiscal: gerarNumeroNotaFiscal(),
        serieNotaFiscal: gerarSerieNotaFiscal(),
        valorTotal,
        impostos: calculos,
        totalImpostos,
        valorFinal: valorTotal + totalImpostos,
    });
};


  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Emissão de Nota Fiscal</h1>

      <div style={styles.card}>
        <h2>Tipo de Nota</h2>
        <div style={styles.inputGroup}>
          <label>
            <input
              type="radio"
              name="tipoNota"
              value="nfe"
              checked={tipoNota === "nfe"}
              onChange={() => setTipoNota("nfe")}
            />
            NF-e
          </label>
          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              name="tipoNota"
              value="nfse"
              checked={tipoNota === "nfse"}
              onChange={() => setTipoNota("nfse")}
            />
            NFS-e
          </label>
        </div>
      </div>

      {tipoNota === "nfe" && (
        <div style={styles.card}>
          <h2>Adicionar Produto</h2>
          <select
            value={produtoSelecionado}
            onChange={(e) => setProdutoSelecionado(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Escolha um Produto --</option>
            {produtos.map((produto) => (
              <option key={produto.codigo} value={produto.codigo}>
                {produto.descricao} (NCM: {produto.ncm})
              </option>
            ))}
          </select>
          <div style={styles.inputGroup}>
            <label>Quantidade:</label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min="1"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Valor Unitário:</label>
            <input
              type="number"
              value={valorUnitario}
              onChange={(e) => setValorUnitario(Number(e.target.value))}
              min="0"
              style={styles.input}
            />
          </div>
          <button style={styles.button} onClick={handleAddItem}>
            Adicionar Produto
          </button>
        </div>
      )}

      {tipoNota === "nfse" && (
        <div style={styles.card}>
          <h2>Adicionar Serviço</h2>
          <div style={styles.inputGroup}>
            <label>Nome do Serviço:</label>
            <input
              type="text"
              value={nomeServico}
              onChange={(e) => setNomeServico(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Valor Unitário:</label>
            <input
              type="number"
              value={valorUnitario}
              onChange={(e) => setValorUnitario(Number(e.target.value))}
              min="0"
              style={styles.input}
            />
          </div>
          <button style={styles.button} onClick={handleAddService}>
            Adicionar Serviço
          </button>
        </div>
      )}


      <div style={styles.card}>
        <h2>Itens Adicionados</h2>
        <ul>
          {itens.map((item, index) => (
            <li key={index} style={styles.item}>
              {item.descricao} - Quantidade: {item.quantidade}, Valor Unitário: {" "}
              {item.valorUnitario.toFixed(2)}, Total: {item.total.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.card}>
        <h2>Configuração de Impostos</h2>
        {tipoNota === "nfe" && (
          ["IRRF", "PIS", "COFINS", "ICMS", "IPI", "FCP"].map((tax, i) => (
            <div style={styles.inputGroup} key={i}>
              <label>{tax} (%):</label>
              <input
                type="number"
                value={
                  tax === "IRRF"
                    ? irrf
                    : tax === "PIS"
                      ? pis
                      : tax === "COFINS"
                        ? cofins
                        : tax === "ICMS"
                          ? icms
                          : tax === "IPI"
                            ? ipi
                            : fcp // Para FCP
                }
                onChange={(e) =>
                  tax === "IRRF"
                    ? setIrrf(Number(e.target.value))
                    : tax === "PIS"
                      ? setPis(Number(e.target.value))
                      : tax === "COFINS"
                        ? setCofins(Number(e.target.value))
                        : tax === "ICMS"
                          ? setIcms(Number(e.target.value))
                          : tax === "IPI"
                            ? setIpi(Number(e.target.value))
                            : setFcp(Number(e.target.value)) // Para FCP
                }
                min="0"
                style={styles.input}
              />
            </div>
          ))
        )}
        {tipoNota === "nfse" && (
          ["ISS", "ISSQN", "pis", "cofins", "irrf", "csll", "inss"].map((tax, i) => (
            <div style={styles.inputGroup} key={i}>
              <label>{tax.toUpperCase()} (%):</label>
              <input
                type="number"
                value={
                  tax === "ISSQN"
                    ? issqn
                    : tax === "pis"
                      ? pis
                      : tax === "cofins"
                        ? cofins
                        : tax === "irrf"
                          ? irrf
                          : tax === "csll"
                            ? csll
                            : inss // Default for INSS
                }
                onChange={(e) => {
                  const value = Number(e.target.value);
                  tax === "ISSQN"
                    ? setIssqn(value)
                    : tax === "pis"
                      ? setPis(value)
                      : tax === "cofins"
                        ? setCofins(value)
                        : tax === "irrf"
                          ? setIrrf(value)
                          : tax === "csll"
                            ? setCsll(value)
                            : setInss(value); // Default for INSS
                }}
                min="0"
                style={styles.input}
              />
            </div>
          ))
        )}
      </div>

      <div style={styles.card}>
        <h2>Cálculo de Nota Fiscal</h2>
        <button style={styles.button} onClick={calcularNotaFiscal} aria-label="Gerar Nota Fiscal">
          Gerar Nota Fiscal
        </button>
        {notaFiscal && (
          <div style={styles.notaFiscal}>
            <h3>
              Nota Fiscal: {notaFiscal.numeroNotaFiscal}
              <br />
              Série: {notaFiscal.serieNotaFiscal}
            </h3>
            <p>Valor Total (Itens): R$ {notaFiscal.valorTotal.toFixed(2)}</p>
            <p>IRRF: R$ {notaFiscal.impostos.irrf.toFixed(2)}</p>
            <p>PIS: R$ {notaFiscal.impostos.pis.toFixed(2)}</p>
            <p>COFINS: R$ {notaFiscal.impostos.cofins.toFixed(2)}</p>
            <p>ISSQN: R$ {notaFiscal.impostos.issqn.toFixed(2)}</p>
            <p>ICMS: R$ {notaFiscal.impostos.icms.toFixed(2)}</p>
            <p>CSLL: R$ {notaFiscal.impostos.csll.toFixed(2)}</p>
            <p>Total de Impostos: R$ {(
              notaFiscal.impostos.irrf +
              notaFiscal.impostos.pis +
              notaFiscal.impostos.cofins +
              notaFiscal.impostos.issqn +
              notaFiscal.impostos.icms +
              notaFiscal.impostos.csll
            ).toFixed(2)}</p>
            <p>Valor Final (com Impostos): R$ {notaFiscal.valorFinal.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Open Sans, sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100vw",
    minHeight: "100vh",
    color: "#ff722a",
    margin: "0",
    padding: "0",
    boxSizing: "border-box",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    paddingBottom: "20px",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginTop: "20px",
  },
  card: {
    width: "80%",
    maxWidth: "600px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    margin: "20px 0",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    opacity: 0.95,
  },
  select: {
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  inputGroup: {
    margin: "10px 0",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#337ab7",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  },
  item: {
    padding: "5px 0",
    borderBottom: "1px solid #ddd",
  },
  notaFiscal: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ff722a",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
};

export default App;