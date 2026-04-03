import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer
  .prompt([
    {
      message: "Type in your URL: ",
      name: "URL",
    },
  ])
  .then((answers) => {
    const url = answers.URL;
    var qr_png = qr.image(url);
    qr_png.pipe(fs.createWriteStream("qr_img.png"));

    fs.writeFile("URL.txt", answers.URL, (err) => {
      if (err) throw err;
      console.log("QR made");
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
        console.log(error);
    }
  });

