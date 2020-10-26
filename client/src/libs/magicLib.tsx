import { Magic } from 'magic-sdk'

console.log(
  'init magic with pub key:',
  process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY
)

const magic = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY || '')

export default magic
