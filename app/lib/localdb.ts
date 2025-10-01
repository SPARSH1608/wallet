
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

export function signUpUser(email:string,password:string){
     const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    
   const existingUser=users.find(u=>u.email===email)
   if(existingUser){
    localStorage.setItem('currentUserId',existingUser.userId)
    return existingUser
   }
   const newUser:User={
    userId:crypto.randomUUID(),
    email,password,mnemonics:null,wallets:[]
   }
    localStorage.setItem('currentUserId',newUser.userId)
   
   users.push(newUser)
   localStorage.setItem('users',JSON.stringify(users))
   return newUser
   
}

export function loginUser(email:string,password:string){
     const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
   const user=users.find(u=>u.email===email && u.password===password)
   if(!user){
    return ''
   }
   localStorage.setItem('currentUserId',user.userId)
   return user
    
}

export function logout(){
    localStorage.removeItem('currentUserId')
}

export function getUser(){
     const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
     const userId=localStorage.getItem('currentUserId')
const user=users.find(u=>u.userId===userId)
    return user
}