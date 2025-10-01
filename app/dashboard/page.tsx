'use client'
import { useEffect, useState } from "react"
import { getUser, logout } from "../lib/localdb"
import { useRouter } from "next/navigation";
import { createMnemonics, createWallet, deleteWallet } from "../lib/solana";
import Link from 'next/link'

interface User {
    userId: string,
    email: string,
    password: string,
    mnemonics: string | null,
    wallets: Wallet[]
}

interface Wallet {
    gradient: string
    walletId: string;
    publicKey: string;
    privateKey: string;
}

function getRandomGradient() {
    const randomColor = () =>
        `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

    const color1 = randomColor();
    const color2 = randomColor();
    const angle = Math.floor(Math.random() * 360);

    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

export default function Page() {
    const [user, setUser] = useState<User>()
    const router = useRouter()
    const [openModal, setOpenModal] = useState(false)
    const [type, setType] = useState('')
    const [selectedCard, setSelectedCard] = useState<Wallet>({
        gradient: "",
        publicKey: "",
        privateKey: "",
        walletId: ""
    })

    useEffect(() => {
        setUser(getUser())
    }, [])

    const refreshUserData = () => {
        setUser(getUser())
        router.refresh()
    }

    const handleLogout = () => {
        logout()
        router.push('/')
        router.refresh()
    }

    return (
        <div className="min-h-screen w-screen relative overflow-hidden bg-black">
            <nav className="flex justify-between items-center p-6 border-b border-gray-700/50">
                <div className="text-white text-2xl font-bold">
                    SPARSH WALTZ
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-white/80 text-sm">{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-gray-700/50">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-white text-xl font-semibold">Quick Actions</h2>
                        <button
                            onClick={refreshUserData}
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            🔄 Refresh
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {user?.mnemonics ? (
                            <button
                                onClick={() => {
                                    setType('showMnemonic')
                                    setOpenModal(true)
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                🔑 Show Recovery Phrase
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setType('createMnemonic')
                                    setOpenModal(true)
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                ✨ Create Recovery Phrase
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setType('createwallet')
                                setOpenModal(true)
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            Create New Wallet
                        </button>
                    </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                    <h2 className="text-white text-xl font-semibold mb-6">Your Wallets</h2>
                    {user?.wallets && user.wallets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {user.wallets.map((wallet, index) => (
                                <div key={wallet.walletId} className="relative group">
                                    <Link href={`/wallet/${wallet.walletId}`}>
                                        <div
                                            className="relative p-6 rounded-2xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-2xl overflow-hidden"
                                            style={{
                                                background: wallet.gradient,
                                                minHeight: '200px',
                                                aspectRatio: '1.586/1'
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full"></div>
                                            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/3 rounded-full"></div>

                                            <div className="relative z-10 h-full flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm shadow-md"></div>
                                                        <span className="text-white/80 text-xs font-medium">CRYPTO</span>
                                                    </div>
                                                    <div className="text-white/60 text-sm">
                                                        💳
                                                    </div>
                                                </div>

                                                <div className="my-6">
                                                    <div className="text-white/60 text-xs mb-1">Wallet ID</div>
                                                    <div className="text-white text-xl font-bold tracking-wide">
                                                        {wallet.walletId}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <div className="text-white text-lg font-bold tracking-wider">
                                                        WALTZ
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setSelectedCard(wallet)
                                            setType('deleteWallet')
                                            setOpenModal(true)
                                        }}
                                        className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">👛</div>
                            <h3 className="text-white text-lg font-semibold mb-2">No Wallets Yet</h3>
                            <p className="text-white/60 mb-4">Create your first wallet to get started</p>
                            <button
                                onClick={() => {
                                    setType('createwallet')
                                    setOpenModal(true)
                                }}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Create First Wallet
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {openModal && type === 'createMnemonic' && <CreateMnemonic openModal={openModal} setOpenModal={setOpenModal} refreshUserData={refreshUserData} />}
            {openModal && type === 'showMnemonic' && <ShowMnemonic openModal={openModal} setOpenModal={setOpenModal} />}
            {openModal && type === 'createwallet' && <CreateWallet openModal={openModal} setOpenModal={setOpenModal} refreshUserData={refreshUserData} />}
            {openModal && type === 'deleteWallet' && <Delete walletId={selectedCard?.walletId} openModal={openModal} setOpenModal={setOpenModal} refreshUserData={refreshUserData} />}
        </div>
    )
}

function Delete({ walletId, openModal, setOpenModal, refreshUserData }: { walletId: string, openModal: boolean, setOpenModal: (openModal: boolean) => void, refreshUserData: () => void }) {
    const handleDelete = () => {
        deleteWallet(walletId)
        setOpenModal(false)
        refreshUserData() // Refresh after deletion
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-gray-700">
                <button
                    onClick={() => setOpenModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
                >
                    ×
                </button>

                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-white text-xl font-semibold mb-4">Delete Wallet</h3>
                    <p className="text-white/80 mb-2">Do you really want to delete this wallet?</p>
                    <p className="text-red-400 text-sm mb-6">If deleted, all transactions will be lost permanently.</p>

                    <div className="flex gap-4">
                        <button
                            onClick={handleDelete}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Delete Forever
                        </button>
                        <button
                            onClick={() => setOpenModal(false)}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CreateWallet({ openModal, setOpenModal, refreshUserData }: { openModal: boolean, setOpenModal: (openModal: boolean) => void, refreshUserData: () => void }) {
    const [gradient, setGradient] = useState('')
    const [created, setCreated] = useState(false)
    const [wallet, setWallet] = useState<Wallet | undefined>()
    const [error, setError] = useState('')

    const handleCreate = () => {
        if (!gradient) {
            setError("Please select a gradient first")
            return
        }
        const res = createWallet(gradient)
        if (!res) {
            setError("Something went wrong while creating new wallet")
        } else {
            setCreated(true)
            setWallet(res)
        }
    }

    const handleDone = () => {
        setOpenModal(false)
        refreshUserData()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-gray-700">
                <button
                    onClick={() => {
                        setOpenModal(false)
                        if (created) refreshUserData()
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
                >
                    ×
                </button>

                <div className="text-center mb-6">
                    <h3 className="text-white text-xl font-semibold mb-2">Create New Wallet</h3>
                    <p className="text-white/60">Choose a gradient design for your wallet</p>
                </div>

                {!created ? (
                    <div className="space-y-6">
                        <div>
                            <button
                                onClick={() => setGradient(getRandomGradient())}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors mb-4"
                            >
                                🎨 Generate Random Gradient
                            </button>

                            {gradient && (
                                <div className="p-4 rounded-lg border border-gray-600" style={{ background: gradient }}>
                                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-center">
                                        <p className="text-white text-sm">Preview</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-600/20 border border-red-600 rounded-lg p-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleCreate}
                            disabled={!gradient}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Create Wallet
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <h4 className="text-white text-lg font-semibold mb-4">Wallet Created Successfully!</h4>
                        </div>

                        {wallet && (
                            <div className="space-y-3 bg-gray-800 rounded-lg p-4">
                                <div>
                                    <p className="text-white/60 text-xs">Public Key</p>
                                    <p className="text-white text-sm font-mono break-all">{wallet.publicKey}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs">Private Key</p>
                                    <p className="text-white text-sm font-mono break-all">{wallet.privateKey}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleDone}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function ShowMnemonic({ openModal, setOpenModal }: { openModal: boolean, setOpenModal: (openModal: boolean) => void }) {
    const [mnemonics, setMnemonics] = useState<string | null | undefined>('')

    useEffect(() => {
        setMnemonics(getUser()?.mnemonics)
    }, [])

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-700">
                <button
                    onClick={() => setOpenModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
                >
                    ×
                </button>

                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🔑</div>
                    <h3 className="text-white text-xl font-semibold mb-2">Recovery Phrase</h3>
                    <p className="text-red-400 text-sm">Keep this phrase safe and never share it with anyone</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-3 gap-2">
                        {mnemonics?.split(' ').map((word, index) => (
                            <div key={index} className="bg-gray-700 rounded-lg p-3 text-center">
                                <span className="text-white/60 text-xs">{index + 1}</span>
                                <p className="text-white text-sm font-medium">{word}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setOpenModal(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                    I've Saved It Safely
                </button>
            </div>
        </div>
    )
}

function CreateMnemonic({ openModal, setOpenModal, refreshUserData }: { openModal: boolean, setOpenModal: (openModal: boolean) => void, refreshUserData: () => void }) {
    const [strength, setStrength] = useState(128)

    const handleCreate = () => {
        const res = createMnemonics(Number(strength))
        console.log('created mnemonics', res)
        setOpenModal(false)
        refreshUserData()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-gray-700">
                <button
                    onClick={() => setOpenModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
                >
                    ×
                </button>

                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🔐</div>
                    <h3 className="text-white text-xl font-semibold mb-2">Secret Recovery Phrase</h3>
                    <p className="text-white/60 text-sm">This phrase will allow you to recover your wallet. Save it in a safe place.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Security Strength
                        </label>
                        <select
                            value={strength}
                            onChange={(e) => setStrength(Number(e.target.value))}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value={128}>128-bit (12 words)</option>
                            <option value={256}>256-bit (24 words)</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCreate}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        Generate Recovery Phrase
                    </button>
                </div>
            </div>
        </div>
    )
}

