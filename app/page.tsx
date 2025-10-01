'use client'
import { useState } from "react";
import { loginUser, signUpUser } from "./lib/localdb";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [type, setType] = useState('none')
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gradient-to-b from-blue-900 to-black" >
      <div className="w-screen h-2/3 relative">
        <nav className="flex justify-between items-center p-5 md:p-7 relative z-10">
          <div className="text-white text-xl font-bold">
            SPARSH
          </div>
          <div className="hidden md:flex space-x-6 text-white text-sm">
            <span>Home</span>
            <span>How it Works</span>
            <span>FAQs</span>
          </div>
          <button
            onClick={() => { setType('signup'); setOpenModal(true) }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full font-medium transition-colors text-sm"
          >
            Join Now
          </button>
        </nav>
      </div>

      <div className="absolute  top-20 left-1/2 transform -translate-x-1/2 w-[93.5%] max-w-5xl h-[76.5%] rounded-3xl shadow-2xl border border-gray-700 overflow-hidden bg-black">
        <div className="flex justify-center pt-7">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
            <span className="text-white text-xs">✨ FREEDOM UNLOCKED DAILY</span>
          </div>
        </div>

        <div className="text-center px-7 mt-7">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Unlock Financial Freedom
          </h1>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            with Premium <span className="underline decoration-white/50">Card</span>
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto mb-7">
            Pay Your Bills Smart helps you effortlessly monitor your credit and<br />
            with a single tap for better financial management
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button
              onClick={() => { setType('login'); setOpenModal(true) }}
              className="border border-white/30 text-white px-7 py-2.5 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              Contact Us 📞
            </button>
            <button
              onClick={() => { setType('signup'); setOpenModal(true) }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-full font-medium transition-colors flex items-center justify-center gap-2 text-sm"
            >
              Get Started 🚀
            </button>
          </div>
        </div>

        <div className="absolute bottom-7 left-0 right-0 px-7">
          <div className="flex justify-between items-start">
            <div className="text-white flex-1 p-4 rounded-xl" style={{
              background: `linear-gradient(145deg, 
                rgba(239, 68, 68, 0.15) 0%,
                rgba(239, 68, 68, 0.05) 50%,
                rgba(0, 0, 0, 0.1) 100%
              )`
            }}>
              <div className="flex items-center mb-2">
                <div className="flex -space-x-1 mr-3">
                  <div className="w-6 h-6 bg-red-400 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-2xl font-bold">80K</span>
              </div>
              <p className="text-sm opacity-90 leading-tight max-w-[200px]">Users are the backbone of any application and their needs to intricate</p>
            </div>

            <div className="text-center text-white flex-1 p-4 rounded-xl mx-4" style={{
              background: `linear-gradient(145deg, 
                rgba(251, 191, 36, 0.15) 0%,
                rgba(251, 191, 36, 0.05) 50%,
                rgba(0, 0, 0, 0.1) 100%
              )`
            }}>
              <div className="flex items-center justify-center mb-2">
                <span className="text-yellow-400 text-xl mr-2">⭐</span>
                <span className="text-2xl font-bold">5.8</span>
              </div>
              <p className="text-sm opacity-90 leading-tight max-w-[200px] mx-auto">Positive ratings by Pulse user around the world! Check the review here!</p>
            </div>

            <div className="text-right text-white flex-1 p-4 rounded-xl" style={{
              background: `linear-gradient(145deg, 
                rgba(34, 197, 94, 0.15) 0%,
                rgba(34, 197, 94, 0.05) 50%,
                rgba(0, 0, 0, 0.1) 100%
              )`
            }}>
              <div className="mb-2">
                <div className="text-2xl font-bold text-center">65K</div>
              </div>
              <p className="text-center text-sm opacity-90 leading-tight max-w-[200px] ml-auto">Active users are essential for the vitality and success of any application</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black w-screen h-1/3 bottom-0"></div>

      {openModal && type === 'login' && <Login openModal={openModal} setOpenModal={setOpenModal} setType={setType} />}
      {openModal && type === 'signup' && <SignUp openModal={openModal} setOpenModal={setOpenModal} setType={setType} />}
    </div>
  );
}

function Login({ openModal, setOpenModal, setType }: { openModal: Boolean, setOpenModal: (openModal: boolean) => void, setType: (type: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = () => {
    const res = loginUser(email, password)
    if (!res) {
      setError('Something went wrong while login')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-gray-200/20" style={{
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.95) 0%,
          rgba(249, 250, 251, 0.9) 50%,
          rgba(243, 244, 246, 0.95) 100%
        )`
      }}>
        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="sparsh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => setType('signup')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}


function SignUp({ openModal, setOpenModal, setType }: { openModal: Boolean, setOpenModal: (openModal: boolean) => void, setType: (type: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = () => {
    const res = signUpUser(email, password)
    console.log(res)
    if (!res) {
      setError('Something went wrong while Signup')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-gray-200/20" style={{
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.95) 0%,
          rgba(249, 250, 251, 0.9) 50%,
          rgba(243, 244, 246, 0.95) 100%
        )`
      }}>
        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600">Join thousands of satisfied users</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="sparsh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Create Account
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => setType('login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}