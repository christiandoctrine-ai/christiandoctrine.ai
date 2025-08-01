import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/other/LoadingDots';
import { CodeBracketSquareIcon } from '@heroicons/react/24/solid';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/other/Accordion';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import { Message } from '@/types';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  messageListRef: React.RefObject<HTMLDivElement>;
  userImage?: string | null;
  userName?: string | null;
}

function MessageList({
  messages,
  loading,
  messageListRef,
  userImage,
  userName,
}: MessageListProps) {
  return (
    <>
      <div className="overflow-y-auto">
        <div ref={messageListRef}>
          {messages.length == 0 ? (
            <div className="my-12">
              <h1 className="text-xl md:text-3xl text-center font-semibold text-gray-100">
                Welcome to the christiandoctrine.ai
              </h1>
            </div>
          ) : (
            messages.map((message, index) => {
              return (
                <div
                  key={`chatMessage-${index}`}
                  className={` ${
                    message.type === 'apiMessage'
                      ? 'bg-gray-700/50'
                      : 'bg-gray-800/90'
                  }`}
                >
                  <div className="flex items-center justify-start max-w-full sm:max-w-4xl  mx-auto overflow-hidden px-2 sm:px-4">
                    {/* user and bot image */}
                    <div className="flex flex-col w-full ">
                      <div className="w-full text-gray-300 p-2 sm:p-4 overflow-wrap break-words">
                        <span
                          className={`mt-2 inline-flex items-center rounded-md px-2 py-1 text-xs sm:text-sm font-medium ring-1 ring-inset ${
                            message.type === 'apiMessage'
                              ? 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/30'
                              : 'bg-purple-400/10 text-purple-400 ring-purple-400/30'
                          }`}
                        >
                          {message.type === 'apiMessage'
                            ? 'Theology Bot'
                            : userName}
                        </span>

                        <div className="mx-auto max-w-full">
                          <ReactMarkdown
                              className="markdown text-xs sm:text-sm md:text-base leading-relaxed"
                              remarkPlugins={[remarkGfm]}
                              components={{
                                a: ({ node, ...props }) => (
                                  <a {...props} target="_blank" rel="noopener noreferrer">
                                    {props.children}
                                  </a>
                                ),
                              }}
                            >
                              {message.message}
                          </ReactMarkdown>
                        </div>

                        {message.type === 'apiMessage' &&
                        !message?.message
                          ?.replace(/•/g, '\n•')
                          ?.includes('Here are some verses about') ? (
                          <>
                            {message.sourceDocs &&
                            message?.sourceDocs[0]?.pageContent.replace(
                              /•/g,
                              '\n•',
                            ).length > 40 ? (
                              message?.sourceDocs.map((doc, index) => (
                                <div key={index}>
                                  <div className="pl-5 mb-5 text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                                    <span className="font-bold">
                                      Here&apos;s what Wayne Grudem has to say
                                      about this topic :{' '}
                                    </span>
                                    <q>
                                      {doc?.pageContent
                                        .replace(/•/g, '\n•')
                                        .replace(/(\d+)\s+\1\./g, '$1.') // Remove duplicate numbers
                                        .replace(/\n(?!\d)/g, ' ')}
                                      .
                                    </q>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-white my-5">
                                No sources available.
                              </p>
                            )}
                            <p className="text-white ">
                              <div>
                                {/* <h3 className="mt-10 text-xs font-extrabold sm:text-sm md:text-base text-white">
                                  {index + 1}. Title
                                </h3> */}
                                <h3 className="mt-5 italic text-sm text-gray-300">
                                  Source
                                </h3>
                              </div>
                              {message.sourceDocs &&
                                message.sourceDocs.map((doc, index) => {
                                  // Extracting author and title information

                                  let formatSource =
                                    doc.metadata.source.includes('PDF/')
                                      ? doc.metadata.source.replace('PDF/', '')
                                      : '';

                                  // Remove ".txt" from the string
                                  let result = formatSource.replace('.txt', '');
                                  let sourceParts = result.split(' - ');
                                  let author =
                                    sourceParts.length > 1
                                      ? sourceParts[1]
                                      : '';
                                  let title = sourceParts[0];

                                  // Reformatting the string
                                  let formattedString = `${
                                    index + 1
                                  }. ${author}, ${title}`;

                                  return (
                                    <h3
                                      key={index}
                                      className="text-xs italic sm:text-sm md:text-base text-gray-300"
                                    >
                                      {index + 1}. Grudem, Wayne (1994).
                                      Systematic Theology: An Introduction to
                                      Biblical Doctrine.
                                    </h3>
                                  );
                                })}
                            </p>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {loading && (
        <div className="flex items-center justify-center h-32 w-full bg-gradient-to-b from-gray-900 via-gray-900/70 to-gray-800/30">
          <div className="flex-shrink-0 p-1">
            <LoadingDots color="#04d9ff" />
          </div>
        </div>
      )}
    </>
  );
}

export default MessageList;
