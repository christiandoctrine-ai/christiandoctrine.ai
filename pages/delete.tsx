import Head from 'next/head';
import React from 'react';
import { Fragment, useState, useRef, useEffect, useCallback } from 'react';
import {
  Bars3Icon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ProfileDropdown from '@/components/other/ProfileDropdown';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DeleteModal from '@/components/other/DeleteModal';
import axios from 'axios';
export default function DeleteUser() {
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.push('/login'),
  });
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');

  const [toggleModal, setToggleModal] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      setUserEmail(session.user.email);
      if (session?.user?.name) {
        setUserName(session.user.name);
      }
      if (session?.user?.image) {
        setUserImage(session.user.image);
      }
    }
  }, [status, session]);

  function deleteUser(event: any) {
    event.preventDefault();
    axios
      .post('api/deleteUser', { userEmail })
      .then((res) => {
        alert(res.data.message);
        localStorage.removeItem('chatList-namespace');
        signOut();
        router.push('/login');
      })
      .catch((err) => console.log(err));
  }

  return (
    <section>
      <Head>
        <title>Delete account</title>
      </Head>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <div className="flex justify-between w-full items-center">
          <Link href={'/'}>
            <span className="text-center rounded-md text-white px-2 py-1 text-lg  font-medium">
              Home
            </span>
          </Link>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Separator */}
            <div
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              aria-hidden="true"
            />
            <ProfileDropdown
              userImage={userImage ? userImage : '/images/user.png'}
              userName={userName ? userName : 'User'}
              signOut={signOut}
            />
          </div>
        </div>
      </div>
      <div className="relative isolate min-h-screen bg-gray-900 flex justify-center">
        <div className="mx-auto flex justify-center max-w-7xl ">
          <div className="relative px-6 pb-20 pt-24  sm:pt-32 lg:static lg:px-8 lg:py-48">
            <h2 className="text-xl text-center sm:text-3xl sm:text-left font-bold text-white">
              Deleting Your Account
            </h2>
            <p className="sm:mt-6 text-sm sm:text-lg leading-6 sm:leading-8 text-gray-300 my-5">
              To delete your account, simply click the &quot;Delete&quot; button
              below the &quot;Sign out&quot; option. Once clicked, you&apos;ll
              be directed to a page featuring a prominent red delete button. By
              proceeding, please note that all information associated with your
              account will be permanently removed.
            </p>
            <p className="sm:mt-6 text-sm sm:text-lg leading-6 sm:leading-8 text-gray-300 my-5">
              This includes your profile details, preferences, and any saved
              data. Once deleted, this information cannot be recovered. Should
              you decide to return, you can easily recreate your account by
              logging back into the app. However, please be aware that any data
              previously removed will not be retrievable.
            </p>
            <p className="sm:mt-6 text-sm sm:text-lg leading-6 sm:leading-8 text-gray-300 my-5">
              If you&apos;re sure about deleting your account and understand
              that this action is irreversible, click the &quot;Delete&quot;
              button below.
            </p>
            <p className="sm:mt-6 text-sm sm:text-lg leading-6 sm:leading-8 text-gray-300 my-5">
              Thank you for being a part of our community. We hope to see you
              again soon.
            </p>
            <button
              onClick={() => setToggleModal(true)}
              className="inline-flex justify-center rounded-md bg-red-500 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-red-500 hover:bg-red-600"
            >
              Delete Your Account
            </button>
            {toggleModal ? (
              <DeleteModal
                setToggleModal={setToggleModal}
                deleteUser={deleteUser}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      {/* modal */}
    </section>
  );
}
