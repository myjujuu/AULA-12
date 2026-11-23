require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware obrigatório antes das rotas para ler JSON
app.use(express.json());

// Conexão com o Supabase (usa as chaves do seu arquivo .env)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota POST exclusiva do Aluno 09
app.post('/api/cursos-idiomas', async (req, res) => {
  const { idioma, nivel, carga_horaria, valor_modulo } = req.body;

  // Validação dos campos obrigatórios (*)
  if (!idioma || !nivel || carga_horaria === undefined || valor_modulo === undefined) {
    return res.status(400).json({
      erro: 'Campos obrigatórios ausentes. Informe: idioma, nivel, carga_horaria e valor_modulo.'
    });
  }

  try {
    // Persistência no Supabase usando .insert().select()
    const { data, error } = await supabase
      .from('cursos_idiomas')
      .insert([
        {
          idioma,
          nivel,
          carga_horaria,
          valor_modulo
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    // Retorna status 201 com o registro recém-criado (id e created_at)
    return res.status(201).json(data[0]);

  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});