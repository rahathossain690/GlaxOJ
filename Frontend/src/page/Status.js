
import React, { useEffect, useState }  from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ReactLoading from 'react-loading';
import queryString from 'query-string'

import {BACKEND_URL, PAGINATION} from '../util/config'

function Status() {

    const [submissionData, setSubmissionData] = useState(null)
    const query = queryString.parse(useLocation().search) 
    const [page, setPage] = useState( Math.max(query.page || 1), 1 )
    const [username, setUsername] = useState(query.username)
    const [problem_id, setProblem_id] = useState(query.problem_id)
    const [verdict, setVerdict] = useState(query.verdict)
    const history = useHistory()

    const handleEnter = (event) => {
        if(event.key === 'Enter') goto()
    }


    useEffect(() => {

        try{
            (async() => {
                const query_object = {}
                if(username) query_object.username = username
                if(page) query_object.page = page
                if(problem_id) query_object.problem_id = problem_id
                if(verdict) query_object.verdict = verdict
                const response = await fetch( `${BACKEND_URL}/submission/status?${queryString.stringify(query_object)}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json();
                //console.log(data)
                if(data.success === "yes"){
                    data.data.forEach(item => {
                        item.problem_title = item.Problem.title
                    })
                    setSubmissionData(data.data)
                } else{
                    // history.push('/404')
                    // history.go(0)
                }

            })()
        } catch(err){
            // history.push('/404')
            // history.go(0)
            // console.log(err)
        }

    }, [])

    const verdictStyle = (verdict)=> {
        if(verdict === "Accepted") return " text-green-600"
        else if(verdict === "Not Judged Yet") return ""
        else return " text-red-600"
    }

    const goto = () => {
        const query_object = {}
        if(username) query_object.username = username
        if(page) query_object.page = page
        if(problem_id) query_object.problem_id = problem_id
        if(verdict) query_object.verdict = verdict
        history.push(`/status?${queryString.stringify(query_object)}`)
        history.go(0)
    }

  return (
    <div>
        {!submissionData && 
          <div className="flex flex-wrap container mx-auto">
            <ReactLoading type={"bars"} color={"#2563EB"} height={667} width={375} className="mx-auto"/>
          </div> 
        }
        {submissionData && <div>
            <div className="flex flex-wrap container mx-auto p-4">
                <div className="mx-auto">
                    <div className="p-2 m-2 font-black text-3xl text-blue-600">GlaxOJ Judge Status</div>
                </div>
            </div> 
            
            <div className="flex flex-wrap container mx-auto p-4">
                <div className="mx-auto">
                    <button className="bg-blue-600 text-white rounded p-2 m-2 focus:bg-blue-700 focus:text-white" style={{width: "60px"}}>Page</button>
                    <input type="number" value={page} className="border border-blue-600 text-center" onChange={e => setPage( Math.max( parseInt(e.target.value.trim()), 1 ) )} onKeyPress={handleEnter}/>
                    <button className="bg-blue-600 text-white rounded p-2 m-2 focus:bg-blue-700 focus:text-white" onClick={goto} style={{width: "60px"}}>&#8611;</button>
                </div>
            </div> 

            <div className="flex flex-wrap container mx-auto">
                <table className="border-collapse border border-blue-600 mx-auto w-full">
                    <thead>
                        <tr>
                            <th className="border border-blue-600 p-2 text-lg">No.</th>
                            <th className="border border-blue-600 p-2 text-lg">ID</th>
                            <th className="border border-blue-600 p-2 text-lg"> <input className="h-full w-full" value={username} onKeyPress={e => handleEnter(e)}  placeholder="Username" onChange={e => setUsername(e.target.value.trim())}/> </th>
                            <th className="border border-blue-600 p-2 text-lg"><input className="text-center" style={{maxWidth: "100px"}} onKeyPress={e => handleEnter(e)} value={problem_id} placeholder="Problem ID" onChange={e => setProblem_id(e.target.value.trim())}/></th>
                            <th className="border border-blue-600 p-2 text-lg">Problem Title</th>
                            <th className="border border-blue-600 p-2 text-lg">Language</th>
                            <th className="border border-blue-600 p-2 text-lg">
                                <select id = "verdictList" onChange={e => setVerdict(e.target.value)} value={verdict} className="border border-blue-600 p-2 text-lg">
                                    <option value="">All Verdict</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Not Judged Yet">Not Judged Yet</option>
                                    <option value="Unknown Error">Unknown Error</option>
                                    <option value="Time Limit Exceeded">Time Limit Exceeded</option>
                                    <option value="Memory Limit Exceeded">Memory Limit Exceeded</option>
                                    <option value="Compilation Error">Compilation Error</option>
                                    <option value="Runtime Error">Runtime Error</option>
                                    <option value="Wrong Answer">Wrong Answer</option>
                                </select>
                            </th>
                            <th className="border border-blue-600 p-2 text-lg">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissionData.map((submission, index) => {
                            return (
                                <tr> 
                                    <td className="border border-blue-600 p-2 text-center">{index + 1 + ((query.page || 1) - 1) * PAGINATION}</td>
                                    <td className="border border-blue-600 p-2 text-center underline"><Link to={`/submission/${submission.id}`}>{submission.id}</Link></td>
                                    <td className="border border-blue-600 p-2 font-black text-blue-600"><Link to={"/user/"+submission.username}>{submission.username}</Link></td>
                                    <td className="border border-blue-600 p-2 text-center font-black"><Link to={"/problem/"+submission.problem_id}>{submission.problem_id}</Link></td>
                                    <td className="border border-blue-600 p-2 text-center font-black"><Link to={"/problem/"+submission.problem_id}>{submission.problem_title}</Link></td>
                                    <td className="border border-blue-600 p-2 text-center"><Link to={`/submission/${submission.id}`}>{submission.language}</Link></td>
                                    <td className={"border border-blue-600 p-2 text-center" + verdictStyle(submission.verdict)}><Link to={`/submission/${submission.id}`}>{submission.verdict}</Link></td>
                                    <td className="border border-blue-600 p-2 text-center">{new Date(submission.createdAt).toLocaleString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>}
    </div>
  );
}

export default Status;
