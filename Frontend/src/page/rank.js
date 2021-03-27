
import React, { useEffect, useState }  from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string'
import ReactLoading from 'react-loading';

import {BACKEND_URL, PAGINATION} from '../util/config'

function Rank() {
    
    const history = useHistory()
    const query = queryString.parse(useLocation().search) 
    const [page, setPage] = useState( Math.max(1, parseInt(query.page) || 1 ) )
    const [rank, setRank] = useState(null)

    useEffect(() => {

        try{

            ( async() => {

                const response = await fetch( `${BACKEND_URL}/submission/rank?page=${page}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                  })
                const data = await response.json()
                //console.log(data)
                if(data.success === "yes") setRank(data.data)
                else {
                    history.push('/404')
                    history.go(0)
                }

            } )()

        } catch(err) {
            history.push('/404')
            history.go(0)
        }


    }, [])

    const goto = () => {
        history.push(`/rank?page=${page}`)
        history.go(0)
    }

    const handleEnter = (event) => {
        if(event.key === 'Enter') goto()
    }

  return (
    <div>
        {!rank && 
          <div className="flex flex-wrap container mx-auto">
            <ReactLoading type={"bars"} color={"#2563EB"} height={667} width={375} className="mx-auto"/>
          </div> 
        }
        {rank && <div>
        <div className="flex flex-wrap container mx-auto items-center justify-between">
            <div className="mx-auto font-black text-blue-600 text-3xl"> Rank </div>
        </div>
        <div className="flex flex-wrap container mx-auto items-center">
                <div className="mx-auto">
                    <button className="bg-blue-600 text-white rounded p-2 m-2 focus:bg-blue-700 focus:text-white" style={{width: "60px"}}>Page</button>
                    <input type="number" value={page} className="border border-blue-600 text-center" onChange={e => setPage( Math.max( parseInt(e.target.value.trim()), 1 ) )} onKeyPress={handleEnter}/>
                    <button className="bg-blue-600 text-white rounded p-2 m-2 focus:bg-blue-700 focus:text-white" style={{width: "60px"}} onClick={goto}>&#8611;</button>
                </div>
        </div>
        <br/>
        <div className="flex flex-wrap container mx-auto">
                <table className="border-collapse border border-blue-600 mx-auto w-full">
                    <thead>
                        <tr>
                            <th className="border border-blue-600 p-2 text-lg">Rank</th>
                            <th className="border border-blue-600 p-2 text-lg">Username</th>
                            <th className="border border-blue-600 p-2 text-lg">Solve</th>
                        </tr>
                    </thead>
                    <tbody>
                        { rank.map((individual, index) => {
                            return (<tr>
                                <td className="border border-blue-600 p-2 text-center">{index + 1 + ((query.page || 1) - 1) * PAGINATION}</td>
                                <td className="border border-blue-600 p-2 font-black text-blue-600"><Link to={"/user/" + individual.username}>{individual.username}</Link></td>
                                <td className="border border-blue-600 p-2 text-center">{individual.solve}</td>
                            </tr>)
                        }) }
                    </tbody>
                </table>
        </div>
        </div>}
    </div>
  );
}

export default Rank;
