const axios = require('axios');

const appKey = 'vtexappkey-bitsized-LMUNHB'
const appToken = 'BXLCNBPKUPGRKKEAPKRTIVUSUCBQGXZIFIQSJACTCNOKOXEVLYAVBAGBDHJKKXYBPDWGFOGFJQUFEDGRKZPWIKUFTMKOWFAKXMUGJQSOTIPAQTKQUWPYBGUITPTZRSET'

const baseURL = 'https://bitsized.vtexcommercestable.com.br/api/catalog/pvt/product';

const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'X-VTEX-API-AppKey': appKey,
    'X-VTEX-API-AppToken': appToken
  }
});

module.exports.getById = async function(id) {
  const response = await http.get(`/${id}`);
  return response.data;  
}
