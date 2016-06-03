const express = require('express');
const homepage = require('../../package.json').homepage;

const html = `<html>
<head>
<title>Upload an image!</title>
</head>
<body>
<form action="/api/v1/images" enctype="multipart/form-data" method="post">
<input type="file" name="image" accept="image/*" />
<input type="submit" value="Upload File" />
</form>

</body>
</html>`;

module.exports = express()
    .get('/', (req, res) => {
        res.send(html);
    });
