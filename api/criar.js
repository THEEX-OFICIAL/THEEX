export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { nomeArquivo, conteudo } = req.body;

  // Verificações básicas
  if (!nomeArquivo || !conteudo) {
    return res.status(400).json({ message: 'Nome do arquivo e conteúdo são obrigatórios.' });
  }

  const repo = 'THEEX';
  const owner = 'THEEX-OFICIAL';
  const path = `api/v1/${nomeArquivo}`;
  const token = process.env.GITHUB_TOKEN; // Coloque seu token em variável de ambiente na Vercel
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

    if (response.ok) {
      return res.status(200).json({ message: 'Arquivo criado com sucesso!', url: data.content.html_url });
    } else {
      return res.status(response.status).json({
        message: 'Erro ao criar o arquivo',
        error: data,
        debug: {
          requestUrl: url,
          requestBody: { path, nomeArquivo, conteudo },
          status: response.status
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
  }
}
