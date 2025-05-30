import { Link } from "react-router-dom"
import { Button } from "../ui/button"

const Hero = () => {
  return (
    <div className="flex items-center flex-col mx-56 gap-9 my-19">
        <h1 className="font-extrabold text-[50px] text-center">

            <span className="text-[#f56551]"> Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingettips
        </h1>
        <p className="text-xl text-gray-500 text-center">Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget</p>
       
       <Link to='/create-trip' > <Button className="hover:cursor-pointer">Get Started, It's Free</Button></Link>
    </div>
  )
}

export default Hero