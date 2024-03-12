import Navbar from '@/components/other/Navbar';
import Head from 'next/head';
import React from 'react';

export default function About() {
  return (
    <div>
      <Head>
        <title>About Us</title>
      </Head>
      <Navbar about={true} />
      <div className="relative isolate min-h-screen bg-gray-900 flex justify-center">
        <div className="mx-auto flex justify-center max-w-7xl ">
          <div className="relative px-6 pb-20 pt-24  sm:pt-32 lg:static lg:px-8 lg:py-48">
            <h2 className="text-xl text-center sm:text-3xl sm:text-left font-bold text-white">
              About christiandoctrine.ai
            </h2>

            <div className="sm:mt-6 text-sm sm:text-lg leading-6 sm:leading-8 text-gray-300 my-5">
              Our vision is to make the bible and theology more accessible in
              order to facilitate vibrant discussions within church communities.
              This AI chatbot is in beta and should not be viewed as an
              authoritative source.
            </div>

            <h2 className="mt-24 text-xl text-center sm:text-3xl sm:text-left font-bold text-white">
              Sources
            </h2>
            <ul>
              <li className="ml-5 text-xs underline sm:text-lg leading-6 sm:leading-8 text-gray-300 my-5">
                <a
                  target="_blank"
                  href="https://drive.google.com/file/d/1Y6_IIkNdQhnBMBDzwo1aHnmmEk6C5893/view?usp=drive_link"
                >
                  • Systematic Theology by Wayne Grudem (1994)
                </a>
              </li>
              <li className="ml-5 text-xs underline sm:text-lg leading-6 sm:leading-8 text-gray-300 my-5">
                <a
                  target="_blank"
                  href="https://drive.google.com/file/d/1Yv2R5JDfjT2coUVHuBgfM_uBa_m9WpyQ/view?usp=drive_link"
                >
                  • World English Bible
                </a>
              </li>
            </ul>

            <a target="_blank" href="https://forms.gle/qiatmBPU9QJzBbBP9">
              <button className="mt-5 rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
