import { serveHTTP } from 'stremio-addon-sdk'
import { addonBuilder } from 'stremio-addon-sdk'
import fetch from 'node-fetch'
import translate from '@vitalets/google-translate-api'

const builder = new addonBuilder({
  id: 'cinemeta-es',
  version: '1.0.0',
  name: 'Cinemeta Español',
  description: 'Está por ver',
  types: ['movie', 'series'],
  catalogs: [],
  resources: ['meta'],
})

const CINEMETA_URL = 'https://v3-cinemeta.strem.io/meta'

async function translateText(text) {
  try {
    const result = await translate(text, { to: 'es' })
    return result.text
  } catch (e) {
    console.error('Error en traducción:', e)
    return text
  }
}

builder.defineMetaHandler(async ({ type, id }) => {
  const url = `${CINEMETA_URL}/${type}/${id}.json`
  const res = await fetch(url)
  const json = await res.json()
  const meta = json.meta

  meta.name = await translateText(meta.name)
  meta.description = await translateText(meta.description)

  return { meta }
})

// Aquí lanzamos el servidor HTTP para que Render detecte el puerto
const port = process.env.PORT || 7000
serveHTTP(builder.getInterface(), { port })
console.log(`Addon activo en http://localhost:${port}/manifest.json`)
