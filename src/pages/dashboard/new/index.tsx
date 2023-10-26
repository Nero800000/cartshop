import { Container } from "../../../components/container"
import { DashboardHeader } from "../../../components/panelheader"
import {FiUpload,FiTrash} from 'react-icons/fi'
import {useForm} from 'react-hook-form'
import { Input } from "../../../components/input"
import {any, date, z} from 'zod'
import {zodResolver}  from '@hookform/resolvers/zod'
import { useSearchParams } from "react-router-dom"
import { ChangeEvent, useState, useContext} from "react"
import {AuthContext} from '../../../context/AuthContext'
import {v4 as uuidv4} from 'uuid'


import {storage,db} from  '../../../service/firebaseconnect'
import {
   ref,
   uploadBytes,
   getDownloadURL,
   deleteObject
} from 'firebase/storage'
import {addDoc,collection} from 'firebase/firestore'

const  schema =  z.object({
    name: z.string().nonempty("O campo nome e´obrigatorio"),
    model: z.string().nonempty("O Modelo é obrigatorio"),
    year: z.string().nonempty("O ano do carro é obrigatorio"),
    km: z.string().nonempty("O Km do carro  é obrigatorio"),
    price: z.string().nonempty("O preço é obrigatorio "),
    city: z.string().nonempty("a Cidade  é obrigatoria"),
    whatsapp: z.string().min(1,"O telefone é obrigatorio").refine((value)=> /^(\d{11,12})$/.test(value), {
        message:"Numero de telefone invalido"
    }
    ),

    description:z.string().nonempty("A descriçaõ é obrigatoria")
})
type formData = z.infer<typeof schema>

interface ImageItemProps {
   uid: string;
   name: string;
   previewUrl: string;
   url:string
}
export function New() { 

   const {user} = useContext(AuthContext)
    const {register, handleSubmit,formState:{errors}, reset} = useForm<formData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const [carImages,seCartImages]  = useState<ImageItemProps[]>([])

   async function handleFile(e: ChangeEvent<HTMLInputElement>) {
      if(e.target.files && e.target.files[0]) {
         const image = e.target.files[0]

         if(image.type === 'image/jpeg' || image.type === 'image/png') {
          await  handleUlpload(image)  
         } else {
            alert("Envie uma imagem jpeg ou png")
            return
         }
      }


      async function handleUlpload(image:File) {
          if(!user?.uid) {
             return
          }

          const currentuid = user?.uid
          const uidImage = uuidv4()

          const uploadRef = ref(storage, `images/${currentuid}/${uidImage}`)
          uploadBytes(uploadRef,image)
          .then((snapshot)=> {
             getDownloadURL(snapshot.ref).then((downloaduUrl)=> {
                const imageItem =  {
                  name: uidImage,
                  uid: currentuid,
                  previewUrl: URL.createObjectURL(image),
                  url: downloaduUrl,

                }

                seCartImages((images)=> [...images,imageItem])
             })
          })

      }
      
    }

    function onsubmit(data:formData) {
      if(carImages.length === 0) {
         alert("Envie alguma imagem brother")
         return;
      }
      const carlistImages = carImages.map(car => {
         return {
            uid:car.uid,
            name:car.name,
            url:car.url

         }
      })
      addDoc(collection(db, "cars"), {
         name:data.name,
         model:data.model,
         whatasapp: data.whatsapp,
         city:data.city,
         year:data.year,
         km:data.km,
         price: data.price,
         description:data.description,
         crearted: new Date(),
         owner:user?.name,
         uid:user?.uid,
         images:carlistImages
      })
      .then(()=> {
         reset()
         seCartImages([])
         console.log("Cadastrado com sucesso")

      })
      .catch((error)=> {
         console.log(error)
         console.log("Erro Ao cadastrar no banco")
      })
      console.log(data)
   
    }

   async function handleDeleteImage(item:ImageItemProps) {
            const  imagemPath =  `images/${item.uid}/${item.name}`
            const imageRef = ref(storage,imagemPath)

            try{
                await  deleteObject(imageRef)
                seCartImages(carImages.filter((car)=>car.url !== item.url))
            } 
            catch(err) {
              console.log("Erro ao deletar")
            }
    }
   
    return (
        <Container>
           <DashboardHeader/>
           <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
            <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:m-48">
              <div className="absolute cursor-pointer">
                <FiUpload size={30} color="#000"/>
              </div>
              <div className="cursonr-pointer">
                <input type="file" accept="image/*" className="opacity-0 cursor-pointer" onChange={handleFile}/>

              </div>
            </button>
            {carImages.map(item => (
               <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
                  <button className="absolute" onClick={()=>handleDeleteImage(item)}>
                  <FiTrash size={28} color="#fff"/>
                  </button>
                  <img
                  src={item.previewUrl}
                  className="rounded-lg w-full h-32 object-cover"
                  alt="Foto do carro"
                  />
               </div>   
            ))}

           </div>

           <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
              <form className="w-full"
              onSubmit={handleSubmit(onsubmit)}
              >
              <div className="mb-3">
                 <p className="mb-2 font-medium ">Nome do carro</p>
                 <Input
                  type="text"
                  register={register}
                  name="name"
                  error={errors.name?.message}
                  placeholder="Ex: Onnix 1.0..."

                  
                 />
              </div>

              <div className="mb-3">
                 <p className="mb-2 font-medium ">Modelo do carro</p>
                 <Input
                  type="text"
                  register={register}
                  name="model"
                  error={errors.model?.message}
                  placeholder="Ex: 1.0flex"
                  
                  
                 />
              </div>

               <div className="flex w-full mb-3  flex-row  items-center  gap-4">
               <div className="w-full">
                 <p className="mb-2 font-medium ">Ano do carro</p>
                 <Input
                  type="text"
                  register={register}
                  name="year"
                  error={errors.year?.message}
                  placeholder="2016/2016"
                  
                 />
              </div>
              <div className="w-full">
                 <p className="mb-2 font-medium ">KM rodados</p>
                 <Input
                  type="text"
                  register={register}
                  name="km"
                  error={errors.km?.message}
                  placeholder="km:XXXX"
                  
                 />
              </div>
              
               </div>

               <div className="flex w-full mb-3  flex-row  items-center  gap-4">
               <div className="w-full">
                 <p className="mb-2 font-medium ">Telefone para contato</p>
                 <Input
                  type="text"
                  register={register}
                  name="whatsapp"
                  error={errors.whatsapp?.message}
                  placeholder="ex: 99999999"
                  
                 />
              </div>
              <div className="w-full">
                 <p className="mb-2 font-medium ">cidade</p>
                 <Input
                  type="text"
                  register={register}
                  name="city"
                  error={errors.city?.message}
                  placeholder="km:Campo grande"
                  
                 />
              </div>
              
               </div>
               <div className="mb-3">
                 <p className="mb-2 font-medium ">Preço</p>
                 <Input
                  type="text"
                  register={register}
                  name="price"
                  error={errors.price?.message}
                  placeholder="Ex: 69.00..."

                  
                 />
              </div>
              <div className="mb-3">
                 <p className="mb-2 font-medium ">Descrição</p>
               <textarea
               className="border-2 w-full rounded-md, h-24 px-2"
               {...register("description")}
               name="description"
               id="description"
               placeholder="Digite a descrição completa sobre o carro...."
               />
               {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
              </div>

              <button type="submit" className="w-full rounded-md bg-zinc-900 text-white font-medium h-10">
                cadastrar
              </button>
              </form>
           </div>
        </Container>

    )
}

