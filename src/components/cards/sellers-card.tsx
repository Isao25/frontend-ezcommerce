import { useNavigate } from 'react-router'
import  rightArrow  from '../../assets/icons/right-arrow.svg'
import  avatar  from '../../assets/avatar.png'
export interface ISellersCardProps {
    id:string,
    name:string,
}

export const SellersCard = (
    {
     id,
     name,
    }:ISellersCardProps) => {
        const navigate = useNavigate()
        const goToProfile = () => navigate(`/profile-buyer?id=${id}`)

        return(
            <>
                <div className="flex flex-col bg-white shadow-lg rounded-lg max-w-[280px] h-[330px] p-4">
                    <div className="rounded-lg overflow-hidden">
                        <img
                        src={avatar}
                        alt={`perfil-${id}`}
                        className='w-full h-[200px] object-cover'
                        />
                    </div>
                    <div className="mt-4">
                        <h3 className='text-xl truncate font-bold text-terciaryLight dark:text-terciaryDark'>
                            {name}
                        </h3>
                    </div>
                    <div className="flex mt-1">
                        <div className='justify-items-right pt-3' >
                            <button className='rounded-full bg-[#B7B7B7] bg-opacity-45 p-2'
                               
                            >
                                <img className='h-7 w-7' src={rightArrow} />
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
}

