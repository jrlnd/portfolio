import sendgrid from "@sendgrid/mail"

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (req, res) => {
  const body = JSON.parse(req.body)

  const message = `
  <style>
    @media only screen and (min-width: 640px) {
      .container {
        height: 100%;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  </style>
  <div class="container" style="box-sizing: border-box; width: 100%; max-width: 100vw; font-family: sans-serif; background: #fafafa; padding: 36px 0;">
    <div class="box" style="box-sizing: border-box; background-color: #fff; border: 1px solid #ccc; width: 100%; max-width: 640px; padding: 1rem; margin: 0 auto;">
      <h4 style="box-sizing: border-box; margin: 0; padding: 0; margin-bottom: 16px;">
        ${body.fullName} sent you a message:
      </h4>
      <h2 style="box-sizing: border-box;">
        ${body.subject}
      </h2>
      <p class="message-body" style="box-sizing: border-box; margin: 0; padding: 0; margin-bottom: 8px;">
        ${body.content.replace(/\r\n|\r|\n/g, '<br>')}
      </p>
      <hr style="box-sizing: border-box; border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
      <p style="box-sizing: border-box; margin: 0; padding: 0;">
        <small style="box-sizing: border-box;"><b style="box-sizing: border-box;">Reply to</b>: ${body.fullName} (${body.email})</small>
      </p>
    </div>
  </div>
  `

  const data = {
    to: 'rjgaoat@gmail.com',
    from: 'portfolio@jrlnd.dev',
    replyTo: body.email,
    subject: `[Portfolio Lead] ${body.subject}`,
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