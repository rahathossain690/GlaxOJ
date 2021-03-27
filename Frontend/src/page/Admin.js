
import React, {useState, useEffect} from 'react';

import { Link, useHistory } from 'react-router-dom'
import ReactLoading from 'react-loading';

import {BACKEND_URL} from '../util/config' 


function Admin() {

    const history = useHistory()
    const [judge, setJudge] = useState("sex")

    const [userCount, setUserCount] = useState("loading...")
    const [submissionCount, setSubmissionCount] = useState("loading...")
    const [deleteState, setDeleteState] = useState("NILL")
    const [deleteID, setDeleteID] = useState(null)

    useEffect(() => {

        (async() => {

            try{
                const response = await fetch( `${BACKEND_URL}/submission/judge_status`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                  })
                  const user_data = await response.json()
                  
                  if(user_data.success === "yes") {
                    setJudge(user_data.data)
                  } else{
                      throw new Error('error')
                  }

                const extra_responses = await Promise.all([
                    fetch( `${BACKEND_URL}/user/count`, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }),
                    fetch( `${BACKEND_URL}/submission/count`, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }),
                ])

                extra_responses[0] = await extra_responses[0].json();
                extra_responses[1] = await extra_responses[1].json();

                // console.log(extra_responses)
                if(extra_responses[0].success === "yes") setUserCount(extra_responses[0].data)
                if(extra_responses[1].success === "yes") setSubmissionCount(extra_responses[1].data)

            } catch(err) {
                history.push('/404')
            }
            
        })()

    }, [])

    const toggle = async() => {
        try{
            const response = await fetch( `${BACKEND_URL}/submission/judge_toggle`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
              })
              const user_data = await response.json()
              
              if(user_data.success === "yes") {
                setJudge(user_data.data)
              } else{
                  throw new Error(user_data.message)
              }
        } catch(err) {
            console.log(err)
        }
    }

    const deleteThat = async () => {
        if(!deleteID) return;
        setDeleteState("Loading...")
        try{
            const response = await fetch( `${BACKEND_URL}/submission?id=${deleteID}`, {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            })
            const data = await response.json()
            // console.log(data)
            if(data.success === "yes") {
                setDeleteState("Success")
            } else {
                setDeleteState("Fail")
            }
        } catch(err) {
            setDeleteState("Fail")
        }
    }

  return (
    <div>
        {judge === "sex" && <div className="flex flex-wrap container mx-auto">
            <ReactLoading type={"bars"} color={"#2563EB"} height={667} width={375} className="mx-auto"/>
        </div>}
        {judge !== "sex" && <div>
        <div className="flex flex-wrap container mx-auto">
            <span className="mx-auto text-3xl text-blue-600">Admin Panel</span>
        </div>
        <div className="flex flex-wrap container mx-auto justify-center p-16">
            <Link to="/problem?admin=true"><button className="box-border p-4 m-2 border-2 text-xl bg-blue-600 text-white focus:bg-blue-700 focus:text-white rounded">Problems</button></Link>
            <Link to="/edit"><button className="box-border p-4 m-2 border-2 text-xl bg-blue-600 text-white focus:bg-blue-700 focus:text-white rounded">Create Problem</button></Link>
            <Link to="/admin/user"><button className="box-border p-4 border-2 m-2 text-xl bg-blue-600 text-white focus:bg-blue-700 focus:text-white rounded">User</button></Link>
            <button className="box-border p-4 border-2 m-2 text-xl bg-blue-600 text-white focus:bg-blue-700 focus:text-white rounded" onClick={toggle}>Turn {judge ? 'Off' : 'On'} Judge</button>
        </div>
        <div className="flex flex-wrap container mx-auto">
            <span className="mx-auto text-3xl text-blue-600">Information</span>
        </div>
        <div className="flex flex-wrap container mx-auto p-4">
            <table className="w-full border border-1">
                <tr>
                    <th className="border border-1 p-1 w-1/2">Users</th>
                    <td className="border border-1 p-1 text-center">{userCount}</td>
                </tr>
                <tr>
                    <th className="border border-1 p-1">Submissions</th>
                    <td className="border border-1 p-1 text-center">{submissionCount}</td>
                </tr>
            </table>
        </div>


        <div className="flex flex-wrap container mx-auto">
            <span className="mx-auto text-3xl text-blue-600">Delete Submission</span>
        </div>
        <div className="flex flex-wrap container mx-auto p-4">
            <table className="w-full border border-1">
                <tr>
                    <th className="border border-1 p-1">Submission id</th>
                    <th className="border border-1 p-1">Action</th>
                    <th className="border border-1 p-1">Result</th>
                </tr>
                <tr>
                    <td className="border border-1 p-1 text-center w-1/3"> <input type="number" className="w-full text-center" value={deleteID} onChange={e => setDeleteID(e.target.value)}/> </td>
                    <td className="border border-1 p-1 text-center"> <button onClick={deleteThat} className="box-border p-1 m-1 border-2 bg-blue-600 text-white focus:bg-blue-700 focus:text-white rounded">Delete</button> </td>
                    <td className="border border-1 p-1 text-center"> {deleteState} </td>
                </tr>
            </table>
        </div>

        </div>}
    </div>
  );
}

export default Admin;
