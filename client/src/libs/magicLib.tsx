import { Magic } from 'magic-sdk'

const magic = new Magic(process.env.MAGIC_PUBLISHABLE_KEY || 'pk_test_0282C246359FA8D2')

export default magic