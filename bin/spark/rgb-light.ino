/**
 * RGB lights
 *
 * Internet connected lights
 */

// Set pin numbers
const int buttonPin = D0;

const int rgbRedPin = A0;
const int rgbGreenPin = A1;
const int rgbBluePin = A4;

const int otherRgbRedPin = A5;
const int otherRgbGreenPin = A6;
const int otherRgbBluePin = A7;

const int HTTP_OK = 200;

int buttonState = 0; // variable for reading the pushbutton status
int prevButtonState = buttonState;

int rgbRed = 0;
int rgbGreen = 0;
int rgbBlue = 0;

int otherRgbRed = 0;
int otherRgbGreen = 0;
int otherRgbBlue = 0;

char rgbColors[64];

String publishEventName = "rgb";

void splitArgStringToArray(String arguments, String *target){
  int numArgs = 0;
  int beginIdx = 0;
  int idx = arguments.indexOf(";");
  int NOT_FOUND = -1;

  while (idx != NOT_FOUND) {
    String arg = arguments.substring(beginIdx, idx);
    arg.trim();
    target[numArgs] = arg;

    beginIdx = idx + 1;
    idx = arguments.indexOf(";", beginIdx);
    ++numArgs;
  }

  // Single or last parameter
  String lastArg = arguments.substring(beginIdx);
  target[numArgs] = lastArg;
}

void setRGBColor(String command) {

  String data[3] = { NULL };
  splitArgStringToArray(command, data);

  rgbRed = data[0].toInt() % 256;
  rgbGreen = data[1].toInt() % 256;
  rgbBlue = data[2].toInt() % 256;

  sprintf(rgbColors, "{\"r\":%i,\"g\":%i,\"b\":%i}", rgbRed, rgbGreen, rgbBlue);
  Spark.publish(publishEventName, rgbColors);

  Serial.println(publishEventName);
  Serial.println(rgbColors);
}

void setOtherRGBColor(String command) {
  String data[3] = { NULL };
  splitArgStringToArray(command, data);

  otherRgbRed = data[0].toInt() % 256;
  otherRgbGreen = data[1].toInt() % 256;
  otherRgbBlue = data[2].toInt() % 256;

  Serial.println(otherRgbRed);
  Serial.println(otherRgbGreen);
  Serial.println(otherRgbBlue);
}

/**
 * Parse json to set colours of other light.
 *
 * Primitive parsing that assumes the order of the
 * json values to be r, g then b.
 *
 * @param json
 */
void setOtherRGBColorFromJson(String json) {
  // Strip out all the json bits to create the
  // command string
  //
  // Format: "{\"r\":%i,\"g\":%i,\"b\":%i}"
  String command = json;
  command.replace("{\"r\":", "");
  command.replace("\"g\":", "");
  command.replace("\"b\":", "");
  command.replace("}", "");

  // , => ;
  command.replace(",", ";");

  Serial.println(String("Set other:" + command));
  setOtherRGBColor(command);
}

void nextRandomColor() {
  rgbRed = random(255);
  rgbGreen = random(255);
  rgbBlue = random(255);

  sprintf(rgbColors, "{\"r\":%i,\"g\":%i,\"b\":%i}", rgbRed, rgbGreen, rgbBlue);
  Spark.publish(publishEventName, rgbColors);
  Serial.println(publishEventName);
  Serial.println(rgbColors);
}

void writeRgbColor() {
  analogWrite(rgbRedPin, rgbRed);
  analogWrite(rgbGreenPin, rgbGreen);
  analogWrite(rgbBluePin, rgbBlue);
}

void writeOtherRgbColor() {
  analogWrite(otherRgbRedPin, otherRgbRed);
  analogWrite(otherRgbGreenPin, otherRgbGreen);
  analogWrite(otherRgbBluePin, otherRgbBlue);
}

int changeRGB(String command) {
  setRGBColor(command);

  return HTTP_OK;
}

void onColorChange(const char *event, const char *data) {
  if (data) {
    // If it isn't the current device, then change
    // the other rgb light
    if (!String(event).endsWith(Spark.deviceID())) {
      Serial.println(event);
      Serial.println(data);

      setOtherRGBColorFromJson(String(data));
    }
  }
}

void setup() {
  // Start serial connection
  Serial.begin(9600);

  /**
   * Change RGB with specific color with command.
   *
   * Command is in the format:
   *
   *    [red_color];[green_color];[blue_color]
   *
   * where [red_color] (and similar) is equal to a number between 0-255
   *
   * To call (with authentication):
   *
   *    POST https://api.spark.io/v1/devices/[device_id]/update
   */
  Spark.function("update", changeRGB);

  // Register state variable
  Spark.variable("state", &rgbColors, STRING);

  // Initialize the pushbutton pin as an input
  pinMode(buttonPin, INPUT);

  // Initialize RGB LEDs
  pinMode(rgbRedPin, OUTPUT);
  pinMode(rgbGreenPin, OUTPUT);
  pinMode(rgbBluePin, OUTPUT);

  pinMode(otherRgbRedPin, OUTPUT);
  pinMode(otherRgbGreenPin, OUTPUT);
  pinMode(otherRgbBluePin, OUTPUT);

  // Set initial colour
  nextRandomColor();

  // Turn off other rgb
  setOtherRGBColor("0;0;0");
}

void loop() {
  // Store previous button state
  prevButtonState = buttonState;

  // read the state of the pushbutton value:
  buttonState = digitalRead(buttonPin);

  if (buttonState == HIGH) { // Pressed
    buttonState = 1;
  } else if (buttonState == LOW) { // Not pressed
    buttonState = 0;
  }

  // Do something, if button state changes
  if ((prevButtonState != buttonState) && (buttonState == 0)) {
    nextRandomColor();
  }

  writeRgbColor();
  writeOtherRgbColor();

  // Give it a bit of time to breathe
  delay(10);
}