
import {ReactNode, createContext, useState, useEffect} from 'react'
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from '../service/firebaseconnect'

interface  AuthProviderProps  {
    children:ReactNode
   }
type AuthContextdata = {
    signed: boolean
    loadingAuth: boolean
    hanleInfoUser: ({name,email,uid}: UserProps) =>void;
    user:UserProps | null

}
interface UserProps {
    uid:string;
    name: string | null;
    email: string | null;

}

export const AuthContext =  createContext({} as AuthContextdata)

function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(()=> {
        const unsub = onAuthStateChanged(auth, (user)=> {
           if(user) {
            //Tem usuario logado
            setUser({
                uid:user.uid,
                name:user?.displayName,
                email: user?.email

            })
            setLoadingAuth(false)

           } else {
            // não tem usuario logado
            setUser(null)
            setLoadingAuth(false)
           }
        })
        return () => {
            unsub();
        }

    },[])

        function hanleInfoUser({name, email,uid}: UserProps) {
          setUser(({
            name,
            email,
            uid,
               
          }))

    }
     return (
          <AuthContext.Provider value={{
            signed:!! user,
            loadingAuth,
            hanleInfoUser,
            user
            

            }}>
            {children}
          </AuthContext.Provider>  
     )
}

export default AuthProvider


