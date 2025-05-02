
import BetSimulateCard from "../../../components/BetSimulate"
import {TutorialA} from "../../../components/BetSimulate"
export default function SimulateBet(){
    const steps = [
        {
          target: '.first-step',
          content: 'This is the first step of the tutorial',
          disableBeacon: true,
        },
        {
          target: '.second-step',
          content: 'This is the second step of the tutorial',
        },
        {
          target: '.third-step',
          content: 'This is the final step of the tutorial',
        },
      ];
    

    return (
        <div className="container2 flex flex-col w-full mx-auto items-center">
            <h1>Simulator</h1>
            <p>This is a simulation of how the betting system is designed </p>
            <p>in this website.</p>
            <h3><strong>It does not use real money.</strong></h3>

            <BetSimulateCard/>
            <h1 className="first-step">Welcome to the Tutorial</h1>
      <p className="second-step">This is some content</p>
      <button className="third-step">Click me</button>
            <TutorialA steps={steps} />
        </div>
    )
}


