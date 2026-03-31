const bcrypt = require('bcrypt');
const hash = '$2b$10$AOOaYphNiD1ZOPa3tQClv.IdvkFALPgz6EjWoEPKyA/sVRwQt1PMK';
const password = '@VisayasM3d';
const match = bcrypt.compareSync(password, hash);
console.log('Match:', match);
