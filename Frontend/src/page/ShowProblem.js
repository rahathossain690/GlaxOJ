
import React, { useEffect, useState }  from 'react';

import { Link, useHistory, useLocation } from 'react-router-dom';
// import queryString from 'query-string'
import {BACKEND_URL} from '../util/config'
import ReactLoading from 'react-loading';

function ShowProblem(props) {

    // const query = queryString.parse(useLocation().search)
    const id = props.match.params.id 
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState(null)
    const [time_limit, setTimeLimit] = useState(null)
    const [memory_limit, setMemoryLimit] = useState(null)
    const [content, setContent] = useState(null)
    const [author, setAuthor] = useState(null)
    const [success, setSuccess] = useState(null)
    const [attempt, setAttempt] = useState(null)
    // time_limit: timeLimit, memory_limit: memoryLimit, content, title, author

    useEffect(()=>{

        try{

              (async()=>{

                const response = await fetch( `${BACKEND_URL}/problem?id=${id}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                  })
                  const problem_data = await response.json()
                  //console.log(problem_data)
                if(problem_data.success === "yes") {
                    setContent(problem_data.data.content)
                    setTitle(problem_data.data.title)
                    setMemoryLimit(problem_data.data.memory_limit)
                    setTimeLimit(problem_data.data.time_limit)
                    setAuthor(problem_data.data.author)
                    setSuccess(problem_data.data.success)
                    setAttempt(problem_data.data.attempt)
                    setLoading(false)
                } else {
                    history.push('/404')
                    // history.go(0)
                }

              })()

        }catch(err){
            //history.push('/404')
        }


    }, [])

    const submit = ()=> {
        history.push(`/submit/${id}`)
        // history.go(0)
    }

  return (
    <div>
        {loading && 
          <div className="flex flex-wrap container mx-auto">
            <ReactLoading type={"bars"} color={"#2563EB"} height={667} width={375} className="mx-auto"/>
          </div> 
        }
        {!loading && <div><div className="flex flex-wrap container mx-auto">
            <table className="mx-auto w-full m-2">
                <tr>
                    <th className="border border-blue-600">ID</th>
                    <th className="border border-blue-600 ">Time Limit (s)</th>
                    <th className="border border-blue-600">Memory Limit (MB)</th>
                    <th className="border border-blue-600">Success / Attempt</th>
                    <th className="border border-blue-600">Author</th>
                    <th className="border border-blue-600">Action</th>
                </tr>
                <tr>
                    <td className="border border-blue-600 text-center">{id}</td>
                    <td className="border border-blue-600 text-center">{time_limit}</td>
                    <td className="border border-blue-600 text-center">{memory_limit}</td>
                    <td className="border border-blue-600 text-center"><Link to={`/status?problem_id=${id}`}>{success} / {attempt}</Link></td>
                    <td className="border border-blue-600 text-center"><Link to={"/problem?author="+author}>{author}</Link></td>
                    <td className="border border-blue-600 text-center"> <button className="p-2 m-2 bg-blue-600 text-white rounded focus:bg-blue-700 focus:text-white" onClick={submit}>Submit</button></td>
                </tr>
            </table>
        </div>
        <br/>
        <div className="flex flex-wrap container mx-auto">
            <span className="mx-auto text-2xl font-black">{title}</span>
        </div>
        <br/>
        <div className="flex flex-wrap container mx-auto p-2 text-justify" dangerouslySetInnerHTML={{__html: content}}>
        </div>
        {/* <div className="flex flex-wrap container mx-auto border-2 border-blue-600 p-2 text-justify" >
            <EditorJs
                data={content}
            />
        </div> */}
    </div>}
    </div>
  );
}

export default ShowProblem;
