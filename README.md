# Ding ding

A musical instrument of sorts.

A pebble{code} hardware hack (Oct 2014).

See [`bin`](https://github.com/taktran/starttter-hardware/tree/master/bin) folder for examples.

## Development

Install pre-requisites

    npm install

### Spark core

Pre-requisites

* [Spark core](https://www.spark.io/)
* `npm install -g spark-cli`
* `spark cloud login`
* Copy `app/public/config/config.example.js` to `app/public/config/config.js`, and add in spark core id

Start the server

* `npm install -g nodemon`

Get device state

    spark get [device_name] state

Monitor state

    spark monitor [device_name] state 5000

Update color

    spark call [device_name] update "100;100;0"

To flash the device with code

    spark flash [device_name] bin/spark/rgb-light.ino

#### Serial

To debug the spark, you can monitor serial output.

Firstly, in the setup code

    void setup() {
        // Start serial connection
        Serial.begin(9600);

        // ...
    }

List connected serial devices

    spark serial list

Connect to device

    spark serial monitor [list_id]

## Testing

Uses [karma](http://karma-runner.github.io/) and [jasmine](http://pivotal.github.io/jasmine/).

Karma is run automatically when `grunt` is called. To run it manually

    karma start config/karma.conf.js

For continuous integration, run

    grunt ci:test

    # Or,

    npm test
