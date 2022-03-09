import sendgrid from "@sendgrid/mail"

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (req, res) => {
  const body = JSON.parse(req.body)

  const message = `
    <span style="font-size: 16px;">From ${body.fullName} (${body.email}),</span><br /><br />
    <div style="font-size: 14px;">${body.content.replace(/\r\n|\r|\n/g, '<br>')}</div>
  `

  const data = {
    to: 'rjgaoat@gmail.com',
    from: 'portfolio@jrlnd.dev',
    replyTo: body.email,
    subject: `[Contact Form] ${body.subject}`,
    html: message
  }

  try {
    const response = await sendgrid.send(data)
    return res.status(response.statusCode).end()
  } catch (error) {
    return res.status(error.statusCode || 500).json({error: error.message })
  }

}

export default sendEmail