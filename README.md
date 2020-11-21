# Waiting List

This is a simple waiting list app using Vue.js, Bulma, Electron, and Twilio.  

![Waiting List Example](./etc/WaitingListExample.gif)

## Table of Content
- [Custom Configuration](#custom-configuration)
  - [Twilio Data](#twilio-data)
  - [Company Data](#company-data)
  - [Icon](#icon)
- [Building](#building)
- [Todo](#todo)

## Custom Configuration

The application allows for the configuration from a public configuration file `./public/config.json`:
```
{
  "twilioData": {
    "accountSid": "YOUR_ACCOUNT_SID",
    "authToken": "YOUR_AUTH_TOKEN",
    "fromNumber": "YOUR_TWILIO_NUMBER",
  },
  "companyData": {
    "companyName": "YOUR_COMPANY_NAME",
    "waitTime": "YOUR_WAIT_TIME",
    "holdTime": "YOUR_HOLD_TIME",
    "isMessageEditable": "IF_THE_MESSAGE_SENT_IS_EDITABLE"
  }
}
```

### Twilio Data

Twilio Data contains all of the information required to send a message through their API.
- **accountSid** -> *String* : The SID of your Twilio account
- **authToken** -> *String* : The authentication token from your Twilio account
- **fromNumber** -> *String* : The phone number associated with your Twilio account

### Company Data

Company Data contains all of the information pertaining to the settings of the application specific to your company.
- **companyName** -> *String* : The name of your company
- **waitTime** -> *Number* : The amount of time until their reservation will be ready
- **holdTime** -> *Number* : The amount of time the reservation will be held
- **isMessageEditable** -> *Boolean* : Whether the text message sent is editable or not

### Icon

Save a `.png` image within the `./public/` folder as `icon.png`.  After this run the `./generate_icon.bat` script.

## Building

Execute the `./build.bat` script.  **Currently this is only built for Windows.**

## TODO

- [ ] Make full text message configurable
- [ ] Add accessibility options

