'use client'
import React,{useState, useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCookie } from '../utils/cookies'

function Header() {
const [isLogged, setIsLogged] = useState(false)
const [profilePic, setProfilePic] = useState('')
const router = useRouter()

useEffect(() => {
  const cookies = document.cookie;
    const sessionId = getCookie('sessionId', cookies);

    if (sessionId) {
      // You might want to validate the sessionId by making a request to your API
      setIsLogged(true);
      // Fetch user data using the sessionId
    } else {
      setIsLogged(false);
    }
  }, []);

  // Handle logout
  const logOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: getCookie('sessionId', document.cookie) }),
      });

      document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'; // Clear the cookie
      setIsLogged(false);
      // Redirect or update the UI as needed
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

return (
    <>
    {/* Notification Bar on top*/}
    {/* <section className='fixed top-0 bg-slate-950 w-screen text-gray-100 flex flex-row p-2 font-poppins text-xs place-content-center z-20'>
        <div className='flex flex-row items-center gap-2'>
            <i className="fi fi-br-exclamation text-sm mt-[2px]"></i>
            <h1>Event Registration for Google Webinar 2024 is now Live!</h1>
        </div>
    </section> */}

    {/*Header*/}
    <header className={`bg-opacity-0 backdrop-blur-3xl text-gray-100 flex flex-row p-2 px-5 justify-between w-screen fixed top-0 z-20 transition-all`}>

            {/*Logo*/}
            <Link href='/' className='flex flex-row items-center gap-2 cursor-pointer p-1'>
                <img src="/logo.png" alt="logo" className='w-14' />
                <h1 className='text-2xl font-azonix'>SPARK</h1>
            </Link>

            {/*Navigation Links*/}
            <div className='flex flex-row items-center gap-12 text-gray-100'>
                <Link href="/" className='relative nav-link hover:nav-selected'>Home</Link>
                <Link href="/mission" className='relative nav-link hover:nav-selected'>Our Mission</Link>
                <Link href="/institutions" className='relative nav-link hover:nav-selected'>Institutions</Link>
                <Link href="/events" className='relative nav-link hover:nav-selected'>Events</Link>
                <Link href="/highlights" className='relative nav-link hover:nav-selected'>Highlights</Link>
                <Link href="/admin" className='relative nav-link hover:nav-selected'>Admin</Link>

            </div>

        {/*Register Button*/}
        <div className='flex items-center'>
        {
            isLogged ?
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar" onClick={() => router.push('/settings')}>
                  <div className="w-10 rounded-full">
                    <img alt="User" src={profilePic} />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                  <li><a onClick={() => router.push('/settings')}>Settings</a></li>
                  <li><a onClick={logOut}>Logout</a></li>
                </ul>
              </div>
              :
              <Link href="/auth/register" className='btn-stylized'>
                Join Now
              </Link>
          }
        </div>
    </header>
    </>
)
}

export default Header
