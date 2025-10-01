
interface User{
    userId:string,
    email:string,
    password:string,
    mnemonics:string | null,
    wallets:Wallet[]
}
interface Wallet {
    gradient:string,
  walletId: string;
  publicKey: string;
  privateKey: string;
}
import * as bip39 from 'bip39'
import { derivePath } from "ed25519-hd-key";
import nacl from 'tweetnacl';
import bs58 from "bs58";
import {Connection,Keypair,LAMPORTS_PER_SOL,PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction} from '@solana/web3.js'

export function createMnemonics( strength:number=128){
     const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
     const userId=localStorage.getItem('currentUserId')
      if (!userId) {
    throw new Error("No user logged in");
  }
 const userIndex = users.findIndex(u => u.userId === userId);
 if (userIndex === -1) {
    throw new Error("User not found");
  }

const mnemonics=bip39.generateMnemonic(strength)
users[userIndex].mnemonics=mnemonics
  localStorage.setItem("users", JSON.stringify(users));
  return mnemonics;
}

export function createWallet(gradient:string){
     const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
     const userId=localStorage.getItem('currentUserId')
      if (!userId) {
    throw new Error("No user logged in");
  }
 const userIndex = users.findIndex(u => u.userId === userId);
 if (userIndex === -1) {
    throw new Error("User not found");
  } const user = users[userIndex];
  if (!user.mnemonics) throw new Error("User has no mnemonics yet");
  const seed=bip39.mnemonicToSeedSync(users[userIndex].mnemonics || "")
   const walletIndex = user.wallets.length;
   const path = `m/44'/501'/${walletIndex}'/0'`;
   const derivedSeed=derivePath(path,seed.toString('hex')).key

  const keypair=nacl.sign.keyPair.fromSeed(derivedSeed)
  
  const newWallet:Wallet={
    gradient,
    walletId:crypto.randomUUID(),
    publicKey:bs58.encode(keypair.publicKey),
    privateKey:bs58.encode(keypair.secretKey)
  }
  user.wallets.push(newWallet)
  users[userIndex]=user
  localStorage.setItem("users", JSON.stringify(users));
return newWallet
}

export function deleteWallet(walletId:string){
     const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  const userId = localStorage.getItem("currentUserId");
  if (!userId) throw new Error("No user logged in");

  const userIndex = users.findIndex(u => u.userId === userId);
  if (userIndex === -1) throw new Error("User not found");

  const user = users[userIndex];
  user.wallets = user.wallets.filter(w => w.walletId !== walletId);

  users[userIndex] = user;
  localStorage.setItem("users", JSON.stringify(users));

  return user.wallets;
}

export function deleteMnemonic() {
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  const userId = localStorage.getItem("currentUserId");
  if (!userId) throw new Error("No user logged in");

  const userIndex = users.findIndex(u => u.userId === userId);
  if (userIndex === -1) throw new Error("User not found");

  const user = users[userIndex];
  user.mnemonics = null;
  user.wallets = [];

  users[userIndex] = user;
  localStorage.setItem("users", JSON.stringify(users));

  return true;
}


export async function getTransactions(walletId:string,limit=20){
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  const userId = localStorage.getItem("currentUserId");
  if (!userId) throw new Error("No user logged in");

  const userIndex = users.findIndex(u => u.userId === userId);
  if (userIndex === -1) throw new Error("User not found");

  const user = users[userIndex];

  const wallet = user.wallets.find(w => w.walletId === walletId);
  if (!wallet) throw new Error("Wallet not found");


const pubKey=new PublicKey(wallet.publicKey)
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const signatures = await connection.getSignaturesForAddress(pubKey, { limit });
    console.log('signatures',signatures)
    const transactionSignatures = signatures.map(sigInfo => sigInfo.signature);
    console.log('transactionSignatures',transactionSignatures)
 const transactions:any[]=[]
 signatures.map(async(sigInfo)=>{
   const tx= await connection.getTransaction(sigInfo.signature, {
      commitment: "confirmed",
    });
    transactions.push(tx)
 })
 return transactions
//     console.log('transa',transactions)
//   return transactions.filter(tx => tx !== null);
}

export async function getBalance(walletId:string){
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  const userId = localStorage.getItem("currentUserId");
  if (!userId) throw new Error("No user logged in");

  const userIndex = users.findIndex(u => u.userId === userId);
  if (userIndex === -1) throw new Error("User not found");

  const user = users[userIndex];

  const wallet = user.wallets.find(w => w.walletId === walletId);
  if (!wallet) throw new Error("Wallet not found");

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const balance = await connection.getBalance(new PublicKey(wallet.publicKey));

  return balance;
}

export async function createTransaction(toPublicKey: string, quantity: number, walletId: string) {
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  const userId = localStorage.getItem("currentUserId");
  if (!userId) throw new Error("No user logged in");

  const userIndex = users.findIndex(u => u.userId === userId);
  if (userIndex === -1) throw new Error("User not found");

  const user = users[userIndex];

  const wallet = user.wallets.find(w => w.walletId === walletId);
  if (!wallet) throw new Error("Wallet not found");

  const fromKeypair = wallet.privateKey
  const keypair = Keypair.fromSecretKey(bs58.decode(fromKeypair));

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: new PublicKey(toPublicKey),
      lamports: quantity * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);

  return signature;
}

export async function topUpWallet(walletId: string, quantitySOL: number) {
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  const userId = localStorage.getItem("currentUserId");
  if (!userId) throw new Error("No user logged in");

  const userIndex = users.findIndex(u => u.userId === userId);
  if (userIndex === -1) throw new Error("User not found");

  const user = users[userIndex];

  const wallet = user.wallets.find(w => w.walletId === walletId);
  if (!wallet) throw new Error("Wallet not found");

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const publicKey = new PublicKey(wallet.publicKey);
  const signature = await connection.requestAirdrop(publicKey, quantitySOL * LAMPORTS_PER_SOL);

  await connection.confirmTransaction(signature, "confirmed");

  return signature;
}

export function getWallet(walletId:string){
      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  const userId = localStorage.getItem("currentUserId");
  if (!userId) throw new Error("No user logged in");

  const userIndex = users.findIndex(u => u.userId === userId);
  if (userIndex === -1) throw new Error("User not found");

  const user = users[userIndex];

  const wallet = user.wallets.find(w => w.walletId === walletId);
  if (!wallet) throw new Error("Wallet not found");
  return wallet
}