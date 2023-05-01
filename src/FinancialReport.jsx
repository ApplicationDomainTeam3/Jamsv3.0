import { TrialBalance } from "./TrialBalance"
import { BalanceSheet } from "./BalanceSheet"
import { IncomeStatement } from "./IncomeStatement"
import { useState } from "react"

export const FinancialReport = () => {

    const [report, setReport] = useState("tb")

    return(

        <>
       <div className="column-container-invis">
       <select name="reportselect" id="reportselect" className="select-report" onChange={(event)=> setReport(event.target.value)}>
                <option value="default">Select Report...</option>
                <option value="tb">Trial Balance</option>
                <option value="bs">Balance Sheet</option>
                <option value="is">Income Statement</option>
            </select>
       

        {report === "tb" &&
        <>
        <TrialBalance />
        </>
        }
        {report === "bs" &&
        <>
        <BalanceSheet/>
        </>
        }
        {report === "is" &&
        <>
        <IncomeStatement/>
        </>
        }

       </div>
       
         </>
       
    )
}