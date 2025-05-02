
import { ConfirmCookies } from "../../components/CookiesConfirm"
import OngoingBetsDisplay from "../../components/OngoingBetsDisplay"
import { poppinsRegular } from "./layout"
import { Button } from "@/components/ui/button"

export default function Home(){

  return (
    <>
    <div className="container1 flex flex-col w-full mx-auto items-center justify-center my-36">
      <div className={`text-8xl flex flex-col items-center justify-center ${poppinsRegular.className}`}>
    <div >Predict.</div>
    <div>Take a chance. </div>
    <div>Win big.</div>
        </div>
        <div className="flex flex-row space-x-4">
      <Button className="mt-6 max-w-fit">Get Started</Button>    
      <Button className="mt-6 max-w-fit">Create your own bets</Button>
        </div>
    </div>
    <div>
    </div>
    <div>
      <OngoingBetsDisplay/>
    </div>
      <div className="w-full mx-auto max-w-fit">
      <ConfirmCookies/>
      </div>
    </>
  )
}