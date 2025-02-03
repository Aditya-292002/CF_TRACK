/**************************************************************************************************
 * APP SETTINGS HERE!!!
 * 
 */


export var AppSetting = {
    // defaultApiUrl: "http://192.168.1.26:1011/",
    defaultApiUrl: "http://192.168.1.27:2003/", // 27 SERVER
  //  defaultApiUrl: "http://localhost:34129/",/*,/**/     
    // defaultApiUrl: "http://103.74.54.211/Cftrackwebapi",
    encryption: false,
    currencyFormatter:"INR"
}


/***************************************************************************************************
 * To convert Readable string to Base64 string using Buffer
 *      let b_string = Buffer.from("Your data is here in string").toString('base64')
 * 
 * To convert Base64 string to Readable string using Buffer
 *      let _string = Buffer.from("your base64 data here",'base64').toString('ascii')
 */