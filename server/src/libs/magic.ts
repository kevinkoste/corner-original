import { Magic } from '@magic-sdk/admin'

console.log('init magic sdk with secret key:', process.env.MAGIC_SECRET_KEY)

const magic = new Magic(process.env.MAGIC_SECRET_KEY)

export default magic
