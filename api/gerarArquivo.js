const fs = require("fs");
const path = require("path");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { nomeArquivo, conteudo } = req.body;

  try {
    const filePath = path.join(process.cwd(), "public", nomeArquivo);
    fs.writeFileSync(filePath, conteudo, "utf8");

    return res.status(200).json({ message: "Arquivo gerado com sucesso", path: `/public/${nomeArquivo}` });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao gerar o arquivo", error });
  }
}
