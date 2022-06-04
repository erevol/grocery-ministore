import axios from 'axios';
import { IProduct } from './types';
import Papa from 'papaparse';

const DEFAULT_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vT7zqxSdbsUjbCzOnKy60LdtkayYaqrZTZcVXD0Ki7WbgViqYe1BFoFr7V5IR3Ssn_6fzOCYp_jO4Ny/pub?output=csv`;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: async (): Promise<IProduct[]> => {
    return axios
    .get(
      process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || DEFAULT_URL, {
      responseType: 'blob',
    })
    .then(resp =>
      new Promise<IProduct[]>((resolve, reject) => {
        Papa.parse(resp.data, {
          header: true,
          complete: results => {
            const products = results.data as IProduct[];

            return resolve(
              products.map((product) => ({
                ...product,
                price: Number(product.price)
              })),
            )
          },
          error: (error) => reject(error.message),
        });
      })
    );
  }
}
