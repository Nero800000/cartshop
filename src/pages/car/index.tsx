import {useEffect, useState} from 'react'
import {Container} from '../../components/container'
import {FaWhatsapp} from 'react-icons/fa'
import {useParams} from 'react-router-dom'

import {getDoc,doc,} from 'firebase/firestore'
import {db} from '../../service/firebaseconnect'

interface CarProps {
  id:string;
  name:string;
  model: string;
  city:string;
  year:string;
  km:string;
  description:string;
  created:string;
  price:string | number;
  owner: string;
  uid:string;
  whatsapp: string
  images: ImagesCarProps[]

}

interface ImagesCarProps {
    uid:string;
    name:string
    url:string;

}

export function Cardetail() {
    const {id} = useParams()
    const [car,setCar] = useState<CarProps>()

    useEffect(()=> {
        async function  loadCar() {
          if(!id) {return}
          const docRef = doc(db,"cars",id)
          getDoc(docRef)
         .then((snapshot)=> {
            setCar({
                id:snapshot.id,
                name:snapshot.data()?.name,
                year:snapshot.data()?.year,
                description:snapshot.data()?.description,
                model: snapshot.data()?.model,
                city:snapshot.data()?.city,
                uid:snapshot.data()?.uid,
                created:snapshot.data()?.created,
                whatsapp:snapshot.data()?.wathsapp,
                price:snapshot.data()?.price,
                km:snapshot.data()?.km,



            })
         })
        }
        loadCar()
    },[id])
    
    return (
        <div>
            meus carros
        </div>
    )
}