import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"


export function ConfirmCookies(){
    return(
        <>
        <Alert className="max-w-fit">
        <AlertDescription className="text-2xl flex items-center justify-center">
            We use cookies for best experience. 
            <Button className="bg-slate-800" >Accept</Button>
</AlertDescription>
        </Alert>

        </>
    )
}