const fs = require('fs');

const Ajv = require('ajv');
let ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

let baseSchema = 'request-schema';
let defsSchemas = [
  'pathfinder/pathfinder-character',
  'pathfinder2/pathfinder2-character',
  'starfinder/starfinder-character',
  'dnd35/dnd35-character'
];
defsSchemas.forEach(schema => {
  let schemaFile = `${__dirname}/../request-schema/${schema}.json`;
  let schemaData = fs.readFileSync(schemaFile);
  let schemaJSON = JSON.parse(schemaData);
  ajv.addSchema(schemaJSON);
});

let schemaFile = `${__dirname}/../request-schema/${baseSchema}.json`;
fs.readFile(schemaFile, 'utf-8', (err, schemaData) => {
  if (err) {
    console.log("ERROR:", err);
    return;
  }
  
  // console.log("SCHEMA:", schemaData);
  let schema = JSON.parse(schemaData);
  let validate = ajv.compile(schema);
  
  let indir = __dirname+'/in';
  fs.readdir(indir, (err, files) => {
    if (err) {
      console.log("ERROR:", err);
      return;
    }
    files.forEach(file => {
      if (!file.match(/\.json$/)) {
        return;
      }

      let filename = indir+'/'+file;
      
      fs.readFile(filename, 'utf-8', (err, fileData) => {
        if (err) {
          console.log(file, "ERROR:", err);
          return;
        }
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
