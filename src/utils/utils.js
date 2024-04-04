// // export async function getBase64Url(url) {
// //   const toDataUrl = async function (url, callback) {
// //     //Convert to base64
// //     return new Promise((resolve, reject) => {
// //       var xhr = new XMLHttpRequest();
// //       xhr.onload = function () {
// //         var reader = new FileReader();
// //         reader.onloadend = function () {
// //           resolve(reader.result);
// //         };
// //         reader.readAsDataURL(xhr.response);
// //       };
// //       xhr.onerror = () => {
// //         reject({
// //           status: this.status,
// //           statusText: xhr.statusText,
// //         });
// //       };
// //       xhr.open("GET", url);
// //       xhr.responseType = "blob";
// //       xhr.send();
// //     });
// //   };
// //   const urlBase64 = await toDataUrl(url);
// //   return urlBase64;
// // }

// export async function getBase64Url(url) {
//   try {
//     const response = await fetch(
//       `http://localhost:5000/get-image?url=${encodeURIComponent(url)}`
//     );
//     if (!response.ok) {
//       throw new Error("Failed to fetch image");
//     }
//     const blob = await response.blob();
//     const reader = new FileReader();
//     reader.readAsDataURL(blob);
//     return new Promise((resolve, reject) => {
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return null;
//   }
// }

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
    `http://localhost:5000/get-image?url=${encodeURIComponent(url)}`
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
    `http://localhost:5000/get-image?url=${encodeURIComponent(url)}`
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
