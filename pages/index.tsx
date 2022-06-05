import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from "next/link";
import { IProduct } from '../product/types';
import api from '../product/api'
import { useState } from 'react';

interface IIndexRoute {
  products: IProduct[];
}

// TODO: local currency
// const parseCurrency = (value: number): string => {
//   return value.toLocaleString('es-AR', {
//     style: 'currency',
//     currency: 'ARS',
//   });
// }

const IndexRoute: React.FC<IIndexRoute> = ({ products = []}) => {
  const [cart, setCart] = useState<IProduct[]>([]);

  const handleAddToCart = (product: IProduct) => {
    setCart((cart) => cart.concat(product));
  };

  const handleProceedCheckout = () => {
    const text = cart
    .reduce((message, product) => message.concat(`* ${product.title} - $${product.price}\n`), ``)
    .concat(`\nTotal: $${cart.reduce((total, product) => total + product.price, 0)}`);

    window.open( 
      `https://wa.me/${process.env.NEXT_PUBLIC_PHONE}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-red-500 text-white font-bold">STORE</header>
      <main className="p-4 flex-grow bg-gray-200">
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Trending Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div className="group relative" key={product.id}>
                <div className="relative w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <div className="relative min-h-[300px] w-full h-full object-center object-cover lg:w-full lg:h-full">
                    <Image
                      src={product.image}
                      loader={() => product.image}
                      alt={`${product.title} - ${product.category}`}
                      className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                      layout="fill"
                      objectFit="cover"
                      unoptimized
                      priority
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href="/about">
                        {product.title}
                      </Link>
                    </h3>
                    {/* <p className="mt-1 text-sm text-gray-500">Black</p> */}
                  </div>
                  <div className="text-sm font-medium text-gray-900">${product.price}</div>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 bg-red-500 group-hover:bg-red-700 flex items-center justify-center rounded-md font-semibold py-3 text-sm text-white uppercase w-full">
                  Add to bag
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {Boolean(cart.length) && (
            <button
              onClick={handleProceedCheckout}
              className="mt-10 bg-green-400 group-hover:bg-green-500 flex items-center justify-center rounded-md font-semibold py-3 text-sm text-white uppercase w-full"
            >
              Proceed to checkout ({cart.length} products)
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      </main>
      <footer className="p-4 bg-red-500 text-white">domain.com</footer>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    props: {
      products,
    },
    revalidate: 10, // refresh cache every 10 secs
  };
};

export default IndexRoute;
