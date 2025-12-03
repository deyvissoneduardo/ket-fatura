import React, { useState, useRef } from "react";
import parsePdfTextToItemsFromContent from "../utils/parsePdf";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).href;

export default function PDFReader() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleProcess = () => {
    const file = fileRef.current.files[0];
    if (!file) {
      alert("Por favor, selecione um arquivo PDF.");
      return;
    }

    const reader = new FileReader();
    setItems([]);
    setLoading(true);

    reader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;

        let extracted = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          const pageItems = parsePdfTextToItemsFromContent(textContent);

          extracted = extracted.concat(pageItems);
        }

        setItems(extracted);
      } catch (err) {
        console.error(err);
        alert("Erro ao processar o PDF.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="application/pdf" />
      <button onClick={handleProcess}>Ler Fatura</button>

      {loading && (
        <p className="loading" style={{ display: "block" }}>
          Processando...
        </p>
      )}

      <table id="resultTable">
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Valor (R$)</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Nenhum item identificado.
              </td>
            </tr>
          ) : (
            items.map((it, idx) => (
              <tr key={idx}>
                <td>{it.date}</td>
                <td>{it.description}</td>
                <td>{it.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
