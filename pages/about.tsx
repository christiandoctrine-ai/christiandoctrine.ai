import Navbar from '@/components/other/Navbar';
import Head from 'next/head';
import React from 'react';

export default function About() {
  return (
    <div>
      <Head>
        <title>About Us</title>
      </Head>
      <Navbar />

      <div className="flex flex-col h-[90vh] items-center justify-center p-8 text-white">
        <h1 className="text-3xl text-white text-center font-bold mb-12">
          About{' '}
          <span className="text-blue-500 underline">christiandoctrine.ai</span>
        </h1>
        <div className="ring-1 ring-inset ring-pink-blue/30 rounded-md p-5">
          <div className="max-w-3xl mx-auto p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <p className="text-lg">
                  • Exploring theology and the Bible through cutting-edge
                  technology
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-lg">
                  • Utilizing advanced natural language processing for
                  comprehensive insights
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-lg">
                  • Dedicated to providing accurate and accessible information
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-lg">
                  • Creating an engaging space for theological exploration
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-lg">
                  • Empowering curious minds and dedicated scholars alike
                </p>
              </div>
            </div>
          </div>{' '}
        </div>
        <h1 className="text-3xl text-white text-center font-bold my-12">
          Contact Us
        </h1>
        <div className="ring-1 ring-inset ring-pink-blue/30 rounded-md p-5">
          <a href="https://forms.gle/qiatmBPU9QJzBbBP9">
            👉{' '}
            <span className="hover:text-blue-500 underline font-bold">
              Fill out this form
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
