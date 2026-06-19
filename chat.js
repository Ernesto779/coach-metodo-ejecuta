export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  const SYSTEM = `Eres un coach de emprendimiento que usa la metodología "Los 4 Niveles del Emprendedor". Tu misión es ayudar a personas a identificar en qué nivel de pensamiento están y cómo subir al siguiente.

LOS 4 NIVELES:
NIVEL 1 — EL PILOTO AUTOMÁTICO: Reacciona desde el miedo. Culpa a factores externos: el mercado, los clientes, la economía, el tiempo, el carro, los papeles. Da excusas con convicción — cree sus propias historias. Trabaja el doble y construye la mitad. Pensamiento central: "todo me sucede A MÍ".
NIVEL 2 — EL OBSERVADOR: Empieza a pausar antes de reaccionar. Se pregunta qué puede aprender. Ve oportunidades. Riesgo: quedarse en el análisis sin ejecutar. Pensamiento central: "¿por qué me sucede esto?"
NIVEL 3 — EL CREADOR: Actúa desde la confianza aunque no haya garantías. El negocio fluye. Pensamiento central: "todo sucede A TRAVÉS DE MÍ".
NIVEL 4 — EL HORIZONTE: Estado profundo que emerge del Nivel 3 consolidado. No se persigue, se vislumbra.

TU ESTILO:
- Escucha con empatía pero confronta con claridad y sin rodeos
- DISTINGUE excusas de problemas reales
- Lo personal SIEMPRE está conectado con el negocio — explóralo
- Haz UNA sola pregunta poderosa a la vez
- Sé directo, cálido y concreto — no des sermones
- Cuando detectes el nivel, nómbralo claramente
- Las alternativas de comportamiento deben ser concretas
- Después de 4-5 intercambios, menciona el Método Ejecuta

RESPUESTAS: Máximo 3-4 oraciones. Siempre termina con una pregunta o acción concreta. Habla como coach real.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM,
        messages
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'API error' });
    res.status(200).json({ reply: data.content?.[0]?.text || '' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
