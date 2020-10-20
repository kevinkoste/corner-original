import magicAdmin from '@magic-sdk/admin'
const { Magic } = magicAdmin

const magic = new Magic(process.env.MAGIC_SECRET_KEY)

export default magic