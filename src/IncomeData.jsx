
import { useState, useEffect, useRef } from "react";
import {db} from './firestore';
import { collection, getDocs, doc, setDoc, addDoc, getCountFromServer } from "firebase/firestore"
import { usersCollectionRef } from './firebase';
import { query, where } from "firebase/firestore";
import { Table } from "react-bootstrap";

export const IncomeData = () => {

    const categories = ["Product Sales", "Cost of Goods Sold","Gross Profit/(Loss)", "Overhead Expenses", "Operating Profit/(Loss)"]
    const [productSales, setPS] = useState(0);
    const [costofGS, setCoGS] = useState(0);
    const [grossProfit, setGP] = useState(0);
    const [overheadExpenses, setOHE] = useState(0);
    const [operatingProfit, setOP] = useState(0);
    const [amounts, setamounts] = useState([]);
    const [movement, setMovement] = useState([])
    const [gpm, setgpm] = useState(0)

    useEffect(() => {

        const getIncomeStatement =  async () => {
    
            let productSales = 0;
            let costofGS = 0;
            let overheadExpenses = 0;
            let grossProfit = 0;
            let operatingProfit = 0;

    //////Get product sales, cost of goods sold, and overhead expenses
            const querySnapshot = await getDocs(collection(db, "accounts"));
            
                    querySnapshot.forEach((doc) => {
                
                    var data = doc.data();
                if(data.name === "product sales")
                { 
                    productSales += parseFloat(data.balance)
                    }
                    if( data.name === "inventory")
                { 
                    costofGS += parseFloat(data.balance)
                
                    }
                    if( data.category === "liability")
                    {
                        overheadExpenses += parseFloat(data.balance)
                    }
                    
                    });
                
            //Calculate gross profit and operating profit
                grossProfit = parseFloat(productSales - costofGS)
                operatingProfit = parseFloat(grossProfit-overheadExpenses)
                setamounts([productSales, costofGS,grossProfit, overheadExpenses, operatingProfit])
                const pschange = productSales-productSales
                const cogschange= costofGS-costofGS
                const ohechange =overheadExpenses-overheadExpenses
                const gpchange = grossProfit-grossProfit
                const opchange = operatingProfit-operatingProfit
                setMovement([pschange, cogschange,  gpchange,ohechange, opchange])
                const grossProfitMargin = parseFloat((productSales-costofGS)/productSales)
                setgpm(grossProfitMargin)
                if(gpm*100 > 50)
                {
                    document.getElementById("gpm").style.color = "#456320";
                    document.getElementById("gpm").style.backgroundColor= "#c5fa75";
                    document.getElementById("gpm").style.opacity = "0.7"; 
                }
                else if(gpm*100 > 35 && gpm <= 50)
                {
                    document.getElementById("gpm").style.color = "#456320";
                    document.getElementById("gpm").style.backgroundColor= "#ed9e0c";
                    document.getElementById("gpm").style.opacity = "0.7"; 
                }
                else if(gpm* 100 <= 35)
                {
                    document.getElementById("gpm").style.color = "#c91704";
                    document.getElementById("gpm").style.backgroundColor= "#f07f73";
                    document.getElementById("gpm").style.opacity = "0.7"; 
                }
                
        
        }

        getIncomeStatement();
        
    }, []); 
    return(

        <>
       
            <div id="gpm">
            <Table>
                <tbody>
                    <tr>
                        <td>
                        <h4 >Gross Profit Margin:</h4>
                        </td>
                        <td>
                      <h4>{gpm*100}%</h4>
                        </td>
                    </tr>
                </tbody>
            </Table>
            </div>
        </>
    )
}

   