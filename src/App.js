import React, { useState, useEffect } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState(0);
  const [itens, setItens] = useState([]);
  const [notaFiscal, setNotaFiscal] = useState(null);

  const [irpf, setIrpf] = useState(5); 
  const [pis, setPis] = useState(1.65);
  const [cofins, setCofins] = useState(7.6);
  const [ISS, setISS] = useState(5);
  const [issqn, setIssqn] = useState(2);

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

  const calcularNotaFiscal = () => {
    const valorTotal = itens.reduce((acc, item) => acc + item.total, 0);

    const calculos = {
      irpf: (valorTotal * irpf) / 100,
      pis: (valorTotal * pis) / 100,
      cofins: (valorTotal * cofins) / 100,
      ISS: (valorTotal * ISS) / 100,
      issqn: (valorTotal * issqn) / 100
    };

    const totalImpostos =
      calculos.irpf + calculos.pis + calculos.cofins + calculos.ISS + calculos.issqn;

    setNotaFiscal({
      valorTotal,
      impostos: calculos,
      totalImpostos,
      valorFinal: valorTotal + totalImpostos
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Emissão de Nota Fiscal</h1>

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
        <div style={styles.inputGroup}>
          <label>IRPF (%):</label>
          <input
            type="number"
            value={irpf}
            onChange={(e) => setIrpf(Number(e.target.value))}
            min="0"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>PIS (%):</label>
          <input
            type="number"
            value={pis}
            onChange={(e) => setPis(Number(e.target.value))}
            min="0"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>COFINS (%):</label>
          <input
            type="number"
            value={cofins}
            onChange={(e) => setCofins(Number(e.target.value))}
            min="0"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>ISS (%):</label>
          <input
            type="number"
            value={ISS}
            onChange={(e) => setISS(Number(e.target.value))}
            min="0"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>ISSQN (%):</label>
          <input
            type="number"
            value={issqn}
            onChange={(e) => setIssqn(Number(e.target.value))}
            min="0"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.card}>
        <h2>Cálculo de Nota Fiscal</h2>
        <button style={styles.button} onClick={calcularNotaFiscal}>
          Gerar Nota Fiscal
        </button>
        {notaFiscal && (
          <div style={styles.notaFiscal}>
            <h3>Nota Fiscal</h3>
            <p>Valor Total (Produtos): R$ {notaFiscal.valorTotal.toFixed(2)}</p>
            <p>IRPF: R$ {notaFiscal.impostos.irpf.toFixed(2)}</p>
            <p>PIS: R$ {notaFiscal.impostos.pis.toFixed(2)}</p>
            <p>COFINS: R$ {notaFiscal.impostos.cofins.toFixed(2)}</p>
            <p>ISS: R$ {notaFiscal.impostos.ISS.toFixed(2)}</p>
            <p>ISSQN: R$ {notaFiscal.impostos.issqn.toFixed(2)}</p>
            <p>Total de Impostos: R$ {notaFiscal.totalImpostos.toFixed(2)}</p>
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
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    color: "#333"
  },
  header: {
    textAlign: "center",
    color: "#ff722a"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    margin: "20px 0",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  select: {
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ddd"
  },
  inputGroup: {
    margin: "10px 0"
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd"
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#337ab7",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  item: {
    padding: "5px 0",
    borderBottom: "1px solid #ddd"
  },
  notaFiscal: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ff722a",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9"
  }
};

export default App;
