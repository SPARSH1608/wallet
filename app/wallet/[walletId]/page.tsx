'use client'
import { createTransaction, getBalance, getTransactions, getWallet, topUpWallet } from "../../lib/solana";
import { useEffect, useState, use } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface Transaction {
    blockTime: number;
    meta: {
        fee: number;
        preBalances: number[];
        postBalances: number[];
        err: any;
    };
    transaction: {
        message: {
            accountKeys: string[];
            instructions: any[];
        };
        signatures: string[];
    };
}

export default function WalletPage({ params }: { params: Promise<{ walletId: string }> }) {
    const { walletId } = use(params)
    const router = useRouter()
    const [wallet, setWallet] = useState<Wallet>({
        gradient: "",
        publicKey: "",
        privateKey: "",
        walletId: ""
    })
    const [balance, setBalance] = useState(0)
    const [type, setType] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        setWallet(getWallet(walletId))
        const fetchTransactions = async () => {
            const balance = await getBalance(walletId)
            setBalance(balance)
            const res: any = await getTransactions(walletId)
            setTransactions(res || [])
        }
        fetchTransactions()
    }, [walletId])

    const refreshWalletData = async () => {
        const balance = await getBalance(walletId)
        setBalance(balance)
        const res: any = await getTransactions(walletId)
        setTransactions(res || [])
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="flex justify-between items-center p-5 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="text-white text-xl hover:text-gray-300">←</Link>
                    <h1 className="text-white text-lg font-bold">My Virtual Cards</h1>
                </div>
            </nav>

            <div className="flex flex-col lg:flex-row gap-7 p-5 max-w-6xl mx-auto">
                <div className="lg:w-1/2 space-y-5">
                    <div
                        className="relative p-5 rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50"
                        style={{
                            background: wallet.gradient || 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                            minHeight: '204px',
                            aspectRatio: '1.586/1'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full"></div>

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                                    <span className="text-white/80 text-xs font-medium">SOL</span>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                                    <div className="w-2.5 h-1.5 bg-white/40 rounded-sm"></div>
                                </div>
                            </div>

                            <div className="my-5">
                                <div className="text-white text-lg font-mono tracking-widest mb-1.5">
                                    •••• •••• •••• {wallet.publicKey.slice(-4)}
                                </div>
                                <div className="text-white/60 text-xs">
                                    {new Date().toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-white text-xl font-bold">
                                        {(Math.pow(10, -9) * balance).toFixed(4)} SOL
                                    </div>
                                </div>
                                <div className="text-white/80 text-base font-bold italic tracking-wider">
                                    VISA
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => { setType('topup'); setOpenModal(true) }}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2"
                        >
                            <div className="text-xl">📈</div>
                            <span className="font-semibold text-sm">Top Up Card</span>
                        </button>

                        <button
                            onClick={() => { setType('sendmoney'); setOpenModal(true) }}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-5 rounded-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2"
                        >
                            <div className="text-xl">📤</div>
                            <span className="font-semibold text-sm">Send Money</span>
                        </button>

                        <button
                            onClick={() => { setType('receive'); setOpenModal(true) }}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-5 rounded-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2"
                        >
                            <div className="text-xl">📥</div>
                            <span className="font-semibold text-sm">Receive Money</span>
                        </button>
                    </div>
                </div>

                <div className="lg:w-1/2">
                    <div className="bg-black backdrop-blur-sm rounded-2xl p-5 border border-gray-800 h-full">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-white text-lg font-bold">Transactions</h2>
                            <button
                                onClick={refreshWalletData}
                                className="text-gray-400 hover:text-white text-xs transition-colors"
                            >
                                🔄 Refresh
                            </button>
                        </div>

                        <div className="space-y-1 max-h-80 overflow-y-auto">
                            {transactions.length > 0 ? (
                                transactions.map((tx, index) => {
                                    const date = new Date(tx.blockTime * 1000);
                                    const time = date.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    });

                                    const preBalance = tx.meta.preBalances[0] || 0;
                                    const postBalance = tx.meta.postBalances[0] || 0;
                                    const amountChanged = (postBalance - preBalance)
                                    const fee = tx.meta.fee / 1000000000;

                                    const isOutgoing = amountChanged < 0;
                                    const displayAmount = Math.abs(amountChanged).toFixed(4);

                                    return (
                                        <RealTransactionItem
                                            key={tx.transaction.signatures[0]}
                                            signature={tx.transaction.signatures[0]}
                                            time={time}
                                            amount={displayAmount}
                                            fee={fee.toFixed(6)}
                                            type={isOutgoing ? 'outgoing' : 'incoming'}
                                            accountKeys={tx.transaction.message.accountKeys}
                                            walletPublicKey={wallet.publicKey}
                                        />
                                    );
                                })
                            ) : (
                                <div className="text-center py-10">
                                    <div className="text-4xl mb-3">📊</div>
                                    <h3 className="text-white text-base font-semibold mb-1.5">No Transactions Yet</h3>
                                    <p className="text-white/60 text-sm">Your transaction history will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {openModal && type === 'topup' && <TopUp wallet={wallet} openModal={openModal} setOpenModal={setOpenModal} refreshWalletData={refreshWalletData} />}
            {openModal && type === 'receive' && <ReceiveMoney wallet={wallet} openModal={openModal} setOpenModal={setOpenModal} />}
            {openModal && type === 'sendmoney' && <SendMoney wallet={wallet} openModal={openModal} setOpenModal={setOpenModal} refreshWalletData={refreshWalletData} />}
        </div>
    )
}

function RealTransactionItem({ signature, time, amount, fee, type, accountKeys, walletPublicKey }: {
    signature: string, time: string, amount: string, fee: string, type: 'incoming' | 'outgoing', accountKeys: string[], walletPublicKey: string
}) {
    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
                <div className="text-xs text-gray-400">{time}</div>
                <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                    {type === 'incoming' ? '📥' : '📤'}
                </div>
                <div>
                    <div className="text-white font-medium text-sm">
                        {type === 'incoming' ? 'Received' : 'Sent'}
                    </div>
                    <div className="text-gray-400 text-xs">
                        SOL Transaction
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className={`font-bold text-sm ${type === 'incoming' ? 'text-green-400' : 'text-white'}`}>
                    {type === 'incoming' ? '+' : '-'}{amount} SOL
                </div>
                <div className="text-gray-400 text-xs">Fee: {fee} SOL</div>
            </div>
        </div>
    )
}

