# Photographer
Photographer is a webservice to convert HTML templates to images. This is a good thing if you want to generate data-dependent images and don't want to mess with ImageMagick-like stuff.

## WTF?
Photographer is implemented as [RabbitMQ](https://www.rabbitmq.com) RPC server – image rendering task requires much CPU resources so having RabbitMQ gives you ability to run several distributed servers without any additional effort. This server accepts task with the following JSON object:

  ```
  {
    html: '<markup>', // HTML markup with inline styles which you want to turn into an image
    width: 640, // width of imaginary browser viewport
    height: 480 // height of imaginary browser viewport
  }
  ```

Valid data is passed to [PhantomJS](http://phantomjs.org), rendered to image and uploaded to AWS S3 storage – link to the image is returned to the client.

## How to run this stuff?
Firstly make sure that you have running RabbitMQ server, PhantomJS is in the PATH and there's an access to some AWS S3 storage. Also prepare some folder for temporary files. Then:

  - `cp local_config.example.js local_config.js` – edit the config
  - `npm install`
  - `npm start`

At this point your server is ready to accept tasks.

## TODO

  - this stuff is pretty slow at the moment – probably should using other options to render HTML (Selenium)
  - ability to disable S3 upload and return image file
  - add more useful options

## Examples
  - [client implementation for this stuff](https://github.com/lafaulx/photographer-webapp-example)