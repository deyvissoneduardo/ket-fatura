// Reconstrói linhas do PDF usando coordenadas Y
function groupByLines(items) {
  const lines = {};

  items.forEach(i => {
    const y = Math.round(i.transform[5]); // posição Y
    const x = i.transform[4];             // posição X

    if (!lines[y]) lines[y] = [];
    lines[y].push({ x, str: i.str });
  });

  // ordena linhas de cima para baixo
  const sortedY = Object.keys(lines).sort((a, b) => b - a);

  return sortedY.map(y => {
    // ordena textos dentro da linha, da esquerda para a direita
    const ordered = lines[y].sort((a, b) => a.x - b.x);
    return ordered.map(o => o.str).join(" ");
  });
}

export default function parsePdfTextToItemsFromContent(textContent) {
  const lines = groupByLines(textContent.items);

  const items = [];

  // regex para capturar qq formato Data / Descrição / Valor
  const regex = /(\d{2}\/\d{2}\/?\d{0,4})\s+(.*?)\s+(\d+[\.,]\d{2})/;

  lines.forEach(line => {
    const match = line.match(regex);
    if (match) {
      items.push({
        date: match[1],
        description: match[2].trim(),
        amount: match[3]
      });
    }
  });

  return items;
}
