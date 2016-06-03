# Photo Wall Server

A simple server to drive a Physical Web enhanced photo wall!


## API

### `POST /api/v1/images`

Required headers:

`Content-Type: multipart/form-data`

Response:

Body:

TBD?

### `GET /api/v1/images`

Lists all files in consisitent order.

Required headers:

None

Response:

`Content-Type: application/json`

Body:

Ordered sequnece of image files, first uploaded always first in sequence.

Example:

```
[
  "image1.jpg",
  "image2.jpg",
  "image3.jpg"
]
```

### `GET /api/v1/images/<filename>`

Retrieves a file

Required headers:

None

Response:

`Content-Type: <file mime-type>`

Body:

Image data

### `DELETE /api/v1/images/<filename>`

Deletes a file.

Required headers:

None

Response:

Empty
