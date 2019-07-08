const fs = require('fs');

const Ajv = require('ajv');
let ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

let schema = 'request-schema-v0';
let schemafile = `${__dirname}/../request-schema/${schema}.json`;
fs.readFile(schemafile, 'utf-8', (err, schemaData) => {
  // console.log("SCHEMA:", schemaData);
  let schema = JSON.parse(schemaData);
  let validate = ajv.compile(schema);
  
  let indir = __dirname+'/in';
  fs.readdir(indir, (err, files) => {
    files.forEach(file => {
      if (!file.match(/\.json$/)) {
        return;
      }

      let filename = indir+'/'+file;
      
      fs.readFile(filename, 'utf-8', (err, fileData) => {
        // console.log("FILE:", fileData);
        let data = JSON.parse(fileData);
        let valid = validate(data);
        if (valid) {
          console.log(file, "OK");
        } else {
          console.log(file, "FAIL:", validate.errors);
        }
      });
    });
  }); 
});
