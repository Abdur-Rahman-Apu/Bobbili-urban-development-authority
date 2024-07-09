import { baseUrl } from "./api";

async function parseURI(d) {
  var reader =
    new FileReader(); /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader */
  reader.readAsDataURL(
    d
  ); /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL */
  return new Promise((res, rej) => {
    /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise */
    reader.onload = (e) => {
      /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload */
      res(e.target.result);
    };
  });
}

export async function getDataBlob(url) {
  const res = await fetch(
    `${baseUrl}/storage/getImage?url=${encodeURIComponent(url)}`
  );
  //   var res = await fetch(url);
  var blob = await res.blob();
  console.log(blob, "blob");
  var uri = await parseURI(blob);
  console.log(uri);
  return uri;
}

export async function URLtoFile(url) {
  const res = await fetch(
    `${baseUrl}/storage/getImage?url=${encodeURIComponent(url)}`
  );
  const blob = await res.blob();
  // Gets URL data and read to blob

  console.log(blob);

  const mime = blob.type;
  const ext = mime.slice(mime.lastIndexOf("/") + 1, mime.length);
  // Gets blob MIME type (e.g. image/png) and extracts extension

  const file = new File([blob], `filename.${ext}`, {
    type: mime,
  });
  // Creates new File object using blob data, extension and MIME type

  console.log(file);
}
// getDataBlob(your_url);

export const otpGenerator = () => {
  const randomNumb = () => {
    return Math.floor(Math.random() * 10).toString();
  };

  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += randomNumb();
  }

  return otp;
};

export const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = ";expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + ";path=/";
};

// get Cookie data
export const getCookie = (searchData) => {
  // Split cookie string and get all individual name=value pairs in an array
  var cookieArr = document.cookie.split(";");

  console.log(document.cookie);
  console.log(cookieArr, "cookie arr");

  // Loop through the array elements
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
    if (searchData == cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // Return null if not found
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};
