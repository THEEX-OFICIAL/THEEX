export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { nomeArquivo, conteudo } = req.body;

  const repo = 'NOME_DO_REPOSITORIO'; // Ex: meu-repo
  const owner = 'SEU_USUARIO_GITHUB'; // Ex: victorUser
  const path = `api/v1/${nomeArquivo}`; // Caminho dentro do repositório
  const token = 'SEU_TOKEN_GITHUB'; // ⚠️ Mantenha seguro - nunca expose no client
  const branch = 'main';

  const base64Content = Buffer.from(conteudo).toString('base64');

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'vercel-app',
      },
      body: JSON.stringify({
        message: `Criando arquivo ${nomeArquivo}`,
        content: base64Content,
        branch: branch,
      }),
    });

    const data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return res.status(200).json({ message: 'Arquivo criado com sucesso', data });
    } else {
      return res.status(response.status).json({ message: 'Erro ao criar o arquivo', error: data });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
}
