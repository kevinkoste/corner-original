import { Magic } from 'magic-sdk'

const magic = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY || '')

export default magic
