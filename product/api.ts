import axios from 'axios';
import { IProduct } from './types';
import Papa from 'papaparse';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: async (): Promise<IProduct[]> => {
    return axios
    .get(
      `https://docs.google.com/spreadsheets/d/e/2PACX-1vT7zqxSdbsUjbCzOnKy60LdtkayYaqrZTZcVXD0Ki7WbgViqYe1BFoFr7V5IR3Ssn_6fzOCYp_jO4Ny/pub?output=csv`, {
      responseType: 'blob',
    })
    .then(resp =>
      new Promise<IProduct[]>((resolve, reject) => {
        Papa.parse(resp.data, {
          header: true,
          complete: results => resolve(results.data as IProduct[]),
          error: (error) => reject(error.message),
        });
      })
    );
  }
}
