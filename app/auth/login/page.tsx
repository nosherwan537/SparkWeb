"use client";
import { useState } from "react";
import { db } from "../../firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import Link from "next/link";
import StarryCanvas from "../../components/StarryCanvas";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (email && password) {
      setLoading(true);

      try {
        // Retrieve user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', email));

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Compare password with the hashed password
          const match = await bcrypt.compare(password, userData.password);

          if (match) {
            // Store user data in local storage
            localStorage.setItem("user", JSON.stringify(userData));
            setSuccess(true);
            for (let i = 0; i < 2; i++) router.back();
            window.location.reload();
            setError("");
          } else {
            setError("Invalid email or password");
            setSuccess(false);
          }
        } else {
          setError("User does not exist");
          setSuccess(false);
        }
      } catch (error) {
        setError("Error logging in");
        console.error("Error logging in user: ", error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter both email and password");
    }
  };

  return (
    <section className="h-screen w-screen flex flex-row fixed planet-bg z-30 overflow-auto">
    <StarryCanvas numberOfStars={300}/>
      <div className="pt-4 bg-opacity-0 bg-black p-6 flex flex-col w-1/3 backdrop-blur-3xl gap-4 items-center h-screen relative transition-all">
        <div className='flex flex-row justify-between w-full'>
          <Link href='/' className="btn btn-ghost">
            Back
          </Link>
          <Link href='/auth/register' className="btn btn-ghost">Register</Link>
        </div>
        
        <img src="/logoWhite.png" alt="logo" className="w-20 h-20 mt-10" />
        <h1 className="text-3xl font-bold text-white mt-10">Login</h1>
        <p className="text-white font-light">Enter your email and password to log in.</p> 
        <div className="flex flex-col gap-2 w-full">

          <label className="flex flex-row items-center gap-2">
            <i className="fi fi-sr-envelope text-lg"></i>
            <h1 className="w-1/5">Email</h1>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
              className="p-3 rounded-lg w-full" 
            />
          </label>

          <label className="flex flex-row items-center gap-2">
            <i className="fi fi-sr-key text-lg"></i>
            <h1 className="w-1/5">Password</h1>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
              className="p-3 rounded-lg w-full"
            />
          </label>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`btn ${loading ? "btn-disabled" : "btn-neutral"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {success && <p className="text-green-600 mt-4">Login successful!</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>  
    </section>
  );
}