function TopUp({ wallet, openModal, setOpenModal, refreshWalletData }: { wallet: Wallet, openModal: boolean, setOpenModal: (openModal: boolean) => void, refreshWalletData: () => void }) {
    const [quantity, setQuantity] = useState(0)
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTopUp = async () => {
        setLoading(true)
        const res = await topUpWallet(wallet.walletId, quantity)
        if (!res) {
            setError('Something went wrong during top up')
        } else {
            setResult(res)
            await refreshWalletData()
        }
        setLoading(false)
    }

    const handleClose = () => {
        setOpenModal(false)
        if (result) {
            refreshWalletData()
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 relative border border-gray-600/50">
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
                >
                    ✕
                </button>

                {!result ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                                💰
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">Top Up Wallet</h3>
                            <p className="text-gray-300 text-sm">Add SOL to your wallet instantly</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white text-sm font-semibold mb-3">
                                    Amount (SOL)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full bg-gray-700/80 border border-gray-600 rounded-xl px-4 py-4 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="0.00"
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                                        SOL
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[0.1, 0.5, 1.0, 2.0].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setQuantity(amount)}
                                        className="bg-gray-700/60 hover:bg-blue-500/20 hover:border-blue-500 border border-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                    >
                                        {amount} SOL
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-red-400 text-lg">⚠️</div>
                                    <p className="text-red-300 text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleTopUp}
                            disabled={loading || quantity <= 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none shadow-lg"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </div>
                            ) : (
                                'Top Up Wallet'
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-700 rounded-3xl flex items-center justify-center text-3xl mx-auto">
                            ✅
                        </div>
                        <div>
                            <h4 className="text-white text-xl font-bold mb-2">Success!</h4>
                            <p className="text-blue-400 text-lg font-semibold">{quantity} SOL added to your wallet</p>
                            <p className="text-gray-400 text-sm mt-2">Transaction completed successfully</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function ReceiveMoney({ wallet, openModal, setOpenModal }: { wallet: Wallet, openModal: boolean, setOpenModal: (openModal: boolean) => void }) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(wallet.publicKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 relative border border-gray-600/50">
                <button
                    onClick={() => setOpenModal(false)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
                >
                    ✕
                </button>

                <div className="space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                            📨
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">Receive Money</h3>
                        <p className="text-gray-300 text-sm">Share your wallet address to receive SOL</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white text-sm font-semibold mb-3">Your Wallet Address</label>
                            <div className="bg-gray-700/80 border border-gray-600 rounded-xl p-4">
                                <div className="text-white text-sm font-mono break-all leading-relaxed bg-gray-600/50 p-3 rounded-lg">
                                    {wallet.publicKey}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="text-blue-400 text-lg">💡</div>
                                <div>
                                    <p className="text-white text-sm font-medium mb-1">Share this address</p>
                                    <p className="text-gray-400 text-xs">Anyone can send SOL to this address. Keep it safe and never share your private key.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={copyToClipboard}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                    >
                        {copied ? (
                            <div className="flex items-center justify-center gap-2">
                                <span>✅ Copied to Clipboard!</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <span>📋 Copy Address</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

function SendMoney({ wallet, openModal, setOpenModal, refreshWalletData }: { wallet: Wallet, openModal: boolean, setOpenModal: (openModal: boolean) => void, refreshWalletData: () => void }) {
    const [pubKey, setPubkey] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTransaction = async () => {
        setLoading(true)
        const res = await createTransaction(pubKey, quantity, wallet.walletId)
        if (!res) {
            setError('Something went wrong during transaction')
        } else {
            setResult(res)
            await refreshWalletData()
        }
        setLoading(false)
    }

    const handleClose = () => {
        setOpenModal(false)
        if (result) {
            refreshWalletData()
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 relative border border-gray-600/50">
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
                >
                    ✕
                </button>

                {!result ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                                💸
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">Send Money</h3>
                            <p className="text-gray-300 text-sm">Transfer SOL to another wallet</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white text-sm font-semibold mb-3">
                                    Recipient Address
                                </label>
                                <input
                                    type="text"
                                    value={pubKey}
                                    onChange={(e) => setPubkey(e.target.value)}
                                    className="w-full bg-gray-700/80 border border-gray-600 rounded-xl px-4 py-4 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter recipient's wallet address..."
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-semibold mb-3">
                                    Amount (SOL)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full bg-gray-700/80 border border-gray-600 rounded-xl px-4 py-4 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="0.00"
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                                        SOL
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[0.01, 0.05, 0.1, 0.5].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setQuantity(amount)}
                                        className="bg-gray-700/60 hover:bg-blue-500/20 hover:border-blue-500 border border-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                    >
                                        {amount} SOL
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-red-400 text-lg">⚠️</div>
                                    <p className="text-red-300 text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleTransaction}
                            disabled={loading || !pubKey || quantity <= 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none shadow-lg"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Sending...
                                </div>
                            ) : (
                                'Send Money'
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-700 rounded-3xl flex items-center justify-center text-3xl mx-auto">
                            ✅
                        </div>
                        <div>
                            <h4 className="text-white text-xl font-bold mb-2">Transaction Sent!</h4>
                            <p className="text-blue-400 text-lg font-semibold">{quantity} SOL sent successfully</p>
                            <p className="text-gray-400 text-sm mt-2">Transaction completed successfully</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}