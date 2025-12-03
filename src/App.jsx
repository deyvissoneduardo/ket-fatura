import React from 'react'
import PDFReader from './components/PDFReader'

export default function App() {
  return (
    <div className="container">
      <h1>📑 Leitor de Fatura Bancária (React)</h1>
      <p>Selecione o PDF da sua fatura para extrair os itens.</p>
      <PDFReader />
    </div>
  )
}
