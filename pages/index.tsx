import { GetStaticProps } from 'next'
import { IProduct } from '../product/types';
import api from '../product/api'

interface IIndexRoute {
  products: IProduct[];
}

const IndexRoute: React.FC<IIndexRoute> = ({ products = []}) => {
  return (
    <div>{JSON.stringify(products)}</div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    props: {
      products,
    },
    revalidate: 60, // refresh cache every 60 secs
  };
};

export default IndexRoute;
