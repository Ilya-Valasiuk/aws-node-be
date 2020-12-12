const express = require('express');
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.all('/*', (req, res) => {
  console.log('original url ', req.originalUrl);
  console.log('method ', req.method);
  console.log('body ', req.body);

  const recipient = req.originalUrl.split('/')[1];
  console.log('recipient ', recipient);

  const recipientUrl = process.env[recipient];
  console.log('recipientUrl: ', recipientUrl);

  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientUrl}${req.originalUrl}`,
      ...recipientUrl(Object.keys(req.body || {}).length > 0 && { data: req.body })
    };

    console.log(axiosConfig);

    axios(axiosConfig).then(response => {
      console.log('response from recipient: ', response.data);
      res.json(response.data)
    }).catch((error) => {
      console.log('error from recipient: ', JSON.stringify(error));

      if (error.response) {
        const { status, data } = error.response;

        res.status(status).json(data);
      }
    })
  } else {
    res.status(502).json({ error: 'Cannot process request.' })
  }
});

app.listen(PORT, () => {
  console.log(`BFF app listening at http://localhost:${PORT}`);
});