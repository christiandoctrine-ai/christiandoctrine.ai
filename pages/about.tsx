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
              Our vision is to facilitate vibrant discussions within church
              communities by making theology more accessible. As people learn more about theology, our desire is that they discuss the concepts
              with their local church.
            </div>
            <div className="sm:mt-6 text-sm sm:text-lg leading-6 sm:leading-8 text-gray-300 my-5">
              This chatbot distinguishes itself from chatgpt in two ways. First, the chatbot uses sources that are carefully curated
              instead of referencing the entirety of the internet. Second, the temperature of the chatbot is set low 
              to significantly reduce hallucinations (fabricated information). In this way, the responses are designed to reference 
              canonical sources only. 
            </div>
            <div className="sm:mt-6 text-sm sm:text-lg leading-6 sm:leading-8 text-gray-300 my-5">  
              However this AI chatbot is in beta and should not be viewed as authoritative. We&#39;ve also started
              with one source but hope to expand to more in the future. If you have any feedback, please share it 
              by contacting us below.
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
