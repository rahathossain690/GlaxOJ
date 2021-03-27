
import React, { useEffect, useState }  from 'react';


import ReactLoading from 'react-loading';
import { Link, useHistory } from 'react-router-dom';

import {BACKEND_URL} from '../util/config'
import AceEditor from "react-ace";

function Submission(props) {

    const id = props.match.params.id 
    const [submissionData, setSubmissionData] = useState(null)
    const [error, setError] = useState(false)

    const history = useHistory()


    const verdictStyle = (verdict)=> {
        if(verdict === "Accepted") return " text-green-600"
        else if(verdict === "Not Judged Yet") return ""
        else return " text-red-600"
    }
    

    useEffect(() => {

        try{

            (async()=>{

                const response = await fetch( `${BACKEND_URL}/submission?id=${id}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json();

                //console.log(data)
                if(data.success === "yes") {
                    setSubmissionData(data.data)
                } else if(data.message === "Solve the problem first"){
                    setError(true)
                } else {
                    history.push('/404')
                    //setError(true)
                }

            })()

        } catch(err){
            //console.log(err)
        }


    }, [])

  return (
    <div>
        {(!submissionData && !error) && 
          <div className="flex flex-wrap container mx-auto">
            <ReactLoading type={"bars"} color={"#2563EB"} height={667} width={375} className="mx-auto"/>
          </div> 
        }
        {(submissionData && !error) && <div>
        <div className="flex flex-wrap container mx-auto items-center justify-between">
            <div className="mx-auto text-2xl p-8 font-black text-blue-600"> Submission </div>
        </div>

        <div className="flex flex-wrap container mx-auto">
            <table className="mx-auto w-full">
                <tr>
                    <th className="border border-blue-600">ID</th>
                    <th className="border border-blue-600">Problem ID</th>
                    <th className="border border-blue-600">Problem Title</th>
                    <th className="border border-blue-600">Username</th>
                    <th className="border border-blue-600">Language</th>
                    <th className="border border-blue-600">Verdict</th>
                    <th className="border border-blue-600">Time</th>
                </tr>
                <tr>
                    <td className="border border-blue-600 text-center p-1">{submissionData.id}</td>
                    <td className="border border-blue-600 text-center font-black p-1"><Link to={"/problem/" + submissionData.problem_id}>{submissionData.problem_id}</Link></td>
                    <td className="border border-blue-600 text-center font-black p-1"><Link to={"/problem/" + submissionData.problem_id}>{submissionData["Problem.title"]}</Link></td>
                    <td className="border border-blue-600 text-center font-black text-blue-600 p-1"><Link to={"/user/" + submissionData.username}>{submissionData.username}</Link></td>
                    <td className="border border-blue-600 text-center p-1">{submissionData.language}</td>
                    <td className={"border border-blue-600 text-center p-1" + verdictStyle(submissionData.verdict)}>{submissionData.verdict}</td>
                    <td className="border border-blue-600 text-center p-1">{new Date(submissionData.createdAt).toLocaleString()}</td>
                </tr>
            </table>
        </div>
        <br/>
        <div className="flex flex-wrap container mx-auto">
            <AceEditor
                value={submissionData.source_code}
                name="Code editor"
                editorProps={{ $blockScrolling: true }}
                className="w-full border border-blue-600"
                placeholder="Code goes here brr..."
                readOnly={true}
                setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: true,
                    highlightActiveLine: false,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
        </div>
        </div>
    }
    {error && <div className="m-4 p-4">
        <div className="flex flex-wrap container mx-auto">
            <div className="mx-auto text-xl text-blue-600"> Submission cannot be shown. Please solve the problem first. </div>
        </div>
        <div className="flex flex-wrap container mx-auto">
            <div className="mx-auto text-lg text-blue-600"> Happy Coding! </div>
        </div>
        </div>}
    </div>
  );
}

export default Submission;
