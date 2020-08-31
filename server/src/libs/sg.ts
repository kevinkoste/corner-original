import sg from '@sendgrid/mail'

sg.setApiKey(process.env.SENDGROID_API_KEY)

export default sg
